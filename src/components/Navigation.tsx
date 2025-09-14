import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Eye } from "lucide-react";

interface NavigationProps {
  onSaveDraft: () => void;
}

export const Navigation = ({
  onSaveDraft
}: NavigationProps) => {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">"Greenhaven" Urban Renewal Project for Downtown </h1>
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
        </div>
      </div>
    </header>
  );
};