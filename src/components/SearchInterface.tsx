import { useState, useEffect } from "react";
import { Search, Sparkles, Filter, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateSearchQuery, useSearchQueries } from "@/hooks/useSearchQueries";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useToast } from "@/hooks/use-toast";

interface SearchInterfaceProps {
  candidates: any[];
  setCandidates: (candidates: any[]) => void;
}

const SearchInterface = ({ candidates, setCandidates }: SearchInterfaceProps) => {
  const [query, setQuery] = useState("");
  const [currentSearchId, setCurrentSearchId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    experience: [0, 15],
    location: "",
    skills: "",
    availability: ""
  });

  const { toast } = useToast();
  const createSearchQuery = useCreateSearchQuery();
  const { data: searchQueries } = useSearchQueries();
  const { data: searchResults, isLoading: isSearching } = useSearchResults(currentSearchId || undefined);

  // Handle search function
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      const searchQuery = await createSearchQuery.mutateAsync(query);
      setCurrentSearchId(searchQuery.id);
      
      // Simulate completing the search after a delay
      setTimeout(async () => {
        // In a real implementation, this would trigger the AI search
        // For now, we'll just mark it as completed
        setCandidates(searchResults || []);
        
        toast({
          title: "Search completed",
          description: `Found ${searchResults?.length || 0} candidates matching your query`,
        });
      }, 2000);
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
    if (searchResults) {
      setCandidates(searchResults);
    }
  }, [searchResults, setCandidates]);

  const suggestedQueries = searchQueries?.slice(0, 4).map(sq => sq.query_text) || [
    "Find senior RAG engineers in EU open to contracts",
    "ML engineers with PyTorch experience in Bay Area",
    "AI researchers with NLP background, remote-friendly",
    "Engineering leads with LLM production experience"
  ];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <span>PeopleGPT Search</span>
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
            <span>Natural Language Search</span>
          </CardTitle>
          <CardDescription>
            Describe your ideal candidate as you would to a colleague
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="e.g., Find senior RAG engineers in EU open to contracts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 text-lg py-6"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !query.trim() || createSearchQuery.isPending}
              className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSearching || createSearchQuery.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </div>
              )}
            </Button>
          </div>

          {/* Suggested Queries */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Advanced Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Experience (years)</label>
              <Slider
                value={filters.experience}
                onValueChange={(value) => setFilters({...filters, experience: value})}
                max={15}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{filters.experience[0]} years</span>
                <span>{filters.experience[1]} years</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any location</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="eu">Europe</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="remote">Remote only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Key Skills</label>
              <Input
                placeholder="e.g., RAG, PyTorch, LLM"
                value={filters.skills}
                onChange={(e) => setFilters({...filters, skills: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Availability</label>
              <Select value={filters.availability} onValueChange={(value) => setFilters({...filters, availability: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="active">Actively looking</SelectItem>
                  <SelectItem value="open">Open to offers</SelectItem>
                  <SelectItem value="contract">Contract only</SelectItem>
                </SelectContent>
              </Select>
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
                        {candidate.anonymized ? "Candidate" : candidate.name} #{candidate.id.slice(-6)}
                      </h3>
                      <p className="text-blue-600 font-medium">{candidate.title}</p>
                      <p className="text-gray-600">{candidate.experience} • {candidate.location}</p>
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
                        {candidate.availability}
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
                      Contact: {candidate.anonymized ? "••••••@••••.com" : candidate.email}
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
