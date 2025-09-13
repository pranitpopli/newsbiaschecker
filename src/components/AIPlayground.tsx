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
import { ArrowLeft, Settings, X, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react";
import { SummaryView } from "./SummaryView";
import { EditorialCompliance } from "./EditorialCompliance";

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

  return (
    <div className="w-[400px] border-l border-border bg-background flex flex-col h-screen">
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
                  <Select value={formData.type} onValueChange={value => setFormData(prev => ({ ...prev, type: value }))}>
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
                  <Select value={formData.daysBack} onValueChange={value => setFormData(prev => ({ ...prev, daysBack: value }))}>
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
                  <Select value={formData.length} onValueChange={value => setFormData(prev => ({ ...prev, length: value }))}>
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
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter fact box title..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Text</Label>
                  <Input
                    value={formData.text}
                    onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Additional text..."
                  />
                </div>
              </div>

              {/* Generated Summary */}
              {formData.aiSummary && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Generated Summary</h3>
                  <SummaryView
                    summary={formData.aiSummary}
                    complianceIssues={complianceIssues}
                    onAcceptSuggestion={onAcceptSuggestion}
                    onRejectSuggestion={onRejectSuggestion}
                    onModifySuggestion={onModifySuggestion}
                    onSummaryChange={(newSummary) => setFormData(prev => ({ ...prev, aiSummary: newSummary }))}
                    editable={true}
                  />
                  
                  {/* Compliance Issues Summary */}
                  {(() => {
                    const activeIssues = complianceIssues.filter(issue => true); // You may want to track rejected issues here
                    return (
                      <>
                        {activeIssues.length > 0 && (
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="h-4 w-4 text-warning" />
                                <span className="text-sm font-medium">
                                  {activeIssues.length} compliance issue{activeIssues.length !== 1 ? 's' : ''} found
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {activeIssues.map((issue, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {issue.type.replace('_', ' ')} ({issue.severity})
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {activeIssues.length === 0 && complianceIssues.length > 0 && (
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 text-success">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">All compliance issues resolved</span>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Editorial Compliance */}
              {formData.aiSummary && (
                <div className="space-y-4">
                  <EditorialCompliance />
                </div>
              )}

              {/* Disclosure Builder */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Disclosure Builder</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Auto Disclosure</Label>
                    <Switch 
                      checked={formData.autoDisclosure} 
                      onCheckedChange={checked => setFormData(prev => ({ ...prev, autoDisclosure: checked }))} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">AI model used</Label>
                    <Input
                      value={formData.aiModelUsed}
                      onChange={(e) => setFormData(prev => ({ ...prev, aiModelUsed: e.target.value }))}
                      placeholder="GPT-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Human Review Description</Label>
                    <Textarea
                      value={formData.humanReviewDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, humanReviewDescription: e.target.value }))}
                      className="text-sm"
                      rows={3}
                      placeholder="Describe the human review process..."
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sources" defaultChecked />
                      <Label htmlFor="sources" className="text-sm">Sources</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Sources used.</p>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="substantial-impact" />
                      <Label htmlFor="substantial-impact" className="text-sm">Substantial Impact Box</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Link to Substantial Impact</p>
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
          <Button 
            variant="default" 
            onClick={onGenerate}
            disabled={isGenerating}
            className="bg-black text-white hover:bg-black/90"
          >
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
        
        {formData.aiSummary && (
          <p className="text-xs text-muted-foreground text-center">
            Unsaved changes
          </p>
        )}
      </div>
    </div>
  );
};