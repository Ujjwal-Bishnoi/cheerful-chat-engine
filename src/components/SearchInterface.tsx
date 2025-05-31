
import { useState, useEffect } from "react";
import { Search, Sparkles, SortDesc, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateSearchQuery, useSearchQueries } from "@/hooks/useSearchQueries";
import { useNLPSearch } from "@/hooks/useNLPSearch";
import { useToast } from "@/hooks/use-toast";

interface SearchInterfaceProps {
  candidates: any[];
  setCandidates: (candidates: any[]) => void;
}

const SearchInterface = ({ candidates, setCandidates }: SearchInterfaceProps) => {
  const [query, setQuery] = useState("");
  
  const { toast } = useToast();
  const createSearchQuery = useCreateSearchQuery();
  const { data: searchQueries } = useSearchQueries();
  const { searchCandidates, isSearching, searchResults, searchSummary } = useNLPSearch();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      // Store search query
      await createSearchQuery.mutateAsync(query);
      
      // Perform NLP search
      await searchCandidates(query);
    } catch (error) {
      toast({
        title: "Search failed",
        description: "There was an error processing your search query",
        variant: "destructive"
      });
    }
  };

  // Update candidates when search results change
  useEffect(() => {
    if (searchResults.length > 0) {
      setCandidates(searchResults);
    }
  }, [searchResults, setCandidates]);

  const suggestedQueries = searchQueries?.slice(0, 4).map(sq => sq.query_text) || [
    "Find senior React developers with 5+ years experience",
    "Python engineers with machine learning background",
    "Remote-friendly full-stack developers",
    "Engineering leads with startup experience"
  ];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
          <Brain className="w-8 h-8 text-purple-600" />
          <span>AI-Powered Candidate Search</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Describe the perfect candidate in natural language. Our AI understands context, skills, and requirements.
        </p>
      </div>

      {/* Search Interface */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </CardTitle>
          <CardDescription>
            Ask questions like "Find React developers with 5+ years experience in startups"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="e.g., Find senior Python developers with ML experience who are actively looking..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 text-lg py-6"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !query.trim()}
              className="px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isSearching ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Search</span>
                </div>
              )}
            </Button>
          </div>

          {/* Search Summary */}
          {searchSummary && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">{searchSummary}</p>
            </div>
          )}

          {/* Suggested Queries */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {candidates.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <SortDesc className="w-5 h-5" />
                <span>Search Results</span>
                <Badge variant="secondary">{candidates.length} candidates</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">Ranked by AI relevance score</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {candidate.name}
                      </h3>
                      <p className="text-blue-600 font-medium">{candidate.title}</p>
                      <p className="text-gray-600">{candidate.experience_years} years • {candidate.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600">AI Score:</span>
                        <Badge 
                          variant={candidate.score >= 90 ? "default" : "secondary"}
                          className={candidate.score >= 90 ? "bg-green-600" : ""}
                        >
                          {candidate.score}%
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {candidate.availability?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{candidate.summary}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.skills?.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Contact: {candidate.email}
                    </p>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        View Full Profile
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Send Outreach
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchInterface;
