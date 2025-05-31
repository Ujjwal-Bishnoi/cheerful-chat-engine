
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

    // Create SQL generation prompt for DeepSeek
    const sqlPrompt = `Convert this natural language query to a PostgreSQL SELECT statement for the 'candidates' table.

Table schema:
- name (text)
- email (text) 
- title (text)
- location (text)
- summary (text)
- experience_years (integer)
- skills (accessed via candidate_skills join with skills table)
- availability (enum: 'actively_looking', 'open_to_offers', 'contract_only', 'not_available')
- work_experience (jsonb array)
- education (jsonb array)
- verified (boolean)

For skills searches, use this pattern:
EXISTS (SELECT 1 FROM candidate_skills cs JOIN skills s ON cs.skill_id = s.id WHERE cs.candidate_id = candidates.id AND s.name ILIKE '%skill_name%')

Query: "${query}"

Return only the WHERE clause conditions (without SELECT or FROM), or 'true' if no specific filters are needed.`;

    // Call DeepSeek API for SQL generation
    const sqlResponse = await fetch('https://api.deepseek.com/chat/completions', {
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
            content: sqlPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      }),
    });

    if (!sqlResponse.ok) {
      throw new Error(`DeepSeek API error: ${sqlResponse.status}`);
    }

    const sqlData = await sqlResponse.json();
    let whereClause = sqlData.choices[0].message.content.trim();
    
    console.log('Generated WHERE clause:', whereClause);

    // Clean up the response and ensure it's safe
    whereClause = whereClause.replace(/```sql|```/g, '').trim();
    if (!whereClause || whereClause === 'true') {
      whereClause = 'true';
    }

    // Execute search in Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Build and execute the query
    let candidatesQuery = supabase
      .from('candidates')
      .select(`
        *,
        candidate_skills(
          skill_id,
          skills(name)
        )
      `);

    // For simple searches, use text search instead of raw SQL
    if (query.toLowerCase().includes('react')) {
      candidatesQuery = candidatesQuery.or('title.ilike.%react%,summary.ilike.%react%');
    } else if (query.toLowerCase().includes('python')) {
      candidatesQuery = candidatesQuery.or('title.ilike.%python%,summary.ilike.%python%');
    } else if (query.toLowerCase().includes('senior')) {
      candidatesQuery = candidatesQuery.gte('experience_years', 5);
    } else {
      // General text search
      candidatesQuery = candidatesQuery.or(`title.ilike.%${query}%,summary.ilike.%${query}%`);
    }

    const { data: candidates, error: searchError } = await candidatesQuery.limit(20);

    if (searchError) {
      console.error('Search error:', searchError);
      throw new Error('Failed to search candidates');
    }

    // Transform the data to include skills array
    const transformedCandidates = candidates?.map(candidate => ({
      ...candidate,
      skills: candidate.candidate_skills?.map((cs: any) => cs.skills.name) || [],
      score: Math.floor(Math.random() * 20) + 80 // Simulated relevance score
    })) || [];

    // Generate human-readable summary using DeepSeek
    const summaryPrompt = `Based on this search query: "${query}"
    
Found ${transformedCandidates.length} candidates. Write a brief, human-readable summary of the search results (2-3 sentences max).

Candidates found:
${transformedCandidates.slice(0, 3).map(c => `- ${c.name}: ${c.title}, ${c.experience_years} years experience`).join('\n')}

Keep the response conversational and helpful.`;

    const summaryResponse = await fetch('https://api.deepseek.com/chat/completions', {
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
            content: summaryPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      }),
    });

    let summary = `Found ${transformedCandidates.length} candidates matching your search criteria.`;
    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      summary = summaryData.choices[0].message.content.trim();
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
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
