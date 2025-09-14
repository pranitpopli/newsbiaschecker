import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Settings, X, ExternalLink, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SummaryView } from "./SummaryView";
import { EditorialCompliance } from "./EditorialCompliance";

const SourceCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const sources = [
    {
      title: "City Council Official Press Release", 
      url: "citycouncil.gov/greenhaven-announcement",
      snippet: "Mayor Johnson announces the ambitious Greenhaven project to transform downtown..."
    },
    {
      title: "Urban Planning Department Report",
      url: "planning.gov/greenhaven-assessment", 
      snippet: "Preliminary assessment outlines 5 acres of new park space and mixed-use development..."
    },
    {
      title: "Economic Impact Study",
      url: "economics.org/greenhaven-jobs",
      snippet: "Study projects over 500 construction jobs and significant local investment..."
    }
  ];

  const nextSource = () => {
    setCurrentIndex((prev) => (prev + 1) % sources.length);
  };

  const prevSource = () => {
    setCurrentIndex((prev) => (prev - 1 + sources.length) % sources.length);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} of {sources.length}
        </span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevSource}>
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextSource}>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-md p-3 min-h-[100px]">
        <div className="text-xs font-medium mb-1 line-clamp-2">
          {sources[currentIndex].title}
        </div>
        <div className="text-xs text-muted-foreground mb-2 line-clamp-3">
          {sources[currentIndex].snippet}
        </div>
        <div className="text-xs text-primary truncate">
          {sources[currentIndex].url}
        </div>
      </div>
    </div>
  );
};
interface ComplianceIssue {
  type: 'policy_violation' | 'factual_deviation' | 'bias' | 'tone_shift';
  severity: 'low' | 'medium' | 'high';
  text: string;
  evidence: string;
  sourceQuote?: string;
  startIndex: number;
  endIndex: number;
}
interface AIPlaygroundProps {
  formData: any;
  setFormData: (data: any) => void;
  aiConfidence: any;
  currentStep: 'plan' | 'generate' | 'review' | 'revise';
  setCurrentStep: (step: 'plan' | 'generate' | 'review' | 'revise') => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onClose: () => void;
  complianceIssues?: ComplianceIssue[];
  onAcceptSuggestion?: (issue: ComplianceIssue) => void;
  onRejectSuggestion?: (issue: ComplianceIssue) => void;
  onModifySuggestion?: (issue: ComplianceIssue) => void;
}
export const AIPlayground = ({
  formData,
  setFormData,
  aiConfidence,
  currentStep,
  setCurrentStep,
  onGenerate,
  isGenerating,
  onClose,
  complianceIssues = [],
  onAcceptSuggestion,
  onRejectSuggestion,
  onModifySuggestion
}: AIPlaygroundProps) => {
  const aiImpactPercentage = aiConfidence?.percentage || 68;
  const getAIImpactLevel = (percentage: number) => {
    if (percentage >= 70) return 'high';
    if (percentage >= 40) return 'medium';
    return 'low';
  };
  return <>
      {/* Header */}
      <div className="border-b border-border px-6 py-4 bg-background">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold">AI Playground</h2>
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-end gap-1">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 whitespace-nowrap">
                AI Impact: {getAIImpactLevel(aiImpactPercentage)}
              </Badge>
              <Button variant="ghost" size="sm" className="text-primary text-xs h-auto p-1">
                Learn more <ExternalLink className="h-2.5 w-2.5 ml-1" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="px-6 py-3 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-6">
          <Tabs defaultValue="factbox" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="utils">Utils</TabsTrigger>
              <TabsTrigger value="factbox">Factbox</TabsTrigger>
            </TabsList>
            
            <TabsContent value="utils" className="space-y-6">
              <div className="text-center text-muted-foreground py-8">
                Utils content coming soon
              </div>
            </TabsContent>
            
            <TabsContent value="factbox" className="space-y-6">
              {/* Form Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Type*</Label>
                  <Select value={formData.type} onValueChange={value => setFormData(prev => ({
                  ...prev,
                  type: value
                }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bullet Points">Bullet Points</SelectItem>
                      <SelectItem value="Paragraph">Paragraph</SelectItem>
                      <SelectItem value="List">List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Days Back*</Label>
                  <Select value={formData.daysBack} onValueChange={value => setFormData(prev => ({
                  ...prev,
                  daysBack: value
                }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="180">180</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Length*</Label>
                  <Select value={formData.length} onValueChange={value => setFormData(prev => ({
                  ...prev,
                  length: value
                }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3 Points">3 Points</SelectItem>
                      <SelectItem value="5 Points">5 Points</SelectItem>
                      <SelectItem value="7 Points">7 Points</SelectItem>
                      <SelectItem value="10 Points">10 Points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Details</h3>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Title</Label>
                  <Input value={formData.title} onChange={e => setFormData(prev => ({
                  ...prev,
                  title: e.target.value
                }))} placeholder="Enter fact box title..." />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Text</Label>
                  <Input value={formData.text} onChange={e => setFormData(prev => ({
                  ...prev,
                  text: e.target.value
                }))} placeholder="Additional text..." />
                </div>
              </div>

              {/* Generated Summary */}
              {formData.aiSummary && <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Generated Summary</h3>
                  <SummaryView summary={formData.aiSummary} complianceIssues={complianceIssues} onAcceptSuggestion={onAcceptSuggestion} onRejectSuggestion={onRejectSuggestion} onModifySuggestion={onModifySuggestion} onSummaryChange={newSummary => setFormData(prev => ({
                ...prev,
                aiSummary: newSummary
              }))} editable={true} />
                </div>}

              {/* Editorial Compliance */}
              {formData.aiSummary && <div className="space-y-4">
                  <EditorialCompliance />
                </div>}

              {/* Disclosure Builder */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold">Disclosure Builder</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Auto Disclosure</Label>
                    <Switch checked={formData.autoDisclosure} onCheckedChange={checked => setFormData(prev => ({
                    ...prev,
                    autoDisclosure: checked
                  }))} />
                  </div>
                  
                  

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Human Review Description</Label>
                    <Textarea value={formData.humanReviewDescription} onChange={e => setFormData(prev => ({
                    ...prev,
                    humanReviewDescription: e.target.value
                  }))} className="text-sm" rows={3} placeholder="Describe the human review process..." />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sources" defaultChecked />
                        <Label htmlFor="sources" className="text-sm">Sources</Label>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                            View sources <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 p-0 bg-background border" side="bottom" align="end">
                          <div className="p-3">
                            <div className="text-xs font-medium mb-2">Sources used in this article</div>
                            <SourceCarousel />
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Bottom Action Buttons */}
      <div className="border-t border-border p-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="default" onClick={onGenerate} disabled={isGenerating} className="bg-black text-white hover:bg-black/90">
            <Settings className="h-4 w-4 mr-2" />
            Generate
          </Button>
          
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            View Facts
          </Button>
        </div>
        
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Save/Copy
        </Button>
        
        {formData.aiSummary && <p className="text-xs text-muted-foreground text-center">
            Unsaved changes
          </p>}
      </div>
    </>;
};