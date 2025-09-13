import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Settings, FileText, Loader2, X } from "lucide-react";
import { EditableOutput } from "./EditableOutput";
import { DisclosurePreview } from "./DisclosurePreview";
import { AIConfidenceIndicator } from "./AIConfidenceIndicator";
import { cn } from "@/lib/utils";

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

interface AIPlaygroundProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  aiConfidence: AIConfidence | null;
  complianceIssues: ComplianceIssue[];
  isGenerating: boolean;
  onGenerate: () => void;
}

export const AIPlayground = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  aiConfidence,
  complianceIssues,
  isGenerating,
  onGenerate
}: AIPlaygroundProps) => {
  const [currentView, setCurrentView] = useState<'main' | 'summary' | 'disclosure'>('main');

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen bg-background border-l border-border flex flex-col w-[500px] z-50">
      {/* Sticky Header */}
      <div className="bg-background border-b border-border p-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {currentView !== 'main' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('main')}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-lg font-semibold">
            {currentView === 'main' ? 'AI Playground' : 
             currentView === 'summary' ? 'Summary Review' : 'Disclosure Builder'}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {aiConfidence && <AIConfidenceIndicator confidence={aiConfidence} />}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {currentView === 'main' ? (
            <Tabs defaultValue="factbox" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="utils">Utils</TabsTrigger>
                <TabsTrigger value="factbox">Factbox</TabsTrigger>
              </TabsList>
              
              <TabsContent value="factbox" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Type*</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={value => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bullet Points">Bullet Points</SelectItem>
                        <SelectItem value="Paragraph">Paragraph</SelectItem>
                        <SelectItem value="List">List</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Length</Label>
                    <Select 
                      value={formData.length} 
                      onValueChange={value => setFormData(prev => ({ ...prev, length: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3 Points">3 Points</SelectItem>
                        <SelectItem value="5 Points">5 Points</SelectItem>
                        <SelectItem value="7 Points">7 Points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Primary Action */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <Button 
                    onClick={() => {
                      onGenerate();
                      setCurrentView('summary');
                    }} 
                    disabled={isGenerating} 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Generating Summary...
                      </>
                    ) : (
                      <>
                        <Settings className="h-4 w-4 mr-2" />
                        Generate Summary
                      </>
                    )}
                  </Button>
                </div>

                {/* Disclosure Builder Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium text-foreground">Disclosure Builder</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Auto Disclosure</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Adds disclosure based on AI impact level for{' '}
                          <span className="text-primary underline cursor-pointer">substantial impact</span>.
                        </p>
                      </div>
                      <Switch 
                        checked={formData.autoDisclosure} 
                        onCheckedChange={checked => setFormData(prev => ({ 
                          ...prev, 
                          autoDisclosure: checked 
                        }))} 
                      />
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setCurrentView('disclosure')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Preview Disclosure
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="utils" className="space-y-4 mt-6">
                <div className="text-center text-muted-foreground py-8">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Utility features coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          ) : currentView === 'summary' ? (
            <EditableOutput
              formData={formData}
              setFormData={setFormData}
              complianceIssues={complianceIssues}
              onViewDisclosure={() => setCurrentView('disclosure')}
            />
          ) : (
            <DisclosurePreview
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};