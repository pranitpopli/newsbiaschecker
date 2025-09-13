import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";
import { BiasAnalysisResult } from "@/services/biasAnalysis";
import { LLMEvaluationResult } from "@/services/llmEvaluation";

interface ResultsPanelProps {
  biasResult: BiasAnalysisResult | null;
  llmResult: LLMEvaluationResult | null;
}

export const ResultsPanel = ({ biasResult, llmResult }: ResultsPanelProps) => {
  const getBiasColor = (score: number) => {
    if (score <= 3) return "success";
    if (score <= 6) return "warning";
    return "destructive";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "success";
    if (score >= 6) return "warning";
    return "destructive";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "medium":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stage 1: Objective Bias Analysis */}
      {biasResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Stage 1: Objective Bias Analysis</span>
              <Badge variant={getBiasColor(biasResult.bias_score) as any}>
                Score: {biasResult.bias_score}/10
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Detected Bias Types</h4>
              <div className="flex flex-wrap gap-2">
                {biasResult.detected_bias_types.map((type) => (
                  <Badge key={type} variant="outline">
                    {type.replace("_", " ")}
                  </Badge>
                ))}
                {biasResult.detected_bias_types.length === 0 && (
                  <span className="text-muted-foreground text-sm">No bias detected</span>
                )}
              </div>
            </div>

            {biasResult.explanations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Evidence</h4>
                <ul className="space-y-1">
                  {biasResult.explanations.map((explanation, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      {explanation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stage 2: LLM Evaluation */}
      {llmResult && (
        <Card>
          <CardHeader>
            <CardTitle>Stage 2: Main Evaluation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scores Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Summary Quality</div>
                <Badge variant={getScoreColor(llmResult.summary_quality_score) as any}>
                  {llmResult.summary_quality_score}/10
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Tone Preservation</div>
                <Badge variant={getScoreColor(llmResult.tone_preservation_score) as any}>
                  {llmResult.tone_preservation_score}/10
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Policy Compliance</div>
                <Badge variant={getScoreColor(llmResult.policy_compliance_score) as any}>
                  {llmResult.policy_compliance_score}/10
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Accuracy</div>
                <Badge variant={getScoreColor(llmResult.accuracy_score) as any}>
                  {llmResult.accuracy_score}/10
                </Badge>
              </div>
            </div>

            {/* Issues */}
            {llmResult.issues.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-3">Issues Identified</h4>
                  <div className="space-y-2">
                    {llmResult.issues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium capitalize">
                              {issue.type.replace("_", " ")}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{issue.evidence}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Suggested Edits */}
            {llmResult.suggested_edits.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-3">Suggested Edits</h4>
                  <div className="space-y-3">
                    {llmResult.suggested_edits.map((edit, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-md space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Before:</span>
                          <div className="bg-destructive/10 p-2 rounded mt-1 text-destructive">
                            "{edit.before}"
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">After:</span>
                          <div className="bg-success/10 p-2 rounded mt-1 text-success">
                            "{edit.after}"
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <strong>Reason:</strong> {edit.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            {llmResult.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{llmResult.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};