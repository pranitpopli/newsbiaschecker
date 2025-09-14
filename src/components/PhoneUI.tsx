import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ThumbsUp, ThumbsDown, ArrowLeft, ChevronDown, Home, Star, Search, User } from "lucide-react";

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

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
  };

  // Convert summary to bullet points if it's not already formatted
  const formatSummaryAsBullets = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, index) => {
      // If line already starts with bullet or dash, keep as is
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return line.trim();
      }
      // If line contains a colon (like "Key features:"), treat as header
      if (line.includes(':')) {
        return line.trim();
      }
      // Otherwise, add bullet point
      return `• ${line.trim()}`;
    });
  };

  const formattedSummary = formatSummaryAsBullets(summary || "");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-[375px] h-[667px] bg-gray-900 rounded-[40px] p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
            {/* Status Bar */}
            <div className="h-11 bg-white flex items-center justify-between px-6 text-sm font-semibold pt-2">
              <span>19:39</span>
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
                <span className="text-black">📶</span>
                <span className="text-black">📶</span>
                <div className="w-6 h-3 border border-black rounded-sm">
                  <div className="w-full h-full bg-black rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* App Header */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="text-center flex-1">
                  <div className="text-lg font-semibold text-black">Nyheter</div>
                  <div className="flex justify-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-gray-600"
              >
                <div className="text-lg">🛍️</div>
              </Button>
            </div>

            {/* Content Area */}
            <ScrollArea className="h-[520px]">
              <div className="p-4">
                {/* Article Title */}
                <h1 className="text-xl font-bold text-black mb-4 leading-tight">
                  Project for Downtown Core
                </h1>

                {/* Summary Content as Bullets */}
                <div className="space-y-3 mb-6">
                  {formattedSummary.map((line, index) => (
                    <div key={index} className="text-gray-800 leading-relaxed">
                      {line.includes(':') && !line.startsWith('•') ? (
                        <div className="font-medium">{line}</div>
                      ) : (
                        <div className="ml-0">{line}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sources Section */}
                <div className="mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => setShowSources(!showSources)}
                    className="flex items-center gap-2 text-black font-medium p-0 h-auto hover:bg-transparent"
                  >
                    <span>Sources</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showSources ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {showSources && includeDisclosure && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 leading-relaxed mb-2">
                        {humanReviewDescription || "All content in the fact box is based on Omni's articles and automatically summarized with the support of AI tools from OpenAI. Omni's editorial team has quality assured the content."}
                      </p>
                      <Button 
                        variant="link" 
                        className="text-sm text-blue-600 p-0 h-auto font-normal underline"
                      >
                        Learn More about our AI Policy and Substantial Impact.
                      </Button>
                    </div>
                  )}
                </div>

                {/* Feedback Buttons */}
                <div className="flex gap-4 mb-6">
                  <Button
                    variant={feedback === 'up' ? 'default' : 'ghost'}
                    onClick={() => handleFeedback('up')}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <ThumbsUp className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={feedback === 'down' ? 'default' : 'ghost'}
                    onClick={() => handleFeedback('down')}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <ThumbsDown className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </ScrollArea>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
              <div className="flex justify-around py-2">
                <Button variant="ghost" className="flex flex-col items-center gap-1 p-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Home className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-green-500 font-medium">Nyheter</span>
                </Button>
                
                <Button variant="ghost" className="flex flex-col items-center gap-1 p-2">
                  <Star className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-400">Bevakningar</span>
                </Button>
                
                <Button variant="ghost" className="flex flex-col items-center gap-1 p-2">
                  <Search className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-400">Upptäck</span>
                </Button>
                
                <Button variant="ghost" className="flex flex-col items-center gap-1 p-2">
                  <User className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-400">Mitt konto</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};