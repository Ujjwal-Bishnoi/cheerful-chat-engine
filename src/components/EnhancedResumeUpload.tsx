
import { useState } from "react";
import { Upload, FileText, Check, AlertCircle, Edit, Save, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useResumeParserFallback } from "@/hooks/useResumeParserFallback";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useToast } from "@/hooks/use-toast";

const EnhancedResumeUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const { parseResume, isProcessing, parsedData, setParsedData } = useResumeParserFallback();
  const { uploadFile, isUploading } = useFileUpload();
  const { toast } = useToast();

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) {
      toast({
        title: "No files detected",
        description: "Please drop a PDF or DOC file",
        variant: "destructive"
      });
      return;
    }

    if (files.length > 1) {
      toast({
        title: "Multiple files detected",
        description: "Please upload one resume at a time",
        variant: "destructive"
      });
      return;
    }

    try {
      const validatedFile = await uploadFile(files[0]);
      await parseResume(validatedFile);
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const validatedFile = await uploadFile(e.target.files[0]);
        await parseResume(validatedFile);
      } catch (error) {
        console.error('File input error:', error);
      }
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
      description: "Resume data has been updated successfully",
    });
  };

  const cancelEditing = () => {
    setEditingData(null);
  };

  const updateField = (field: string, value: any) => {
    setEditingData(prev => ({ ...prev, [field]: value }));
  };

  const currentData = editingData || parsedData;
  const isCurrentlyProcessing = isProcessing || isUploading;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Resume Upload & Parser</span>
          </CardTitle>
          <CardDescription>
            Upload PDF or DOC resumes and extract structured candidate information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
              isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            } ${isCurrentlyProcessing ? 'opacity-50 pointer-events-none' : ''}`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() => !isCurrentlyProcessing && document.getElementById('resume-file-input')?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {isCurrentlyProcessing ? 'Processing resume...' : 'Drop your resume here'}
            </h3>
            <p className="text-gray-500 mb-4">
              Supports PDF, DOC, and DOCX files (max 10MB)
            </p>
            <Button variant="outline" disabled={isCurrentlyProcessing}>
              {isCurrentlyProcessing ? 'Processing...' : 'Select File'}
            </Button>
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileInput}
              disabled={isCurrentlyProcessing}
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
                    placeholder="Enter candidate name"
                  />
                ) : (
                  <p className="text-lg font-semibold">{currentData.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                {editingData ? (
                  <Input 
                    type="email"
                    value={editingData.email || ''} 
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                ) : (
                  <p className="text-gray-700">{currentData.email || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Job Title</label>
                {editingData ? (
                  <Input 
                    value={editingData.title || ''} 
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Enter job title"
                  />
                ) : (
                  <p className="text-gray-700">{currentData.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                {editingData ? (
                  <Input 
                    value={editingData.location || ''} 
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="Enter location"
                  />
                ) : (
                  <p className="text-gray-700">{currentData.location}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Years of Experience</label>
                {editingData ? (
                  <Input 
                    type="number"
                    value={editingData.experience_years || 0} 
                    onChange={(e) => updateField('experience_years', parseInt(e.target.value) || 0)}
                    placeholder="Enter years of experience"
                  />
                ) : (
                  <p className="text-gray-700">{currentData.experience_years} years</p>
                )}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium mb-1">Professional Summary</label>
              {editingData ? (
                <Textarea 
                  value={editingData.summary || ''} 
                  onChange={(e) => updateField('summary', e.target.value)}
                  rows={4}
                  placeholder="Enter professional summary"
                />
              ) : (
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{currentData.summary}</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium mb-2">Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {currentData.skills?.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              {editingData && (
                <Input 
                  placeholder="Add skills separated by commas"
                  value={editingData.skills?.join(', ') || ''}
                  onChange={(e) => updateField('skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                />
              )}
            </div>

            {/* Work Experience */}
            {currentData.work_experience && currentData.work_experience.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Work Experience</label>
                <div className="space-y-3">
                  {currentData.work_experience.map((exp: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-blue-600">{exp.role} at {exp.company}</h4>
                      <p className="text-sm text-gray-600 mb-2">{exp.duration}</p>
                      {exp.description && (
                        <p className="text-sm text-gray-700">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {currentData.education && currentData.education.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Education</label>
                <div className="space-y-2">
                  {currentData.education.map((edu: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <h4 className="font-medium">{edu.degree} in {edu.field}</h4>
                      <p className="text-sm text-gray-600">{edu.institution} - {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                Save to Database
              </Button>
              <Button variant="outline" className="flex-1">
                Create Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedResumeUpload;
