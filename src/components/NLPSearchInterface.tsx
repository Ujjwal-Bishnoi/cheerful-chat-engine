
import { useState } from 'react';
import { Search, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGroqNLPSearch } from '@/hooks/useGroqNLPSearch';

export const NLPSearchInterface = () => {
  const [query, setQuery] = useState('');
  const { searchCandidates, isSearching, searchResults, searchSummary } = useGroqNLPSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchCandidates(query);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">AI-Powered Candidate Search</h2>
          <Sparkles className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-gray-600">
          Use natural language to find the perfect candidates. Powered by advanced AI.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="e.g., 'Senior React developer with 5+ years experience' or 'ML engineer for computer vision'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              disabled={isSearching}
            />
          </div>
          <Button type="submit" disabled={isSearching || !query.trim()}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        {/* Example Queries */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Try:</span>
          {[
            'Senior DevOps engineer with Kubernetes',
            'Frontend developer React TypeScript',
            'Data scientist with Python experience',
            'Mobile developer iOS Android',
            'Full stack developer startup experience'
          ].map((example) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              onClick={() => setQuery(example)}
              disabled={isSearching}
              className="text-xs"
            >
              {example}
            </Button>
          ))}
        </div>
      </form>

      {/* Search Summary */}
      {searchSummary && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">AI Analysis</h3>
                <p className="text-blue-700 text-sm mt-1">{searchSummary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {searchResults.length} Candidates Found (Ranked by AI)
          </h3>
          
          <div className="grid gap-4">
            {searchResults.map((candidate, index) => (
              <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <h4 className="font-semibold text-lg">{candidate.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {candidate.score}% match
                        </Badge>
                        {candidate.verified && (
                          <Badge variant="default" className="text-xs bg-green-600">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{candidate.title}</p>
                      <p className="text-sm text-gray-500">
                        {candidate.experience} • {candidate.location}
                      </p>
                    </div>
                    <Badge 
                      variant={candidate.availability === 'actively looking' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {candidate.availability}
                    </Badge>
                  </div>

                  {candidate.reason && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-green-800">
                        <strong>Why this match:</strong> {candidate.reason}
                      </p>
                    </div>
                  )}

                  <p className="text-sm text-gray-700 mb-3">{candidate.summary}</p>

                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 8).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills.length > 8 && (
                      <Badge variant="outline" className="text-xs">
                        +{candidate.skills.length - 8} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isSearching && searchResults.length === 0 && query && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">
              No candidates found matching your search. Try adjusting your query.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
