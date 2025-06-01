
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NLPSearchResult {
  id: string;
  name: string;
  title: string;
  experience: string;
  location: string;
  skills: string[];
  score: number;
  summary: string;
  availability: string;
  email: string;
  reason?: string;
  verification_score: number;
  verified: boolean;
}

export const useGroqNLPSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NLPSearchResult[]>([]);
  const [searchSummary, setSearchSummary] = useState('');
  const [searchQueryId, setSearchQueryId] = useState<string | null>(null);

  const { toast } = useToast();

  const searchCandidates = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setSearchSummary('');
    setSearchQueryId(null);

    try {
      console.log('Starting NLP search with query:', query);

      const { data, error } = await supabase.functions.invoke('nlp-search', {
        body: { query }
      });

      if (error) {
        console.error('NLP search error:', error);
        throw error;
      }

      console.log('NLP search response:', data);

      if (data.success) {
        setSearchResults(data.candidates || []);
        setSearchSummary(data.summary || '');
        setSearchQueryId(data.search_query_id || null);
        
        toast({
          title: "AI Search completed",
          description: `Found ${data.count} candidates using intelligent matching`,
        });
      } else {
        throw new Error(data.error || 'Search failed');
      }

    } catch (error: any) {
      console.error('NLP Search error:', error);
      toast({
        title: "Search failed",
        description: error.message || 'Please try again',
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchCandidates,
    isSearching,
    searchResults,
    searchSummary,
    searchQueryId
  };
};
