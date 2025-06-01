
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

    // Execute search in Supabase using simple text matching
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Simple text search approach
    let candidatesQuery = supabase
      .from('candidates')
      .select(`
        *,
        candidate_skills(
          skill_id,
          skills(name)
        )
      `);

    // Enhanced search logic with multiple conditions
    const searchTerm = query.toLowerCase();
    
    if (searchTerm.includes('react')) {
      candidatesQuery = candidatesQuery.or('title.ilike.%react%,summary.ilike.%react%');
    } else if (searchTerm.includes('python')) {
      candidatesQuery = candidatesQuery.or('title.ilike.%python%,summary.ilike.%python%');
    } else if (searchTerm.includes('javascript')) {
      candidatesQuery = candidatesQuery.or('title.ilike.%javascript%,summary.ilike.%javascript%');
    } else if (searchTerm.includes('senior')) {
      candidatesQuery = candidatesQuery.gte('experience_years', 5);
    } else if (searchTerm.includes('junior')) {
      candidatesQuery = candidatesQuery.lte('experience_years', 2);
    } else if (searchTerm.includes('full stack') || searchTerm.includes('fullstack')) {
      candidatesQuery = candidatesQuery.or('title.ilike.%full%,title.ilike.%stack%,summary.ilike.%full%,summary.ilike.%stack%');
    } else {
      // General text search across multiple fields
      candidatesQuery = candidatesQuery.or(`title.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
    }

    const { data: candidates, error: searchError } = await candidatesQuery.limit(20);

    if (searchError) {
      console.error('Search error:', searchError);
      throw new Error('Failed to search candidates');
    }

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
