
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
      console.log('Initializing Google Drive service...');
      
      // Get Google credentials from Supabase secrets
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get secrets from Supabase
      const { data: secrets, error: secretsError } = await supabase.functions.invoke('get-secrets', {
        body: { keys: ['GOOGLE_CLIENT_ID', 'GOOGLE_API_KEY'] }
      });

      if (secretsError) {
        console.error('Failed to get Google credentials from Supabase:', secretsError);
        throw new Error('Google credentials not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_API_KEY to Supabase secrets.');
      }

      this.clientId = secrets.GOOGLE_CLIENT_ID;
      this.apiKey = secrets.GOOGLE_API_KEY;

      if (!this.clientId || !this.apiKey) {
        throw new Error('Google credentials not found in Supabase secrets. Please add GOOGLE_CLIENT_ID and GOOGLE_API_KEY.');
      }

      // Load Google API script
      await this.loadGoogleApi();
      
      // Initialize Google API
      await this.initializeGapi();
      
      this.isInitialized = true;
      console.log('Google Drive service initialized successfully');
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
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }

  private initializeGapi(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.gapi.load('auth2:picker:client', () => {
        this.gapi.client.init({
          apiKey: this.apiKey,
          clientId: this.clientId,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          scope: 'https://www.googleapis.com/auth/drive.readonly'
        }).then(() => {
          resolve();
        }).catch((error: any) => {
          console.error('Failed to initialize Google client:', error);
          reject(error);
        });
      });
    });
  }

  async authenticate(): Promise<boolean> {
    try {
      await this.initialize();
      
      const authInstance = this.gapi.auth2.getAuthInstance();
      if (!authInstance) {
        throw new Error('Google auth instance not available');
      }
      
      const isSignedIn = authInstance.isSignedIn.get();
      
      if (!isSignedIn) {
        console.log('Starting Google sign-in...');
        const user = await authInstance.signIn();
        console.log('Google sign-in successful:', user.isSignedIn());
        return user.isSignedIn();
      }
      
      return true;
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

      // Load picker API
      await new Promise((resolve, reject) => {
        this.gapi.load('picker', () => {
          if (window.google && window.google.picker) {
            resolve(true);
          } else {
            reject(new Error('Google Picker API failed to load'));
          }
        });
      });

      return new Promise((resolve) => {
        const authToken = this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        
        const picker = new window.google.picker.PickerBuilder()
          .addView(window.google.picker.ViewId.DOCS)
          .addView(window.google.picker.ViewId.PRESENTATIONS)
          .addView(window.google.picker.ViewId.SPREADSHEETS)
          .addView(window.google.picker.ViewId.PDFS)
          .setOAuthToken(authToken)
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
