import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ThumbsUp, ThumbsDown, Smartphone } from "lucide-react";

interface PhoneUIProps {
  summary: string;
  includeDisclosure: boolean;
  humanReviewDescription?: string;
  onClose: () => void;
}

export const PhoneUI = ({ 
  summary, 
  includeDisclosure, 
  humanReviewDescription,
  onClose 
}: PhoneUIProps) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-[375px] h-[667px] bg-gray-900 rounded-[40px] p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
            {/* Status Bar */}
            <div className="h-6 bg-gray-50 flex items-center justify-between px-6 text-xs font-medium">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <span>100%</span>
                <div className="w-6 h-3 border border-gray-300 rounded-sm">
                  <div className="w-full h-full bg-green-500 rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* App Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                <span className="font-semibold text-sm">News App</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content Area */}
            <ScrollArea className="h-[580px]">
              <div className="p-4 space-y-4">
                {/* Summary Card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        AI Summary
                      </Badge>
                      <span className="text-xs text-muted-foreground">Just now</span>
                    </div>
                    
                    <div className="text-sm leading-relaxed whitespace-pre-wrap mb-4">
                      {summary || "No summary generated yet"}
                    </div>

                    {/* Feedback Section */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">Was this helpful?</span>
                      <div className="flex gap-2">
                        <Button
                          variant={feedback === 'up' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleFeedback('up')}
                          className="h-7 w-7 p-0"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant={feedback === 'down' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleFeedback('down')}
                          className="h-7 w-7 p-0"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Disclosure Card */}
                {includeDisclosure && (
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Disclosure
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {humanReviewDescription || "This content was generated with AI assistance and reviewed by our editorial team."}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};