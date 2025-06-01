
import { useState, useEffect } from "react";
import { Search, Sparkles, SortDesc, Brain, X, Eye, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateSearchQuery, useSearchQueries } from "@/hooks/useSearchQueries";
import { useNLPSearch } from "@/hooks/useNLPSearch";
import { useToast } from "@/hooks/use-toast";
import CandidateProfile from "./CandidateProfile";

interface SearchInterfaceProps {
  candidates: any[];
  setCandidates: (candidates: any[]) => void;
  setActiveTab?: (tab: string) => void;
  setSelectedCandidateEmail?: (email: string) => void;
}

const SearchInterface = ({ candidates, setCandidates, setActiveTab, setSelectedCandidateEmail }: SearchInterfaceProps) => {
  const [query, setQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
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

  const handleClear = () => {
    setQuery("");
    setCandidates([]);
  };

  const handleSendOutreach = (candidate: any) => {
    if (setSelectedCandidateEmail && setActiveTab) {
      setSelectedCandidateEmail(candidate.email);
      setActiveTab("outreach");
    }
  };

  // Update candidates when search results change
  useEffect(() => {
    if (searchResults.length > 0) {
      setCandidates(searchResults);
    }
  }, [searchResults, setCandidates]);

  // Get unique suggested queries
  const baseSuggestions = [
    "Find senior React developers with 5+ years experience",
    "Python engineers with machine learning background",
    "Remote-friendly full-stack developers",
    "Engineering leads with startup experience",
    "Show me candidates having experience in RAG",
    "GenAI researchers with PyTorch experience",
    "Frontend developers skilled in TypeScript"
  ];

  const recentQueries = searchQueries?.slice(0, 2).map(sq => sq.query_text) || [];
  const allQueries = [...recentQueries, ...baseSuggestions];
  const uniqueSuggestedQueries = Array.from(new Set(allQueries)).slice(0, 4);

  // Show candidate profile if one is selected
  if (selectedCandidate) {
    return (
      <CandidateProfile 
        candidate={selectedCandidate} 
        onBack={() => setSelectedCandidate(null)}
        onSendOutreach={handleSendOutreach}
      />
    );
  }

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
            <Button 
              onClick={handleClear}
              variant="outline"
              className="px-6 py-6"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
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
              {uniqueSuggestedQueries.map((suggestion, index) => (
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
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {candidate.name}
                        </h3>
                        {candidate.verified && (
                          <Badge className="bg-green-600 text-xs">
                            Verified {candidate.verification_score}%
                          </Badge>
                        )}
                      </div>
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
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          candidate.availability === 'actively_looking' ? 'border-green-500 text-green-700' :
                          candidate.availability === 'open_to_offers' ? 'border-blue-500 text-blue-700' :
                          candidate.availability === 'contract_only' ? 'border-orange-500 text-orange-700' :
                          'border-gray-500 text-gray-700'
                        }`}
                      >
                        {candidate.availability?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{candidate.summary}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.skills?.slice(0, 6).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills?.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{candidate.skills.length - 6} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Contact: {candidate.email}
                    </p>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleSendOutreach(candidate)}
                      >
                        <Mail className="w-4 h-4 mr-1" />
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
