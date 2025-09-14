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
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 bg-card border border-border rounded-lg p-2 shadow-lg">
      <Button 
        variant={isAIOpen ? "default" : "outline"} 
        size="sm" 
        onClick={onAIToggle}
        className={`${isAIOpen ? "bg-primary text-primary-foreground" : ""} w-10 h-10 p-0`}
      >
        <Sparkles className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="sm" className="w-10 h-10 p-0">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};