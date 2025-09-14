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
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 bg-card border border-border rounded-lg p-3 shadow-lg w-20">
      <Button 
        variant={isAIOpen ? "default" : "outline"} 
        size="sm" 
        onClick={onAIToggle}
        className={`${isAIOpen ? "bg-primary text-primary-foreground" : ""} flex-col h-16 w-16 p-2`}
      >
        <Sparkles className="h-6 w-6 mb-1" />
        <span className="text-xs font-medium">AI</span>
      </Button>
      
      <Button variant="outline" size="sm" className="flex-col h-16 w-16 p-2">
        <Settings className="h-6 w-6 mb-1" />
        <span className="text-xs font-medium">Settings</span>
      </Button>
    </div>
  );
};