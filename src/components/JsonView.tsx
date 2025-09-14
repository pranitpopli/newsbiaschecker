import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JsonViewProps {
  data: any;
  title: string;
}

export const JsonView = ({ data, title }: JsonViewProps) => {
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "JSON data has been copied to your clipboard",
        duration: 1000
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy JSON to clipboard",
        variant: "destructive",
        duration: 1000
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowJson(!showJson)}
            >
              <Code2 className="h-4 w-4 mr-2" />
              {showJson ? "Hide" : "Show"} JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={copied}
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              Copy JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      {showJson && (
        <CardContent>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </CardContent>
      )}
    </Card>
  );
};