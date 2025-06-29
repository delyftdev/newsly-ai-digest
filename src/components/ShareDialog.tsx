
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareUrl: string;
  type: "changelog" | "feedback";
}

const ShareDialog = ({ isOpen, onClose, title, shareUrl, type }: ShareDialogProps) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const { toast } = useToast();

  const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" style="border: 1px solid #e5e7eb; border-radius: 8px;"></iframe>`;

  const copyToClipboard = async (text: string, type: 'link' | 'embed') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2000);
      }
      toast({
        title: "Copied!",
        description: `${type === 'link' ? 'Share link' : 'Embed code'} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const openInNewTab = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share {type === 'changelog' ? 'Changelog' : 'Feedback'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Sharing: {title}</h4>
          </div>

          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link">Share Link</TabsTrigger>
              <TabsTrigger value="embed">Embed Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="share-url">Public Share URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="share-url"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(shareUrl, 'link')}
                    className="flex-shrink-0"
                  >
                    {copiedLink ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={openInNewTab}
                    className="flex-shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This link can be shared with anyone and doesn't require authentication.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="embed" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="embed-code">HTML Embed Code</Label>
                <div className="space-y-2">
                  <Textarea
                    id="embed-code"
                    value={embedCode}
                    readOnly
                    className="font-mono text-sm resize-none"
                    rows={4}
                  />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(embedCode, 'embed')}
                    className="w-full"
                  >
                    {copiedEmbed ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Embed Code
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Copy and paste this code into your website or application to embed the {type}.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
