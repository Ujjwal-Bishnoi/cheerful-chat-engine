
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SearchQuery {
  id: string;
  query_text: string;
  status: string;
  result_count: number;
  created_at: string;
}

export const useSearchQueries = () => {
  return useQuery({
    queryKey: ['search-queries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_queries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    }
  });
};

export const useCreateSearchQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (queryText: string) => {
      const { data, error } = await supabase
        .from('search_queries')
        .insert({
          query_text: queryText,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-queries'] });
    }
  });
};
