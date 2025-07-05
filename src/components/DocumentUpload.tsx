
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X, Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import GoogleDrivePicker from "./GoogleDrivePicker";

interface DocumentUploadProps {
  onDocumentUpload: (file: File) => void;
  onAIGenerate?: (changelogData: any) => void;
  isProcessing?: boolean;
}

const DocumentUpload = ({ 
  onDocumentUpload, 
  onAIGenerate,
  isProcessing = false 
}: DocumentUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const documentFiles = files.filter(file => 
      file.type.includes('pdf') || 
      file.type.includes('document') || 
      file.type.includes('text') ||
      file.name.endsWith('.docx') ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md')
    );
    
    if (documentFiles.length > 0) {
      handleFileUpload(documentFiles[0]);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, Word document, or text file.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFiles([file]);
    onDocumentUpload(file);
    toast({
      title: "Document uploaded",
      description: `${file.name} is ready for AI processing.`,
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleAIProcessing = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsAIProcessing(true);
    try {
      const file = uploadedFiles[0];
      const formData = new FormData();
      formData.append('file', file);

      console.log('Processing file with AI:', file.name);

      const { data, error } = await supabase.functions.invoke('process-document-to-changelog', {
        body: formData,
      });

      if (error) {
        console.error('AI processing error:', error);
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to process document');
      }

      console.log('AI processing successful:', data.data);

      toast({
        title: "AI Processing Complete!",
        description: "Your changelog draft has been generated and is ready for editing.",
      });

      if (onAIGenerate) {
        onAIGenerate(data.data);
      }

    } catch (error: any) {
      console.error('Error processing document:', error);
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process document with AI",
        variant: "destructive",
      });
    } finally {
      setIsAIProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed cursor-pointer transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Document for AI Processing
          </h3>
          <p className="text-gray-600 mb-4">
            Upload release notes, documentation, or any text file to generate a changelog
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supports PDF, Word documents, and text files
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button type="button" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            <GoogleDrivePicker 
              onFileSelected={handleFileUpload}
              disabled={isProcessing || isAIProcessing}
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Ready for AI Processing</span>
              <Button 
                onClick={handleAIProcessing}
                disabled={isProcessing || isAIProcessing}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isAIProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Changelog with AI
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    disabled={isAIProcessing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isAIProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <div>
                <p className="font-medium">AI is generating your changelog...</p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;
