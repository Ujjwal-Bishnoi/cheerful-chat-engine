import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Load environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const groqApiKey = Deno.env.get('GROQ_API_KEY');

if (!supabaseUrl || !supabaseServiceKey || !groqApiKey) {
  console.error("❌ Missing one or more environment variables");
  throw new Error("Missing environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GROQ_API_KEY");
}

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

    console.log('🔍 Processing NLP search query:', query);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch candidates and skills
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

    if (candidatesError || !candidates) {
      console.error('❌ Error fetching candidates:', candidatesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch candidates' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    const prompt = `You are an expert talent sourcer and recruiter... \nSEARCH QUERY: "${query}"\n\nCANDIDATES DATA:\n${JSON.stringify(candidatesForLLM, null, 2)}\n...`;

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
            content: 'You are an API. Only respond with valid JSON. Do not wrap the response in markdown or explanation.'
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
      console.error('❌ Groq API error:', errorText);
      return new Response(JSON.stringify({ error: 'Groq API request failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const groqData = await groqResponse.json();
    const rawContent = groqData.choices?.[0]?.message?.content;

    if (!rawContent) {
      console.error('❌ LLM returned an empty response');
      return new Response(JSON.stringify({ error: 'No valid content from LLM' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ✅ Strip markdown-style ```json ... ``` if present
    const cleanedContent = rawContent
      .trim()
      .replace(/^```(?:json)?/, '')
      .replace(/```$/, '');

    let analysisResult;

    try {
      analysisResult = JSON.parse(cleanedContent);
    } catch (err) {
      console.error("❌ Failed to parse JSON from LLM response");
      console.error("Raw content received:\n", rawContent);
      return new Response(JSON.stringify({ error: 'Error parsing Groq response: ' + err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rankedResults = analysisResult.results || [];

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
      console.error('⚠️ Error storing search query:', searchError);
    }

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
        console.error('⚠️ Error storing search results:', resultsError);
      }
    }

    console.log(`✅ Returning ${rankedCandidates.length} ranked candidates`);

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
    console.error('💥 Unexpected error in NLP search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
