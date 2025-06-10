
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered, 
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [selectedText, setSelectedText] = useState("");

  const formatCommands = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: Link, command: 'createLink', title: 'Link' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', title: 'Quote', value: 'blockquote' },
    { icon: Code, command: 'formatBlock', title: 'Code Block', value: 'pre' },
    { icon: Heading1, command: 'formatBlock', title: 'Heading 1', value: 'h1' },
    { icon: Heading2, command: 'formatBlock', title: 'Heading 2', value: 'h2' },
    { icon: Heading3, command: 'formatBlock', title: 'Heading 3', value: 'h3' },
  ];

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="border border-gray-300 rounded-md">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 border-b border-gray-200 bg-gray-50">
        {formatCommands.map((cmd, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand(cmd.command, cmd.value)}
            title={cmd.title}
            className="h-8 w-8 p-0"
          >
            <cmd.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Editor */}
      <div
        contentEditable
        className="min-h-[300px] p-4 focus:outline-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onSelect={() => {
          const selection = window.getSelection();
          setSelectedText(selection?.toString() || "");
        }}
        style={{ whiteSpace: 'pre-wrap' }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
