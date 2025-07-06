
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import ImageResize from 'tiptap-extension-resize-image';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Image as ImageIcon, Video, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ImageUpload from './ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import './TipTapEditor.css';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const TipTapEditor = ({ content, onChange, placeholder = "Start writing..." }: TipTapEditorProps) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      ImageResize.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-lg cursor-pointer editor-image',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 315,
        HTMLAttributes: {
          class: 'youtube-embed',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      console.log('Editor content updated:', html.substring(0, 100) + '...');
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'min-h-[400px] focus:outline-none p-4 prose prose-slate max-w-none text-foreground editor-content',
      },
    },
  });

  if (!editor) {
    return null;
  }

  // Enhanced image insertion with SVG support
  const addImage = (url: string, alt?: string) => {
    if (url) {
      console.log('Adding image to editor:', url);
      
      // Check if it's an SVG
      const isSVG = url.toLowerCase().includes('.svg') || url.includes('image/svg');
      
      if (isSVG) {
        // For SVG files, add special handling
        editor.chain().focus().setImage({ 
          src: url, 
          alt: alt || 'SVG Image',
          class: 'svg-image'
        }).run();
      } else {
        // Regular image insertion
        editor.chain().focus().setImage({ 
          src: url, 
          alt: alt || 'Image'
        }).run();
      }
    }
  };

  // Enhanced image upload with comprehensive format support
  const handleImageUpload = async (file: File) => {
    try {
      console.log('=== IMAGE UPLOAD STARTED ===');
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Validate file type - now including SVG
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
        'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Unsupported file type: ${file.type}. Supported types: ${allowedTypes.join(', ')}`);
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log('Generated filename:', fileName);

      // Special handling for SVG files
      if (file.type === 'image/svg+xml') {
        console.log('Processing SVG file');
        
        // Read SVG content to check for animations
        const svgText = await file.text();
        const isAnimated = svgText.includes('<animate') || 
                          svgText.includes('<animateTransform') || 
                          svgText.includes('animation');
        
        console.log('SVG is animated:', isAnimated);
        
        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from('changelog-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });

        if (error) {
          console.error('SVG upload error:', error);
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('changelog-images')
          .getPublicUrl(data.path);

        console.log('SVG uploaded successfully:', publicUrl);
        
        // Add SVG to editor with special class for styling
        addImage(publicUrl, `SVG Image${isAnimated ? ' (Animated)' : ''}`);
        
        toast({
          title: "SVG Added",
          description: `SVG image has been successfully uploaded${isAnimated ? ' with animations preserved' : ''}.`,
        });
        
      } else {
        // Regular image upload
        console.log('Processing regular image');
        
        const { data, error } = await supabase.storage
          .from('changelog-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Image upload error:', error);
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('changelog-images')
          .getPublicUrl(data.path);

        console.log('Image uploaded successfully:', publicUrl);
        
        addImage(publicUrl, file.name);
        
        toast({
          title: "Image Added",
          description: "Image has been successfully uploaded and added to your changelog.",
        });
      }

      setShowImageDialog(false);
      console.log('=== IMAGE UPLOAD COMPLETE ===');
      
    } catch (error) {
      console.error('=== IMAGE UPLOAD FAILED ===');
      console.error('Upload error details:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addVideo = () => {
    if (videoUrl) {
      console.log('Adding video:', videoUrl);
      editor.commands.setYoutubeVideo({
        src: videoUrl,
      });
      setVideoUrl('');
      setShowVideoDialog(false);
      toast({
        title: "Video Added",
        description: "Video has been embedded in your changelog.",
      });
    }
  };

  const addLink = () => {
    if (linkUrl) {
      console.log('Adding link:', linkUrl, linkText);
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
      toast({
        title: "Link Added",
        description: "Link has been added to your changelog.",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="border rounded-lg p-3 bg-muted/30">
        <div className="flex items-center space-x-1 flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-accent' : ''}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-accent' : ''}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-accent' : ''}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-accent' : ''}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-2" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageDialog(true)}
            title="Add Image (includes SVG support)"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVideoDialog(true)}
            title="Add Video"
          >
            <Video className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkDialog(true)}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent editor={editor} />
        {editor.isEmpty && (
          <div className="absolute top-6 left-6 text-muted-foreground/50 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image (JPG, PNG, GIF, WebP, SVG)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload images including animated SVGs. All formats are supported with full animation preservation.
            </p>
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage=""
              onImageRemove={() => {}}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube video URL"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowVideoDialog(false)}>
                Cancel
              </Button>
              <Button onClick={addVideo}>Add Video</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
            />
            <Input
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text (optional)"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                Cancel
              </Button>
              <Button onClick={addLink}>Add Link</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TipTapEditor;
