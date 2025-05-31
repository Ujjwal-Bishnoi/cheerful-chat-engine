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

    // Download and extract text
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error('Failed to download file');
    }
    
    const fileBuffer = await fileResponse.arrayBuffer();
    const fileText = new TextDecoder().decode(fileBuffer);
    
    // Clean and normalize text
    let extractedText = fileText
      .replace(/[^\x20-\x7E\n\r]/g, ' ') // Remove non-printable characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/obj|endobj|stream|endstream/g, '') // Remove PDF metadata
      .trim();

    // Enhanced DeepSeek prompt for field extraction
    const prompt = `You are an intelligent resume parser. Extract the following fields from the resume text, even if the format is non-standard. Use best effort and context.

Return fields in this exact JSON format:
{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "total_experience": "",
  "skills": [],
  "current_role": "",
  "education": "",
  "linkedin": "",
  "github": ""
}

Rules:
- If email or phone is in a footer/header, still extract
- Skills should be inferred from both skill sections and work descriptions
- Use context (e.g., "worked at HuggingFace on Transformers → skill = Transformers, NLP, HuggingFace")
- Extract years of experience as a number
- For location, extract city/state/country if available
- For current role, extract the most recent job title
- For education, extract degree and institution

Extract the following fields from this resume:

<<<
${extractedText.slice(0, 4000)}
>>>

Return ONLY the JSON object, no other text:`;

    // Call DeepSeek API for parsing
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
      parsedData = {
        name: extractNameFromText(extractedText) || fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
        email: extractEmailFromText(extractedText) || "",
        phone: extractPhoneFromText(extractedText) || "",
        location: extractLocationFromText(extractedText) || "Not specified",
        total_experience: extractExperienceFromText(extractedText) || 0,
        skills: extractSkillsFromText(extractedText) || [],
        current_role: extractCurrentRoleFromText(extractedText) || "Software Developer",
        education: extractEducationFromText(extractedText) || "",
        linkedin: extractLinkedInFromText(extractedText) || "",
        github: extractGitHubFromText(extractedText) || ""
      };
    }

    // Map to database format with enhanced fields
    const candidateData = {
      name: parsedData.name || "Unknown",
      email: parsedData.email || "",
      title: parsedData.current_role || "Not specified",
      location: parsedData.location || "",
      summary: `${parsedData.current_role || 'Professional'} with ${parsedData.total_experience || 0} years of experience. ${parsedData.education ? 'Education: ' + parsedData.education : ''}`.trim(),
      experience_years: parseInt(parsedData.total_experience) || 0,
      availability: 'open_to_offers',
      verification_score: calculateVerificationScore(parsedData),
      verified: isVerifiedProfile(parsedData),
      work_experience: [{
        company: "Previous Company",
        role: parsedData.current_role || "Professional",
        duration: "Recent",
        description: `Professional with expertise in: ${parsedData.skills?.join(', ') || 'various technologies'}`
      }],
      education: parsedData.education ? [{
        institution: parsedData.education.split(',')[0]?.trim() || "Institution",
        degree: extractDegreeFromEducation(parsedData.education),
        field: extractFieldFromEducation(parsedData.education),
        year: extractYearFromEducation(parsedData.education) || "Recent"
      }] : [],
      certifications: [],
      languages: ["English"],
      linkedin_url: parsedData.linkedin || null,
      github_url: parsedData.github || null
    };

    // Store in Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .insert(candidateData)
      .select()
      .single();

    if (candidateError) {
      console.error('Error inserting candidate:', candidateError);
      throw new Error('Failed to save candidate data');
    }

    // Insert skills with enhanced categorization
    if (parsedData.skills && parsedData.skills.length > 0) {
      for (const skillName of parsedData.skills) {
        const category = categorizeSkill(skillName);
        
        // Insert or get skill
        const { data: skill } = await supabase
          .from('skills')
          .upsert({ 
            name: skillName, 
            category: category
          }, { onConflict: 'name' })
          .select()
          .single();

        if (skill) {
          // Link skill to candidate with proficiency
          await supabase
            .from('candidate_skills')
            .insert({
              candidate_id: candidate.id,
              skill_id: skill.id,
              proficiency_level: estimateSkillProficiency(skillName, extractedText),
              years_experience: estimateSkillYears(skillName, extractedText, parsedData.total_experience)
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
        parsing_confidence: calculateParsingConfidence(parsedData),
        parsed_data: parsedData,
        file_size: fileBuffer.byteLength,
        parsing_flags: generateParsingFlags(parsedData)
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

// Helper functions for enhanced parsing
function calculateVerificationScore(parsedData: any): number {
  let score = 60; // Base score
  if (parsedData.email) score += 10;
  if (parsedData.phone) score += 5;
  if (parsedData.linkedin) score += 10;
  if (parsedData.github) score += 5;
  if (parsedData.education) score += 5;
  if (parsedData.skills?.length > 3) score += 5;
  return Math.min(score, 100);
}

function isVerifiedProfile(parsedData: any): boolean {
  return calculateVerificationScore(parsedData) >= 85;
}

function categorizeSkill(skill: string): string {
  const categories = {
    'Programming': ['JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'Go', 'Rust'],
    'AI/ML': ['PyTorch', 'TensorFlow', 'RAG', 'LangChain', 'RLHF', 'Machine Learning'],
    'Web': ['React', 'Angular', 'Vue', 'Node.js', 'HTML', 'CSS'],
    'Database': ['SQL', 'MongoDB', 'PostgreSQL', 'Redis'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    'Mobile': ['React Native', 'Flutter', 'iOS', 'Android']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(k => skill.toLowerCase().includes(k.toLowerCase()))) {
      return category;
    }
  }
  return 'Other';
}

function estimateSkillProficiency(skill: string, text: string): number {
  const mentions = (text.match(new RegExp(skill, 'gi')) || []).length;
  const hasLeadMention = text.toLowerCase().includes(`lead ${skill.toLowerCase()}`);
  const hasSeniorMention = text.toLowerCase().includes(`senior ${skill.toLowerCase()}`);
  
  let score = 3; // Base proficiency
  if (mentions > 3) score++;
  if (hasLeadMention || hasSeniorMention) score++;
  return Math.min(score, 5);
}

function estimateSkillYears(skill: string, text: string, totalExperience: number): number {
  const yearPattern = new RegExp(`(\\d+)\\s*years?.*?${skill}`, 'i');
  const match = text.match(yearPattern);
  if (match) {
    return Math.min(parseInt(match[1]), totalExperience || 10);
  }
  return Math.floor(totalExperience / 2) || 1;
}

function calculateParsingConfidence(parsedData: any): number {
  let confidence = 70; // Base confidence
  const requiredFields = ['name', 'email', 'current_role', 'skills'];
  const presentFields = requiredFields.filter(f => parsedData[f] && parsedData[f].length > 0);
  confidence += (presentFields.length / requiredFields.length) * 30;
  return Math.round(confidence);
}

function generateParsingFlags(parsedData: any): string[] {
  const flags = [];
  if (!parsedData.email) flags.push('missing_email');
  if (!parsedData.name) flags.push('missing_name');
  if (!parsedData.skills?.length) flags.push('missing_skills');
  if (parsedData.skills?.length > 20) flags.push('excessive_skills');
  return flags;
}

function extractDegreeFromEducation(education: string): string {
  const degrees = ['Bachelor', 'Master', 'PhD', 'BSc', 'MSc', 'BA', 'MA'];
  for (const degree of degrees) {
    if (education?.toLowerCase().includes(degree.toLowerCase())) {
      return degree;
    }
  }
  return "Degree";
}

function extractFieldFromEducation(education: string): string {
  const fields = ['Computer Science', 'Engineering', 'Information Technology', 'Mathematics'];
  for (const field of fields) {
    if (education?.toLowerCase().includes(field.toLowerCase())) {
      return field;
    }
  }
  return "Field of Study";
}

function extractYearFromEducation(education: string): string {
  const yearPattern = /20\d{2}|19\d{2}/;
  const match = education?.match(yearPattern);
  return match ? match[0] : "Recent";
}

// Existing helper functions remain unchanged
function extractNameFromText(text: string): string | null {
  const lines = text.split('\n').filter(line => line.trim().length > 2);
  const nameCandidate = lines.slice(0, 5).find(line => {
    const trimmed = line.trim();
    return trimmed.length > 2 && 
           trimmed.length < 60 && 
           !trimmed.includes('@') && 
           !trimmed.includes('http') &&
           /^[A-Za-z\s.'-]+$/.test(trimmed) &&
           !trimmed.toLowerCase().includes('resume') &&
           !trimmed.toLowerCase().includes('cv');
  })?.trim();
  return nameCandidate || null;
}

function extractEmailFromText(text: string): string | null {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  return text.match(emailRegex)?.[0] || null;
}

function extractPhoneFromText(text: string): string | null {
  const phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/;
  return text.match(phoneRegex)?.[0] || null;
}

function extractLocationFromText(text: string): string | null {
  const locationRegex = /([A-Za-z\s]+,\s*[A-Z]{2}|[A-Za-z\s]+,\s*[A-Za-z\s]+)/;
  return text.match(locationRegex)?.[0] || null;
}

function extractExperienceFromText(text: string): number {
  const experienceMatches = text.match(/(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i);
  return experienceMatches ? parseInt(experienceMatches[1]) : 0;
}

function extractSkillsFromText(text: string): string[] {
  const skillKeywords = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'HTML', 'CSS', 
    'Git', 'AWS', 'Docker', 'TypeScript', 'Angular', 'Vue', 'MongoDB', 'PostgreSQL',
    'PHP', 'Ruby', 'Go', 'Kotlin', 'Swift', 'Flutter', 'React Native', 'Redux',
    'Express', 'Django', 'Spring', 'Laravel', 'Firebase', 'GraphQL', 'REST',
    'RAG', 'LangChain', 'PyTorch', 'TensorFlow', 'Machine Learning', 'AI', 'ML',
    'NLP', 'Computer Vision', 'Data Science', 'Analytics', 'Kubernetes'
  ];
  
  return skillKeywords.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractCurrentRoleFromText(text: string): string | null {
  const jobTitlePatterns = [
    /(?:software|web|mobile|full.?stack|front.?end|back.?end|senior|junior|lead)\s+(?:developer|engineer|programmer)/gi,
    /(?:data\s+scientist|machine\s+learning\s+engineer|ai\s+engineer|research\s+scientist)/gi,
    /(?:product\s+manager|project\s+manager|engineering\s+manager)/gi
  ];
  
  for (const pattern of jobTitlePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      return matches[0];
    }
  }
  return null;
}

function extractEducationFromText(text: string): string | null {
  const educationRegex = /(bachelor|master|phd|doctorate|bs|ms|ba|ma).*?(university|college|institute)/gi;
  return text.match(educationRegex)?.[0] || null;
}

function extractLinkedInFromText(text: string): string | null {
  const linkedinRegex = /linkedin\.com\/in\/[A-Za-z0-9-]+/i;
  return text.match(linkedinRegex)?.[0] || null;
}

function extractGitHubFromText(text: string): string | null {
  const githubRegex = /github\.com\/[A-Za-z0-9-]+/i;
  return text.match(githubRegex)?.[0] || null;
}