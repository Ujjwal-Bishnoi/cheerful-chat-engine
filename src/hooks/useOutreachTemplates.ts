
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OutreachTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  template_type: string;
  usage_count: number;
}

export const useOutreachTemplates = () => {
  return useQuery({
    queryKey: ['outreach-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outreach_templates')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
};
