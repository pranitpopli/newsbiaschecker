import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, FileText, Brain, Key, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiKeyInput } from "./ApiKeyInput";
import { ResultsPanel } from "./ResultsPanel";
import { JsonView } from "./JsonView";
import { biasAnalyzer, BiasAnalysisResult } from "@/services/biasAnalysis";
import { llmEvaluator, LLMEvaluationResult, EvaluationInput } from "@/services/llmEvaluation";

interface FormData {
  originalArticle: string;
  aiSummary: string;
  companyPolicy: string;
  approvedCorpus: string;
  apiKey: string;
}

export const BiasChecker = () => {
  const [formData, setFormData] = useState<FormData>({
    originalArticle: "",
    aiSummary: "",
    companyPolicy: "",
    approvedCorpus: "",
    apiKey: "",
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [biasResult, setBiasResult] = useState<BiasAnalysisResult | null>(null);
  const [llmResult, setLLMResult] = useState<LLMEvaluationResult | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.originalArticle.trim()) {
      newErrors.originalArticle = "Original article is required";
    }
    if (!formData.aiSummary.trim()) {
      newErrors.aiSummary = "AI-generated summary is required";
    }
    if (!formData.companyPolicy.trim()) {
      newErrors.companyPolicy = "Company policy is required";
    }
    if (!formData.approvedCorpus.trim()) {
      newErrors.approvedCorpus = "Approved corpus is required";
    }
    if (!formData.apiKey.trim()) {
      newErrors.apiKey = "API key is required";
    } else if (!llmEvaluator.validateApiKey(formData.apiKey)) {
      newErrors.apiKey = "Invalid API key format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadSampleData = () => {
    const sampleData = {
      originalArticle: `The City Council today unveiled an ambitious new urban renewal project, dubbed "Greenhaven," set to transform the downtown core over the next decade. Mayor Johnson hailed the initiative as a "landmark step towards a sustainable and vibrant future for our city."

The Greenhaven project includes several key features:
• Creation of 5 acres of new public park space.
• Development of three mixed-use buildings with affordable housing units.
• Establishment of pedestrian-only zones on Main Street.
• Upgrades to existing public transport hubs.

The project is projected to create over 500 new jobs during its construction phase and attract significant local investment. However, preliminary assessments also highlight potential concerns regarding the displacement of some long-standing local businesses and expected traffic disruptions during the multi-year construction period.`,

      aiSummary: `City Council launches "Greenhaven" urban renewal plan to revitalize downtown over the next 10 years.

Key features:
• 5 acres of new public park space.
• 3 mixed-use buildings with affordable housing.
• Pedestrian-only zones introduced on Main Street.
• Upgrades to current public transport hubs.

Economic impact:
• Over 500 new construction jobs expected.
• Project anticipated to attract significant investment.
• Potential displacement of existing local businesses.
• Traffic disruptions expected during extended construction phase.`,

      companyPolicy: `Editorial Guidelines:
- Maintain objective, factual reporting
- Avoid sensationalized language or loaded terms
- Present balanced perspectives on controversial issues
- Verify all claims with credible sources
- Use neutral tone throughout
- Clearly distinguish between facts and opinions
- Avoid speculation without proper attribution`,

      approvedCorpus: `Sample approved articles:
1. "City approves budget increase for infrastructure improvements" - neutral tone, factual presentation
2. "New housing development faces mixed community response" - balanced coverage of different viewpoints
3. "Transportation committee reviews public transit expansion proposals" - objective reporting of official proceedings`,

      apiKey: ""
    };

    setFormData(sampleData);
    toast({
      title: "Sample data loaded",
      description: "Form has been filled with sample content for testing",
    });
  };

  const analyzeBias = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setBiasResult(null);
    setLLMResult(null);

    try {
      // Stage 1: Initialize and run local bias analysis
      setStatus("Preparing local model...");
      setProgress(10);
      
      if (biasAnalyzer.getStatus() === 'not_initialized') {
        await biasAnalyzer.initialize();
      }
      
      setStatus("Model ready, analyzing bias...");
      setProgress(30);
      
      const biasAnalysisResult = await biasAnalyzer.analyzeBias(
        formData.aiSummary,
        formData.originalArticle
      );
      
      setBiasResult(biasAnalysisResult);
      setProgress(60);

      // Stage 2: LLM Evaluation
      setStatus("Evaluating with LLM...");
      
      const evaluationInput: EvaluationInput = {
        originalArticle: formData.originalArticle,
        aiSummary: formData.aiSummary,
        companyPolicy: formData.companyPolicy,
        approvedCorpus: formData.approvedCorpus,
        biasScore: biasAnalysisResult.bias_score,
        apiKey: formData.apiKey,
      };

      const llmEvaluationResult = await llmEvaluator.evaluateSummary(evaluationInput);
      setLLMResult(llmEvaluationResult);
      setProgress(100);

      setStatus("Analysis complete");
      toast({
        title: "Analysis Complete",
        description: "Both bias analysis and LLM evaluation finished successfully",
      });

    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed", 
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setStatus("Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isFormValid = 
    formData.originalArticle.trim() &&
    formData.aiSummary.trim() && 
    formData.companyPolicy.trim() &&
    formData.approvedCorpus.trim() &&
    formData.apiKey.trim() &&
    llmEvaluator.validateApiKey(formData.apiKey);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Newsroom Bias Review Tool
                </CardTitle>
                <p className="text-muted-foreground">
                  Analyze AI-generated summaries for bias, tone preservation, and policy compliance
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Sample Data Button */}
                <div className="flex justify-end">
                  <Button variant="outline" onClick={loadSampleData}>
                    Load Sample Data
                  </Button>
                </div>

                {/* Original Article */}
                <div className="space-y-2">
                  <Label htmlFor="originalArticle">Original Article *</Label>
                  <Textarea
                    id="originalArticle"
                    placeholder="Paste the original article content here..."
                    value={formData.originalArticle}
                    onChange={(e) => setFormData(prev => ({...prev, originalArticle: e.target.value}))}
                    className={`min-h-32 ${errors.originalArticle ? 'border-destructive' : ''}`}
                  />
                  {errors.originalArticle && (
                    <p className="text-sm text-destructive">{errors.originalArticle}</p>
                  )}
                </div>

                {/* AI Summary */}
                <div className="space-y-2">
                  <Label htmlFor="aiSummary">AI-Generated Summary *</Label>
                  <Textarea
                    id="aiSummary"
                    placeholder="Paste the AI-generated summary here..."
                    value={formData.aiSummary}
                    onChange={(e) => setFormData(prev => ({...prev, aiSummary: e.target.value}))}
                    className={`min-h-32 ${errors.aiSummary ? 'border-destructive' : ''}`}
                  />
                  {errors.aiSummary && (
                    <p className="text-sm text-destructive">{errors.aiSummary}</p>
                  )}
                </div>

                {/* Company Policy */}
                <div className="space-y-2">
                  <Label htmlFor="companyPolicy">Company Policy *</Label>
                  <Textarea
                    id="companyPolicy"
                    placeholder="Enter your editorial guidelines and company policy..."
                    value={formData.companyPolicy}
                    onChange={(e) => setFormData(prev => ({...prev, companyPolicy: e.target.value}))}
                    className={`min-h-24 ${errors.companyPolicy ? 'border-destructive' : ''}`}
                  />
                  {errors.companyPolicy && (
                    <p className="text-sm text-destructive">{errors.companyPolicy}</p>
                  )}
                </div>

                {/* Approved Corpus */}
                <div className="space-y-2">
                  <Label htmlFor="approvedCorpus">Approved Corpus *</Label>
                  <Textarea
                    id="approvedCorpus"
                    placeholder="Provide examples of approved editorial content..."
                    value={formData.approvedCorpus}
                    onChange={(e) => setFormData(prev => ({...prev, approvedCorpus: e.target.value}))}
                    className={`min-h-24 ${errors.approvedCorpus ? 'border-destructive' : ''}`}
                  />
                  {errors.approvedCorpus && (
                    <p className="text-sm text-destructive">{errors.approvedCorpus}</p>
                  )}
                </div>

                {/* API Key */}
                <ApiKeyInput
                  value={formData.apiKey}
                  onChange={(value) => setFormData(prev => ({...prev, apiKey: value}))}
                  isValid={llmEvaluator.validateApiKey(formData.apiKey)}
                  error={errors.apiKey}
                />

                {/* Analysis Progress */}
                {isAnalyzing && (
                  <div className="space-y-3">
                    <Progress value={progress} className="w-full" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {status}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={analyzeBias}
                  disabled={!isFormValid || isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      Analyze Bias with AI
                    </>
                  )}
                </Button>

                {!isFormValid && formData.apiKey && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    Please fill in all required fields and provide a valid API key
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {(biasResult || llmResult) && (
              <>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResultsPanel biasResult={biasResult} llmResult={llmResult} />
                  </CardContent>
                </Card>

                {/* JSON Views */}
                {biasResult && (
                  <JsonView data={biasResult} title="Stage 1: Bias Analysis JSON" />
                )}
                {llmResult && (
                  <JsonView data={llmResult} title="Stage 2: LLM Evaluation JSON" />
                )}
              </>
            )}
            
            {!biasResult && !llmResult && (
              <Card className="sticky top-4">
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Results will appear here after analysis</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};