
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const groqApiKey = Deno.env.get('GROQ_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing NLP search query:', query);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all candidates with their skills
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select(`
        *,
        candidate_skills(
          skill_id,
          proficiency_level,
          years_experience,
          skills(name)
        )
      `);

    if (candidatesError) {
      console.error('Error fetching candidates:', candidatesError);
      throw candidatesError;
    }

    console.log(`Found ${candidates.length} candidates to analyze`);

    // Transform candidates data for LLM processing
    const candidatesForLLM = candidates.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      title: candidate.title,
      experience_years: candidate.experience_years,
      location: candidate.location,
      summary: candidate.summary,
      availability: candidate.availability,
      verification_score: candidate.verification_score,
      skills: candidate.candidate_skills?.map((cs: any) => ({
        name: cs.skills.name,
        proficiency: cs.proficiency_level,
        years: cs.years_experience
      })) || []
    }));

    // Create the prompt for Groq API with in-context learning
    const prompt = `You are an expert talent sourcer and recruiter. Your task is to analyze candidates and rank them based on how well they match a search query.

INSTRUCTIONS:
1. Analyze the search query to understand the requirements (skills, experience level, role type, etc.)
2. Score each candidate from 0-100 based on relevance to the query
3. Consider: skills match, experience level, job title relevance, availability status
4. Return ONLY a JSON array of candidate IDs with their scores, sorted by score (highest first)
5. Include a brief explanation for the top matches

EXAMPLES:

Query: "Senior React developer with 5+ years experience"
Expected response: Focus on candidates with React skills, 5+ years experience, frontend/fullstack roles

Query: "Machine learning engineer for computer vision"
Expected response: Prioritize ML engineers with computer vision, deep learning, Python skills

Query: "DevOps engineer with Kubernetes and AWS"
Expected response: Look for DevOps/SRE roles with Kubernetes, AWS, Docker, CI/CD skills

SEARCH QUERY: "${query}"

CANDIDATES DATA:
${JSON.stringify(candidatesForLLM, null, 2)}

Return your response as a JSON object with this structure:
{
  "results": [
    {"candidate_id": "uuid", "score": 95, "reason": "Perfect match - Senior ML Engineer with 6 years experience in computer vision and deep learning"},
    {"candidate_id": "uuid", "score": 87, "reason": "Strong match - React specialist with 8 years experience"}
  ],
  "summary": "Brief explanation of the search and ranking criteria used"
}`;

    // Call Groq API with a currently supported model
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are an expert recruiter and talent sourcer. Analyze candidates and provide accurate relevance scores based on search queries. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('Groq API response received');

    let analysisResult;
    try {
      const content = groqData.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in Groq response');
      }
      
      // Parse the JSON response from Groq
      analysisResult = JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing Groq response:', parseError);
      console.error('Raw content:', groqData.choices[0]?.message?.content);
      throw new Error('Failed to parse LLM response');
    }

    // Get the ranked candidate IDs and scores
    const rankedResults = analysisResult.results || [];
    
    // Fetch full candidate details for the ranked results
    const rankedCandidates = rankedResults.map((result: any) => {
      const candidate = candidates.find(c => c.id === result.candidate_id);
      if (!candidate) return null;
      
      return {
        id: candidate.id,
        name: candidate.name,
        title: candidate.title,
        experience: `${candidate.experience_years} years`,
        location: candidate.location,
        skills: candidate.candidate_skills?.map((cs: any) => cs.skills.name) || [],
        score: result.score,
        summary: candidate.summary,
        availability: candidate.availability?.replace('_', ' '),
        email: candidate.email,
        reason: result.reason || '',
        verification_score: candidate.verification_score,
        verified: candidate.verified
      };
    }).filter(Boolean);

    // Store search query and results
    const { data: searchQuery, error: searchError } = await supabase
      .from('search_queries')
      .insert({
        query_text: query,
        status: 'completed',
        result_count: rankedCandidates.length
      })
      .select()
      .single();

    if (searchError) {
      console.error('Error storing search query:', searchError);
    }

    // Store search results if we have a search query ID
    if (searchQuery?.id && rankedCandidates.length > 0) {
      const searchResultsData = rankedCandidates.map((candidate, index) => ({
        search_query_id: searchQuery.id,
        candidate_id: candidate.id,
        relevance_score: candidate.score,
        ranking_position: index + 1,
        anonymized: false
      }));

      const { error: resultsError } = await supabase
        .from('search_results')
        .insert(searchResultsData);

      if (resultsError) {
        console.error('Error storing search results:', resultsError);
      }
    }

    console.log(`Returning ${rankedCandidates.length} ranked candidates`);

    return new Response(JSON.stringify({
      success: true,
      candidates: rankedCandidates,
      count: rankedCandidates.length,
      summary: analysisResult.summary || `Found ${rankedCandidates.length} candidates matching your search criteria`,
      search_query_id: searchQuery?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in NLP search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
