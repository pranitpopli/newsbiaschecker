import { Button } from "@/components/ui/button";
import { Sparkles, Settings } from "lucide-react";

interface VerticalNavbarProps {
  onAIToggle: () => void;
  isAIOpen: boolean;
}

export const VerticalNavbar = ({
  onAIToggle,
  isAIOpen
}: VerticalNavbarProps) => {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 bg-card border border-border rounded-lg p-2 shadow-lg">
      <Button 
        variant={isAIOpen ? "default" : "outline"} 
        size="sm" 
        onClick={onAIToggle}
        className={`${isAIOpen ? "bg-primary text-primary-foreground" : ""} flex-col h-auto p-3`}
      >
        <Sparkles className="h-5 w-5 mb-1" />
        <span className="text-xs">AI</span>
      </Button>
      
      <Button variant="outline" size="sm" className="flex-col h-auto p-3">
        <Settings className="h-5 w-5 mb-1" />
        <span className="text-xs">Settings</span>
      </Button>
    </div>
  );
};