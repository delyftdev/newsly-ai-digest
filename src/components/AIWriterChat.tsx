
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  X, 
  Loader2,
  Paperclip
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: File[];
}

interface AIWriterChatProps {
  onContentGenerated: (content: string) => void;
  onInsertContent: (content: string) => void;
}

const AIWriterChat = ({ onContentGenerated, onInsertContent }: AIWriterChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const supportedFiles = files.filter(file => 
      file.type.includes('image') || 
      file.type.includes('pdf') || 
      file.type.includes('document') ||
      file.type.includes('text') ||
      file.name.endsWith('.docx') ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md')
    );
    
    if (supportedFiles.length !== files.length) {
      toast({
        title: "Some files not supported",
        description: "Only images, PDFs, Word docs, and text files are supported.",
        variant: "destructive",
      });
    }
    
    setUploadedFiles(prev => [...prev, ...supportedFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    const currentFiles = [...uploadedFiles];
    setUploadedFiles([]);
    setIsLoading(true);
    setIsStreaming(true);

    try {
      // Create FormData for multimodal input
      const formData = new FormData();
      formData.append('message', inputValue);
      formData.append('conversationHistory', JSON.stringify(messages));
      
      currentFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const { data, error } = await supabase.functions.invoke('claude-ai-writer', {
        body: formData,
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-insert content if it looks like generated content
      if (data.shouldInsert && data.content) {
        onInsertContent(data.content);
      }

    } catch (error: any) {
      console.error('AI Writer error:', error);
      toast({
        title: "AI Writer Error",
        description: error.message || "Failed to process your request",
        variant: "destructive",
      });
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatFileIcon = (file: File) => {
    if (file.type.includes('image')) return <ImageIcon className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="flex flex-col h-full bg-background border-l">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">AI Writer</h3>
        <p className="text-sm text-muted-foreground">
          Chat with Claude to generate and refine your content
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <div className="space-y-2">
                <p className="text-lg font-medium">Welcome to AI Writer!</p>
                <p className="text-sm">Try these prompts:</p>
                <div className="space-y-1 text-xs">
                  <p>• "Create a changelog from this document"</p>
                  <p>• "Make this content more customer-friendly"</p>
                  <p>• "Generate a newsletter highlighting key features"</p>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-4' 
                  : 'bg-muted mr-4'
              }`}>
                {message.files && message.files.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {message.files.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs opacity-75">
                        {formatFileIcon(file)}
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                <div className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isStreaming && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 mr-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Claude is writing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* File Upload Area */}
      {uploadedFiles.length > 0 && (
        <div className="p-4 border-t border-b bg-muted/50">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Attached Files:</p>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <div className="flex items-center space-x-1">
                    {formatFileIcon(file)}
                    <span className="max-w-[100px] truncate">{file.name}</span>
                    <button onClick={() => removeFile(index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Claude to help with your content..."
              className="w-full p-3 pr-12 border border-input bg-background rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[60px] max-h-[120px]"
              rows={2}
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || (!inputValue.trim() && uploadedFiles.length === 0)}
            size="lg"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.md,image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default AIWriterChat;
