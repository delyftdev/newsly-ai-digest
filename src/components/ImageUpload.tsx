
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image, FileImage } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  currentImage?: string;
  onImageRemove?: () => void;
}

const ImageUpload = ({ onImageUpload, currentImage, onImageRemove }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
    const imageFile = files.find(file => 
      file.type.startsWith('image/') || file.type === 'image/svg+xml'
    );
    
    if (imageFile) {
      handleFileProcess(imageFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'image/svg+xml')) {
      handleFileProcess(file);
    }
  };

  const handleFileProcess = (file: File) => {
    // Create preview for non-SVG images
    if (file.type !== 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For SVG files, show a placeholder
      setPreviewUrl('svg-placeholder');
    }

    // Process the file
    onImageUpload(file);
  };

  const getSupportedFormats = () => {
    return "JPG, PNG, GIF, WebP, SVG (including animated)";
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'image/svg+xml') {
      return <FileImage className="h-6 w-6 text-purple-500" />;
    }
    return <Image className="h-6 w-6 text-blue-500" />;
  };

  return (
    <div className="space-y-4">
      {currentImage || previewUrl ? (
        <div className="relative">
          {previewUrl === 'svg-placeholder' ? (
            <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300">
              <div className="text-center">
                <FileImage className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-700">SVG File Selected</p>
                <p className="text-xs text-purple-600">Animations preserved</p>
              </div>
            </div>
          ) : (
            <img
              src={previewUrl || currentImage}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
          {onImageRemove && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => {
                onImageRemove();
                setPreviewUrl(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <Card
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              <Image className="h-8 w-8 text-gray-400" />
              <FileImage className="h-8 w-8 text-purple-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload Image or SVG
              </h3>
              <p className="text-gray-600 mb-2">
                Drag and drop your file here, or click to select
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: {getSupportedFormats()}
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-blue-800 mb-1">✨ SVG Features</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Animated SVGs fully supported</li>
                  <li>• Scalable vector graphics</li>
                  <li>• Perfect for logos and icons</li>
                </ul>
              </div>
            </div>
            
            <Button type="button" variant="outline" className="pointer-events-none">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
          />
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
