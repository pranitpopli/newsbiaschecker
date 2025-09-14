import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Save, Eye, Settings } from "lucide-react";
interface NavigationProps {
  onAIToggle: () => void;
  onSaveDraft: () => void;
  isAIOpen: boolean;
}
export const Navigation = ({
  onAIToggle,
  onSaveDraft,
  isAIOpen
}: NavigationProps) => {
  return <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">&quot;Greenhaven&quot; Urban Renewal Project for Downtown </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-xs">Updated yesterday</span>
            <span className="mx-0">•</span>
            <span className="text-emerald-600 font-medium">Published yesterday at 1700</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          
          
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant={isAIOpen ? "default" : "outline"} size="sm" onClick={onAIToggle} className={isAIOpen ? "bg-primary text-primary-foreground" : ""}>
            <Sparkles className="h-4 w-4 mr-1" />
            AI
          </Button>
        </div>
      </div>
    </header>;
};