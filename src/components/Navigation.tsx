import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Save, Eye, Settings } from "lucide-react";

interface NavigationProps {
  onAIToggle: () => void;
  onSaveDraft: () => void;
  isAIOpen: boolean;
}

export const Navigation = ({ onAIToggle, onSaveDraft, isAIOpen }: NavigationProps) => {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">
            "Greenhaven" Urban Renewal Project for Downtown Core
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Updated yesterday</span>
            <span>•</span>
            <span>Published yesterday</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSaveDraft}
            className="hidden md:flex"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={isAIOpen ? "default" : "outline"} 
            size="sm"
            onClick={onAIToggle}
            className={isAIOpen ? "bg-primary text-primary-foreground" : ""}
          >
            <Brain className="h-4 w-4 mr-2" />
            AI
          </Button>
        </div>
      </div>
    </header>
  );
};