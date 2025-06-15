
import { supabase } from "@/integrations/supabase/client";

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
}

class GoogleDriveService {
  private gapi: any = null;
  private isInitialized = false;
  private clientId = '';
  private apiKey = '';

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Get Google credentials from Supabase secrets
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Load Google API script
      await this.loadGoogleApi();
      
      // Initialize with placeholder values - in production, these would come from Supabase secrets
      this.clientId = 'your-google-client-id';
      this.apiKey = 'your-google-api-key';

      await this.gapi.load('auth2:picker:client', this.initializeGapi.bind(this));
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Drive service:', error);
      throw error;
    }
  }

  private loadGoogleApi(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        this.gapi = window.gapi;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        this.gapi = window.gapi;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private async initializeGapi() {
    await this.gapi.client.init({
      apiKey: this.apiKey,
      clientId: this.clientId,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      scope: 'https://www.googleapis.com/auth/drive.readonly'
    });
  }

  async authenticate(): Promise<boolean> {
    try {
      await this.initialize();
      
      const authInstance = this.gapi.auth2.getAuthInstance();
      const isSignedIn = authInstance.isSignedIn.get();
      
      if (!isSignedIn) {
        await authInstance.signIn();
      }
      
      return authInstance.isSignedIn.get();
    } catch (error) {
      console.error('Google Drive authentication failed:', error);
      return false;
    }
  }

  async openFilePicker(): Promise<GoogleDriveFile | null> {
    try {
      const isAuthenticated = await this.authenticate();
      if (!isAuthenticated) {
        throw new Error('Google Drive authentication failed');
      }

      return new Promise((resolve) => {
        const picker = new window.google.picker.PickerBuilder()
          .addView(window.google.picker.ViewId.DOCS)
          .addView(window.google.picker.ViewId.PRESENTATIONS)
          .addView(window.google.picker.ViewId.SPREADSHEETS)
          .addView(window.google.picker.ViewId.PDFS)
          .setOAuthToken(this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token)
          .setDeveloperKey(this.apiKey)
          .setCallback((data: any) => {
            if (data.action === window.google.picker.Action.PICKED) {
              const file = data.docs[0];
              resolve({
                id: file.id,
                name: file.name,
                mimeType: file.mimeType,
                size: file.sizeBytes,
                webViewLink: file.url
              });
            } else {
              resolve(null);
            }
          })
          .build();
        
        picker.setVisible(true);
      });
    } catch (error) {
      console.error('Failed to open Google Drive picker:', error);
      return null;
    }
  }

  async downloadFile(fileId: string): Promise<Blob | null> {
    try {
      const response = await this.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
      });
      
      // Convert response to blob
      const blob = new Blob([response.body], { type: 'application/octet-stream' });
      return blob;
    } catch (error) {
      console.error('Failed to download file from Google Drive:', error);
      return null;
    }
  }
}

export const googleDriveService = new GoogleDriveService();
export type { GoogleDriveFile };
