import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "./Navigation";
import { AIPlayground } from "./AIPlayground";
import { EditorialCompliance } from "./EditorialCompliance";
import { SummaryView } from "./SummaryView";
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
  byline: string;
  textDescription: string;
  altText: string;
  articleTitle: string;
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
    humanReviewDescription: "All content in the fact box is based on Omni's articles and automatically summarized with the support of AI tools from OpenAI. Omni's editorial team has quality assured the content.",
    byline: "",
    textDescription: "",
    altText: "",
    articleTitle: '"Greenhaven" Urban Renewal Project for Downtown'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<AIConfidence | null>(null);
  const [complianceIssues, setComplianceIssues] = useState<ComplianceIssue[]>([]);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'plan' | 'generate' | 'review' | 'revise'>('plan');
  const {
    toast
  } = useToast();
  const generateSummary = async () => {
    setIsGenerating(true);
    setCurrentStep('generate');
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
      setFormData(prev => ({
        ...prev,
        aiSummary: generatedSummary
      }));
      setAiConfidence({
        level: 'medium',
        percentage: 68,
        status: 'review',
        color: 'bg-orange-100 text-orange-800'
      });
      setComplianceIssues([{
        type: 'bias',
        severity: 'medium',
        text: 'Potential displacement of existing',
        evidence: 'Language may be unnecessarily negative',
        sourceQuote: 'However, preliminary assessments also highlight potential concerns regarding...',
        startIndex: 280,
        endIndex: 312
      }, {
        type: 'tone_shift',
        severity: 'low',
        text: 'Traffic disruptions expected',
        evidence: 'More neutral phrasing available',
        sourceQuote: 'expected traffic disruptions during the multi-year construction period.',
        startIndex: 335,
        endIndex: 361
      }]);
      setCurrentStep('review');
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
  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your changes have been saved successfully"
    });
  };
  const handleAcceptSuggestion = (issue: ComplianceIssue) => {
    // Apply the suggestion to the draft
    setCurrentStep('revise');
    toast({
      title: "Suggestion Applied",
      description: "The content has been updated based on the suggestion"
    });
  };
  const handleRejectSuggestion = (issue: ComplianceIssue) => {
    // Remove the issue from the list
    setComplianceIssues(prev => prev.filter(i => !(i.startIndex === issue.startIndex && i.endIndex === issue.endIndex)));
  };
  const handleModifySuggestion = (issue: ComplianceIssue) => {
    // Open modification dialog or inline editor
    console.log('Modifying suggestion:', issue);
  };
  return <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation onAIToggle={() => setIsPlaygroundOpen(!isPlaygroundOpen)} onSaveDraft={handleSaveDraft} isAIOpen={isPlaygroundOpen} />
        
        <div className="flex flex-1 relative">
          {/* Main Content */}
          <div className={`flex-1 overflow-auto transition-all duration-300 ${isPlaygroundOpen ? 'mr-[400px]' : ''}`}>
            <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
              {/* Article Content */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className={`grid grid-cols-1 ${!isPlaygroundOpen ? 'lg:grid-cols-2' : ''} gap-8`}>
                    {/* Left Column - Image and Metadata */}
                    <div className="space-y-4">
                      {/* Image and Metadata Side by Side */}
                      <div className="flex gap-4">
                        {/* Image Placeholder - Smaller */}
                        <div className="w-48 h-32 bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center flex-shrink-0">
                          <div className="text-center text-muted-foreground">
                            <div className="text-xs font-medium mb-1">Article Image</div>
                            <div className="text-xs">Upload or drag image here</div>
                          </div>
                        </div>
                        
                        {/* Compact Metadata - next to image */}
                        <div className="flex-1 space-y-2">
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Byline</Label>
                            <div className="p-2 border rounded text-xs text-muted-foreground bg-muted/30">
                              {formData.byline || "No byline"}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                            <div className="p-2 border rounded text-xs text-muted-foreground bg-muted/30 max-h-12 overflow-y-auto">
                              {formData.textDescription || "No description"}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Alt text</Label>
                            <div className="p-2 border rounded text-xs text-muted-foreground bg-muted/30">
                              {formData.altText || "No alt text"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Article Title and Content */}
                    <div className="space-y-6">
                      {/* Article Title - Display Only */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Article Title</Label>
                        <div className="p-3 border rounded-md bg-muted/50 text-lg font-semibold text-foreground">
                          {formData.articleTitle}
                        </div>
                      </div>
                      
                      {/* Article Content - Display Only */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Article Content</Label>
                        <div className="p-4 border rounded-md bg-muted/50 text-sm text-foreground min-h-[400px] whitespace-pre-wrap">
                          {formData.originalArticle}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Playground - Right Panel */}
          {isPlaygroundOpen && (
            <div className="absolute top-0 right-0 bottom-0 w-[400px] border-l border-border bg-background flex flex-col">
              <AIPlayground 
                formData={formData} 
                setFormData={setFormData} 
                aiConfidence={aiConfidence} 
                currentStep={currentStep} 
                setCurrentStep={setCurrentStep} 
                onGenerate={generateSummary} 
                isGenerating={isGenerating} 
                onClose={() => setIsPlaygroundOpen(false)} 
                complianceIssues={complianceIssues} 
                onAcceptSuggestion={handleAcceptSuggestion} 
                onRejectSuggestion={handleRejectSuggestion} 
                onModifySuggestion={handleModifySuggestion} 
              />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>;
};