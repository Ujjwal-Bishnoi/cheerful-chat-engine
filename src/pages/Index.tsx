
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SearchInterface from "@/components/SearchInterface";
import { NLPSearchInterface } from "@/components/NLPSearchInterface";
import ResumeUpload from "@/components/ResumeUpload";
import EnhancedResumeUpload from "@/components/EnhancedResumeUpload";
import OutreachTemplates from "@/components/OutreachTemplates";
import ThemeToggle from "@/components/ThemeToggle";
import { Brain, Search, Upload, MessageSquare, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">TalentFinder Pro</h1>
            <p className="text-gray-600">AI-powered recruitment platform</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="ai-search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="ai-search" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Search
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Basic Search
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Resume Upload
            </TabsTrigger>
            <TabsTrigger value="enhanced-upload" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Smart Upload
            </TabsTrigger>
            <TabsTrigger value="outreach" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Outreach
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-search">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI-Powered Candidate Search
                </CardTitle>
                <CardDescription>
                  Use natural language to find candidates with advanced AI matching and ranking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NLPSearchInterface />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Basic Candidate Search
                </CardTitle>
                <CardDescription>
                  Search and filter candidates based on skills, experience, and availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SearchInterface />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Resume Upload & Parsing
                </CardTitle>
                <CardDescription>
                  Upload resumes to automatically extract candidate information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResumeUpload />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enhanced-upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Enhanced Resume Processing
                </CardTitle>
                <CardDescription>
                  Advanced AI-powered resume parsing with detailed analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedResumeUpload />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outreach">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Outreach Templates
                </CardTitle>
                <CardDescription>
                  Manage and customize outreach templates for candidate engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OutreachTemplates />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
