import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, X, Check, Edit3 } from "lucide-react";
interface ComplianceIssue {
  type: 'policy_violation' | 'factual_deviation' | 'bias' | 'tone_shift';
  severity: 'low' | 'medium' | 'high';
  text: string;
  evidence: string;
  sourceQuote?: string;
  startIndex: number;
  endIndex: number;
}
interface SummaryViewProps {
  summary: string;
  complianceIssues: ComplianceIssue[];
  onAcceptSuggestion?: (issue: ComplianceIssue) => void;
  onRejectSuggestion?: (issue: ComplianceIssue) => void;
  onModifySuggestion?: (issue: ComplianceIssue) => void;
  onSummaryChange?: (newSummary: string) => void;
  editable?: boolean;
}
export const SummaryView = ({
  summary,
  complianceIssues,
  onAcceptSuggestion,
  onRejectSuggestion,
  onModifySuggestion,
  onSummaryChange,
  editable = false
}: SummaryViewProps) => {
  const [rejectedIssues, setRejectedIssues] = useState<Set<string>>(new Set());
  const [hoveredIssue, setHoveredIssue] = useState<string | null>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const getHighlightClass = (severity: 'low' | 'medium' | 'high', type: string, isHovered: boolean = false) => {
    const baseClass = 'border-2 rounded px-1 transition-all duration-300';
    
    // Use explicit class combinations to ensure Tailwind recognizes them
    if (isHovered) {
      switch (type) {
        case 'tone_shift':
          switch (severity) {
            case 'low': return `bg-tone-shift-low/70 border-tone-shift-low/90 ${baseClass}`;
            case 'medium': return `bg-tone-shift-medium/70 border-tone-shift-medium/90 ${baseClass}`;
            case 'high': return `bg-tone-shift-high/70 border-tone-shift-high/90 ${baseClass}`;
          }
          break;
        case 'policy_violation':
          switch (severity) {
            case 'low': return `bg-policy-violation-low/70 border-policy-violation-low/90 ${baseClass}`;
            case 'medium': return `bg-policy-violation-medium/70 border-policy-violation-medium/90 ${baseClass}`;
            case 'high': return `bg-policy-violation-high/70 border-policy-violation-high/90 ${baseClass}`;
          }
          break;
        case 'factual_deviation':
          switch (severity) {
            case 'low': return `bg-factual-deviation-low/70 border-factual-deviation-low/90 ${baseClass}`;
            case 'medium': return `bg-factual-deviation-medium/70 border-factual-deviation-medium/90 ${baseClass}`;
            case 'high': return `bg-factual-deviation-high/70 border-factual-deviation-high/90 ${baseClass}`;
          }
          break;
        case 'bias':
          switch (severity) {
            case 'low': return `bg-bias-issue-low/70 border-bias-issue-low/90 ${baseClass}`;
            case 'medium': return `bg-bias-issue-medium/70 border-bias-issue-medium/90 ${baseClass}`;
            case 'high': return `bg-bias-issue-high/70 border-bias-issue-high/90 ${baseClass}`;
          }
          break;
      }
    } else {
      switch (type) {
        case 'tone_shift':
          switch (severity) {
            case 'low': return `bg-tone-shift-low/40 border-tone-shift-low/60 ${baseClass}`;
            case 'medium': return `bg-tone-shift-medium/40 border-tone-shift-medium/60 ${baseClass}`;
            case 'high': return `bg-tone-shift-high/40 border-tone-shift-high/60 ${baseClass}`;
          }
          break;
        case 'policy_violation':
          switch (severity) {
            case 'low': return `bg-policy-violation-low/40 border-policy-violation-low/60 ${baseClass}`;
            case 'medium': return `bg-policy-violation-medium/40 border-policy-violation-medium/60 ${baseClass}`;
            case 'high': return `bg-policy-violation-high/40 border-policy-violation-high/60 ${baseClass}`;
          }
          break;
        case 'factual_deviation':
          switch (severity) {
            case 'low': return `bg-factual-deviation-low/40 border-factual-deviation-low/60 ${baseClass}`;
            case 'medium': return `bg-factual-deviation-medium/40 border-factual-deviation-medium/60 ${baseClass}`;
            case 'high': return `bg-factual-deviation-high/40 border-factual-deviation-high/60 ${baseClass}`;
          }
          break;
        case 'bias':
          switch (severity) {
            case 'low': return `bg-bias-issue-low/40 border-bias-issue-low/60 ${baseClass}`;
            case 'medium': return `bg-bias-issue-medium/40 border-bias-issue-medium/60 ${baseClass}`;
            case 'high': return `bg-bias-issue-high/40 border-bias-issue-high/60 ${baseClass}`;
          }
          break;
      }
    }
    
    // Fallback
    return `bg-muted/40 border-muted/60 ${baseClass}`;
  };

  const getIssueTypeColor = (type: string, severity: 'low' | 'medium' | 'high') => {
    const key = `${type}-${severity}`;
    switch (key) {
      case 'tone_shift-low':
        return 'bg-tone-shift-low text-white border-tone-shift-low';
      case 'tone_shift-medium':
        return 'bg-tone-shift-medium text-white border-tone-shift-medium';
      case 'tone_shift-high':
        return 'bg-tone-shift-high text-white border-tone-shift-high';
      case 'policy_violation-low':
        return 'bg-policy-violation-low text-white border-policy-violation-low';
      case 'policy_violation-medium':
        return 'bg-policy-violation-medium text-white border-policy-violation-medium';
      case 'policy_violation-high':
        return 'bg-policy-violation-high text-white border-policy-violation-high';
      case 'factual_deviation-low':
        return 'bg-factual-deviation-low text-white border-factual-deviation-low';
      case 'factual_deviation-medium':
        return 'bg-factual-deviation-medium text-white border-factual-deviation-medium';
      case 'factual_deviation-high':
        return 'bg-factual-deviation-high text-white border-factual-deviation-high';
      case 'bias-low':
        return 'bg-bias-issue-low text-white border-bias-issue-low';
      case 'bias-medium':
        return 'bg-bias-issue-medium text-white border-bias-issue-medium';
      case 'bias-high':
        return 'bg-bias-issue-high text-white border-bias-issue-high';
      default:
        return 'bg-gray-600 text-white border-gray-600';
    }
  };
  const handleContentChange = () => {
    if (editable && editableRef.current && onSummaryChange) {
      const newContent = editableRef.current.textContent || '';
      onSummaryChange(newContent);
    }
  };

  const handleAccept = (issue: ComplianceIssue) => {
    onAcceptSuggestion?.(issue);
    setRejectedIssues(prev => {
      const newSet = new Set(prev);
      newSet.delete(`${issue.startIndex}-${issue.endIndex}`);
      return newSet;
    });
  };

  const handleReject = (issue: ComplianceIssue) => {
    onRejectSuggestion?.(issue);
    setRejectedIssues(prev => new Set(prev).add(`${issue.startIndex}-${issue.endIndex}`));
  };
  const renderHighlightedText = () => {
    let result = [];
    let lastIndex = 0;

    // Sort issues by start index to handle overlapping highlights
    const sortedIssues = [...complianceIssues].sort((a, b) => a.startIndex - b.startIndex);
    for (const issue of sortedIssues) {
      const issueKey = `${issue.startIndex}-${issue.endIndex}`;
      const isRejected = rejectedIssues.has(issueKey);
      const isHovered = hoveredIssue === issueKey;

      // Add text before the issue
      if (issue.startIndex > lastIndex) {
        result.push(summary.slice(lastIndex, issue.startIndex));
      }

      // Add the highlighted issue text
      if (!isRejected) {
        result.push(<Tooltip key={issueKey}>
            <TooltipTrigger asChild>
              <span className={`${getHighlightClass(issue.severity, issue.type, isHovered)} cursor-help relative`}>
                {issue.text}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-0 overflow-hidden">
              <div className="p-3">
                <p className="font-medium text-sm mb-2">{issue.evidence}</p>
                {issue.sourceQuote && <p className="text-xs text-muted-foreground mb-3 italic">
                    Source: "{issue.sourceQuote}"
                  </p>}
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAccept(issue)} className="h-7 px-2 text-xs bg-success text-success-foreground hover:bg-success/90">
                    <Check className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                  
                  <Button size="sm" variant="outline" onClick={() => handleReject(issue)} className="h-7 px-2 text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>);
      } else {
        result.push(issue.text);
      }
      lastIndex = Math.max(lastIndex, issue.endIndex);
    }

    // Add remaining text
    if (lastIndex < summary.length) {
      result.push(summary.slice(lastIndex));
    }
    return result;
  };
  const activeIssues = complianceIssues.filter(issue => !rejectedIssues.has(`${issue.startIndex}-${issue.endIndex}`));
  return <div className="space-y-4">
      {/* Compliance Issues Summary - Moved Above */}
      {(() => {
        const activeIssues = complianceIssues.filter(issue => !rejectedIssues.has(`${issue.startIndex}-${issue.endIndex}`));
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
                    {activeIssues.map((issue, index) => {
                      const issueKey = `${issue.startIndex}-${issue.endIndex}`;
                      return (
                         <Badge 
                           key={index} 
                           className={`text-xs cursor-pointer transition-all duration-300 hover:scale-105 hover:brightness-90 ${getIssueTypeColor(issue.type, issue.severity)}`}
                           onMouseEnter={() => setHoveredIssue(issueKey)}
                           onMouseLeave={() => setHoveredIssue(null)}
                         >
                          {issue.type.replace('_', ' ')} ({issue.severity})
                        </Badge>
                      );
                    })}
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

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-48">
            <div 
              ref={editableRef}
              contentEditable={editable}
              onInput={handleContentChange}
              className={`p-6 prose prose-sm max-w-none ${editable ? 'outline-none focus:bg-muted/20' : ''}`}
              suppressContentEditableWarning={true}
            >
            <div className="text-base leading-relaxed whitespace-pre-line">
              {complianceIssues.length > 0 ? renderHighlightedText() : summary}
            </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>;
};