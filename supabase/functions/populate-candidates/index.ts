
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = 'https://ocmqqtgcadltakzuwixd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jbXFxdGdjYWRsdGFrenV3aXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjU0MjYsImV4cCI6MjA2NDIwMTQyNn0.u_L1ruz6-gE9q8uuH9bKAZzpUX2IqLoP5qmgTgSd_fQ';

const sampleCandidates = [
  {
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    title: "Senior RAG Engineer",
    location: "San Francisco, CA",
    summary: "Experienced AI engineer specializing in Retrieval-Augmented Generation systems. Built large-scale RAG pipelines for enterprise applications.",
    experience_years: 7,
    availability: "actively_looking",
    verified: true,
    verification_score: 95,
    skills: ["RAG", "LangChain", "Python", "Vector Databases", "OpenAI"],
    work_experience: [
      {
        company: "OpenAI",
        role: "Senior ML Engineer",
        duration: "2022-2024",
        description: "Led RAG system development for GPT applications"
      }
    ],
    education: [
      {
        institution: "Stanford University",
        degree: "MS",
        field: "Computer Science",
        year: "2019"
      }
    ]
  },
  {
    name: "Marcus Rodriguez",
    email: "marcus.r@example.com", 
    title: "Full Stack Python Developer",
    location: "Austin, TX",
    summary: "Full-stack developer with expertise in Python, Django, and React. Experience building scalable web applications and APIs.",
    experience_years: 5,
    availability: "open_to_offers",
    verified: true,
    verification_score: 88,
    skills: ["Python", "Django", "React", "PostgreSQL", "AWS"],
    work_experience: [
      {
        company: "Meta",
        role: "Software Engineer",
        duration: "2021-2024",
        description: "Built internal tools and APIs for data processing"
      }
    ]
  },
  {
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    title: "GenAI Research Scientist", 
    location: "Boston, MA",
    summary: "Research scientist focused on generative AI, with publications in RLHF and large language model training.",
    experience_years: 6,
    availability: "actively_looking",
    verified: true,
    verification_score: 97,
    skills: ["PyTorch", "RLHF", "GenAI", "Machine Learning", "Deep Learning"],
    work_experience: [
      {
        company: "DeepMind",
        role: "Research Scientist",
        duration: "2020-2024",
        description: "Research on reinforcement learning from human feedback"
      }
    ]
  },
  {
    name: "David Kim",
    email: "david.kim@example.com",
    title: "Senior React Developer",
    location: "Seattle, WA", 
    summary: "Frontend architect with deep React expertise. Led development of complex UI systems for enterprise applications.",
    experience_years: 8,
    availability: "contract_only",
    verified: true,
    verification_score: 91,
    skills: ["React", "TypeScript", "Next.js", "GraphQL", "Node.js"],
    work_experience: [
      {
        company: "Netflix",
        role: "Senior Frontend Engineer",
        duration: "2019-2024",
        description: "Built and maintained Netflix's web interface"
      }
    ]
  },
  {
    name: "Priya Patel",
    email: "priya.patel@example.com",
    title: "Machine Learning Engineer",
    location: "New York, NY",
    summary: "ML engineer specializing in computer vision and NLP. Experience with production ML systems at scale.",
    experience_years: 4,
    availability: "actively_looking",
    verified: true,
    verification_score: 89,
    skills: ["Machine Learning", "TensorFlow", "Computer Vision", "NLP", "Python"],
    work_experience: [
      {
        company: "Google",
        role: "ML Engineer",
        duration: "2021-2024", 
        description: "Developed ML models for Google Search"
      }
    ]
  },
  {
    name: "Alex Thompson",
    email: "alex.thompson@example.com",
    title: "DevOps Engineering Lead",
    location: "Denver, CO",
    summary: "DevOps leader with expertise in cloud infrastructure, Kubernetes, and CI/CD. Built scalable deployment pipelines.",
    experience_years: 9,
    availability: "open_to_offers",
    verified: true,
    verification_score: 93,
    skills: ["Kubernetes", "AWS", "Docker", "Terraform", "CI/CD"],
    work_experience: [
      {
        company: "Uber",
        role: "Staff DevOps Engineer",
        duration: "2018-2024",
        description: "Led infrastructure scaling for ride-sharing platform"
      }
    ]
  },
  {
    name: "Jessica Wong",
    email: "jessica.wong@example.com",
    title: "Senior Backend Engineer",
    location: "Toronto, CA",
    summary: "Backend engineer with expertise in distributed systems and microservices architecture. Strong Java and Go experience.",
    experience_years: 6,
    availability: "actively_looking",
    verified: true,
    verification_score: 90,
    skills: ["Java", "Go", "Microservices", "Redis", "Apache Kafka"],
    work_experience: [
      {
        company: "Shopify",
        role: "Senior Backend Engineer",
        duration: "2020-2024",
        description: "Built payment processing microservices"
      }
    ]
  },
  {
    name: "Michael Brown",
    email: "michael.brown@example.com",
    title: "Data Science Manager",
    location: "Chicago, IL",
    summary: "Data science leader with experience managing teams and building ML products. Strong background in statistics and analytics.",
    experience_years: 10,
    availability: "open_to_offers",
    verified: true,
    verification_score: 94,
    skills: ["Data Science", "R", "Python", "SQL", "Machine Learning"],
    work_experience: [
      {
        company: "Airbnb",
        role: "Senior Data Scientist",
        duration: "2017-2024",
        description: "Led pricing and recommendation algorithms"
      }
    ]
  },
  {
    name: "Lisa Garcia",
    email: "lisa.garcia@example.com",
    title: "Mobile Development Lead",
    location: "Los Angeles, CA",
    summary: "Mobile development expert with iOS and Android experience. Led teams building consumer mobile applications.",
    experience_years: 7,
    availability: "contract_only",
    verified: true,
    verification_score: 87,
    skills: ["iOS", "Android", "Swift", "Kotlin", "React Native"],
    work_experience: [
      {
        company: "Spotify",
        role: "Mobile Team Lead",
        duration: "2019-2024",
        description: "Led mobile app development for music streaming"
      }
    ]
  },
  {
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    title: "Cloud Solutions Architect",
    location: "Phoenix, AZ",
    summary: "Cloud architect specializing in AWS and Azure. Designed enterprise cloud migrations and serverless architectures.",
    experience_years: 11,
    availability: "open_to_offers",
    verified: true,
    verification_score: 96,
    skills: ["AWS", "Azure", "Serverless", "Lambda", "CloudFormation"],
    work_experience: [
      {
        company: "Microsoft",
        role: "Principal Cloud Architect",
        duration: "2016-2024",
        description: "Designed cloud solutions for enterprise customers"
      }
    ]
  },
  {
    name: "Amanda Lee",
    email: "amanda.lee@example.com",
    title: "Product Manager - AI",
    location: "Portland, OR",
    summary: "Product manager with focus on AI/ML products. Experience launching AI features and managing cross-functional teams.",
    experience_years: 8,
    availability: "actively_looking",
    verified: true,
    verification_score: 85,
    skills: ["Product Management", "AI/ML", "Agile", "Data Analytics", "User Research"],
    work_experience: [
      {
        company: "Slack",
        role: "Senior Product Manager",
        duration: "2019-2024",
        description: "Led AI-powered search and recommendations"
      }
    ]
  },
  {
    name: "James Wilson",
    email: "james.wilson@example.com",
    title: "Senior Security Engineer",
    location: "Washington, DC",
    summary: "Cybersecurity engineer with expertise in threat detection and incident response. Strong background in penetration testing.",
    experience_years: 9,
    availability: "open_to_offers",
    verified: true,
    verification_score: 92,
    skills: ["Cybersecurity", "Penetration Testing", "SIEM", "Threat Detection", "Python"],
    work_experience: [
      {
        company: "CrowdStrike",
        role: "Senior Security Engineer",
        duration: "2018-2024",
        description: "Built threat detection algorithms"
      }
    ]
  },
  {
    name: "Nina Kowalski",
    email: "nina.kowalski@example.com",
    title: "UX Design Lead",
    location: "Berlin, Germany",
    summary: "UX design leader with experience in B2B and consumer products. Strong background in user research and design systems.",
    experience_years: 6,
    availability: "actively_looking",
    verified: true,
    verification_score: 88,
    skills: ["UX Design", "User Research", "Figma", "Design Systems", "Prototyping"],
    work_experience: [
      {
        company: "SAP",
        role: "UX Design Lead", 
        duration: "2020-2024",
        description: "Led design for enterprise software products"
      }
    ]
  },
  {
    name: "Carlos Mendez",
    email: "carlos.mendez@example.com",
    title: "Blockchain Developer",
    location: "Miami, FL",
    summary: "Blockchain developer with expertise in Ethereum and DeFi protocols. Experience building smart contracts and dApps.",
    experience_years: 4,
    availability: "contract_only",
    verified: true,
    verification_score: 86,
    skills: ["Solidity", "Ethereum", "Web3", "Smart Contracts", "DeFi"],
    work_experience: [
      {
        company: "Coinbase",
        role: "Blockchain Engineer",
        duration: "2021-2024",
        description: "Built DeFi trading protocols"
      }
    ]
  },
  {
    name: "Rachel Green",
    email: "rachel.green@example.com",
    title: "Site Reliability Engineer",
    location: "San Diego, CA",
    summary: "SRE with expertise in system monitoring, automation, and incident response. Strong background in distributed systems.",
    experience_years: 5,
    availability: "open_to_offers",
    verified: true,
    verification_score: 91,
    skills: ["SRE", "Monitoring", "Automation", "Linux", "Python"],
    work_experience: [
      {
        company: "Datadog",
        role: "Site Reliability Engineer",
        duration: "2020-2024",
        description: "Maintained monitoring infrastructure"
      }
    ]
  },
  {
    name: "Kevin Zhang",
    email: "kevin.zhang@example.com",
    title: "Quantitative Developer",
    location: "New York, NY",
    summary: "Quantitative developer with finance background. Experience building trading algorithms and risk management systems.",
    experience_years: 7,
    availability: "actively_looking",
    verified: true,
    verification_score: 94,
    skills: ["C++", "Python", "Finance", "Algorithms", "Statistics"],
    work_experience: [
      {
        company: "Goldman Sachs",
        role: "Quantitative Developer",
        duration: "2018-2024",
        description: "Built algorithmic trading systems"
      }
    ]
  },
  {
    name: "Sophia Martin",
    email: "sophia.martin@example.com",
    title: "Engineering Manager",
    location: "Atlanta, GA",
    summary: "Engineering manager with experience leading large teams. Strong technical background in full-stack development.",
    experience_years: 12,
    availability: "open_to_offers",
    verified: true,
    verification_score: 95,
    skills: ["Engineering Management", "Leadership", "Full Stack", "Team Building", "Strategy"],
    work_experience: [
      {
        company: "Stripe",
        role: "Engineering Manager",
        duration: "2017-2024",
        description: "Led payments infrastructure team"
      }
    ]
  },
  {
    name: "Daniel Rodriguez",
    email: "daniel.rodriguez@example.com",
    title: "Game Developer",
    location: "Los Angeles, CA",
    summary: "Game developer with expertise in Unity and Unreal Engine. Experience shipping mobile and console games.",
    experience_years: 6,
    availability: "contract_only",
    verified: true,
    verification_score: 89,
    skills: ["Unity", "Unreal Engine", "C#", "Game Design", "3D Graphics"],
    work_experience: [
      {
        company: "Riot Games",
        role: "Senior Game Developer",
        duration: "2019-2024",
        description: "Developed gameplay features for League of Legends"
      }
    ]
  },
  {
    name: "Natasha Petrov",
    email: "natasha.petrov@example.com",
    title: "Computer Vision Engineer",
    location: "Cambridge, MA",
    summary: "Computer vision engineer with PhD in machine learning. Experience with autonomous vehicles and medical imaging.",
    experience_years: 8,
    availability: "actively_looking",
    verified: true,
    verification_score: 97,
    skills: ["Computer Vision", "OpenCV", "PyTorch", "Medical Imaging", "Autonomous Vehicles"],
    work_experience: [
      {
        company: "Waymo",
        role: "Computer Vision Engineer",
        duration: "2018-2024",
        description: "Developed perception systems for self-driving cars"
      }
    ]
  },
  {
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    title: "Database Administrator",
    location: "Houston, TX",
    summary: "Senior DBA with expertise in PostgreSQL, MongoDB, and database optimization. Experience with large-scale data systems.",
    experience_years: 10,
    availability: "open_to_offers",
    verified: true,
    verification_score: 93,
    skills: ["PostgreSQL", "MongoDB", "Database Optimization", "SQL", "Data Modeling"],
    work_experience: [
      {
        company: "Oracle",
        role: "Senior Database Administrator",
        duration: "2016-2024",
        description: "Managed enterprise database systems"
      }
    ]
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting to populate candidates...');

    for (const candidateData of sampleCandidates) {
      const { skills, ...candidateInfo } = candidateData;

      // Insert candidate
      const { data: candidate, error: candidateError } = await supabase
        .from('candidates')
        .insert(candidateInfo)
        .select()
        .single();

      if (candidateError) {
        console.error('Error inserting candidate:', candidateError);
        continue;
      }

      console.log('Inserted candidate:', candidate.name);

      // Insert skills for this candidate
      if (skills && skills.length > 0) {
        for (const skillName of skills) {
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
                years_experience: Math.min(candidateInfo.experience_years, 5)
              });
          }
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully populated ${sampleCandidates.length} candidates`
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
