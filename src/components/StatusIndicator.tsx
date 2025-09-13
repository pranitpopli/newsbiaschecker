import { CheckCircle, AlertCircle, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: 'pending' | 'loading' | 'complete' | 'error';
  label: string;
  className?: string;
}

export const StatusIndicator = ({ status, label, className }: StatusIndicatorProps) => {
  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'loading':
        return 'text-primary';
      case 'complete':
        return 'text-success';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {getIcon()}
      <span className={cn("text-sm font-medium", getTextColor())}>
        {label}
      </span>
    </div>
  );
};