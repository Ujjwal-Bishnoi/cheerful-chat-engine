
import { useState } from "react";
import { MessageSquare, Send, Copy, Edit, Eye, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const OutreachTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("initial_outreach");
  const [customMessage, setCustomMessage] = useState("");
  const [personalization, setPersonalization] = useState({
    candidateName: "Alex Chen",
    role: "Senior ML Engineer",
    company: "TechCorp",
    specificSkill: "RAG systems"
  });
  const { toast } = useToast();

  const templates = {
    initial_outreach: {
      name: "Initial Outreach",
      subject: "Exciting AI Engineering Opportunity at [COMPANY]",
      body: `Hi [CANDIDATE_NAME],

I hope this message finds you well! I came across your profile and was impressed by your experience with [SPECIFIC_SKILL] and your background in [FIELD].

We have an exciting opportunity for a [ROLE] position at [COMPANY] that seems like a perfect match for your expertise. The role involves:

• Leading development of production AI systems
• Working with cutting-edge ML technologies
• Collaborating with a world-class engineering team
• Competitive compensation and equity package

Would you be interested in a brief conversation about this opportunity? I'd love to share more details about the role and learn about your career goals.

Best regards,
[YOUR_NAME]
[YOUR_TITLE]`,
      tags: ["Cold outreach", "AI roles", "Professional"]
    },
    follow_up: {
      name: "Follow-up Message",
      subject: "Following up on our AI Engineering opportunity",
      body: `Hi [CANDIDATE_NAME],

I wanted to follow up on my previous message about the [ROLE] position at [COMPANY]. I understand you're likely busy, but I believe this opportunity could be a great next step in your career.

Since we last spoke, we've had some exciting developments:
• Secured Series B funding for AI research expansion
• Launched new ML platform serving 10M+ users
• Expanded the team with engineers from top tech companies

I'd still love to have a brief conversation about how your experience with [SPECIFIC_SKILL] could contribute to our mission.

Would you have 15 minutes for a quick call this week?

Best,
[YOUR_NAME]`,
      tags: ["Follow-up", "Warm", "Persistent"]
    },
    contract_role: {
      name: "Contract Position",
      subject: "High-impact AI Contract Opportunity",
      body: `Hello [CANDIDATE_NAME],

I'm reaching out regarding a specialized contract opportunity that aligns perfectly with your expertise in [SPECIFIC_SKILL].

Project Details:
• Duration: 3-6 months with possible extension
• Remote-friendly with occasional travel
• Competitive daily/hourly rate
• Direct impact on cutting-edge AI research

We're looking for someone with your background to lead a critical initiative in [FIELD]. The project involves building production-ready AI systems from the ground up.

Are you currently available for contract work? I'd love to discuss the details and compensation structure.

Looking forward to hearing from you!

[YOUR_NAME]
[COMPANY] - Talent Acquisition`,
      tags: ["Contract", "Remote", "Short-term"]
    },
    referral_request: {
      name: "Referral Request",
      subject: "Quick question about AI talent in your network",
      body: `Hi [CANDIDATE_NAME],

I hope you're doing well! While I know you're not currently looking for new opportunities, I wanted to reach out about something else.

We're building an exceptional AI engineering team at [COMPANY] and are looking for talented individuals with expertise in [SPECIFIC_SKILL]. Given your experience and network in the AI community, I thought you might know someone who could be a great fit.

The role offers:
• Competitive compensation ($150k-$200k+)
• Equity in a fast-growing AI company
• Opportunity to work on cutting-edge research
• Flexible remote work options

Do you know anyone in your network who might be interested? I'd be happy to provide more details about the role and company.

Thanks for any help you can provide!

Best,
[YOUR_NAME]`,
      tags: ["Referral", "Network", "Indirect"]
    }
  };

  const generatePersonalizedMessage = () => {
    let message = templates[selectedTemplate as keyof typeof templates].body;
    
    // Replace placeholders with personalization data
    message = message.replace(/\[CANDIDATE_NAME\]/g, personalization.candidateName);
    message = message.replace(/\[ROLE\]/g, personalization.role);
    message = message.replace(/\[COMPANY\]/g, personalization.company);
    message = message.replace(/\[SPECIFIC_SKILL\]/g, personalization.specificSkill);
    message = message.replace(/\[FIELD\]/g, "AI/ML Engineering");
    message = message.replace(/\[YOUR_NAME\]/g, "Sarah Wilson");
    message = message.replace(/\[YOUR_TITLE\]/g, "Senior Tech Recruiter");
    
    setCustomMessage(message);
    
    toast({
      title: "Message personalized",
      description: "Template has been customized with candidate information",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(customMessage);
    toast({
      title: "Copied to clipboard",
      description: "Message copied and ready to paste",
    });
  };

  const sendMessage = () => {
    toast({
      title: "Message sent",
      description: `Outreach message sent to ${personalization.candidateName}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
          <MessageSquare className="w-8 h-8 text-green-600" />
          <span>Outreach Templates</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          AI-powered outreach templates optimized for AI/ML talent acquisition with smart personalization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <div className="lg:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>
                Choose from proven outreach templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(templates).map(([key, template]) => (
                <div
                  key={key}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === key
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedTemplate(key)}
                >
                  <h4 className="font-semibold">{template.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {template.subject}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Personalization */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Personalization</span>
              </CardTitle>
              <CardDescription>
                Customize the message for your candidate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Candidate Name</label>
                <Input
                  value={personalization.candidateName}
                  onChange={(e) => setPersonalization({...personalization, candidateName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Input
                  value={personalization.role}
                  onChange={(e) => setPersonalization({...personalization, role: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Company</label>
                <Input
                  value={personalization.company}
                  onChange={(e) => setPersonalization({...personalization, company: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Specific Skill</label>
                <Input
                  value={personalization.specificSkill}
                  onChange={(e) => setPersonalization({...personalization, specificSkill: e.target.value})}
                />
              </div>
              <Button 
                onClick={generatePersonalizedMessage}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Message
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Message Composer */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{templates[selectedTemplate as keyof typeof templates].name}</CardTitle>
                  <CardDescription>
                    Edit and customize your outreach message
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="compose" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="compose">Compose</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="compose" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Subject Line</label>
                    <Input
                      value={templates[selectedTemplate as keyof typeof templates].subject}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Message Body</label>
                    <Textarea
                      value={customMessage || templates[selectedTemplate as keyof typeof templates].body}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={16}
                      className="mt-1 font-mono text-sm"
                      placeholder="Your personalized message will appear here..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Save Template
                    </Button>
                    <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="space-y-4">
                  <div className="border rounded-lg p-6 bg-gray-50 min-h-96">
                    <div className="border-b pb-4 mb-4">
                      <h3 className="font-semibold">
                        Subject: {templates[selectedTemplate as keyof typeof templates].subject}
                      </h3>
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {customMessage || templates[selectedTemplate as keyof typeof templates].body}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-6">
            <CardHeader>
              <CardTitle>Template Performance</CardTitle>
              <CardDescription>
                Track your outreach success rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">127</p>
                  <p className="text-sm text-gray-600">Messages Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">23%</p>
                  <p className="text-sm text-gray-600">Response Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">12%</p>
                  <p className="text-sm text-gray-600">Interview Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">8%</p>
                  <p className="text-sm text-gray-600">Hire Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OutreachTemplates;
