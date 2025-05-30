
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  title: string;
  experience_years: number;
  location: string;
  summary: string;
  availability: string;
  verification_score: number;
  skills?: string[];
}

export const useCandidates = () => {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      const { data: candidates, error } = await supabase
        .from('candidates')
        .select(`
          *,
          candidate_skills(
            skill_id,
            skills(name)
          )
        `);

      if (error) throw error;

      // Transform the data to include skills array
      return candidates.map(candidate => ({
        ...candidate,
        skills: candidate.candidate_skills?.map((cs: any) => cs.skills.name) || []
      }));
    }
  });
};
