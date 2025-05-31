
import { useState, useEffect } from "react";
import { Upload, Users, MessageSquare, Zap, Shield, Target, LogOut, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SearchInterface from "@/components/SearchInterface";
import EnhancedResumeUpload from "@/components/EnhancedResumeUpload";
import CandidateResults from "@/components/CandidateResults";
import OutreachTemplates from "@/components/OutreachTemplates";
import AuthPage from "@/components/AuthPage";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [candidates, setCandidates] = useState([]);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading or auth page if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hire AI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-6">
                <Button
                  variant={activeTab === "home" ? "default" : "ghost"}
                  onClick={() => setActiveTab("home")}
                  className="flex items-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Button>
                <Button
                  variant={activeTab === "upload" ? "default" : "ghost"}
                  onClick={() => setActiveTab("upload")}
                  className="flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </Button>
                <Button
                  variant={activeTab === "candidates" ? "default" : "ghost"}
                  onClick={() => setActiveTab("candidates")}
                  className="flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Candidates</span>
                </Button>
                <Button
                  variant={activeTab === "outreach" ? "default" : "ghost"}
                  onClick={() => setActiveTab("outreach")}
                  className="flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Outreach</span>
                </Button>
              </nav>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Only show when no specific tab is active */}
      {activeTab === "home" && candidates.length === 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                AI-Powered Talent Sourcing
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Upload resumes for instant AI parsing, search candidates with natural language, 
                and discover talent with intelligent matching.
              </p>
              
              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-3xl font-bold text-blue-600 mb-2">AI-Powered</div>
                  <div className="text-gray-600 dark:text-gray-300">Resume Parsing</div>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-3xl font-bold text-purple-600 mb-2">Natural</div>
                  <div className="text-gray-600 dark:text-gray-300">Language Search</div>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-3xl font-bold text-blue-600 mb-2">Smart</div>
                  <div className="text-gray-600 dark:text-gray-300">Candidate Matching</div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-center">Resume AI Parser</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center dark:text-gray-300">
                      Upload PDFs and instantly extract structured candidate data with AI
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-center">AI Search</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center dark:text-gray-300">
                      "Find React developers with 5+ years" - Search using natural language
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-center">Smart Outreach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center dark:text-gray-300">
                      AI-personalized templates based on candidate profiles and role fit
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "home" && (
          <SearchInterface candidates={candidates} setCandidates={setCandidates} />
        )}
        {activeTab === "upload" && <EnhancedResumeUpload />}
        {activeTab === "candidates" && <CandidateResults candidates={candidates} />}
        {activeTab === "outreach" && <OutreachTemplates />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-md flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold">Hire AI</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered talent acquisition with smart resume parsing and natural language search.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>AI Resume Parser</li>
                <li>NLP Candidate Search</li>
                <li>Smart Outreach</li>
                <li>Candidate Database</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Technology</h3>
              <ul className="space-y-2 text-gray-400">
                <li>DeepSeek LLM</li>
                <li>Supabase Backend</li>
                <li>React Frontend</li>
                <li>Vector Search</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: <a href="mailto:contact@hire-ai.com" className="text-blue-400 hover:text-blue-300">contact@hire-ai.com</a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Hire AI. Powered by advanced AI technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
