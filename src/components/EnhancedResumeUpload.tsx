
import { useState } from "react";
import { Upload, FileText, Check, AlertCircle, Edit, Save, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useResumeParser } from "@/hooks/useResumeParser";
import { useToast } from "@/hooks/use-toast";

const EnhancedResumeUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const { parseResume, isProcessing, parsedData, setParsedData } = useResumeParser();
  const { toast } = useToast();

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(file => 
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    
    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF files only",
        variant: "destructive"
      });
      return;
    }

    if (pdfFiles.length > 1) {
      toast({
        title: "Multiple files",
        description: "Please upload one resume at a time",
        variant: "destructive"
      });
      return;
    }

    await parseResume(pdfFiles[0]);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await parseResume(e.target.files[0]);
    }
  };

  const startEditing = () => {
    setEditingData({ ...parsedData });
  };

  const saveEdits = () => {
    setParsedData(editingData);
    setEditingData(null);
    toast({
      title: "Changes saved",
      description: "Resume data has been updated",
    });
  };

  const cancelEditing = () => {
    setEditingData(null);
  };

  const updateField = (field: string, value: any) => {
    setEditingData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>AI-Powered Resume Parser</span>
          </CardTitle>
          <CardDescription>
            Upload a PDF resume and our AI will extract structured candidate information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
              isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() => document.getElementById('resume-file-input')?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {isProcessing ? 'Processing resume...' : 'Drop your resume PDF here'}
            </h3>
            <p className="text-gray-500 mb-4">
              or click to browse files
            </p>
            <Button variant="outline" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Select PDF File'}
            </Button>
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileInput}
              disabled={isProcessing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Parsed Data Display */}
      {parsedData && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>Extracted Information</span>
              </CardTitle>
              <div className="flex space-x-2">
                {!editingData ? (
                  <Button onClick={startEditing} variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button onClick={saveEdits} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={cancelEditing} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                {editingData ? (
                  <Input 
                    value={editingData.name || ''} 
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-semibold">{parsedData.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                {editingData ? (
                  <Input 
                    value={editingData.email || ''} 
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700">{parsedData.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                {editingData ? (
                  <Input 
                    value={editingData.title || ''} 
                    onChange={(e) => updateField('title', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700">{parsedData.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                {editingData ? (
                  <Input 
                    value={editingData.location || ''} 
                    onChange={(e) => updateField('location', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700">{parsedData.location}</p>
                )}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium mb-1">Summary</label>
              {editingData ? (
                <Textarea 
                  value={editingData.summary || ''} 
                  onChange={(e) => updateField('summary', e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="text-gray-700">{parsedData.summary}</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {(editingData ? editingData.skills : parsedData.skills)?.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            {parsedData.work_experience && parsedData.work_experience.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Work Experience</label>
                <div className="space-y-3">
                  {parsedData.work_experience.map((exp: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <h4 className="font-medium">{exp.role} at {exp.company}</h4>
                      <p className="text-sm text-gray-600">{exp.duration}</p>
                      {exp.description && (
                        <p className="text-sm mt-1">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {parsedData.education && parsedData.education.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Education</label>
                <div className="space-y-2">
                  {parsedData.education.map((edu: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <h4 className="font-medium">{edu.degree} in {edu.field}</h4>
                      <p className="text-sm text-gray-600">{edu.institution} - {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedResumeUpload;
