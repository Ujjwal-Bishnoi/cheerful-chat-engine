
import { useState } from "react";
import { Users, Star, MapPin, Clock, Mail, Phone, ExternalLink, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CandidateResultsProps {
  candidates: any[];
}

const CandidateResults = ({ candidates }: CandidateResultsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [filterBy, setFilterBy] = useState("all");

  // Mock candidates if none provided
  const mockCandidates = [
    {
      id: 1,
      name: "Alex Chen",
      title: "Senior ML Engineer",
      experience: "5 years",
      location: "San Francisco, CA",
      skills: ["RAG", "PyTorch", "LangChain", "Vector Databases", "Python", "AWS"],
      score: 95,
      summary: "Expert in retrieval-augmented generation with production RAG systems experience at scale. Led implementation of enterprise RAG solutions serving millions of users.",
      availability: "Open to offers",
      email: "alex.chen@email.com",
      phone: "+1 (555) 123-4567",
      lastActive: "2 days ago",
      education: "MS Computer Science, Stanford",
      currentCompany: "TechCorp AI",
      salaryRange: "$150k - $200k",
      verified: true
    },
    {
      id: 2,
      name: "Sarah Rodriguez",
      title: "AI Research Scientist",
      experience: "7 years",
      location: "Berlin, Germany",
      skills: ["Transformers", "RLHF", "MLOps", "Distributed Training", "Research", "Publications"],
      score: 92,
      summary: "PhD in NLP with expertise in large language model training and alignment. Published 15+ papers in top-tier conferences including NeurIPS and ICML.",
      availability: "Contract only",
      email: "s.rodriguez@research.eu",
      phone: "+49 30 12345678",
      lastActive: "1 week ago",
      education: "PhD NLP, Technical University Berlin",
      currentCompany: "AI Research Institute",
      salaryRange: "€80k - €120k",
      verified: true
    },
    {
      id: 3,
      name: "Marcus Johnson",
      title: "AI Engineering Lead",
      experience: "8 years",
      location: "London, UK",
      skills: ["LLM Fine-tuning", "Inference Optimization", "Team Leadership", "MLOps", "Kubernetes"],
      score: 88,
      summary: "Led AI teams building production LLM applications at scale. Experience with multi-modal models and real-time inference optimization.",
      availability: "Actively looking",
      email: "marcus.j@techcorp.com",
      phone: "+44 20 7123 4567",
      lastActive: "1 day ago",
      education: "BEng Software Engineering, Imperial College",
      currentCompany: "Fintech AI Solutions",
      salaryRange: "£90k - £130k",
      verified: false
    },
    {
      id: 4,
      name: "Maria Gonzalez",
      title: "MLOps Engineer",
      experience: "4 years",
      location: "Barcelona, Spain",
      skills: ["Kubernetes", "MLflow", "Docker", "CI/CD", "Model Monitoring", "Terraform"],
      score: 85,
      summary: "Specialist in ML infrastructure and deployment pipelines. Built automated ML training and deployment systems handling 100+ models in production.",
      availability: "Open to offers",
      email: "maria.g@mlops.es",
      phone: "+34 93 123 4567",
      lastActive: "3 days ago",
      education: "MS Data Engineering, UPC Barcelona",
      currentCompany: "CloudML Systems",
      salaryRange: "€60k - €80k",
      verified: true
    }
  ];

  const displayCandidates = candidates.length > 0 ? candidates : mockCandidates;

  const filteredCandidates = displayCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterBy === "all" || 
                         (filterBy === "verified" && candidate.verified) ||
                         (filterBy === "active" && candidate.availability === "Actively looking") ||
                         (filterBy === "contract" && candidate.availability === "Contract only");
    
    return matchesSearch && matchesFilter;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return b.score - a.score;
      case "experience":
        return parseInt(b.experience) - parseInt(a.experience);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
          <Users className="w-8 h-8 text-blue-600" />
          <span>Candidate Database</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse and manage your candidate pool with advanced filtering and detailed profiles.
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search candidates, skills, or titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">AI Score</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Candidates</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="active">Actively Looking</SelectItem>
                  <SelectItem value="contract">Contract Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Showing {sortedCandidates.length} of {displayCandidates.length} candidates
            </p>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedCandidates.map((candidate) => (
          <Card key={candidate.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                      {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <p className="text-blue-600 font-medium">{candidate.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <Badge 
                      variant={candidate.score >= 90 ? "default" : "secondary"}
                      className={candidate.score >= 90 ? "bg-green-600" : ""}
                    >
                      {candidate.score}%
                    </Badge>
                  </div>
                  {candidate.verified && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {candidate.summary}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{candidate.experience}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{candidate.location}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Key Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 6).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{candidate.skills.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                <div><span className="font-medium">Education:</span> {candidate.education}</div>
                <div><span className="font-medium">Current:</span> {candidate.currentCompany}</div>
                <div><span className="font-medium">Salary:</span> {candidate.salaryRange}</div>
                <div><span className="font-medium">Last Active:</span> {candidate.lastActive}</div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <Badge 
                    variant={candidate.availability === "Actively looking" ? "default" : "outline"}
                    className={candidate.availability === "Actively looking" ? "bg-green-600" : ""}
                  >
                    {candidate.availability}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Profile
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Mail className="w-3 h-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedCandidates.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No candidates found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms or filters to find more candidates.
            </p>
            <Button variant="outline" onClick={() => {setSearchTerm(""); setFilterBy("all");}}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidateResults;
