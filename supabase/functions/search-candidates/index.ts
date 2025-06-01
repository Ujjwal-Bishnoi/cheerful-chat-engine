
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

    // Use OpenAI API for query understanding and search
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI hiring assistant helping recruiters find candidates from a structured candidate database. Your task is to analyze the recruiter's plain-English query and convert it into search parameters.

Examples:
Query: "Find senior RAG engineers in EU open to contracts"
Output: {"keywords": ["RAG", "engineer", "senior"], "skills": ["RAG", "LangChain"], "seniority": "senior", "location": ["EU", "Europe"], "experience_min": 5}

Query: "Looking for GenAI researchers with PyTorch and RLHF experience in the US"
Output: {"keywords": ["GenAI", "researcher", "PyTorch", "RLHF"], "skills": ["PyTorch", "RLHF", "GenAI"], "location": ["US", "United States"], "experience_min": 3}

Query: "Find Python developers with 3+ years experience"
Output: {"keywords": ["Python", "developer"], "skills": ["Python"], "experience_min": 3}

Return only a JSON object with extracted search parameters.`
          },
          {
            role: 'user',
            content: `Extract search parameters from this query: "${query}"`
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      }),
    });

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', await openaiResponse.text());
      throw new Error('Failed to process query with AI');
    }

    const openaiData = await openaiResponse.json();
    let searchParams;
    
    try {
      searchParams = JSON.parse(openaiData.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Fallback to simple keyword search
      searchParams = {
        keywords: query.toLowerCase().split(' ').filter(word => word.length > 2)
      };
    }

    console.log('Extracted search parameters:', searchParams);

    // Execute search in Supabase
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

    // Build dynamic search query
    const searchConditions = [];
    
    // Search in title, summary, name
    if (searchParams.keywords && searchParams.keywords.length > 0) {
      const keywordConditions = searchParams.keywords.map((keyword: string) => 
        `title.ilike.%${keyword}%,summary.ilike.%${keyword}%,name.ilike.%${keyword}%`
      ).join(',');
      searchConditions.push(keywordConditions);
    }

    // Location search
    if (searchParams.location && searchParams.location.length > 0) {
      const locationConditions = searchParams.location.map((loc: string) => 
        `location.ilike.%${loc}%`
      ).join(',');
      searchConditions.push(locationConditions);
    }

    // Experience filter
    if (searchParams.experience_min) {
      candidatesQuery = candidatesQuery.gte('experience_years', searchParams.experience_min);
    }

    // Apply OR conditions
    if (searchConditions.length > 0) {
      candidatesQuery = candidatesQuery.or(searchConditions.join(','));
    }

    const { data: candidates, error: searchError } = await candidatesQuery.limit(20);

    if (searchError) {
      console.error('Search error:', searchError);
      throw new Error('Failed to search candidates');
    }

    // Transform the data to include skills array and calculate relevance score
    const transformedCandidates = candidates?.map(candidate => {
      const skills = candidate.candidate_skills?.map((cs: any) => cs.skills?.name).filter(Boolean) || [];
      
      // Calculate relevance score based on matches
      let score = 60; // Base score
      
      // Skill matches
      if (searchParams.skills) {
        const skillMatches = searchParams.skills.filter((skill: string) => 
          skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        ).length;
        score += skillMatches * 15;
      }

      // Experience bonus
      if (searchParams.experience_min && candidate.experience_years >= searchParams.experience_min) {
        score += 10;
      }

      // Keyword matches in title/summary
      if (searchParams.keywords) {
        const titleSummaryText = `${candidate.title} ${candidate.summary}`.toLowerCase();
        const keywordMatches = searchParams.keywords.filter((keyword: string) => 
          titleSummaryText.includes(keyword.toLowerCase())
        ).length;
        score += keywordMatches * 10;
      }

      return {
        ...candidate,
        skills,
        score: Math.min(score, 99) // Cap at 99%
      };
    }) || [];

    // Sort by relevance score
    transformedCandidates.sort((a, b) => b.score - a.score);

    const summary = `Found ${transformedCandidates.length} candidates matching "${query}". Results ranked by AI relevance score.`;

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
