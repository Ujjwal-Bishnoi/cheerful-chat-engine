import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useResumeParserFallback = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const { toast } = useToast();

  const parseResumeText = (text: string, fileName: string) => {
    // Clean up the text by removing PDF metadata and control characters
    let cleanText = text
      .replace(/^%PDF.*?endobj/s, '') // Remove PDF header
      .replace(/[^\x20-\x7E\n\r]/g, ' ') // Remove non-printable characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // If text is still mostly garbage, create basic fallback
    if (cleanText.length < 50 || cleanText.includes('obj') || cleanText.includes('endobj')) {
      const candidateName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
      return {
        name: candidateName,
        email: '',
        phone: '',
        title: 'Software Developer',
        location: 'Not specified',
        summary: 'Resume uploaded - please review and edit information manually',
        experience_years: 0,
        skills: [],
        work_experience: [],
        education: [],
        certifications: [],
        languages: ['English']
      };
    }

    const lines = cleanText.split('\n').filter(line => line.trim().length > 2);
    
    // Extract basic information using patterns
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/;
    
    const email = cleanText.match(emailRegex)?.[0] || '';
    const phone = cleanText.match(phoneRegex)?.[0] || '';
    
    // Enhanced name extraction - look for a proper name at the beginning
    let candidateName = '';
    const firstLine = lines[0]?.trim();
    if (firstLine && firstLine.length < 100 && /^[A-Z][a-z]+ [A-Z][a-z]+/.test(firstLine)) {
      candidateName = firstLine;
    } else {
      // Look for name patterns in first few lines
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i].trim();
        if (line.length > 2 && line.length < 50 && 
            /^[A-Z][a-z]+ [A-Z][a-z]+/.test(line) &&
            !line.includes('@') && !line.includes('http') &&
            !line.toLowerCase().includes('resume') &&
            !line.toLowerCase().includes('cv')) {
          candidateName = line;
          break;
        }
      }
    }
    
    if (!candidateName) {
      candidateName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
    }
    
    // Enhanced skill extraction
    const allSkillKeywords = [
      // Programming Languages
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Kotlin', 'Swift', 'TypeScript',
      'Scala', 'Rust', 'Perl', 'R', 'MATLAB', 'VB.NET', 'Objective-C', 'Dart', 'Elixir', 'Haskell',
      
      // Web Technologies
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails',
      'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind', 'jQuery', 'Redux', 'GraphQL', 'REST',
      'Next.js', 'Nuxt.js', 'Svelte', 'Ember.js', 'Backbone.js', 'Webpack', 'Vite', 'Gulp', 'Grunt',
      
      // Databases
      'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQLite', 'DynamoDB', 'Cassandra',
      'Neo4j', 'ElasticSearch', 'CouchDB', 'Firebase', 'Supabase',
      
      // Cloud & DevOps
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'Terraform',
      'Ansible', 'Chef', 'Puppet', 'Vagrant', 'Travis CI', 'CircleCI', 'Heroku', 'Netlify', 'Vercel',
      
      // Mobile Development
      'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Cordova', 'Android', 'iOS',
      
      // AI/ML
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'Pandas',
      'NumPy', 'OpenCV', 'NLP', 'Computer Vision', 'Neural Networks', 'RAG', 'LLM', 'GPT', 'BERT',
      
      // Other Technologies
      'Blockchain', 'Solidity', 'Web3', 'Microservices', 'API', 'Agile', 'Scrum', 'DevOps', 'CI/CD',
      'Testing', 'Jest', 'Cypress', 'Selenium', 'Unit Testing', 'Integration Testing'
    ];
    
    const foundSkills = [];
    for (const skill of allSkillKeywords) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(cleanText)) {
        foundSkills.push(skill);
      }
    }
    
    // Enhanced experience extraction
    let experienceYears = 0;
    const expPatterns = [
      /(\d+)\s*(?:\+)?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i,
      /experience[:\s]*(\d+)\s*(?:years?|yrs?)/i,
      /(\d+)\s*(?:years?|yrs?)\s*experience/i
    ];
    
    for (const pattern of expPatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        experienceYears = parseInt(match[1]);
        break;
      }
    }
    
    // If no explicit experience mentioned, try to infer from dates
    if (experienceYears === 0) {
      const currentYear = new Date().getFullYear();
      const yearMatches = cleanText.match(/20\d{2}/g);
      if (yearMatches && yearMatches.length > 0) {
        const years = yearMatches.map(y => parseInt(y)).filter(y => y <= currentYear);
        const minYear = Math.min(...years);
        if (minYear > 2000 && minYear < currentYear) {
          experienceYears = currentYear - minYear;
        }
      }
    }
    
    // Enhanced job title extraction
    let jobTitle = 'Software Developer';
    const titlePatterns = [
      /(?:software|web|mobile|full.?stack|front.?end|back.?end|senior|junior|lead|principal)\s+(?:developer|engineer|programmer|architect)/gi,
      /(?:data|machine learning|ml|ai|devops|cloud|security)\s+(?:engineer|scientist|architect|specialist)/gi,
      /(?:product|project|technical|engineering)\s+(?:manager|lead|director)/gi,
      /(?:ui|ux|frontend|backend|fullstack)\s+(?:developer|engineer|designer)/gi
    ];
    
    for (const pattern of titlePatterns) {
      const matches = cleanText.match(pattern);
      if (matches && matches.length > 0) {
        jobTitle = matches[0];
        break;
      }
    }
    
    // Enhanced education extraction
    const education = [];
    const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'institute'];
    const educationLines = lines.filter(line => 
      educationKeywords.some(keyword => line.toLowerCase().includes(keyword))
    );
    
    if (educationLines.length > 0) {
      const eduLine = educationLines[0];
      education.push({
        institution: 'University',
        degree: eduLine.toLowerCase().includes('master') ? "Master's" : 
               eduLine.toLowerCase().includes('phd') ? "PhD" : "Bachelor's",
        field: eduLine.toLowerCase().includes('computer') ? 'Computer Science' : 
               eduLine.toLowerCase().includes('engineering') ? 'Engineering' : 'Technology',
        year: '2020'
      });
    }
    
    // Enhanced work experience extraction
    const workExperience = [];
    const companyIndicators = ['pvt', 'ltd', 'inc', 'corp', 'llc', 'technologies', 'solutions', 'systems'];
    const roleIndicators = ['engineer', 'developer', 'manager', 'analyst', 'consultant', 'specialist'];
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      const hasCompany = companyIndicators.some(indicator => lowerLine.includes(indicator));
      const hasRole = roleIndicators.some(indicator => lowerLine.includes(indicator));
      
      if (hasCompany || hasRole) {
        workExperience.push({
          company: hasCompany ? line.trim() : 'Previous Company',
          role: hasRole ? line.trim() : jobTitle,
          duration: '2020-2023',
          description: 'Professional experience in software development'
        });
        if (workExperience.length >= 2) break; // Limit to 2 experiences
      }
    }
    
    // Enhanced location extraction
    let location = 'Not specified';
    const locationPatterns = [
      /(?:address|location)[:\s]*([^,\n]+(?:,\s*[^,\n]+)*)/i,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2,})/,
      /([A-Z][a-z]+,\s*[A-Z][a-z]+)/
    ];
    
    for (const pattern of locationPatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        location = match[1].trim();
        break;
      }
    }
    
    // Enhanced summary extraction
    let summary = 'Professional with experience in software development';
    const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (summaryKeywords.some(keyword => line.includes(keyword))) {
        // Take next few lines as summary
        const summaryLines = lines.slice(i + 1, i + 4).filter(l => 
          l.trim().length > 20 && !l.toLowerCase().includes('experience') && 
          !l.toLowerCase().includes('education')
        );
        if (summaryLines.length > 0) {
          summary = summaryLines.join(' ').substring(0, 300);
          break;
        }
      }
    }
    
    return {
      name: candidateName,
      email: email,
      phone: phone,
      title: jobTitle,
      location: location,
      summary: summary,
      experience_years: experienceYears,
      skills: foundSkills.length > 0 ? foundSkills : ['Software Development'],
      work_experience: workExperience,
      education: education,
      certifications: [],
      languages: ['English']
    };
  };

  const parseResume = async (file: File) => {
    setIsProcessing(true);
    setParsedData(null);

    try {
      // Read file content
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file, 'UTF-8');
      });

      // Parse the extracted text
      const parsed = parseResumeText(text, file.name);
      setParsedData(parsed);
      
      toast({
        title: "Resume parsed successfully",
        description: `Information extracted for ${parsed.name}`,
      });

      return { success: true, parsedData: parsed };

    } catch (error: any) {
      console.error('Resume parsing error:', error);
      
      // Create minimal fallback data
      const fallbackData = {
        name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
        email: '',
        phone: '',
        title: 'Candidate',
        location: 'Not specified',
        summary: 'Resume uploaded - please review and edit information',
        experience_years: 0,
        skills: [],
        work_experience: [],
        education: [],
        certifications: [],
        languages: []
      };
      
      setParsedData(fallbackData);
      
      toast({
        title: "Basic parsing completed",
        description: "Please review and edit the extracted information",
        variant: "default"
      });
      
      return { success: true, parsedData: fallbackData };
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToDatabase = async () => {
    if (!parsedData) return;

    try {
      // Insert candidate data
      const { data: candidate, error: candidateError } = await supabase
        .from('candidates')
        .insert({
          name: parsedData.name,
          email: parsedData.email || '',
          title: parsedData.title,
          location: parsedData.location || '',
          summary: parsedData.summary || '',
          experience_years: parsedData.experience_years || 0,
          availability: 'open_to_offers',
          verification_score: 75,
          verified: false,
          work_experience: parsedData.work_experience || [],
          education: parsedData.education || [],
          certifications: parsedData.certifications || [],
          languages: parsedData.languages || []
        })
        .select()
        .single();

      if (candidateError) throw candidateError;

      // Insert skills if any
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

      toast({
        title: "Candidate saved successfully",
        description: `${parsedData.name} has been added to the database`,
      });

      return candidate;
    } catch (error: any) {
      console.error('Error saving candidate:', error);
      toast({
        title: "Failed to save candidate",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    parseResume,
    isProcessing,
    parsedData,
    setParsedData,
    saveToDatabase
  };
};
