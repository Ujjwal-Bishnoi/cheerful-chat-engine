
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
    const supabase = createClient(supabaseUrl, supabaseKey);

    const newCandidates = [
      {
        name: "Sarah Chen",
        email: "sarah.chen@email.com",
        title: "Senior RAG Engineer",
        location: "San Francisco, CA",
        experience_years: 6,
        summary: "Expert in Retrieval-Augmented Generation systems with extensive experience in LangChain, vector databases, and semantic search. Built production RAG systems serving millions of queries.",
        availability: "actively_looking",
        verified: true,
        verification_score: 92,
        work_experience: [
          {
            role: "Senior RAG Engineer",
            company: "AI Research Lab",
            duration: "2022-2024",
            description: "Led development of enterprise RAG systems using LangChain and Pinecone. Improved retrieval accuracy by 35%."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Computer Science",
            institution: "Stanford University",
            year: "2020"
          }
        ],
        languages: ["English", "Mandarin"]
      },
      {
        name: "Marcus Rodriguez",
        email: "marcus.rodriguez@email.com",
        title: "GenAI Research Scientist",
        location: "Austin, TX",
        experience_years: 8,
        summary: "Research scientist specializing in generative AI, PyTorch, and RLHF. Published 15+ papers on transformer architectures and reinforcement learning from human feedback.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 96,
        work_experience: [
          {
            role: "Principal Research Scientist",
            company: "DeepMind",
            duration: "2020-2024",
            description: "Research on large language models, RLHF, and alignment. Led team of 8 researchers working on GPT-4 competitor models."
          }
        ],
        education: [
          {
            degree: "PhD",
            field: "Machine Learning",
            institution: "MIT",
            year: "2018"
          }
        ],
        languages: ["English", "Spanish"]
      },
      {
        name: "Emily Watson",
        email: "emily.watson@email.com",
        title: "Full Stack Developer",
        location: "Remote (EU)",
        experience_years: 5,
        summary: "Remote-friendly full-stack developer with expertise in React, Node.js, and cloud infrastructure. Strong background in building scalable web applications.",
        availability: "contract_only",
        verified: true,
        verification_score: 88,
        work_experience: [
          {
            role: "Senior Full Stack Developer",
            company: "TechCorp",
            duration: "2021-2024",
            description: "Built and maintained React applications serving 100k+ users. Implemented CI/CD pipelines and microservices architecture."
          }
        ],
        education: [
          {
            degree: "BS",
            field: "Software Engineering",
            institution: "University of Edinburgh",
            year: "2019"
          }
        ],
        languages: ["English", "French"]
      },
      {
        name: "David Kim",
        email: "david.kim@email.com",
        title: "Engineering Lead",
        location: "Seattle, WA",
        experience_years: 10,
        summary: "Experienced engineering leader with startup background. Led teams of 15+ engineers in scaling applications from prototype to IPO.",
        availability: "actively_looking",
        verified: true,
        verification_score: 94,
        work_experience: [
          {
            role: "VP of Engineering",
            company: "StartupXYZ",
            duration: "2020-2024",
            description: "Scaled engineering team from 5 to 50 people. Led company through Series A to IPO, managing technical infrastructure for 10M+ users."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Computer Science",
            institution: "University of Washington",
            year: "2014"
          }
        ],
        languages: ["English", "Korean"]
      },
      {
        name: "Anna Kowalski",
        email: "anna.kowalski@email.com",
        title: "Machine Learning Engineer",
        location: "Berlin, Germany",
        experience_years: 4,
        summary: "ML engineer specializing in computer vision and deep learning. Experience with PyTorch, TensorFlow, and production ML systems.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 87,
        work_experience: [
          {
            role: "ML Engineer",
            company: "Vision AI",
            duration: "2022-2024",
            description: "Developed computer vision models for autonomous vehicles. Improved object detection accuracy by 25% using custom PyTorch implementations."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Artificial Intelligence",
            institution: "Technical University of Munich",
            year: "2020"
          }
        ],
        languages: ["English", "German", "Polish"]
      },
      {
        name: "James Thompson",
        email: "james.thompson@email.com",
        title: "Frontend Developer",
        location: "London, UK",
        experience_years: 7,
        summary: "TypeScript expert with deep knowledge of React ecosystem. Passionate about user experience and modern frontend architecture.",
        availability: "actively_looking",
        verified: true,
        verification_score: 91,
        work_experience: [
          {
            role: "Senior Frontend Developer",
            company: "FinTech Solutions",
            duration: "2021-2024",
            description: "Led frontend development for trading platform used by 50k+ traders. Built complex real-time dashboards with React and TypeScript."
          }
        ],
        education: [
          {
            degree: "BS",
            field: "Computer Science",
            institution: "Imperial College London",
            year: "2017"
          }
        ],
        languages: ["English"]
      },
      {
        name: "Lisa Zhang",
        email: "lisa.zhang@email.com",
        title: "Data Scientist",
        location: "Toronto, Canada",
        experience_years: 6,
        summary: "Data scientist with expertise in NLP, time series analysis, and MLOps. Experience building production ML pipelines at scale.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 89,
        work_experience: [
          {
            role: "Senior Data Scientist",
            company: "DataCorp",
            duration: "2020-2024",
            description: "Built recommendation systems and NLP models serving 1M+ users. Implemented MLOps practices reducing model deployment time by 60%."
          }
        ],
        education: [
          {
            degree: "PhD",
            field: "Statistics",
            institution: "University of Toronto",
            year: "2018"
          }
        ],
        languages: ["English", "Mandarin", "French"]
      },
      {
        name: "Roberto Silva",
        email: "roberto.silva@email.com",
        title: "DevOps Engineer",
        location: "São Paulo, Brazil",
        experience_years: 8,
        summary: "DevOps specialist with expertise in Kubernetes, AWS, and infrastructure automation. Built CI/CD pipelines for high-traffic applications.",
        availability: "contract_only",
        verified: true,
        verification_score: 93,
        work_experience: [
          {
            role: "Principal DevOps Engineer",
            company: "CloudTech",
            duration: "2019-2024",
            description: "Designed and implemented cloud infrastructure for fintech applications. Managed Kubernetes clusters serving 500+ microservices."
          }
        ],
        education: [
          {
            degree: "BS",
            field: "Information Systems",
            institution: "University of São Paulo",
            year: "2016"
          }
        ],
        languages: ["Portuguese", "English", "Spanish"]
      },
      {
        name: "Michael O'Connor",
        email: "michael.oconnor@email.com",
        title: "Blockchain Developer",
        location: "Dublin, Ireland",
        experience_years: 5,
        summary: "Blockchain developer specializing in Ethereum, Solidity, and DeFi protocols. Built smart contracts handling $100M+ in transactions.",
        availability: "actively_looking",
        verified: true,
        verification_score: 86,
        work_experience: [
          {
            role: "Senior Blockchain Developer",
            company: "CryptoFin",
            duration: "2021-2024",
            description: "Developed DeFi protocols and smart contracts. Led security audits and gas optimization resulting in 40% cost reduction."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Cryptography",
            institution: "Trinity College Dublin",
            year: "2019"
          }
        ],
        languages: ["English", "Irish"]
      },
      {
        name: "Priya Patel",
        email: "priya.patel@email.com",
        title: "Product Manager",
        location: "Mumbai, India",
        experience_years: 9,
        summary: "Technical product manager with B2B SaaS experience. Led product strategy for AI-powered analytics platform with 10k+ enterprise users.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 90,
        work_experience: [
          {
            role: "Senior Product Manager",
            company: "Analytics Pro",
            duration: "2020-2024",
            description: "Led product roadmap for enterprise analytics platform. Increased user engagement by 45% through AI-powered insights features."
          }
        ],
        education: [
          {
            degree: "MBA",
            field: "Technology Management",
            institution: "Indian Institute of Management",
            year: "2015"
          }
        ],
        languages: ["English", "Hindi", "Gujarati"]
      },
      {
        name: "Alex Petrov",
        email: "alex.petrov@email.com",
        title: "Security Engineer",
        location: "Prague, Czech Republic",
        experience_years: 7,
        summary: "Cybersecurity expert specializing in application security, penetration testing, and secure code review. CISSP certified with SOC 2 compliance experience.",
        availability: "contract_only",
        verified: true,
        verification_score: 88,
        work_experience: [
          {
            role: "Lead Security Engineer",
            company: "SecureTech",
            duration: "2020-2024",
            description: "Led security team for fintech applications. Implemented zero-trust architecture and reduced security incidents by 70%."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Cybersecurity",
            institution: "Czech Technical University",
            year: "2017"
          }
        ],
        languages: ["English", "Czech", "Russian"]
      },
      {
        name: "Sofia Martinez",
        email: "sofia.martinez@email.com",
        title: "UX Designer",
        location: "Barcelona, Spain",
        experience_years: 6,
        summary: "Senior UX designer with expertise in design systems, user research, and accessibility. Led design for award-winning mobile applications.",
        availability: "actively_looking",
        verified: true,
        verification_score: 85,
        work_experience: [
          {
            role: "Senior UX Designer",
            company: "DesignStudio",
            duration: "2021-2024",
            description: "Led UX design for mobile banking app with 2M+ users. Improved user satisfaction scores by 35% through research-driven design."
          }
        ],
        education: [
          {
            degree: "MA",
            field: "Interaction Design",
            institution: "Elisava Barcelona",
            year: "2018"
          }
        ],
        languages: ["Spanish", "English", "Catalan"]
      },
      {
        name: "Kevin Anderson",
        email: "kevin.anderson@email.com",
        title: "Mobile Developer",
        location: "Vancouver, Canada",
        experience_years: 5,
        summary: "Mobile developer specializing in React Native and native iOS/Android development. Built cross-platform apps with 1M+ downloads.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 87,
        work_experience: [
          {
            role: "Senior Mobile Developer",
            company: "MobileFirst",
            duration: "2022-2024",
            description: "Developed React Native apps for e-commerce and fitness tracking. Optimized performance achieving 4.8+ app store ratings."
          }
        ],
        education: [
          {
            degree: "BS",
            field: "Computer Science",
            institution: "University of British Columbia",
            year: "2019"
          }
        ],
        languages: ["English", "French"]
      },
      {
        name: "Yuki Tanaka",
        email: "yuki.tanaka@email.com",
        title: "AI Research Engineer",
        location: "Tokyo, Japan",
        experience_years: 4,
        summary: "AI researcher focused on transformer architectures, multimodal AI, and computer vision. Published research on attention mechanisms and vision transformers.",
        availability: "actively_looking",
        verified: true,
        verification_score: 94,
        work_experience: [
          {
            role: "AI Research Engineer",
            company: "AI Labs Tokyo",
            duration: "2022-2024",
            description: "Research on vision transformers and multimodal AI. Developed novel attention mechanisms improving image classification accuracy by 12%."
          }
        ],
        education: [
          {
            degree: "PhD",
            field: "Artificial Intelligence",
            institution: "University of Tokyo",
            year: "2020"
          }
        ],
        languages: ["Japanese", "English"]
      },
      {
        name: "Thomas Mueller",
        email: "thomas.mueller@email.com",
        title: "Backend Developer",
        location: "Munich, Germany",
        experience_years: 8,
        summary: "Backend specialist with expertise in microservices, Go, and distributed systems. Built high-performance APIs serving 100M+ requests daily.",
        availability: "contract_only",
        verified: true,
        verification_score: 91,
        work_experience: [
          {
            role: "Principal Backend Engineer",
            company: "CloudScale",
            duration: "2019-2024",
            description: "Architected microservices platform handling 100M+ daily requests. Led migration from monolith to microservices reducing latency by 50%."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Distributed Systems",
            institution: "Technical University of Munich",
            year: "2016"
          }
        ],
        languages: ["German", "English"]
      },
      {
        name: "Isabella Costa",
        email: "isabella.costa@email.com",
        title: "Data Engineer",
        location: "Lisbon, Portugal",
        experience_years: 6,
        summary: "Data engineer specializing in Apache Spark, Kafka, and real-time data processing. Built data pipelines processing TB-scale datasets.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 89,
        work_experience: [
          {
            role: "Senior Data Engineer",
            company: "DataFlow",
            duration: "2021-2024",
            description: "Built real-time data pipelines using Spark and Kafka. Processed 10TB+ daily data for ML model training and analytics."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Data Science",
            institution: "University of Porto",
            year: "2018"
          }
        ],
        languages: ["Portuguese", "English", "Spanish"]
      },
      {
        name: "Oliver Williams",
        email: "oliver.williams@email.com",
        title: "Site Reliability Engineer",
        location: "Sydney, Australia",
        experience_years: 7,
        summary: "SRE with expertise in monitoring, incident response, and system reliability. Maintained 99.99% uptime for critical financial services infrastructure.",
        availability: "actively_looking",
        verified: true,
        verification_score: 92,
        work_experience: [
          {
            role: "Senior SRE",
            company: "FinanceAI",
            duration: "2020-2024",
            description: "Maintained trading systems with 99.99% uptime. Implemented monitoring and alerting reducing MTTR by 60%."
          }
        ],
        education: [
          {
            degree: "BS",
            field: "Computer Engineering",
            institution: "University of Sydney",
            year: "2017"
          }
        ],
        languages: ["English"]
      },
      {
        name: "Marie Dubois",
        email: "marie.dubois@email.com",
        title: "Quantum Computing Researcher",
        location: "Paris, France",
        experience_years: 5,
        summary: "Quantum computing researcher with expertise in quantum algorithms, Qiskit, and quantum machine learning. PhD in quantum information theory.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 96,
        work_experience: [
          {
            role: "Quantum Research Scientist",
            company: "Quantum Labs",
            duration: "2022-2024",
            description: "Research on quantum machine learning algorithms. Developed novel quantum optimization algorithms showing 10x speedup for specific problems."
          }
        ],
        education: [
          {
            degree: "PhD",
            field: "Quantum Information",
            institution: "Sorbonne University",
            year: "2019"
          }
        ],
        languages: ["French", "English"]
      },
      {
        name: "Ahmed Hassan",
        email: "ahmed.hassan@email.com",
        title: "Cloud Architect",
        location: "Dubai, UAE",
        experience_years: 9,
        summary: "Cloud architect specializing in multi-cloud strategies, Azure, and enterprise migrations. Led cloud transformations for Fortune 500 companies.",
        availability: "contract_only",
        verified: true,
        verification_score: 93,
        work_experience: [
          {
            role: "Principal Cloud Architect",
            company: "CloudConsult",
            duration: "2020-2024",
            description: "Led cloud migration projects for enterprise clients. Designed multi-cloud architectures reducing infrastructure costs by 40%."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Cloud Computing",
            institution: "American University of Dubai",
            year: "2015"
          }
        ],
        languages: ["Arabic", "English"]
      },
      {
        name: "Rachel Green",
        email: "rachel.green@email.com",
        title: "NLP Engineer",
        location: "Boston, MA",
        experience_years: 4,
        summary: "NLP engineer specializing in transformer models, BERT, and conversational AI. Built chatbots and language models for enterprise applications.",
        availability: "actively_looking",
        verified: true,
        verification_score: 88,
        work_experience: [
          {
            role: "NLP Engineer",
            company: "ConversationAI",
            duration: "2022-2024",
            description: "Developed enterprise chatbots using BERT and GPT models. Improved conversation quality metrics by 30% through fine-tuning and RLHF."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Computational Linguistics",
            institution: "Harvard University",
            year: "2020"
          }
        ],
        languages: ["English"]
      }
    ];

    // Insert candidates
    for (const candidate of newCandidates) {
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .insert(candidate)
        .select()
        .single();

      if (candidateError) {
        console.error('Error inserting candidate:', candidate.name, candidateError);
        continue;
      }

      // Define skills for each candidate
      const candidateSkills = {
        "sarah.chen@email.com": ["RAG", "LangChain", "Vector Databases", "Python", "Pinecone", "Semantic Search"],
        "marcus.rodriguez@email.com": ["PyTorch", "RLHF", "Transformers", "Python", "Research", "GenAI"],
        "emily.watson@email.com": ["React", "Node.js", "TypeScript", "JavaScript", "Cloud", "Full Stack"],
        "david.kim@email.com": ["Leadership", "Management", "Scaling", "Architecture", "Strategy", "Startups"],
        "anna.kowalski@email.com": ["PyTorch", "TensorFlow", "Computer Vision", "Deep Learning", "Python", "ML"],
        "james.thompson@email.com": ["TypeScript", "React", "Frontend", "JavaScript", "UI/UX", "Modern Frontend"],
        "lisa.zhang@email.com": ["NLP", "MLOps", "Python", "Machine Learning", "Data Science", "Statistics"],
        "roberto.silva@email.com": ["Kubernetes", "AWS", "DevOps", "CI/CD", "Infrastructure", "Docker"],
        "michael.oconnor@email.com": ["Blockchain", "Solidity", "Ethereum", "DeFi", "Smart Contracts", "Web3"],
        "priya.patel@email.com": ["Product Management", "Strategy", "AI", "B2B SaaS", "Analytics", "Leadership"],
        "alex.petrov@email.com": ["Cybersecurity", "Penetration Testing", "Security", "SOC 2", "CISSP", "DevSecOps"],
        "sofia.martinez@email.com": ["UX Design", "UI Design", "User Research", "Accessibility", "Design Systems", "Figma"],
        "kevin.anderson@email.com": ["React Native", "iOS", "Android", "Mobile", "JavaScript", "Cross-platform"],
        "yuki.tanaka@email.com": ["AI Research", "Transformers", "Computer Vision", "Python", "PyTorch", "Research"],
        "thomas.mueller@email.com": ["Go", "Microservices", "Backend", "Distributed Systems", "APIs", "Performance"],
        "isabella.costa@email.com": ["Apache Spark", "Kafka", "Data Engineering", "Python", "ETL", "Big Data"],
        "oliver.williams@email.com": ["SRE", "Monitoring", "Reliability", "Infrastructure", "Incident Response", "DevOps"],
        "marie.dubois@email.com": ["Quantum Computing", "Qiskit", "Python", "Research", "Quantum ML", "Algorithms"],
        "ahmed.hassan@email.com": ["Cloud Architecture", "Azure", "Multi-cloud", "Enterprise", "Migration", "Strategy"],
        "rachel.green@email.com": ["NLP", "BERT", "Transformers", "Chatbots", "Python", "Conversational AI"]
      };

      // Get or create skills and link to candidate
      const skills = candidateSkills[candidate.email] || [];
      for (const skillName of skills) {
        // Get or create skill
        let { data: skillData, error: skillSelectError } = await supabase
          .from('skills')
          .select('id')
          .eq('name', skillName)
          .single();

        if (skillSelectError || !skillData) {
          const { data: newSkillData, error: skillInsertError } = await supabase
            .from('skills')
            .insert({ name: skillName, category: 'Technology' })
            .select()
            .single();

          if (skillInsertError) {
            console.error('Error creating skill:', skillName, skillInsertError);
            continue;
          }
          skillData = newSkillData;
        }

        // Link skill to candidate
        const { error: linkError } = await supabase
          .from('candidate_skills')
          .insert({
            candidate_id: candidateData.id,
            skill_id: skillData.id,
            proficiency_level: Math.floor(Math.random() * 3) + 3, // 3-5
            years_experience: Math.floor(Math.random() * 5) + 1 // 1-5
          });

        if (linkError) {
          console.error('Error linking skill to candidate:', linkError);
        }
      }
    }

    console.log('Successfully populated 20 new candidates');

    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully populated 20 new candidates with skills'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in populate-candidates function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
