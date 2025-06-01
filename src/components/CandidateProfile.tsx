
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Award, Building, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CandidateProfileProps {
  candidate: any;
  onBack: () => void;
  onSendOutreach?: (candidate: any) => void;
}

const CandidateProfile = ({ candidate, onBack, onSendOutreach }: CandidateProfileProps) => {
  const handleSendOutreach = () => {
    if (onSendOutreach) {
      onSendOutreach(candidate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </Button>
        <h1 className="text-2xl font-bold">Candidate Profile</h1>
      </div>

      {/* Main Profile Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{candidate.name}</CardTitle>
              <CardDescription className="text-lg text-blue-600 font-medium mb-2">
                {candidate.title}
              </CardDescription>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{candidate.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{candidate.experience_years} years experience</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                {candidate.verified && (
                  <Badge className="bg-green-600">
                    <Award className="w-3 h-3 mr-1" />
                    Verified {candidate.verification_score}%
                  </Badge>
                )}
              </div>
              <Badge 
                variant="outline" 
                className={`${
                  candidate.availability === 'actively_looking' ? 'border-green-500 text-green-700' :
                  candidate.availability === 'open_to_offers' ? 'border-blue-500 text-blue-700' :
                  candidate.availability === 'contract_only' ? 'border-orange-500 text-orange-700' :
                  'border-gray-500 text-gray-700'
                }`}
              >
                {candidate.availability?.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div>
            <h3 className="font-semibold mb-2">Professional Summary</h3>
            <p className="text-gray-700">{candidate.summary}</p>
          </div>

          {/* Contact Actions */}
          <div className="flex space-x-3">
            <Button 
              onClick={handleSendOutreach}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Mail className="w-4 h-4" />
              <span>Send Outreach</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Schedule Call</span>
            </Button>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold mb-3">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          {candidate.work_experience && candidate.work_experience.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Work Experience</h3>
              <div className="space-y-4">
                {candidate.work_experience.map((exp: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{exp.role}</h4>
                        <div className="flex items-center space-x-2 text-gray-600 mb-2">
                          <Building className="w-4 h-4" />
                          <span>{exp.company}</span>
                          <Calendar className="w-4 h-4 ml-2" />
                          <span>{exp.duration}</span>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {candidate.education && candidate.education.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Education</h3>
              <div className="space-y-3">
                {candidate.education.map((edu: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium">{edu.degree} in {edu.field}</h4>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {candidate.languages && candidate.languages.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.languages.map((language: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateProfile;
