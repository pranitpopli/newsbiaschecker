import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Edit3, Check, X, Eye, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { AgenticTooltip } from "./AgenticTooltip";
import { cn } from "@/lib/utils";

interface ComplianceIssue {
  type: 'policy_violation' | 'factual_deviation' | 'bias' | 'tone_shift';
  severity: 'low' | 'medium' | 'high';
  text: string;
  evidence: string;
  sourceQuote?: string;
  startIndex: number;
  endIndex: number;
}

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

interface EditableOutputProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  complianceIssues: ComplianceIssue[];
  onViewDisclosure: () => void;
}

export const EditableOutput = ({ 
  formData, 
  setFormData, 
  complianceIssues,
  onViewDisclosure 
}: EditableOutputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(formData.aiSummary);

  const handleSaveEdit = () => {
    setFormData(prev => ({ ...prev, aiSummary: editedSummary }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedSummary(formData.aiSummary);
    setIsEditing(false);
  };

  const renderHighlightedText = (text: string, issues: ComplianceIssue[]) => {
    if (issues.length === 0) return text;

    const sortedIssues = [...issues].sort((a, b) => a.startIndex - b.startIndex);
    let result = [];
    let lastIndex = 0;

    sortedIssues.forEach((issue, index) => {
      // Add text before the issue
      if (issue.startIndex > lastIndex) {
        result.push(text.slice(lastIndex, issue.startIndex));
      }

      // Add highlighted text with tooltip
      const highlightedText = text.slice(issue.startIndex, issue.endIndex);
      const severityColors = {
        low: 'bg-bias-low/20 border-bias-low/50',
        medium: 'bg-bias-medium/20 border-bias-medium/50',
        high: 'bg-bias-high/20 border-bias-high/50'
      };

      result.push(
        <AgenticTooltip
          key={`issue-${index}`}
          issue={issue}
          onAccept={() => console.log('Accept suggestion')}
          onReject={() => console.log('Reject suggestion')}
          onModify={() => console.log('Modify suggestion')}
        >
          <span className={cn(
            "px-1 rounded cursor-help border-2 transition-colors",
            severityColors[issue.severity]
          )}>
            {highlightedText}
          </span>
        </AgenticTooltip>
      );

      lastIndex = issue.endIndex;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result;
  };

  return (
    <div className="space-y-6">
      {/* AI Summary Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">AI Generated Summary</Label>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <Textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
            placeholder="Edit your summary here..."
          />
        ) : (
          <div className="bg-muted/30 p-4 rounded-lg border">
            <div className="space-y-3 text-sm leading-relaxed">
              <div className="font-medium text-base">
                {renderHighlightedText(
                  "City Council launches \"Greenhaven\" urban renewal plan to revitalize downtown over the next 10 years.",
                  []
                )}
              </div>
              
              <div>
                <p className="font-medium mb-2">Key features:</p>
                <ul className="space-y-1 list-disc list-inside ml-2">
                  <li>5 acres of new public park space.</li>
                  <li>3 mixed-use buildings with affordable housing.</li>
                  <li>Pedestrian-only zones introduced on Main Street.</li>
                  <li>Upgrades to current public transport hubs.</li>
                </ul>
              </div>
              
              <div>
                <p className="font-medium mb-2">Economic impact:</p>
                <ul className="space-y-1 list-disc list-inside ml-2">
                  <li>Over 500 new construction jobs expected.</li>
                  <li>Project anticipated to attract significant investment.</li>
                  <li>
                    {renderHighlightedText(
                      "Potential displacement of existing local businesses.",
                      complianceIssues.filter(issue => issue.text === 'potential concerns')
                    )}
                  </li>
                  <li>
                    {renderHighlightedText(
                      "Traffic disruptions expected during extended construction phase.",
                      complianceIssues.filter(issue => issue.text === 'expected traffic disruptions')
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compliance Issues Summary */}
      {complianceIssues.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span className="font-medium text-warning-foreground">
              {complianceIssues.length} compliance {complianceIssues.length === 1 ? 'issue' : 'issues'} detected
            </span>
          </div>
          <div className="space-y-2">
            {complianceIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                <div>
                  <span className="text-sm font-medium capitalize">{issue.type.replace('_', ' ')}</span>
                  <span className="text-xs text-muted-foreground ml-2">({issue.severity} severity)</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclosure Control */}
      <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Include Disclosure</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Add AI disclosure notice to published article
            </p>
          </div>
          <Switch 
            checked={formData.includeDisclosure} 
            onCheckedChange={checked => setFormData(prev => ({ 
              ...prev, 
              includeDisclosure: checked 
            }))} 
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onViewDisclosure}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview Disclosure
        </Button>
      </div>
    </div>
  );
};