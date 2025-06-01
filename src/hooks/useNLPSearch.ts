
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useNLPSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchSummary, setSearchSummary] = useState('');

  const { toast } = useToast();

  const searchCandidates = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setSearchSummary('');

    try {
      const { data, error } = await supabase.functions.invoke('search-candidates', {
        body: { query }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setSearchResults(data.candidates);
        setSearchSummary(data.summary);
        
        toast({
          title: "Search completed",
          description: `Found ${data.count} candidates matching your query`,
        });
      } else {
        throw new Error(data.error || 'Search failed');
      }

    } catch (error: any) {
      console.error('Search error:', error);
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
    searchSummary
  };
};
