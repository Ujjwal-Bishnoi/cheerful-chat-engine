
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useResumeParser = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const { toast } = useToast();

  const parseResume = async (file: File) => {
    setIsProcessing(true);
    setParsedData(null);

    try {
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error('Failed to upload file');
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // Call parse-resume function
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: {
          fileUrl: urlData.publicUrl,
          fileName: file.name
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setParsedData(data.parsedData);
        toast({
          title: "Resume parsed successfully",
          description: `Extracted data for ${data.parsedData.name}`,
        });
        return data;
      } else {
        throw new Error(data.error || 'Failed to parse resume');
      }

    } catch (error: any) {
      console.error('Resume parsing error:', error);
      toast({
        title: "Resume parsing failed",
        description: error.message || 'Please try again',
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    parseResume,
    isProcessing,
    parsedData,
    setParsedData
  };
};
