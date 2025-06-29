
import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Video, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface EnhancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => void;
}

const EnhancedRichTextEditor = ({
  value,
  onChange,
  placeholder,
  onImageUpload
}: EnhancedRichTextEditorProps) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const embedVideo = () => {
    if (!videoUrl) return;

    let embedHtml = '';
    
    // YouTube
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.includes('youtu.be') 
        ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
        : videoUrl.split('v=')[1]?.split('&')[0];
      
      if (videoId) {
        embedHtml = `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
          <iframe src="https://www.youtube.com/embed/${videoId}" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                  frameborder="0" allowfullscreen></iframe>
        </div>`;
      }
    }
    // Vimeo
    else if (videoUrl.includes('vimeo.com')) {
      const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        embedHtml = `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
          <iframe src="https://player.vimeo.com/video/${videoId}" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                  frameborder="0" allowfullscreen></iframe>
        </div>`;
      }
    }
    // Generic video URL
    else {
      embedHtml = `<video controls style="width: 100%; max-width: 100%;">
        <source src="${videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>`;
    }

    if (embedHtml) {
      onChange(value + '<br>' + embedHtml + '<br>');
      setVideoUrl('');
      setShowVideoDialog(false);
    }
  };

  const handleImageUpload = (file: File) => {
    if (onImageUpload) {
      onImageUpload(file);
    }
    
    // Create a temporary URL for immediate display
    const imageUrl = URL.createObjectURL(file);
    const imageHtml = `<img src="${imageUrl}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
    onChange(value + '<br>' + imageHtml + '<br>');
    setShowImageDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 border-b pb-2">
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <ImageIcon className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
            </DialogHeader>
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage=""
              onImageRemove={() => {}}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Embed Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Video URL</label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Enter YouTube, Vimeo, or direct video URL"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowVideoDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={embedVideo}>Embed Video</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <RichTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default EnhancedRichTextEditor;
