import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Settings, Sparkles, RefreshCw, Scissors, Plus, Quote, BookOpen, Lightbulb, Wand2 } from "lucide-react";

interface AIPlaygroundProps {
  formData: any;
  setFormData: (data: any) => void;
  aiConfidence: any;
  currentStep: 'plan' | 'generate' | 'review' | 'revise';
  setCurrentStep: (step: 'plan' | 'generate' | 'review' | 'revise') => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onClose: () => void;
}

export const AIPlayground = ({ 
  formData, 
  setFormData, 
  aiConfidence, 
  currentStep, 
  setCurrentStep,
  onGenerate, 
  isGenerating,
  onClose 
}: AIPlaygroundProps) => {
  const [goals, setGoals] = useState("Create an engaging, balanced summary that highlights both opportunities and challenges");
  const [tone, setTone] = useState("Professional, informative, neutral");
  const [constraints, setConstraints] = useState("Must include key metrics, avoid speculation, maintain source accuracy");

  const getStepColor = (step: string) => {
    if (step === currentStep) return "bg-primary text-primary-foreground";
    return "bg-muted text-muted-foreground";
  };

  const reviewLevel = aiConfidence?.level || 'medium';
  const reviewLevelDisplay = reviewLevel === 'low' ? 'Low' : reviewLevel === 'medium' ? 'Medium' : 'High';
  const reviewLevelColor = reviewLevel === 'low' ? 'bg-success/10 text-success' : 
                          reviewLevel === 'medium' ? 'bg-warning/10 text-warning' : 
                          'bg-destructive/10 text-destructive';

  return (
    <div className="w-96 border-l border-border bg-background flex flex-col h-screen">
      {/* Sticky Header */}
      <div className="border-b border-border p-4 bg-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <span className="font-semibold">AI Playground</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={reviewLevelColor}>
              Need of review: {reviewLevelDisplay}
            </Badge>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="flex items-center gap-1 text-xs">
          {['plan', 'generate', 'review', 'revise'].map((step, index) => (
            <div key={step} className="flex items-center">
              <Badge className={getStepColor(step)} variant="outline">
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </Badge>
              {index < 3 && <span className="mx-1 text-muted-foreground">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Input Controls - Goals/Tone/Constraints */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Input Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Goals</Label>
                <Textarea 
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="Define your content goals..."
                  className="mt-1 text-sm"
                  rows={2}
                />
              </div>
              
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Tone</Label>
                <Textarea 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="Specify desired tone..."
                  className="mt-1 text-sm"
                  rows={2}
                />
              </div>
              
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Constraints</Label>
                <Textarea 
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="Set content constraints..."
                  className="mt-1 text-sm"
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground">Type</Label>
                <Select value={formData.type} onValueChange={value => setFormData(prev => ({ ...prev, type: value }))}>
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
            </CardContent>
          </Card>

          {/* Draft Summary - Editable */}
          {formData.aiSummary && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Draft Summary</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      <Scissors className="h-3 w-3 mr-1" />
                      Shorten
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Expand
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48 border border-border rounded-md p-3">
                  <Textarea
                    value={formData.aiSummary}
                    onChange={(e) => setFormData(prev => ({ ...prev, aiSummary: e.target.value }))}
                    className="border-0 p-0 resize-none text-sm leading-relaxed"
                    style={{ minHeight: '180px' }}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Tool Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Generate
                </Button>
                
                <Button variant="outline" size="sm" className="text-xs">
                  <Quote className="h-3 w-3 mr-1" />
                  Cite
                </Button>
                
                <Button variant="outline" size="sm" className="text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
                
                <Button variant="outline" size="sm" className="text-xs">
                  <Wand2 className="h-3 w-3 mr-1" />
                  Improve
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Disclosure Builder */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Disclosure Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Auto Disclosure</Label>
                <Switch 
                  checked={formData.autoDisclosure} 
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, autoDisclosure: checked }))} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Include Disclosure</Label>
                <Switch 
                  checked={formData.includeDisclosure} 
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, includeDisclosure: checked }))} 
                />
              </div>

              {formData.includeDisclosure && (
                <div className="mt-4 p-3 border border-border rounded-md bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-2">Live Preview:</div>
                  <div className="text-xs leading-relaxed">
                    {formData.humanReviewDescription}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};