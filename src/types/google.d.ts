
declare global {
  interface Window {
    gapi: any;
    google: {
      picker: {
        PickerBuilder: any;
        ViewId: {
          DOCS: string;
          PRESENTATIONS: string;
          SPREADSHEETS: string;
          PDFS: string;
        };
        Action: {
          PICKED: string;
        };
      };
    };
  }
}

export {};
