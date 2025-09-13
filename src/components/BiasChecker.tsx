import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, FileText, Brain, ChevronLeft, X, Settings, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { biasAnalyzer, BiasAnalysisResult } from "@/services/biasAnalysis";
import { llmEvaluator, LLMEvaluationResult, EvaluationInput } from "@/services/llmEvaluation";

interface FormData {
  originalArticle: string;
  aiSummary: string;
  type: string;
  daysBack: string;
  length: string;
  title: string;
  text: string;
  autoDisclosure: boolean;
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
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiImpact, setAiImpact] = useState<number | null>(null);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'disclosure'>('main');
  const [biasResult, setBiasResult] = useState<BiasAnalysisResult | null>(null);
  const [llmResult, setLLMResult] = useState<LLMEvaluationResult | null>(null);

  const { toast } = useToast();

  const generateSummary = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation process
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
      setAiImpact(68);
      
      toast({
        title: "Summary Generated",
        description: "AI has successfully generated the summary",
      });
    } catch (error) {
      console.error("Generation failed:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-4 h-3 bg-primary rounded-sm"></div>
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  "Greenhaven" Urban Renewal Project for Downtown Core
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">What's New</span>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Update
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
                <Sheet open={isPlaygroundOpen} onOpenChange={setIsPlaygroundOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      size="sm"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      AI
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[500px]">
                    <SheetHeader className="border-b pb-4">
                      <div className="flex items-center justify-between">
                        <SheetTitle>AI Playground</SheetTitle>
                        {aiImpact && (
                          <div className="flex items-center gap-2">
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">
                              AI Impact: {aiImpact}%
                            </span>
                          </div>
                        )}
                      </div>
                    </SheetHeader>

                    <div className="mt-6">
                      {currentView === 'main' ? (
                        <div className="space-y-6">
                          <Tabs defaultValue="factbox" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="utils">Utils</TabsTrigger>
                              <TabsTrigger value="factbox">Factbox</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="factbox" className="space-y-4 mt-4">
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium">Type*</Label>
                                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({...prev, type: value}))}>
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

                                <div>
                                  <Label className="text-sm font-medium">Days Back*</Label>
                                  <Select value={formData.daysBack} onValueChange={(value) => setFormData(prev => ({...prev, daysBack: value}))}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="30">30</SelectItem>
                                      <SelectItem value="60">60</SelectItem>
                                      <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Length*</Label>
                                  <Select value={formData.length} onValueChange={(value) => setFormData(prev => ({...prev, length: value}))}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="3 Points">3 Points</SelectItem>
                                      <SelectItem value="5 Points">5 Points</SelectItem>
                                      <SelectItem value="7 Points">7 Points</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-3">
                                  <h3 className="font-medium">Details</h3>
                                  <div>
                                    <Label className="text-sm">Title</Label>
                                    <input 
                                      type="text"
                                      value={formData.title}
                                      onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                                      className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm">Text</Label>
                                    <input 
                                      type="text"
                                      value={formData.text}
                                      onChange={(e) => setFormData(prev => ({...prev, text: e.target.value}))}
                                      className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm"
                                    />
                                  </div>
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
                                    <Switch 
                                      checked={formData.autoDisclosure}
                                      onCheckedChange={(checked) => setFormData(prev => ({...prev, autoDisclosure: checked}))}
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={generateSummary}
                                      disabled={isGenerating}
                                      className="flex-1 bg-gray-800 hover:bg-gray-900 text-white"
                                    >
                                      {isGenerating ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      ) : (
                                        <Settings className="h-4 w-4 mr-2" />
                                      )}
                                      Generate
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      className="flex-1"
                                      onClick={() => setCurrentView('disclosure')}
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      View Facts
                                    </Button>
                                  </div>

                                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    Save/Copy
                                  </Button>

                                  <p className="text-xs text-muted-foreground text-center">
                                    Unsaved changes
                                  </p>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>

                          {/* Generated Summary Display */}
                          {formData.aiSummary && (
                            <div className="mt-6 p-4 bg-muted rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setCurrentView('disclosure')}
                                  className="p-0 h-auto text-sm"
                                >
                                  <ChevronLeft className="h-4 w-4 mr-1" />
                                  Back
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <p className="font-medium text-sm">
                                  {formData.aiSummary.split('\n')[0]}
                                </p>
                                <div className="text-sm text-muted-foreground whitespace-pre-line">
                                  {formData.aiSummary.split('\n').slice(1).join('\n')}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCurrentView('main')}
                              className="p-0 h-auto"
                            >
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Back
                            </Button>
                          </div>

                          <h3 className="font-medium">Disclosure Builder</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-sm font-medium">Auto Disclosure.</Label>
                                <p className="text-xs text-muted-foreground">
                                  Adds the disclosure level based on AI impact on{' '}
                                  <span className="text-blue-600 underline cursor-pointer">Substantial impact</span>.
                                </p>
                              </div>
                              <Switch 
                                checked={formData.autoDisclosure}
                                onCheckedChange={(checked) => setFormData(prev => ({...prev, autoDisclosure: checked}))}
                              />
                            </div>

                            <div className="space-y-3">
                              <Label className="text-sm font-medium">AI model used</Label>
                              <Select defaultValue="gpt-4">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                                  <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Human Review Description</Label>
                              <Textarea 
                                className="min-h-20 text-sm"
                                placeholder="All content in the fact box is based on Omni's articles and automatically summarized with the support of AI tools from OpenAI. Omni's editorial team has quality assured the content. Learn More A..."
                              />
                            </div>

                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Sources</Label>
                              <p className="text-xs text-muted-foreground">Sources used.</p>
                            </div>

                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Substantial Impact Box</Label>
                              <p className="text-xs text-muted-foreground">Link to Substantial Impact</p>
                            </div>

                            <div className="flex gap-2 pt-4">
                              <Button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white">
                                <Settings className="h-4 w-4 mr-2" />
                                Generate
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <FileText className="h-4 w-4 mr-2" />
                                View Facts
                              </Button>
                            </div>

                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                              Save/Copy
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                              Unsaved changes
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
                <Button variant="ghost" size="sm">
                  •••
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              531 characters • Updated yesterday 16:00 • 
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs ml-2">
                Published Yesterday, 16:00
              </span>
            </div>

            {/* Article Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  "Greenhaven" Urban Renewal Project for Downtown Core
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="space-y-3">
                    <img 
                      src="/placeholder.svg" 
                      alt="Pictures from Greenhaven's official webpage" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
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
  );
};