
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
        name: "Carlos Mendoza",
        email: "carlos.mendoza@email.com",
        title: "Senior Rust Developer",
        location: "Mexico City, Mexico",
        experience_years: 7,
        summary: "Systems programmer specializing in Rust, WebAssembly, and high-performance computing. Built distributed systems handling millions of transactions per second.",
        availability: "actively_looking",
        verified: true,
        verification_score: 91,
        work_experience: [
          {
            role: "Senior Rust Developer",
            company: "HighPerf Systems",
            duration: "2021-2024",
            description: "Developed low-latency trading systems in Rust. Optimized performance achieving sub-microsecond latencies for critical financial operations."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Computer Science",
            institution: "UNAM",
            year: "2017"
          }
        ],
        languages: ["Spanish", "English"]
      },
      {
        name: "Fatima Al-Zahra",
        email: "fatima.alzahra@email.com",
        title: "Computer Vision Engineer",
        location: "Dubai, UAE",
        experience_years: 5,
        summary: "Computer vision specialist with expertise in autonomous vehicles, medical imaging, and real-time object detection using PyTorch and OpenCV.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 89,
        work_experience: [
          {
            role: "Computer Vision Engineer",
            company: "AutonomousTech",
            duration: "2022-2024",
            description: "Developed vision systems for self-driving cars. Improved object detection accuracy by 28% using custom neural network architectures."
          }
        ],
        education: [
          {
            degree: "PhD",
            field: "Computer Vision",
            institution: "American University of Sharjah",
            year: "2019"
          }
        ],
        languages: ["Arabic", "English", "French"]
      },
      {
        name: "Hiroshi Tanaka",
        email: "hiroshi.tanaka@email.com",
        title: "Game Engine Developer",
        location: "Kyoto, Japan",
        experience_years: 9,
        summary: "Game engine architect with expertise in C++, graphics programming, and real-time rendering. Led development of AAA game engines used by major studios.",
        availability: "contract_only",
        verified: true,
        verification_score: 95,
        work_experience: [
          {
            role: "Principal Engine Developer",
            company: "GameTech Studios",
            duration: "2018-2024",
            description: "Architected next-generation game engine supporting VR/AR platforms. Optimized rendering pipeline achieving 60fps at 4K resolution."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Computer Graphics",
            institution: "University of Tokyo",
            year: "2015"
          }
        ],
        languages: ["Japanese", "English"]
      },
      {
        name: "Nina Johansson",
        email: "nina.johansson@email.com",
        title: "Bioinformatics Engineer",
        location: "Stockholm, Sweden",
        experience_years: 6,
        summary: "Computational biologist specializing in genomics, protein folding prediction, and drug discovery. Experience with machine learning for biological data analysis.",
        availability: "actively_looking",
        verified: true,
        verification_score: 92,
        work_experience: [
          {
            role: "Senior Bioinformatics Engineer",
            company: "BioAI Research",
            duration: "2020-2024",
            description: "Developed ML models for protein structure prediction. Contributed to drug discovery pipeline reducing time-to-market by 40%."
          }
        ],
        education: [
          {
            degree: "PhD",
            field: "Bioinformatics",
            institution: "Karolinska Institute",
            year: "2018"
          }
        ],
        languages: ["Swedish", "English", "German"]
      },
      {
        name: "Kofi Asante",
        email: "kofi.asante@email.com",
        title: "Edge Computing Specialist",
        location: "Accra, Ghana",
        experience_years: 5,
        summary: "Edge computing expert focusing on IoT systems, real-time processing, and distributed architectures. Built edge networks for smart city applications.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 87,
        work_experience: [
          {
            role: "Edge Computing Engineer",
            company: "SmartCity Solutions",
            duration: "2021-2024",
            description: "Designed edge computing infrastructure for smart traffic management. Reduced latency by 80% through edge-cloud hybrid architecture."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Distributed Systems",
            institution: "University of Ghana",
            year: "2019"
          }
        ],
        languages: ["English", "Twi", "French"]
      },
      {
        name: "Valentina Rossi",
        email: "valentina.rossi@email.com",
        title: "Robotics Software Engineer",
        location: "Milan, Italy",
        experience_years: 7,
        summary: "Robotics engineer specializing in autonomous navigation, ROS, and industrial automation. Developed control systems for manufacturing robots.",
        availability: "contract_only",
        verified: true,
        verification_score: 90,
        work_experience: [
          {
            role: "Senior Robotics Engineer",
            company: "AutoBot Industries",
            duration: "2020-2024",
            description: "Led development of autonomous manufacturing robots. Improved production efficiency by 45% through advanced motion planning algorithms."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Robotics Engineering",
            institution: "Polytechnic University of Milan",
            year: "2017"
          }
        ],
        languages: ["Italian", "English", "German"]
      },
      {
        name: "Raj Patel",
        email: "raj.patel@email.com",
        title: "Fintech Backend Engineer",
        location: "Bangalore, India",
        experience_years: 6,
        summary: "Backend engineer specializing in payment systems, blockchain integration, and high-frequency trading platforms. Expert in Java, Scala, and distributed systems.",
        availability: "actively_looking",
        verified: true,
        verification_score: 88,
        work_experience: [
          {
            role: "Senior Backend Engineer",
            company: "PaymentTech",
            duration: "2021-2024",
            description: "Built payment processing system handling 1M+ transactions daily. Implemented blockchain settlement reducing processing time by 70%."
          }
        ],
        education: [
          {
            degree: "BTech",
            field: "Computer Science",
            institution: "IIT Bangalore",
            year: "2018"
          }
        ],
        languages: ["English", "Hindi", "Gujarati"]
      },
      {
        name: "Lars Nielsen",
        email: "lars.nielsen@email.com",
        title: "AR/VR Developer",
        location: "Copenhagen, Denmark",
        experience_years: 5,
        summary: "Immersive technology developer with expertise in Unity, Unreal Engine, and WebXR. Built enterprise VR training applications and AR shopping experiences.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 86,
        work_experience: [
          {
            role: "AR/VR Developer",
            company: "ImmersiveTech",
            duration: "2022-2024",
            description: "Developed VR training simulations for enterprise clients. Created AR shopping app with 500k+ downloads achieving 4.7 app store rating."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Interactive Media",
            institution: "Technical University of Denmark",
            year: "2019"
          }
        ],
        languages: ["Danish", "English", "Norwegian"]
      },
      {
        name: "Aisha Mohamed",
        email: "aisha.mohamed@email.com",
        title: "MLOps Engineer",
        location: "Cairo, Egypt",
        experience_years: 4,
        summary: "MLOps specialist focusing on model deployment, monitoring, and CI/CD for machine learning systems. Expert in Kubernetes, Docker, and cloud platforms.",
        availability: "actively_looking",
        verified: true,
        verification_score: 89,
        work_experience: [
          {
            role: "MLOps Engineer",
            company: "ML Platform",
            duration: "2022-2024",
            description: "Built MLOps platform serving 50+ ML models in production. Reduced model deployment time from weeks to hours through automated pipelines."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Machine Learning",
            institution: "Cairo University",
            year: "2020"
          }
        ],
        languages: ["Arabic", "English", "French"]
      },
      {
        name: "Sebastian Müller",
        email: "sebastian.mueller@email.com",
        title: "Embedded Systems Engineer",
        location: "Zurich, Switzerland",
        experience_years: 8,
        summary: "Embedded systems expert specializing in real-time systems, RTOS, and hardware-software integration. Developed firmware for medical devices and automotive systems.",
        availability: "contract_only",
        verified: true,
        verification_score: 93,
        work_experience: [
          {
            role: "Principal Embedded Engineer",
            company: "MedTech Solutions",
            duration: "2019-2024",
            description: "Led firmware development for life-critical medical devices. Achieved FDA approval for embedded systems with 99.99% reliability requirements."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Embedded Systems",
            institution: "ETH Zurich",
            year: "2016"
          }
        ],
        languages: ["German", "English", "French"]
      },
      {
        name: "Grace Kim",
        email: "grace.kim@email.com",
        title: "Privacy Engineer",
        location: "Seoul, South Korea",
        experience_years: 5,
        summary: "Privacy engineering specialist with expertise in differential privacy, homomorphic encryption, and GDPR compliance. Built privacy-preserving ML systems.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 91,
        work_experience: [
          {
            role: "Senior Privacy Engineer",
            company: "PrivacyFirst",
            duration: "2021-2024",
            description: "Implemented differential privacy for large-scale data analytics. Ensured GDPR compliance while maintaining data utility for ML applications."
          }
        ],
        education: [
          {
            degree: "PhD",
            field: "Cryptography",
            institution: "KAIST",
            year: "2019"
          }
        ],
        languages: ["Korean", "English", "Japanese"]
      },
      {
        name: "Jean-Pierre Dubois",
        email: "jeanpierre.dubois@email.com",
        title: "Green Tech Developer",
        location: "Lyon, France",
        experience_years: 6,
        summary: "Sustainable technology developer focusing on energy management systems, smart grids, and carbon footprint optimization. Expert in IoT and renewable energy integration.",
        availability: "actively_looking",
        verified: true,
        verification_score: 88,
        work_experience: [
          {
            role: "Green Tech Engineer",
            company: "EcoSystems",
            duration: "2020-2024",
            description: "Developed smart grid management system reducing energy waste by 35%. Built IoT platform for renewable energy monitoring and optimization."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Sustainable Engineering",
            institution: "École Polytechnique",
            year: "2018"
          }
        ],
        languages: ["French", "English", "German"]
      },
      {
        name: "Olumide Adebayo",
        email: "olumide.adebayo@email.com",
        title: "Voice Technology Engineer",
        location: "Lagos, Nigeria",
        experience_years: 4,
        summary: "Voice AI specialist with expertise in speech recognition, NLU, and conversational interfaces. Built voice assistants for African languages and dialects.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 87,
        work_experience: [
          {
            role: "Voice AI Engineer",
            company: "AfriVoice Tech",
            duration: "2022-2024",
            description: "Developed multilingual voice assistant supporting 15 African languages. Improved speech recognition accuracy by 40% for underrepresented languages."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Speech Technology",
            institution: "University of Lagos",
            year: "2020"
          }
        ],
        languages: ["English", "Yoruba", "Igbo", "Hausa"]
      },
      {
        name: "Anastasia Volkov",
        email: "anastasia.volkov@email.com",
        title: "Quantum Software Developer",
        location: "Moscow, Russia",
        experience_years: 5,
        summary: "Quantum computing software developer with expertise in Qiskit, Cirq, and quantum algorithm optimization. Research focus on quantum machine learning applications.",
        availability: "contract_only",
        verified: true,
        verification_score: 94,
        work_experience: [
          {
            role: "Quantum Software Engineer",
            company: "QuantumLab",
            duration: "2021-2024",
            description: "Developed quantum algorithms for optimization problems. Achieved 100x speedup for specific combinatorial optimization tasks using quantum annealing."
          }
        ],
        education: [
          {
            degree: "PhD",
            field: "Quantum Computing",
            institution: "Moscow State University",
            year: "2019"
          }
        ],
        languages: ["Russian", "English", "German"]
      },
      {
        name: "Santiago Rodriguez",
        email: "santiago.rodriguez@email.com",
        title: "AgTech Developer",
        location: "Buenos Aires, Argentina",
        experience_years: 6,
        summary: "Agricultural technology developer specializing in precision farming, drone automation, and crop monitoring systems. Expert in computer vision and IoT for agriculture.",
        availability: "actively_looking",
        verified: true,
        verification_score: 86,
        work_experience: [
          {
            role: "AgTech Engineer",
            company: "FarmTech Solutions",
            duration: "2020-2024",
            description: "Built precision agriculture platform using drone imagery and ML. Increased crop yields by 25% through automated monitoring and intervention systems."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Agricultural Engineering",
            institution: "University of Buenos Aires",
            year: "2018"
          }
        ],
        languages: ["Spanish", "English", "Portuguese"]
      },
      {
        name: "Amara Okafor",
        email: "amara.okafor@email.com",
        title: "Accessibility Engineer",
        location: "Toronto, Canada",
        experience_years: 5,
        summary: "Accessibility specialist focusing on assistive technology, WCAG compliance, and inclusive design. Built accessibility tools for web and mobile applications.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 90,
        work_experience: [
          {
            role: "Accessibility Engineer",
            company: "InclusiveTech",
            duration: "2021-2024",
            description: "Developed accessibility testing platform used by 200+ organizations. Improved web accessibility compliance rates by 60% through automated testing tools."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Human-Computer Interaction",
            institution: "University of Toronto",
            year: "2019"
          }
        ],
        languages: ["English", "French", "Igbo"]
      },
      {
        name: "Dmitri Petrov",
        email: "dmitri.petrov@email.com",
        title: "Space Technology Engineer",
        location: "Moscow, Russia",
        experience_years: 8,
        summary: "Aerospace software engineer specializing in satellite systems, mission control software, and space communication protocols. Expert in real-time embedded systems.",
        availability: "contract_only",
        verified: true,
        verification_score: 95,
        work_experience: [
          {
            role: "Senior Space Systems Engineer",
            company: "Cosmostech",
            duration: "2018-2024",
            description: "Developed flight control software for satellite missions. Led software development for Mars mission achieving 99.9% system reliability over 2-year mission."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Aerospace Engineering",
            institution: "Bauman Moscow State Technical University",
            year: "2016"
          }
        ],
        languages: ["Russian", "English"]
      },
      {
        name: "Fatou Diallo",
        email: "fatou.diallo@email.com",
        title: "EdTech Platform Engineer",
        location: "Dakar, Senegal",
        experience_years: 4,
        summary: "Educational technology developer focusing on adaptive learning systems, content management, and student analytics. Built platforms serving millions of African students.",
        availability: "actively_looking",
        verified: true,
        verification_score: 88,
        work_experience: [
          {
            role: "EdTech Engineer",
            company: "AfricaEdu",
            duration: "2022-2024",
            description: "Developed adaptive learning platform for K-12 education. Improved student engagement by 50% through personalized learning paths and gamification."
          }
        ],
        education: [
          {
            degree: "MS",
            field: "Educational Technology",
            institution: "Cheikh Anta Diop University",
            year: "2020"
          }
        ],
        languages: ["French", "Wolof", "English", "Arabic"]
      },
      {
        name: "Ravi Sharma",
        email: "ravi.sharma@email.com",
        title: "Renewable Energy Software Engineer",
        location: "Delhi, India",
        experience_years: 7,
        summary: "Clean energy software specialist focusing on solar panel optimization, wind farm management, and energy storage systems. Expert in predictive analytics for renewable energy.",
        availability: "open_to_offers",
        verified: true,
        verification_score: 89,
        work_experience: [
          {
            role: "Senior Energy Software Engineer",
            company: "GreenPower Systems",
            duration: "2019-2024",
            description: "Built energy management system for 500MW solar farm. Optimized energy production through ML-driven predictive maintenance reducing downtime by 40%."
          }
        ],
        education: [
          {
            degree: "MTech",
            field: "Renewable Energy",
            institution: "IIT Delhi",
            year: "2017"
          }
        ],
        languages: ["Hindi", "English", "Punjabi"]
      },
      {
        name: "Isabella Santos",
        email: "isabella.santos@email.com",
        title: "Healthcare AI Engineer",
        location: "São Paulo, Brazil",
        experience_years: 5,
        summary: "Healthcare AI specialist with expertise in medical imaging, diagnostic systems, and clinical decision support. Built AI models for radiology and pathology analysis.",
        availability: "actively_looking",
        verified: true,
        verification_score: 92,
        work_experience: [
          {
            role: "Healthcare AI Engineer",
            company: "MedAI Solutions",
            duration: "2021-2024",
            description: "Developed AI diagnostic system for early cancer detection. Achieved 95% accuracy in mammography screening improving early detection rates by 30%."
          }
        ],
        education: [
          {
            degree: "PhD",
            field: "Biomedical Engineering",
            institution: "University of São Paulo",
            year: "2019"
          }
        ],
        languages: ["Portuguese", "English", "Spanish"]
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
        "carlos.mendoza@email.com": ["Rust", "WebAssembly", "Systems Programming", "Performance Optimization", "Distributed Systems", "Low Latency"],
        "fatima.alzahra@email.com": ["Computer Vision", "PyTorch", "OpenCV", "Autonomous Vehicles", "Medical Imaging", "Object Detection"],
        "hiroshi.tanaka@email.com": ["C++", "Game Engine", "Graphics Programming", "Real-time Rendering", "VR/AR", "Performance Optimization"],
        "nina.johansson@email.com": ["Bioinformatics", "Genomics", "Protein Folding", "Drug Discovery", "Machine Learning", "Python"],
        "kofi.asante@email.com": ["Edge Computing", "IoT", "Real-time Processing", "Distributed Systems", "Smart Cities", "Cloud Architecture"],
        "valentina.rossi@email.com": ["Robotics", "ROS", "Autonomous Navigation", "Industrial Automation", "Motion Planning", "Control Systems"],
        "raj.patel@email.com": ["Java", "Scala", "Payment Systems", "Blockchain", "High-frequency Trading", "Distributed Systems"],
        "lars.nielsen@email.com": ["Unity", "Unreal Engine", "WebXR", "AR/VR", "3D Graphics", "Interactive Media"],
        "aisha.mohamed@email.com": ["MLOps", "Kubernetes", "Docker", "CI/CD", "Model Deployment", "Cloud Platforms"],
        "sebastian.mueller@email.com": ["Embedded Systems", "RTOS", "Firmware", "Hardware Integration", "Medical Devices", "Automotive"],
        "grace.kim@email.com": ["Privacy Engineering", "Differential Privacy", "Homomorphic Encryption", "GDPR", "Cryptography", "Security"],
        "jeanpierre.dubois@email.com": ["Green Technology", "Smart Grids", "IoT", "Renewable Energy", "Energy Management", "Sustainability"],
        "olumide.adebayo@email.com": ["Voice AI", "Speech Recognition", "NLU", "Conversational AI", "Multilingual NLP", "African Languages"],
        "anastasia.volkov@email.com": ["Quantum Computing", "Qiskit", "Cirq", "Quantum Algorithms", "Quantum ML", "Optimization"],
        "santiago.rodriguez@email.com": ["AgTech", "Precision Farming", "Drone Automation", "Computer Vision", "IoT", "Agriculture"],
        "amara.okafor@email.com": ["Accessibility", "WCAG", "Assistive Technology", "Inclusive Design", "Testing Automation", "HCI"],
        "dmitri.petrov@email.com": ["Aerospace", "Satellite Systems", "Mission Control", "Space Communication", "Embedded Systems", "Real-time"],
        "fatou.diallo@email.com": ["EdTech", "Adaptive Learning", "Student Analytics", "Content Management", "Gamification", "Educational Technology"],
        "ravi.sharma@email.com": ["Renewable Energy", "Solar Optimization", "Wind Farm Management", "Energy Storage", "Predictive Analytics", "Clean Energy"],
        "isabella.santos@email.com": ["Healthcare AI", "Medical Imaging", "Diagnostic Systems", "Radiology", "Pathology", "Clinical Decision Support"]
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

    console.log('Successfully populated 20 new diverse candidates');

    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully populated 20 new diverse candidates with skills'
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
