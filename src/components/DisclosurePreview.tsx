import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, Edit3, Save, RotateCcw } from "lucide-react";

interface FormData {
  originalArticle: string;
  aiSummary: string;
  type: string;
  daysBack: string;
  length: string;
  title: string;
  text: string;
  autoDisclosure: boolean;
  includeDisclosure: boolean;
  aiModelUsed: string;
  humanReviewDescription: string;
}

interface DisclosurePreviewProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const DisclosurePreview = ({ formData, setFormData }: DisclosurePreviewProps) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customDisclosure, setCustomDisclosure] = useState(formData.humanReviewDescription);
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'inline'>('bottom');

  const handleSaveCustomization = () => {
    setFormData(prev => ({ 
      ...prev, 
      humanReviewDescription: customDisclosure 
    }));
    setIsCustomizing(false);
  };

  const handleResetToDefault = () => {
    const defaultText = "All content in the fact box is based on Omni's articles and automatically summarized with the support of AI tools from OpenAI. Omni's editorial team has quality assured the content.";
    setCustomDisclosure(defaultText);
    setFormData(prev => ({ 
      ...prev, 
      humanReviewDescription: defaultText 
    }));
  };

  const renderDisclosureInContext = () => {
    const sampleArticleStart = `**"Greenhaven" Urban Renewal Project for Downtown Core**

The City Council today unveiled an ambitious new urban renewal project, dubbed "Greenhaven," set to transform the downtown core over the next decade...`;

    const factBox = `**Key Facts:**
• 5 acres of new public park space
• 3 mixed-use buildings with affordable housing
• Pedestrian-only zones on Main Street
• Over 500 new construction jobs expected`;

    const sampleArticleEnd = `The project is projected to create significant local investment while addressing concerns about business displacement during the construction period.`;

    return (
      <div className="bg-background border rounded-lg p-4 text-sm space-y-4">
        {placement === 'top' && (
          <>
            <div className="bg-info/10 text-info-foreground p-3 rounded border-l-4 border-info italic text-xs">
              {formData.humanReviewDescription}
            </div>
            <Separator />
          </>
        )}
        
        <div className="space-y-3">
          <p>{sampleArticleStart}</p>
          
          {placement === 'inline' && (
            <>
              <div className="bg-muted/50 p-3 rounded border">
                <div className="font-medium text-sm mb-2">{factBox}</div>
                <div className="bg-info/10 text-info-foreground p-2 rounded border-l-4 border-info italic text-xs mt-2">
                  {formData.humanReviewDescription}
                </div>
              </div>
            </>
          )}
          
          {placement !== 'inline' && (
            <div className="bg-muted/50 p-3 rounded border">
              <div className="font-medium text-sm">{factBox}</div>
            </div>
          )}
          
          <p>{sampleArticleEnd}</p>
        </div>
        
        {placement === 'bottom' && (
          <>
            <Separator />
            <div className="bg-info/10 text-info-foreground p-3 rounded border-l-4 border-info italic text-xs">
              {formData.humanReviewDescription}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Live Preview */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <Label className="text-lg font-semibold">Live Preview</Label>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">How disclosure will appear</CardTitle>
          </CardHeader>
          <CardContent>
            {renderDisclosureInContext()}
          </CardContent>
        </Card>
      </div>

      {/* Disclosure Settings */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Disclosure Settings</Label>
        
        <div className="space-y-4">
          {/* Placement Options */}
          <div>
            <Label className="text-sm font-medium">Placement</Label>
            <Select value={placement} onValueChange={(value: 'top' | 'bottom' | 'inline') => setPlacement(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top of article</SelectItem>
                <SelectItem value="bottom">Bottom of article</SelectItem>
                <SelectItem value="inline">Inline with fact box</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto Disclosure Toggle */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <Label className="text-sm font-medium">Auto Disclosure</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically include disclosure based on AI impact level
              </p>
            </div>
            <Switch 
              checked={formData.autoDisclosure} 
              onCheckedChange={checked => setFormData(prev => ({ 
                ...prev, 
                autoDisclosure: checked 
              }))} 
            />
          </div>
        </div>
      </div>

      {/* Custom Disclosure Text */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Disclosure Text</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToDefault}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            {!isCustomizing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomizing(true)}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Customize
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSaveCustomization}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            )}
          </div>
        </div>

        {isCustomizing ? (
          <div className="space-y-2">
            <Textarea
              value={customDisclosure}
              onChange={(e) => setCustomDisclosure(e.target.value)}
              className="min-h-[100px]"
              placeholder="Enter your custom disclosure text..."
            />
            <p className="text-xs text-muted-foreground">
              Keep it clear and transparent about AI involvement in content creation.
            </p>
          </div>
        ) : (
          <div className="bg-muted/30 p-3 rounded border">
            <p className="text-sm italic text-muted-foreground">
              {formData.humanReviewDescription}
            </p>
          </div>
        )}
      </div>

      {/* Templates Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Quick Templates</Label>
        <div className="grid gap-2">
          {[
            "Content generated with AI assistance and human oversight.",
            "This summary was created using AI tools with editorial review.",
            "AI-assisted content creation with full human editorial control."
          ].map((template, index) => (
            <Button
              key={index}
              variant="ghost"
              className="text-left justify-start h-auto p-2 text-xs"
              onClick={() => {
                setCustomDisclosure(template);
                setFormData(prev => ({ ...prev, humanReviewDescription: template }));
              }}
            >
              {template}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};