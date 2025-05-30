
import { useState, useCallback } from "react";
import { Upload, FileText, Check, AlertCircle, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const ResumeUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedResumes, setParsedResumes] = useState<any[]>([]);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFiles = droppedFiles.filter(file => 
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    
    if (pdfFiles.length !== droppedFiles.length) {
      toast({
        title: "Some files were skipped",
        description: "Only PDF files are supported",
        variant: "destructive"
      });
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const processResumes = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate processing
    const mockParsedData = files.map((file, index) => ({
      id: Date.now() + index,
      filename: file.name,
      candidate: {
        name: `Candidate ${index + 1}`,
        title: ["Senior ML Engineer", "AI Researcher", "Data Scientist", "ML Platform Engineer"][index % 4],
        experience: Math.floor(Math.random() * 10) + 2,
        skills: [
          ["Python", "PyTorch", "MLOps", "Kubernetes"],
          ["Transformers", "RLHF", "Research", "Publications"],
          ["Statistics", "R", "SQL", "Visualization"],
          ["Infrastructure", "Docker", "AWS", "Monitoring"]
        ][index % 4],
        location: ["San Francisco, CA", "New York, NY", "Seattle, WA", "Remote"][index % 4]
      },
      parsing: {
        confidence: Math.floor(Math.random() * 20) + 80,
        extractedSections: ["Contact", "Experience", "Education", "Skills"],
        flags: index === 1 ? ["Potential duplicate"] : []
      }
    }));

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }
    
    setParsedResumes(mockParsedData);
    setUploading(false);
    
    toast({
      title: "Resumes processed successfully",
      description: `${files.length} resumes have been parsed and added to your database`,
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Upload Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
          <Upload className="w-8 h-8 text-blue-600" />
          <span>Resume Upload & Parsing</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload resumes in bulk to build your candidate database. Our AI extracts key information and creates searchable profiles.
        </p>
      </div>

      {/* Upload Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-800">1,247</p>
                <p className="text-blue-600 text-sm">Total Resumes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-800">892</p>
                <p className="text-green-600 text-sm">Unique Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-800">94%</p>
                <p className="text-purple-600 text-sm">Parse Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Upload Area */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Upload Resumes</CardTitle>
          <CardDescription>
            Drag and drop PDF files or click to select. Bulk uploads supported.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Drop your resume PDFs here
            </h3>
            <p className="text-gray-500 mb-4">
              or click to browse files
            </p>
            <Button variant="outline">
              Select Files
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Selected Files ({files.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={processResumes} 
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {uploading ? "Processing..." : `Process ${files.length} Resume${files.length > 1 ? 's' : ''}`}
                </Button>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Processing resumes...</span>
                <span className="text-sm text-gray-600">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parsing Results */}
      {parsedResumes.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Parsing Results</span>
            </CardTitle>
            <CardDescription>
              AI-extracted candidate information ready for search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parsedResumes.map((resume) => (
                <div key={resume.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{resume.filename}</h4>
                      <p className="text-sm text-gray-600">
                        {resume.candidate.name} • {resume.candidate.title}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={resume.parsing.confidence > 90 ? "default" : "secondary"}
                        className={resume.parsing.confidence > 90 ? "bg-green-600" : ""}
                      >
                        {resume.parsing.confidence}% confidence
                      </Badge>
                      {resume.parsing.flags.length > 0 && (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {resume.parsing.flags[0]}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Experience:</span> {resume.candidate.experience} years
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {resume.candidate.location}
                    </div>
                    <div>
                      <span className="font-medium">Sections:</span> {resume.parsing.extractedSections.join(", ")}
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="font-medium text-sm">Skills: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {resume.candidate.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
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

export default ResumeUpload;
