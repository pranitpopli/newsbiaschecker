import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, X, Edit3, Quote } from "lucide-react";

interface ComplianceIssue {
  type: 'policy_violation' | 'factual_deviation' | 'bias' | 'tone_shift';
  severity: 'low' | 'medium' | 'high';
  text: string;
  evidence: string;
  sourceQuote?: string;
  startIndex: number;
  endIndex: number;
}

interface AgenticTooltipProps {
  children: ReactNode;
  issue: ComplianceIssue;
  onAccept: () => void;
  onReject: () => void;
  onModify: () => void;
}

const getSuggestion = (issue: ComplianceIssue): string => {
  switch (issue.type) {
    case 'bias':
      if (issue.text === 'potential concerns') {
        return 'Consider using more neutral language like "considerations" or "factors to address"';
      }
      return 'Consider using more objective language';
    case 'tone_shift':
      if (issue.text === 'expected traffic disruptions') {
        return 'Use "temporary traffic changes" or "construction-related traffic adjustments"';
      }
      return 'Consider adjusting tone to match article style';
    case 'policy_violation':
      return 'This may violate editorial guidelines';
    case 'factual_deviation':
      return 'Verify facts against source material';
    default:
      return 'Review this section for accuracy';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low':
      return 'text-bias-low';
    case 'medium':
      return 'text-bias-medium';
    case 'high':
      return 'text-bias-high';
    default:
      return 'text-muted-foreground';
  }
};

export const AgenticTooltip = ({ 
  children, 
  issue, 
  onAccept, 
  onReject, 
  onModify 
}: AgenticTooltipProps) => {
  const suggestion = getSuggestion(issue);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-0" side="top">
        <div className="p-3 space-y-3">
          {/* Issue Header */}
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium uppercase tracking-wide ${getSeverityColor(issue.severity)}`}>
              {issue.severity} {issue.type.replace('_', ' ')}
            </span>
          </div>

          {/* Evidence */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{issue.evidence}</p>
            
            {/* AI Suggestion */}
            <div className="bg-primary/5 p-2 rounded text-xs">
              <div className="flex items-start gap-2">
                <Edit3 className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                <p className="text-primary">{suggestion}</p>
              </div>
            </div>

            {/* Source Quote */}
            {issue.sourceQuote && (
              <div className="bg-muted/50 p-2 rounded text-xs">
                <div className="flex items-start gap-2">
                  <Quote className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <p className="text-muted-foreground italic">
                    "{issue.sourceQuote}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 pt-2 border-t">
            <Button
              size="sm"
              variant="ghost"
              onClick={onAccept}
              className="flex-1 h-7 text-xs bg-success/10 hover:bg-success/20 text-success"
            >
              <Check className="h-3 w-3 mr-1" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onModify}
              className="flex-1 h-7 text-xs bg-primary/10 hover:bg-primary/20 text-primary"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Modify
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onReject}
              className="flex-1 h-7 text-xs hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3 mr-1" />
              Reject
            </Button>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};