import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIConfidence {
  level: 'low' | 'medium' | 'high';
  percentage: number;
  status: 'safe' | 'review';
  color: string;
}

interface AIConfidenceIndicatorProps {
  confidence: AIConfidence;
  showPercentage?: boolean;
}

export const AIConfidenceIndicator = ({ 
  confidence, 
  showPercentage = false 
}: AIConfidenceIndicatorProps) => {
  const getIcon = () => {
    switch (confidence.level) {
      case 'low':
        return <CheckCircle className="h-3 w-3" />;
      case 'medium':
        return <AlertCircle className="h-3 w-3" />;
      case 'high':
        return <XCircle className="h-3 w-3" />;
    }
  };

  const getStatusText = () => {
    if (confidence.status === 'safe') {
      return 'Safe to Publish';
    }
    
    switch (confidence.level) {
      case 'low':
        return 'Review Needed - Low';
      case 'medium':
        return 'Review Needed - Medium';
      case 'high':
        return 'Review Needed - High';
    }
  };

  const getVariant = () => {
    switch (confidence.level) {
      case 'low':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'destructive';
    }
  };

  const getColorClasses = () => {
    switch (confidence.level) {
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-md border text-xs font-medium",
        getColorClasses()
      )}>
        {getIcon()}
        <span>{getStatusText()}</span>
        {showPercentage && (
          <span className="text-xs opacity-75">
            ({confidence.percentage}%)
          </span>
        )}
      </div>
    </div>
  );
};