
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ExternalLink, Mail, Calendar, Lightbulb } from "lucide-react";
import { Email } from "@/stores/emailStore";

interface EmailCardProps {
  email: Email;
}

const EmailCard = ({ email }: EmailCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Product Updates': 'bg-blue-100 text-blue-800',
      'Feature Releases': 'bg-green-100 text-green-800',
      'News & Announcements': 'bg-purple-100 text-purple-800',
      'Marketing Content': 'bg-orange-100 text-orange-800',
      'Technical Updates': 'bg-red-100 text-red-800',
      'Company News': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">{email.sender}</span>
              <Badge className={`text-xs ${getCategoryColor(email.category)}`}>
                {email.category}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-tight mb-2">{email.subject}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {formatDate(email.receivedAt)}
            </div>
          </div>
          
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
        
        <CardDescription className="text-base leading-relaxed">
          {email.aiSummary}
        </CardDescription>
      </CardHeader>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            {/* Key Insights */}
            {email.keyInsights.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <h4 className="font-semibold text-gray-900">Key Insights</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {email.keyInsights.map((insight, index) => (
                    <Badge key={index} variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                      {insight}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {email.links.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Important Links
                </h4>
                <div className="space-y-2">
                  {email.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{link.linkText}</span>
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-xs text-gray-500 truncate block mt-1">{link.url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {email.images.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Images</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {email.images.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.imageUrl}
                        alt={image.altText}
                        className="w-full h-48 object-cover rounded-lg"
                        loading="lazy"
                      />
                      {image.altText && (
                        <p className="text-xs text-gray-600 mt-2">{image.altText}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Content */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Full Content</h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {email.content}
                </p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default EmailCard;
