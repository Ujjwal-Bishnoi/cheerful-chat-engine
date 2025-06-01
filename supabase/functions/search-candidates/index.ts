
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

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get all candidates with their skills
    const { data: candidates, error: searchError } = await supabase
      .from('candidates')
      .select(`
        *,
        candidate_skills(
          skill_id,
          skills(name)
        )
      `);

    if (searchError) {
      console.error('Search error:', searchError);
      throw new Error('Failed to search candidates');
    }

    // Filter candidates based on query
    const searchTerm = query.toLowerCase();
    const filteredCandidates = candidates?.filter(candidate => {
      // Check name, title, summary
      const textMatch = [
        candidate.name?.toLowerCase() || '',
        candidate.title?.toLowerCase() || '',
        candidate.summary?.toLowerCase() || '',
        candidate.location?.toLowerCase() || ''
      ].some(field => field.includes(searchTerm));

      // Check skills
      const skills = candidate.candidate_skills?.map((cs: any) => cs.skills?.name?.toLowerCase()).filter(Boolean) || [];
      const skillMatch = skills.some((skill: string) => skill.includes(searchTerm));

      // Check work experience
      const workExpMatch = candidate.work_experience?.some((exp: any) => 
        exp.role?.toLowerCase().includes(searchTerm) ||
        exp.company?.toLowerCase().includes(searchTerm) ||
        exp.description?.toLowerCase().includes(searchTerm)
      ) || false;

      // Check education
      const educationMatch = candidate.education?.some((edu: any) =>
        edu.degree?.toLowerCase().includes(searchTerm) ||
        edu.field?.toLowerCase().includes(searchTerm) ||
        edu.institution?.toLowerCase().includes(searchTerm)
      ) || false;

      return textMatch || skillMatch || workExpMatch || educationMatch;
    }) || [];

    // Transform the data to include skills array
    const transformedCandidates = filteredCandidates.map(candidate => ({
      ...candidate,
      skills: candidate.candidate_skills?.map((cs: any) => cs.skills?.name).filter(Boolean) || [],
      score: Math.floor(Math.random() * 20) + 80 // Simulated relevance score
    }));

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
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
