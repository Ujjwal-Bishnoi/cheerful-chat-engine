
import { useState, useEffect } from "react";
import { MessageSquare, Plus, Edit, Copy, Eye, TrendingUp, Send, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOutreachTemplates } from "@/hooks/useOutreachTemplates";

interface OutreachTemplatesProps {
  selectedCandidateEmail?: string;
}

const OutreachTemplates = ({ selectedCandidateEmail }: OutreachTemplatesProps) => {
  const { data: templates = [], isLoading } = useOutreachTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const handleUseTemplate = () => {
    if (selectedTemplateData && selectedCandidateEmail) {
      const subject = encodeURIComponent(selectedTemplateData.subject);
      const body = encodeURIComponent(selectedTemplateData.content.replace('{candidate_email}', selectedCandidateEmail));
      window.location.href = `mailto:${selectedCandidateEmail}?subject=${subject}&body=${body}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
          <MessageSquare className="w-8 h-8 text-green-600" />
          <span>Outreach Templates</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create and manage personalized outreach templates. AI-powered personalization helps you connect with candidates effectively.
        </p>
        {selectedCandidateEmail && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">Selected candidate: <strong>{selectedCandidateEmail}</strong></p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-800">{templates.length}</p>
                <p className="text-green-600 text-sm">Active Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-800">
                  {templates.reduce((sum, t) => sum + t.usage_count, 0)}
                </p>
                <p className="text-blue-600 text-sm">Total Sent</p>
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
                <p className="text-2xl font-bold text-purple-800">23%</p>
                <p className="text-purple-600 text-sm">Response Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-800">47</p>
                <p className="text-orange-600 text-sm">Interviews Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="lg:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Templates</CardTitle>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-1" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{template.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {template.template_type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{template.subject}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Used {template.usage_count} times</span>
                      <div className="space-x-1">
                        <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Editor/Preview */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedTemplateData ? selectedTemplateData.name : 'Select a Template'}
                </CardTitle>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {previewMode ? 'Edit' : 'Preview'}
                  </Button>
                  {selectedTemplateData && selectedCandidateEmail && (
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleUseTemplate}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Use Template
                    </Button>
                  )}
                </div>
              </div>
              {selectedTemplateData && (
                <CardDescription>
                  {selectedTemplateData.template_type} template • Used {selectedTemplateData.usage_count} times
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {selectedTemplateData ? (
                <div className="space-y-4">
                  {previewMode ? (
                    // Preview Mode
                    <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                      <div className="border-b pb-4">
                        <label className="text-sm font-medium text-gray-700">Subject:</label>
                        <p className="text-lg font-semibold mt-1">{selectedTemplateData.subject}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Message:</label>
                        <div className="mt-2 whitespace-pre-wrap text-gray-800 leading-relaxed">
                          {selectedTemplateData.content}
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Template Variables:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-blue-600">• {'{candidate_name}'}</span>
                          <span className="text-blue-600">• {'{company}'}</span>
                          <span className="text-blue-600">• {'{role_title}'}</span>
                          <span className="text-blue-600">• {'{recruiter_name}'}</span>
                          <span className="text-blue-600">• {'{key_skills}'}</span>
                          <span className="text-blue-600">• {'{experience_areas}'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Template Name</label>
                        <Input
                          defaultValue={selectedTemplateData.name}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Template Type</label>
                        <Select defaultValue={selectedTemplateData.template_type}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="specialist">Specialist</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Subject Line</label>
                        <Input
                          defaultValue={selectedTemplateData.subject}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Message Content</label>
                        <Textarea
                          defaultValue={selectedTemplateData.content}
                          rows={12}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Template Selected</h3>
                  <p className="text-gray-600 mb-4">Choose a template from the list to view or edit it.</p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Template
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OutreachTemplates;
