// Force cache refresh - Fixed aiImpact undefined error
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, FileText, Brain, ChevronLeft, X, Settings, ChevronDown, ArrowLeft, Sparkles, Eye, Save, Copy, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const [currentView, setCurrentView] = useState<'main' | 'summary' | 'disclosure'>('main');
  const {
    toast
  } = useToast();
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
        text: 'potential concerns',
        evidence: 'Language may be unnecessarily negative',
        sourceQuote: 'However, preliminary assessments also highlight potential concerns regarding...',
        startIndex: 520,
        endIndex: 538
      }, {
        type: 'tone_shift',
        severity: 'low',
        text: 'expected traffic disruptions',
        evidence: 'More neutral phrasing available',
        sourceQuote: 'expected traffic disruptions during the multi-year construction period.',
        startIndex: 680,
        endIndex: 708
      }]);
      setCurrentView('summary');
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
  return <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  
                  <h1 className="text-xl font-semibold text-foreground">
                    "Greenhaven" Urban Renewal Project for Downtown Core
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Update
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
                  <Sheet open={isPlaygroundOpen} onOpenChange={setIsPlaygroundOpen}>
                    <SheetTrigger asChild>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                        <Brain className="h-4 w-4 mr-2" />
                        AI
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[500px]">
                      <SheetHeader className="border-b pb-4">
                        <div className="flex items-center justify-between">
                          <SheetTitle>AI Playground</SheetTitle>
                          {aiConfidence && <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-sm font-medium ${aiConfidence.color}`}>
                                AI Impact: {aiConfidence.percentage}%
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${aiConfidence.status === 'safe' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {aiConfidence.status === 'safe' ? 'Safe to Publish' : 'Review Before Publishing'}
                              </span>
                            </div>}
                        </div>
                      </SheetHeader>

                      <div className="mt-6">
                        {currentView === 'main' ? <Tabs defaultValue="factbox" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="utils">Utils</TabsTrigger>
                              <TabsTrigger value="factbox">Factbox</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="factbox" className="space-y-4 mt-4">
                              <div className="space-y-4">
                                <div>
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

                                <div className="space-y-4 pt-4 border-t">
                                  <h3 className="font-medium">Disclosure Builder</h3>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <Label className="text-sm font-medium">Auto Disclosure.</Label>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Adds the disclosure level based on AI impact on{' '}
                                        <span className="text-blue-600 underline cursor-pointer">Substantial impact</span>.
                                      </p>
                                    </div>
                                    <Switch checked={formData.autoDisclosure} onCheckedChange={checked => setFormData(prev => ({
                                  ...prev,
                                  autoDisclosure: checked
                                }))} />
                                  </div>

                                  <div className="flex gap-2">
                                    <Button onClick={generateSummary} disabled={isGenerating} className="flex-1 bg-gray-800 hover:bg-gray-900 text-white">
                                      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
                                      Generate
                                    </Button>
                                    <Button variant="outline" className="flex-1" onClick={() => setCurrentView('disclosure')}>
                                      <FileText className="h-4 w-4 mr-2" />
                                      View Facts
                                    </Button>
                                  </div>

                                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    Save/Copy
                                  </Button>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs> : currentView === 'summary' ? <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')} className="p-0 h-auto">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <div className="text-lg font-semibold">
                                City Council launches "Greenhaven" urban renewal plan to revitalize downtown over the next 10 years.
                              </div>
                              
                              <div className="space-y-3 text-sm">
                                <p className="font-medium">Key features:</p>
                                <ul className="space-y-1 list-disc list-inside ml-2">
                                  <li>5 acres of new public park space.</li>
                                  <li>3 mixed-use buildings with affordable housing.</li>
                                  <li>Pedestrian-only zones introduced on Main Street.</li>
                                  <li>Upgrades to current public transport hubs.</li>
                                </ul>
                                
                                <p className="font-medium">Economic impact:</p>
                                <ul className="space-y-1 list-disc list-inside ml-2">
                                  <li>Over 500 new construction jobs expected.</li>
                                  <li>Project anticipated to attract significant investment.</li>
                                  <li>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="px-1 bg-orange-100 border-orange-300 rounded cursor-help border-2">
                                          Potential displacement of existing
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <div className="max-w-sm">
                                          <p className="font-medium">Language may be unnecessarily negative</p>
                                          <p className="text-xs mt-1 text-muted-foreground">Source: However, preliminary assessments also highlight potential concerns regarding...</p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                    {' '}local businesses.
                                  </li>
                                  <li>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="px-1 bg-yellow-100 border-yellow-300 rounded cursor-help border-2">
                                          Traffic disruptions expected
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <div className="max-w-sm">
                                          <p className="font-medium">More neutral phrasing available</p>
                                          <p className="text-xs mt-1 text-muted-foreground">Source: expected traffic disruptions during the multi-year construction period.</p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                    {' '}during extended construction phase.
                                  </li>
                                </ul>
                              </div>

                              {complianceIssues.length > 0 && <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    <span className="text-sm font-medium text-amber-800">
                                      {complianceIssues.length} compliance issues found
                                    </span>
                                  </div>
                                </div>}
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Include Disclosure</Label>
                                <Switch checked={formData.includeDisclosure} onCheckedChange={checked => setFormData(prev => ({
                              ...prev,
                              includeDisclosure: checked
                            }))} />
                              </div>
                            </div>
                          </div> : <div className="space-y-4">
                            <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')} className="p-0 h-auto">
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Back
                            </Button>
                            <h3 className="font-medium">Disclosure Builder</h3>
                            <Textarea value={formData.humanReviewDescription} onChange={e => setFormData(prev => ({
                          ...prev,
                          humanReviewDescription: e.target.value
                        }))} className="min-h-20 text-sm" />
                          </div>}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Article Status and Metadata */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">531 characters</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">Updated yesterday 16:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mx-[8px]">
                    Published Yesterday, 16:00
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="space-y-3">
                      <img src="/placeholder.svg" alt="Pictures from Greenhaven's official webpage" className="w-full h-48 object-cover rounded-lg" />
                      <div className="text-sm">
                        <p className="font-medium">Byline</p>
                        <p className="text-muted-foreground">Molly TT/TT Nyhetsbyrån</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Text</p>
                        <p className="text-muted-foreground">Pictures from Greenhaven's official webpage. (TT)</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Alt text</p>
                        <p className="text-muted-foreground">Add text</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-foreground">
                        {formData.originalArticle}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>;
};