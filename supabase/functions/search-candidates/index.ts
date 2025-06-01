
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = 'https://ocmqqtgcadltakzuwixd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jbXFxdGdjYWRsdGFrenV3aXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjU0MjYsImV4cCI6MjA2NDIwMTQyNn0.u_L1ruz6-gE9q8uuH9bKAZzpUX2IqLoP5qmgTgSd_fQ';

const groqApiKey = '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';

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

    // Use Groq API for query understanding and search
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an AI hiring assistant helping recruiters find candidates from a structured candidate database. Your task is to analyze the recruiter's plain-English query and convert it into search parameters for semantic matching.

Examples:
Query: "Find senior RAG engineers in EU open to contracts"
Output: {"keywords": ["RAG", "engineer", "senior"], "skills": ["RAG", "LangChain", "vector database"], "seniority": "senior", "location": ["EU", "Europe"], "experience_min": 5, "work_type": "contract"}

Query: "Looking for GenAI researchers with PyTorch and RLHF experience in the US"
Output: {"keywords": ["GenAI", "researcher", "PyTorch", "RLHF"], "skills": ["PyTorch", "RLHF", "GenAI", "machine learning"], "location": ["US", "United States"], "experience_min": 3}

Query: "Find Python developers with 3+ years experience"
Output: {"keywords": ["Python", "developer"], "skills": ["Python"], "experience_min": 3}

Query: "Show me candidates having experience in RAG"
Output: {"keywords": ["RAG", "experience"], "skills": ["RAG", "LangChain", "vector search", "embeddings"], "experience_min": 1}

Return only a JSON object with extracted search parameters. Include semantic variations of skills to improve matching.`
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

    if (!groqResponse.ok) {
      console.error('Groq API error:', await groqResponse.text());
      throw new Error('Failed to process query with AI');
    }

    const groqData = await groqResponse.json();
    let searchParams;
    
    try {
      searchParams = JSON.parse(groqData.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError);
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

    // Build dynamic search query with OR conditions for better matching
    const searchConditions = [];
    
    // Search in title, summary, name, work_experience, education
    if (searchParams.keywords && searchParams.keywords.length > 0) {
      const keywordConditions = [];
      searchParams.keywords.forEach((keyword) => {
        keywordConditions.push(`title.ilike.%${keyword}%`);
        keywordConditions.push(`summary.ilike.%${keyword}%`);
        keywordConditions.push(`name.ilike.%${keyword}%`);
        keywordConditions.push(`work_experience.cs.${JSON.stringify([{description: keyword}])}`);
        keywordConditions.push(`education.cs.${JSON.stringify([{field: keyword}])}`);
      });
      searchConditions.push(...keywordConditions);
    }

    // Enhanced skill search
    if (searchParams.skills && searchParams.skills.length > 0) {
      const skillConditions = [];
      searchParams.skills.forEach((skill) => {
        skillConditions.push(`title.ilike.%${skill}%`);
        skillConditions.push(`summary.ilike.%${skill}%`);
        skillConditions.push(`work_experience.cs.${JSON.stringify([{description: skill}])}`);
      });
      searchConditions.push(...skillConditions);
    }

    // Location search
    if (searchParams.location && searchParams.location.length > 0) {
      const locationConditions = searchParams.location.map((loc) => 
        `location.ilike.%${loc}%`
      );
      searchConditions.push(...locationConditions);
    }

    // Experience filter
    if (searchParams.experience_min) {
      candidatesQuery = candidatesQuery.gte('experience_years', searchParams.experience_min);
    }

    // Availability filter
    if (searchParams.work_type) {
      if (searchParams.work_type.toLowerCase().includes('contract')) {
        candidatesQuery = candidatesQuery.eq('availability', 'contract_only');
      } else if (searchParams.work_type.toLowerCase().includes('full')) {
        candidatesQuery = candidatesQuery.in('availability', ['actively_looking', 'open_to_offers']);
      }
    }

    // Apply OR conditions
    if (searchConditions.length > 0) {
      candidatesQuery = candidatesQuery.or(searchConditions.join(','));
    }

    const { data: candidates, error: searchError } = await candidatesQuery.limit(50);

    if (searchError) {
      console.error('Search error:', searchError);
      throw new Error('Failed to search candidates');
    }

    // Transform the data to include skills array and calculate relevance score
    const transformedCandidates = candidates?.map(candidate => {
      const skills = candidate.candidate_skills?.map((cs) => cs.skills?.name).filter(Boolean) || [];
      
      // Calculate relevance score based on matches
      let score = 60; // Base score
      
      // Skill matches (higher weight)
      if (searchParams.skills) {
        const skillMatches = searchParams.skills.filter((skill) => 
          skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          ) ||
          candidate.title?.toLowerCase().includes(skill.toLowerCase()) ||
          candidate.summary?.toLowerCase().includes(skill.toLowerCase())
        ).length;
        score += skillMatches * 20;
      }

      // Experience bonus
      if (searchParams.experience_min && candidate.experience_years >= searchParams.experience_min) {
        score += 15;
      }

      // Keyword matches in title/summary/work experience
      if (searchParams.keywords) {
        const titleSummaryText = `${candidate.title} ${candidate.summary}`.toLowerCase();
        const workExperienceText = JSON.stringify(candidate.work_experience || []).toLowerCase();
        const keywordMatches = searchParams.keywords.filter((keyword) => 
          titleSummaryText.includes(keyword.toLowerCase()) ||
          workExperienceText.includes(keyword.toLowerCase())
        ).length;
        score += keywordMatches * 10;
      }

      // Location bonus
      if (searchParams.location && candidate.location) {
        const locationMatches = searchParams.location.some(loc => 
          candidate.location.toLowerCase().includes(loc.toLowerCase())
        );
        if (locationMatches) score += 10;
      }

      return {
        ...candidate,
        skills,
        score: Math.min(score, 99) // Cap at 99%
      };
    }) || [];

    // Sort by relevance score and filter for minimum relevance
    const filteredCandidates = transformedCandidates
      .filter(candidate => candidate.score >= 70) // Only show relevant matches
      .sort((a, b) => b.score - a.score);

    const summary = `Found ${filteredCandidates.length} candidates matching "${query}". Results ranked by AI relevance score using Groq LLaMA.`;

    return new Response(JSON.stringify({
      success: true,
      candidates: filteredCandidates,
      summary,
      count: filteredCandidates.length
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
