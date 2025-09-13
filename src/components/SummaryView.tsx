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
    const opacity = isHovered ? '60' : '15';
    const borderOpacity = isHovered ? '80' : '30';
    
    // Use severity-based colors for each issue type
    const colorKey = `${type.replace('_', '-')}-${severity}`;
    return `bg-${colorKey}/${opacity} border-${colorKey}/${borderOpacity} ${baseClass}`;
  };

  const getIssueTypeColor = (type: string, severity: 'low' | 'medium' | 'high') => {
    const colorKey = `${type.replace('_', '-')}-${severity}`;
    return `bg-${colorKey} text-white`;
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
                          className={`text-xs cursor-pointer transition-all duration-300 hover:scale-105 ${getIssueTypeColor(issue.type, issue.severity)}`}
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