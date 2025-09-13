import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChevronDown, CheckCircle, Calendar, Clock, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "./Navigation";
import { AIPlayground } from "./AIPlayground";

interface FormData {
  originalArticle: string;
  aiSummary: string;
  type: string;
  daysBack: string;
  length: string;
  title: string;
  text: string;
  autoDisclosure: boolean;
  includeDisclosure: boolean;
  aiModelUsed: string;
  humanReviewDescription: string;
}

interface ComplianceIssue {
  type: 'policy_violation' | 'factual_deviation' | 'bias' | 'tone_shift';
  severity: 'low' | 'medium' | 'high';
  text: string;
  evidence: string;
  sourceQuote?: string;
  startIndex: number;
  endIndex: number;
}

interface AIConfidence {
  level: 'low' | 'medium' | 'high';
  percentage: number;
  status: 'safe' | 'review';
  color: string;
}

export const BiasChecker = () => {
  const [formData, setFormData] = useState<FormData>({
    originalArticle: `The City Council today unveiled an ambitious new urban renewal project, dubbed "Greenhaven," set to transform the downtown core over the next decade. Mayor Johnson hailed the initiative as a "landmark step towards a sustainable and vibrant future for our city."

The Greenhaven project includes several key features:
• Creation of 5 acres of new public park space.
• Development of three mixed-use buildings with affordable housing units.
• Establishment of pedestrian-only zones on Main Street.
• Upgrades to existing public transport hubs.

The project is projected to create over 500 new jobs during its construction phase and attract significant local investment. However, preliminary assessments also highlight potential concerns regarding the displacement of some long-standing local businesses and expected traffic disruptions during the multi-year construction period.`,
    aiSummary: "",
    type: "Bullet Points",
    daysBack: "100",
    length: "5 Points",
    title: "Kent would never be like Gessie – we forgive you",
    text: "100",
    autoDisclosure: true,
    includeDisclosure: true,
    aiModelUsed: "GPT-4",
    humanReviewDescription: "All content in the fact box is based on Omni's articles and automatically summarized with the support of AI tools from OpenAI. Omni's editorial team has quality assured the content."
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<AIConfidence | null>(null);
  const [complianceIssues, setComplianceIssues] = useState<ComplianceIssue[]>([]);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const { toast } = useToast();

  const onAIClick = () => setIsPlaygroundOpen(!isPlaygroundOpen);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedSummary = `City Council launches "Greenhaven" urban renewal plan to revitalize downtown over the next 10 years.

Key features:
• 5 acres of new public park space.
• 3 mixed-use buildings with affordable housing.
• Pedestrian-only zones introduced on Main Street.
• Upgrades to current public transport hubs.

Economic impact:
• Over 500 new construction jobs expected.
• Project anticipated to attract significant investment.
• Potential displacement of existing local businesses.
• Traffic disruptions expected during extended construction phase.`;

      setFormData(prev => ({ ...prev, aiSummary: generatedSummary }));
      
      setAiConfidence({
        level: 'medium',
        percentage: 68,
        status: 'review',
        color: 'bg-warning/20 text-warning'
      });
      
      setComplianceIssues([
        {
          type: 'bias',
          severity: 'medium',
          text: 'potential concerns',
          evidence: 'Language may be unnecessarily negative',
          sourceQuote: 'However, preliminary assessments also highlight potential concerns regarding...',
          startIndex: 520,
          endIndex: 538
        },
        {
          type: 'tone_shift',
          severity: 'low',
          text: 'expected traffic disruptions',
          evidence: 'More neutral phrasing available',
          sourceQuote: 'expected traffic disruptions during the multi-year construction period.',
          startIndex: 680,
          endIndex: 708
        }
      ]);

      toast({
        title: "Summary Generated",
        description: "AI has successfully generated the summary with disclosure"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate summary",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    toast({
      title: "Publishing...",
      description: formData.includeDisclosure ? "Publishing with disclosure included" : "Publishing without disclosure"
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex">
        {/* Navigation Sidebar */}
        <Navigation />

        {/* Main Content Area */}
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header with Title and Actions */}
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    "Greenhaven" Urban Renewal Project for Downtown Core
                  </h1>
                  
                  {/* Metadata Section */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Published yesterday</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Updated yesterday</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Author: Sarah Johnson</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    onClick={onAIClick}
                    className={cn(
                      "gap-2",
                      isPlaygroundOpen 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
                    )}
                  >
                    <Brain className="h-4 w-4" />
                    AI
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Publish
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border border-border">
                      <DropdownMenuItem onClick={handlePublish} className="cursor-pointer hover:bg-accent">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Publish {formData.includeDisclosure ? 'with Disclosure' : ''}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Article Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Article Content</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <div className="space-y-4 text-sm leading-relaxed">
                    <p>
                      The City Council today unveiled an ambitious new urban renewal project, dubbed "Greenhaven," 
                      set to transform the downtown core over the next decade. Mayor Johnson hailed the initiative 
                      as a "landmark step towards a sustainable and vibrant future for our city."
                    </p>
                    
                    <div>
                      <p className="font-medium mb-2">The Greenhaven project includes several key features:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Creation of 5 acres of new public park space.</li>
                        <li>Development of three mixed-use buildings with affordable housing units.</li>
                        <li>Establishment of pedestrian-only zones on Main Street.</li>
                        <li>Upgrades to existing public transport hubs.</li>
                      </ul>
                    </div>
                    
                    <p>
                      The project is projected to create over 500 new jobs during its construction phase and attract 
                      significant local investment. However, preliminary assessments also highlight potential concerns 
                      regarding the displacement of some long-standing local businesses and expected traffic 
                      disruptions during the multi-year construction period.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Playground Panel */}
          <AIPlayground
            isOpen={isPlaygroundOpen}
            onClose={() => setIsPlaygroundOpen(false)}
            formData={formData}
            setFormData={setFormData}
            aiConfidence={aiConfidence}
            complianceIssues={complianceIssues}
            isGenerating={isGenerating}
            onGenerate={generateSummary}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};