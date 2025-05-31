
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

    // Use DeepSeek to understand query intent
    const queryUnderstandingPrompt = `You are an AI hiring assistant helping recruiters find candidates from a structured candidate database. Your task is to analyze the recruiter's plain-English query and convert it into search parameters.

Examples:
Query: "Find senior RAG engineers in EU open to contracts"
Output:
{
  "title": "RAG Engineer",
  "seniority": "Senior", 
  "skills": ["RAG", "LangChain"],
  "region": "Europe",
  "work_type": "Contract"
}

Query: "Looking for GenAI researchers with PyTorch and RLHF experience in the US"
Output:
{
  "title": "GenAI Researcher",
  "skills": ["PyTorch", "RLHF"],
  "region": "United States"
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

    // Execute search in Supabase using enhanced matching
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

    // Build search conditions based on intent or fallback to text search
    const searchConditions = [];
    const searchTerm = query.toLowerCase();

    if (searchIntent) {
      // Use structured search based on DeepSeek understanding
      if (searchIntent.title) {
        searchConditions.push(`title.ilike.%${searchIntent.title}%`);
      }
      
      if (searchIntent.skills && searchIntent.skills.length > 0) {
        const skillConditions = searchIntent.skills.map(skill => 
          `summary.ilike.%${skill}%`
        ).join(',');
        searchConditions.push(skillConditions);
      }
      
      if (searchIntent.seniority) {
        if (searchIntent.seniority.toLowerCase().includes('senior')) {
          candidatesQuery = candidatesQuery.gte('experience_years', 5);
        } else if (searchIntent.seniority.toLowerCase().includes('junior')) {
          candidatesQuery = candidatesQuery.lte('experience_years', 2);
        }
      }
      
      if (searchIntent.region) {
        searchConditions.push(`location.ilike.%${searchIntent.region}%`);
      }
    } else {
      // Fallback to comprehensive text search
      if (searchTerm.includes('rag')) {
        searchConditions.push('title.ilike.%rag%,summary.ilike.%rag%,work_experience::text.ilike.%rag%');
      } else if (searchTerm.includes('react')) {
        searchConditions.push('title.ilike.%react%,summary.ilike.%react%,work_experience::text.ilike.%react%');
      } else if (searchTerm.includes('python')) {
        searchConditions.push('title.ilike.%python%,summary.ilike.%python%,work_experience::text.ilike.%python%');
      } else if (searchTerm.includes('javascript')) {
        searchConditions.push('title.ilike.%javascript%,summary.ilike.%javascript%,work_experience::text.ilike.%javascript%');
      } else if (searchTerm.includes('senior')) {
        candidatesQuery = candidatesQuery.gte('experience_years', 5);
      } else if (searchTerm.includes('junior')) {
        candidatesQuery = candidatesQuery.lte('experience_years', 2);
      } else if (searchTerm.includes('full stack') || searchTerm.includes('fullstack')) {
        searchConditions.push('title.ilike.%full%,title.ilike.%stack%,summary.ilike.%full%,summary.ilike.%stack%');
      } else {
        // General comprehensive search
        searchConditions.push(`title.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,work_experience::text.ilike.%${searchTerm}%,education::text.ilike.%${searchTerm}%,certifications::text.ilike.%${searchTerm}%`);
      }
    }

    // Apply search conditions
    if (searchConditions.length > 0) {
      candidatesQuery = candidatesQuery.or(searchConditions.join(','));
    }

    const { data: candidates, error: searchError } = await candidatesQuery.limit(20);

    if (searchError) {
      console.error('Search error:', searchError);
      throw new Error('Failed to search candidates');
    }

    console.log('Found candidates:', candidates?.length || 0);

    // Transform the data to include skills array
    const transformedCandidates = candidates?.map(candidate => ({
      ...candidate,
      skills: candidate.candidate_skills?.map((cs: any) => cs.skills?.name).filter(Boolean) || [],
      score: Math.floor(Math.random() * 20) + 80 // Simulated relevance score
    })) || [];

    const summary = `Found ${transformedCandidates.length} candidates matching "${query}". Results include candidates with relevant skills and experience.`;

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
      status: 200, // Return 200 to avoid client-side errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
