import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, FileText, Settings, Users, BarChart3, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: Search, label: "Search", active: false },
    { icon: FileText, label: "Articles", active: true },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Users, label: "Team", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <nav className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Top Navigation */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-lg font-semibold text-sidebar-foreground">CMS</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
              item.active && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            disabled={!item.active}
          >
            <item.icon className="h-4 w-4" />
            {!isCollapsed && <span>{item.label}</span>}
          </Button>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Bell className="h-4 w-4" />
          {!isCollapsed && <span>Notifications</span>}
        </Button>
      </div>
    </nav>
  );
};