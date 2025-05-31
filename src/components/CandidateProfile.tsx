
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Mail, MapPin, Calendar, Star } from "lucide-react";
import { Candidate } from "@/hooks/useCandidates";

interface CandidateProfileProps {
  candidate: Candidate;
  onBack: () => void;
}

const CandidateProfile = ({ candidate, onBack }: CandidateProfileProps) => {
  const handleExportPDF = () => {
    // Create a simple HTML content for PDF export
    const htmlContent = `
      <html>
        <head>
          <title>${candidate.name} - Profile</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .skills { display: flex; flex-wrap: wrap; gap: 5px; }
            .skill { background: #e5e7eb; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${candidate.name}</h1>
            <h2>${candidate.title}</h2>
            <p>${candidate.location} • ${candidate.experience_years} years experience</p>
          </div>
          
          <div class="section">
            <h3>Contact Information</h3>
            <p>Email: ${candidate.email}</p>
            <p>Availability: ${candidate.availability?.replace('_', ' ')}</p>
          </div>
          
          <div class="section">
            <h3>Summary</h3>
            <p>${candidate.summary}</p>
          </div>
          
          <div class="section">
            <h3>Skills</h3>
            <div class="skills">
              ${candidate.skills?.map(skill => `<span class="skill">${skill}</span>`).join('') || ''}
            </div>
          </div>
          
          <div class="section">
            <h3>Verification</h3>
            <p>Verified: ${candidate.verified ? 'Yes' : 'No'}</p>
            ${candidate.verified ? `<p>Verification Score: ${candidate.verification_score}%</p>` : ''}
          </div>
        </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidate.name.replace(/\s+/g, '_')}_profile.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatAvailability = (availability: string) => {
    return availability?.replace('_', ' ').replace('to_', 'to ') || '';
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={onBack}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Candidates</span>
      </Button>

      {/* Main Profile Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
                  <p className="text-xl text-blue-600 font-medium">{candidate.title}</p>
                  <div className="flex items-center space-x-4 mt-2 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{candidate.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{candidate.experience_years} years experience</span>
                    </div>
                    {candidate.verified && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Verified {candidate.verification_score}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Badge 
                variant="outline" 
                className={`${
                  candidate.availability === 'actively_looking' ? 'border-green-500 text-green-700 bg-green-50' :
                  candidate.availability === 'open_to_offers' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                  candidate.availability === 'contract_only' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                  'border-gray-500 text-gray-700 bg-gray-50'
                }`}
              >
                {formatAvailability(candidate.availability)}
              </Badge>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  className="flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-1"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Information */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{candidate.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium">{candidate.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Experience</p>
              <p className="font-medium">{candidate.experience_years} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Availability</p>
              <p className="font-medium">{formatAvailability(candidate.availability)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Skills & Technologies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {candidate.skills?.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                {skill}
              </Badge>
            )) || <p className="text-gray-500">No skills listed</p>}
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      {candidate.verified && (
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <Star className="w-5 h-5" />
              <span>Verification Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-medium">Profile Verified</p>
                <p className="text-green-600 text-sm">This candidate's profile has been verified by our system</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-800">{candidate.verification_score}%</p>
                <p className="text-green-600 text-sm">Verification Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidateProfile;
