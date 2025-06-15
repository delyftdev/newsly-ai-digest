
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import GoogleDrivePicker from "./GoogleDrivePicker";

interface DocumentUploadProps {
  onDocumentUpload: (file: File) => void;
  onAIProcess?: (content: string) => void;
  isProcessing?: boolean;
}

const DocumentUpload = ({ 
  onDocumentUpload, 
  onAIProcess,
  isProcessing = false 
}: DocumentUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
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
      description: `${file.name} is ready for processing.`,
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleAIProcessing = () => {
    if (uploadedFiles.length > 0 && onAIProcess) {
      // In a real implementation, we'd extract text from the document
      onAIProcess("Document content would be extracted here");
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
            Upload Document
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop a document here, or click to select
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
              disabled={isProcessing}
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
              <span>Uploaded Documents</span>
              {onAIProcess && (
                <Button 
                  onClick={handleAIProcessing}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Smart AI Convert'}
                </Button>
              )}
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
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;
