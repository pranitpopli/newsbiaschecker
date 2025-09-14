import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ChevronDown, Home, Star, Search, User, ThumbsUp, ThumbsDown } from "lucide-react";
import { FeedbackDialog } from "./FeedbackDialog";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [showSources, setShowSources] = useState(false);
  const [showSourcesDropdown, setShowSourcesDropdown] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'up' | 'down' | null>(null);
  const isMobile = useIsMobile();

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    setFeedbackType(type);
    setShowFeedbackDialog(true);
  };

  // Preserve original summary format - only format if it's plain paragraph text
  const formatSummaryContent = (text: string) => {
    if (!text) return [];
    
    const lines = text.split('\n').filter(line => line.trim());
    
    // Check if summary already has structured formatting (bullets, dashes, or headers)
    const hasStructuredFormat = lines.some(line => 
      line.trim().startsWith('•') || 
      line.trim().startsWith('-') || 
      line.includes(':') ||
      /^\d+\./.test(line.trim()) // numbered lists
    );
    
    // If already structured, return as is, otherwise format as paragraphs
    if (hasStructuredFormat) {
      return lines.map(line => line.trim());
    } else {
      // For plain paragraphs, split by sentences or keep as paragraphs
      return lines;
    }
  };

  const formattedSummary = formatSummaryContent(summary || "");

  return (
    <>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="relative w-full max-w-sm mx-auto">
          {/* Phone Frame - Responsive */}
          <div className={`${isMobile ? 'w-full h-screen' : 'w-[375px] h-[667px] rounded-[40px] p-2 shadow-2xl'} bg-muted-foreground`}>
            {/* Screen */}
            <div className={`w-full h-full bg-background ${isMobile ? 'rounded-none' : 'rounded-[32px]'} overflow-hidden relative`}>
              {/* Status Bar */}
              <div className="h-11 bg-background flex items-center justify-between px-4 sm:px-6 text-sm font-semibold pt-2">
                <span className="text-foreground">19:39</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-primary">📶</span>
                  <div className="w-6 h-3 border border-foreground rounded-sm">
                    <div className="w-full h-full bg-primary rounded-sm"></div>
                  </div>
                </div>
              </div>

              {/* App Header */}
              <div className="bg-background px-3 sm:px-4 py-3 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3 flex-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClose}
                    className="h-8 w-8 p-0 text-foreground hover:bg-primary/10"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="text-center flex-1">
                    <div className="text-lg font-semibold text-foreground">Nyheter</div>
                    <div className="flex justify-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-muted rounded-full"></div>
                      <div className="w-2 h-2 bg-muted rounded-full"></div>
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="w-2 h-2 bg-muted rounded-full"></div>
                      <div className="w-2 h-2 bg-muted rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <ScrollArea className={`${isMobile ? 'h-[calc(100vh-140px)]' : 'h-[520px]'}`}>
                <div className="p-3 sm:p-4">
                  {/* Article Title */}
                  <h1 className="text-lg sm:text-xl font-bold text-foreground mb-4 leading-tight">
                    Project for Downtown Core
                  </h1>

                  {/* Summary Content - Preserve Original Format */}
                  <div className="space-y-3 mb-6">
                    {formattedSummary.map((line, index) => (
                      <div key={index} className="text-foreground leading-relaxed text-sm sm:text-base">
                        {line.includes(':') && !line.startsWith('•') && !line.startsWith('-') ? (
                          <div className="font-semibold text-primary mb-2">{line}</div>
                        ) : line.startsWith('•') || line.startsWith('-') ? (
                          <div className="ml-2">{line}</div>
                        ) : (
                          <div className="mb-3">{line}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Disclosure Section */}
                  {includeDisclosure && (
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
                      <p className="text-xs text-foreground leading-relaxed mb-2">
                        {humanReviewDescription || "All content in the fact box is based on Omni's articles and automatically summarized with the support of AI tools from OpenAI. Omni's editorial team has quality assured the content."}
                      </p>
                      <Button 
                        variant="link" 
                        className="text-xs text-primary p-0 h-auto font-normal underline hover:no-underline"
                      >
                        Learn More about our AI Policy and Substantial Impact.
                      </Button>
                    </div>
                  )}

                  {/* Sources Section */}
                  {includeDisclosure && showSources && (
                    <div className="mb-6">
                      <Button
                        variant="ghost"
                        onClick={() => setShowSourcesDropdown(!showSourcesDropdown)}
                        className="flex items-center gap-2 text-foreground font-medium p-0 h-auto hover:bg-transparent"
                      >
                        <span className="text-sm">Sources</span>
                        <ChevronDown className={`h-3 w-3 transition-transform ${showSourcesDropdown ? 'rotate-180' : ''}`} />
                      </Button>
                      
                      {showSourcesDropdown && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                          <p className="text-xs text-foreground leading-relaxed">
                            Source information and references would appear here.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback Buttons */}
                  <div className="flex gap-3 mb-6">
                    <Button
                      variant={feedback === 'up' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFeedback('up')}
                      className={`flex items-center gap-2 ${
                        feedback === 'up' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-foreground border-border hover:bg-primary/10'
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-xs">Helpful</span>
                    </Button>
                    <Button
                      variant={feedback === 'down' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFeedback('down')}
                      className={`flex items-center gap-2 ${
                        feedback === 'down' 
                          ? 'bg-destructive text-destructive-foreground' 
                          : 'text-foreground border-border hover:bg-destructive/10'
                      }`}
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span className="text-xs">Not helpful</span>
                    </Button>
                  </div>
                </div>
              </ScrollArea>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border">
                <div className="flex justify-around py-2">
                  <Button variant="ghost" className="flex flex-col items-center gap-1 p-2 hover:bg-transparent">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Home className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-xs text-primary font-medium">Nyheter</span>
                  </Button>
                  
                  <Button variant="ghost" className="flex flex-col items-center gap-1 p-2 hover:bg-transparent">
                    <Star className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Bevakningar</span>
                  </Button>
                  
                  <Button variant="ghost" className="flex flex-col items-center gap-1 p-2 hover:bg-transparent">
                    <Search className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upptäck</span>
                  </Button>
                  
                  <Button variant="ghost" className="flex flex-col items-center gap-1 p-2 hover:bg-transparent">
                    <User className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Mitt konto</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <FeedbackDialog 
        isOpen={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        feedbackType={feedbackType}
      />
    </>
  );
};