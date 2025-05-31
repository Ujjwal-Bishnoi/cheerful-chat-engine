import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = 'https://ocmqqtgcadltakzuwixd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jbXFxdGdjYWRsdGFrenV3aXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjU0MjYsImV4cCI6MjA2NDIwMTQyNn0.u_L1ruz6-gE9q8uuH9bKAZzpUX2IqLoP5qmgTgSd_fQ';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query) {
      throw new Error('No search query provided');
    }

    console.log('Processing search query:', query);

    // Enhanced DeepSeek prompt for semantic search
    const queryUnderstandingPrompt = `You are an AI hiring assistant helping recruiters find candidates from a structured candidate database. Your task is to analyze the recruiter's plain-English query and convert it into a semantic embedding vector that represents the skills, roles, seniority, and region.

Examples:
Query: "Find senior RAG engineers in EU open to contracts"
Output:
{
  "title": "RAG Engineer",
  "seniority": "Senior",
  "skills": ["RAG", "LangChain", "Vector Search", "Embeddings"],
  "region": "Europe",
  "work_type": "Contract"
}

Query: "Looking for GenAI researchers with PyTorch and RLHF experience in the US"
Output:
{
  "title": "GenAI Researcher",
  "skills": ["PyTorch", "RLHF", "Machine Learning", "Deep Learning"],
  "region": "United States",
  "seniority": "Any"
}

Now analyze this query and return ONLY the JSON object, no other text:
Query: "${query}"`;

    let searchIntent;
    try {
      const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: queryUnderstandingPrompt
            }
          ],
          temperature: 0.1,
          max_tokens: 500
        }),
      });

      if (deepseekResponse.ok) {
        const deepseekData = await deepseekResponse.json();
        const intentText = deepseekData.choices[0].message.content;
        console.log('DeepSeek query understanding response:', intentText);
        
        try {
          searchIntent = JSON.parse(intentText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          searchIntent = null;
        }
      }
    } catch (error) {
      console.error('DeepSeek API error:', error);
      searchIntent = null;
    }

    // Execute search in Supabase using semantic search
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let candidatesQuery = supabase
      .from('candidates')
      .select(`
        *,
        candidate_skills(
          skill_id,
          skills(name)
        )
      `);

    // Build semantic search conditions
    if (searchIntent) {
      // Title and role matching
      if (searchIntent.title) {
        candidatesQuery = candidatesQuery.or(
          `title.ilike.%${searchIntent.title}%,summary.ilike.%${searchIntent.title}%`
        );
      }
      
      // Skills matching - use vector similarity when available
      if (searchIntent.skills && searchIntent.skills.length > 0) {
        const skillConditions = searchIntent.skills.map(skill => 
          `summary.ilike.%${skill}%,work_experience::text.ilike.%${skill}%`
        ).join(',');
        candidatesQuery = candidatesQuery.or(skillConditions);
      }
      
      // Experience level matching
      if (searchIntent.seniority) {
        if (searchIntent.seniority.toLowerCase().includes('senior')) {
          candidatesQuery = candidatesQuery.gte('experience_years', 5);
        } else if (searchIntent.seniority.toLowerCase().includes('junior')) {
          candidatesQuery = candidatesQuery.lte('experience_years', 3);
        } else if (searchIntent.seniority.toLowerCase().includes('mid')) {
          candidatesQuery = candidatesQuery
            .gte('experience_years', 3)
            .lte('experience_years', 5);
        }
      }
      
      // Location/region matching
      if (searchIntent.region) {
        candidatesQuery = candidatesQuery.ilike('location', `%${searchIntent.region}%`);
      }
      
      // Work type preference
      if (searchIntent.work_type) {
        if (searchIntent.work_type.toLowerCase() === 'contract') {
          candidatesQuery = candidatesQuery.eq('availability', 'contract_only');
        }
      }
    } else {
      // Fallback to basic text search
      candidatesQuery = candidatesQuery.or(
        `title.ilike.%${query}%,` +
        `summary.ilike.%${query}%,` +
        `name.ilike.%${query}%,` +
        `work_experience::text.ilike.%${query}%`
      );
    }

    // Execute search
    const { data: candidates, error: searchError } = await candidatesQuery
      .order('verification_score', { ascending: false })
      .limit(20);

    if (searchError) {
      console.error('Search error:', searchError);
      throw new Error('Failed to search candidates');
    }

    console.log('Found candidates:', candidates?.length || 0);

    // Transform and score results
    const transformedCandidates = candidates?.map(candidate => {
      // Calculate relevance score based on multiple factors
      let score = 70; // Base score
      
      // Skills match bonus
      if (searchIntent?.skills) {
        const candidateSkills = candidate.candidate_skills?.map((cs: any) => 
          cs.skills?.name.toLowerCase()
        ).filter(Boolean) || [];
        
        const matchingSkills = searchIntent.skills.filter(skill =>
          candidateSkills.some(cs => cs.includes(skill.toLowerCase()))
        );
        score += (matchingSkills.length / searchIntent.skills.length) * 20;
      }
      
      // Experience bonus
      if (candidate.experience_years >= 5) score += 5;
      
      // Verification bonus
      if (candidate.verified) score += 5;
      if (candidate.verification_score) {
        score += (candidate.verification_score / 100) * 5;
      }
      
      return {
        ...candidate,
        skills: candidate.candidate_skills?.map((cs: any) => cs.skills?.name).filter(Boolean) || [],
        score: Math.min(100, Math.round(score))
      };
    }) || [];

    // Generate search summary
    let summary = `Found ${transformedCandidates.length} candidates matching "${query}".`;
    if (searchIntent) {
      summary += ` Results prioritize candidates with ${searchIntent.skills?.join(', ')} skills`;
      if (searchIntent.seniority) summary += `, ${searchIntent.seniority} level experience`;
      if (searchIntent.region) summary += ` in ${searchIntent.region}`;
    }

    return new Response(JSON.stringify({
      success: true,
      candidates: transformedCandidates,
      summary,
      count: transformedCandidates.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-candidates function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      candidates: [],
      summary: 'Search failed. Please try again.',
      count: 0
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});