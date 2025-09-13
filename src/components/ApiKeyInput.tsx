import { useState } from "react";
import { Eye, EyeOff, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
  error?: string;
}

export const ApiKeyInput = ({ value, onChange, isValid, error }: ApiKeyInputProps) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="apiKey" className="text-sm font-medium">
        OpenAI API Key *
      </Label>
      <div className="relative">
        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="apiKey"
          type={showKey ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="sk-..."
          className={`pl-10 pr-10 ${
            value && !isValid ? "border-destructive" : ""
          }`}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 h-6 w-6 p-0"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};