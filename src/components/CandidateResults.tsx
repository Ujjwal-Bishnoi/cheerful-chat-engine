
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Filter, TrendingUp, Eye } from "lucide-react";
import { useCandidates } from "@/hooks/useCandidates";
import { useState } from "react";
import CandidateProfile from "./CandidateProfile";

interface CandidateResultsProps {
  candidates: any[];
  setActiveTab?: (tab: string) => void;
  setSelectedCandidateEmail?: (email: string) => void;
}

const CandidateResults = ({ candidates: searchCandidates, setActiveTab, setSelectedCandidateEmail }: CandidateResultsProps) => {
  const { data: allCandidates = [], isLoading } = useCandidates();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Always show all candidates in this tab, ignore search candidates
  const displayCandidates = allCandidates;

  const filteredCandidates = displayCandidates.filter(candidate => {
    const matchesSearch = candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || candidate.availability === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatAvailability = (availability: string) => {
    return availability?.replace('_', ' ').replace('to_', 'to ') || '';
  };

  const handleSendOutreach = (candidate: any) => {
    if (setSelectedCandidateEmail && setActiveTab) {
      setSelectedCandidateEmail(candidate.email);
      setActiveTab("outreach");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
          <Users className="w-8 h-8 text-blue-600" />
          <span>Candidate Database</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse and manage your candidate database. View profiles, track engagement, and manage outreach campaigns.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-800">{allCandidates.length}</p>
                <p className="text-blue-600 text-sm">Total Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-800">
                  {allCandidates.filter(c => c.availability === 'actively_looking').length}
                </p>
                <p className="text-green-600 text-sm">Actively Looking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-800">
                  {allCandidates.filter(c => c.verified).length}
                </p>
                <p className="text-purple-600 text-sm">Verified Profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-800">0</p>
                <p className="text-orange-600 text-sm">Outreach Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search candidates, skills, titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Candidates</SelectItem>
                <SelectItem value="actively_looking">Actively Looking</SelectItem>
                <SelectItem value="open_to_offers">Open to Offers</SelectItem>
                <SelectItem value="contract_only">Contract Only</SelectItem>
                <SelectItem value="not_available">Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidate List */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Candidate Profiles</CardTitle>
            <Badge variant="secondary">{filteredCandidates.length} candidates</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
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
                    <Badge 
                      variant="outline" 
                      className={`mb-2 ${
                        candidate.availability === 'actively_looking' ? 'border-green-500 text-green-700' :
                        candidate.availability === 'open_to_offers' ? 'border-blue-500 text-blue-700' :
                        candidate.availability === 'contract_only' ? 'border-orange-500 text-orange-700' :
                        'border-gray-500 text-gray-700'
                      }`}
                    >
                      {formatAvailability(candidate.availability)}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{candidate.summary}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {candidate.skills?.slice(0, 6).map((skill: string, index: number) => (
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
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Contact:</span> {candidate.email}
                  </div>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateResults;
