
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSearchResults = (searchQueryId?: string) => {
  return useQuery({
    queryKey: ['search-results', searchQueryId],
    queryFn: async () => {
      if (!searchQueryId) return [];

      const { data, error } = await supabase
        .from('search_results')
        .select(`
          *,
          candidates(
            *,
            candidate_skills(
              skill_id,
              skills(name)
            )
          )
        `)
        .eq('search_query_id', searchQueryId)
        .order('ranking_position', { ascending: true });

      if (error) throw error;

      // Transform the data to match our interface
      return data.map(result => ({
        id: result.candidates.id,
        name: result.candidates.name,
        title: result.candidates.title,
        experience: `${result.candidates.experience_years} years`,
        location: result.candidates.location,
        skills: result.candidates.candidate_skills?.map((cs: any) => cs.skills.name) || [],
        score: result.relevance_score,
        summary: result.candidates.summary,
        availability: result.candidates.availability.replace('_', ' '),
        email: result.candidates.email,
        anonymized: result.anonymized
      }));
    },
    enabled: !!searchQueryId
  });
};
