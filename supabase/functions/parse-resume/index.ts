
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
    const { fileUrl, fileName } = await req.json();
    
    if (!fileUrl) {
      throw new Error('No file URL provided');
    }

    console.log('Processing resume:', fileName);

    // Download the file content
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error('Failed to download file');
    }
    
    const fileBuffer = await fileResponse.arrayBuffer();
    const fileText = new TextDecoder().decode(fileBuffer);
    
    // Extract text content (simplified - in production you'd use PDF parsing libraries)
    let extractedText = fileText;
    
    // If it looks like a PDF, extract readable content
    if (fileName.toLowerCase().endsWith('.pdf')) {
      // Simple PDF text extraction - in production use proper PDF parser
      extractedText = fileText.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    console.log('Extracted text length:', extractedText.length);

    // Create prompt for DeepSeek API
    const prompt = `Extract structured information from this resume text and return ONLY a valid JSON object with the following fields:

{
  "name": "candidate full name",
  "email": "email address",
  "title": "current or desired job title",
  "location": "location/address",
  "summary": "brief professional summary",
  "experience_years": number,
  "skills": ["skill1", "skill2", "skill3"],
  "work_experience": [
    {
      "company": "company name",
      "role": "job title",
      "duration": "employment period",
      "description": "brief description"
    }
  ],
  "education": [
    {
      "institution": "school name",
      "degree": "degree type",
      "field": "field of study",
      "year": "graduation year"
    }
  ],
  "certifications": ["cert1", "cert2"],
  "languages": ["language1", "language2"]
}

Resume text:
${extractedText.slice(0, 4000)}

Return only the JSON object, no other text.`;

    // Call DeepSeek API
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
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      }),
    });

    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text();
      console.error('DeepSeek API error:', errorText);
      throw new Error(`DeepSeek API error: ${deepseekResponse.status}`);
    }

    const deepseekData = await deepseekResponse.json();
    const extractedData = deepseekData.choices[0].message.content;
    
    console.log('DeepSeek response:', extractedData);

    // Parse the JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(extractedData);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback to basic extraction
      parsedData = {
        name: "Unknown",
        email: "",
        title: "Not specified",
        location: "",
        summary: extractedText.slice(0, 200),
        experience_years: 0,
        skills: [],
        work_experience: [],
        education: [],
        certifications: [],
        languages: []
      };
    }

    // Store in Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const candidateData = {
      name: parsedData.name || "Unknown",
      email: parsedData.email || "",
      title: parsedData.title || "Not specified",
      location: parsedData.location || "",
      summary: parsedData.summary || "",
      experience_years: parsedData.experience_years || 0,
      availability: 'open_to_offers',
      verification_score: 85,
      verified: true,
      work_experience: parsedData.work_experience || [],
      education: parsedData.education || [],
      certifications: parsedData.certifications || [],
      languages: parsedData.languages || []
    };

    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .insert(candidateData)
      .select()
      .single();

    if (candidateError) {
      console.error('Error inserting candidate:', candidateError);
      throw new Error('Failed to save candidate data');
    }

    // Insert skills
    if (parsedData.skills && parsedData.skills.length > 0) {
      for (const skillName of parsedData.skills) {
        // Insert or get skill
        const { data: skill } = await supabase
          .from('skills')
          .upsert({ name: skillName, category: 'Technical' }, { onConflict: 'name' })
          .select()
          .single();

        if (skill) {
          // Link skill to candidate
          await supabase
            .from('candidate_skills')
            .insert({
              candidate_id: candidate.id,
              skill_id: skill.id,
              proficiency_level: 4,
              years_experience: 2
            });
        }
      }
    }

    // Store resume file info
    await supabase
      .from('resumes')
      .insert({
        candidate_id: candidate.id,
        filename: fileName,
        content_text: extractedText.slice(0, 10000),
        parsing_confidence: 85,
        parsed_data: parsedData,
        file_size: fileBuffer.byteLength
      });

    return new Response(JSON.stringify({
      success: true,
      candidate,
      parsedData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in parse-resume function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
