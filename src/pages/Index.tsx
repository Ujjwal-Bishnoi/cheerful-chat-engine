
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Upload, MessageCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import SearchInterface from "@/components/SearchInterface";
import CandidateResults from "@/components/CandidateResults";
import ResumeUpload from "@/components/ResumeUpload";
import OutreachTemplates from "@/components/OutreachTemplates";

const Index = () => {
  const [candidates, setCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState("search");
  const [selectedCandidateEmail, setSelectedCandidateEmail] = useState("");

  // Handle tab change from other components
  useEffect(() => {
    // This effect can be used to handle external tab changes if needed
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              AI Recruiter Dashboard
            </h1>
            <p className="text-gray-600">
              Find, analyze, and connect with top talent using AI-powered search and outreach
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Candidates</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="outreach" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Outreach Templates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <SearchInterface 
              candidates={candidates} 
              setCandidates={setCandidates}
              setActiveTab={setActiveTab}
              setSelectedCandidateEmail={setSelectedCandidateEmail}
            />
          </TabsContent>

          <TabsContent value="candidates">
            <CandidateResults 
              candidates={candidates}
              setActiveTab={setActiveTab}
              setSelectedCandidateEmail={setSelectedCandidateEmail}
            />
          </TabsContent>

          <TabsContent value="upload">
            <ResumeUpload />
          </TabsContent>

          <TabsContent value="outreach">
            <OutreachTemplates selectedCandidateEmail={selectedCandidateEmail} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
