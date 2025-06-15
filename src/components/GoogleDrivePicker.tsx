
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { googleDriveService, GoogleDriveFile } from "@/services/googleDriveService";
import { toast } from "@/components/ui/use-toast";

interface GoogleDrivePickerProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

const GoogleDrivePicker = ({ onFileSelected, disabled = false }: GoogleDrivePickerProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleDriveClick = async () => {
    setIsLoading(true);
    
    try {
      console.log('Starting Google Drive file selection...');
      const selectedFile = await googleDriveService.openFilePicker();
      
      if (selectedFile) {
        console.log('File selected from Google Drive:', selectedFile.name);
        
        // Download the file content
        const blob = await googleDriveService.downloadFile(selectedFile.id);
        
        if (blob) {
          // Convert blob to File object
          const file = new File([blob], selectedFile.name, {
            type: selectedFile.mimeType
          });
          
          onFileSelected(file);
          
          toast({
            title: "File imported from Google Drive",
            description: `${selectedFile.name} has been imported successfully.`,
          });
        } else {
          throw new Error('Failed to download file content');
        }
      }
    } catch (error: any) {
      console.error('Google Drive integration error:', error);
      
      let errorMessage = "Failed to import file from Google Drive. Please try again.";
      
      if (error.message?.includes('credentials not configured')) {
        errorMessage = "Google Drive is not configured. Please contact support to set up Google Drive integration.";
      } else if (error.message?.includes('popup_blocked_by_browser')) {
        errorMessage = "Popup was blocked. Please allow popups for this site and try again.";
      } else if (error.message?.includes('User not authenticated')) {
        errorMessage = "Please sign in to use Google Drive integration.";
      }
      
      toast({
        title: "Google Drive Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      onClick={handleGoogleDriveClick}
      disabled={disabled || isLoading}
    >
      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
        <path fill="currentColor" d="M6.28 11L8.85 6.5H15.15L17.72 11M12 13.5L9.43 18H14.57L12 13.5M12 6.5L9.43 11H14.57L12 6.5Z"/>
      </svg>
      {isLoading ? 'Connecting...' : 'Google Drive'}
    </Button>
  );
};

export default GoogleDrivePicker;
