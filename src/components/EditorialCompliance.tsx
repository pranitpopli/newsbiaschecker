import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, AlertCircle, Circle, ChevronDown, ChevronRight, Wand2 } from "lucide-react";

type ComplianceStatus = 'complete' | 'needs-attention' | 'not-started';

interface ComplianceItem {
  id: string;
  title: string;
  status: ComplianceStatus;
  criteria: string[];
  suggestions: string[];
}

export const EditorialCompliance = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const complianceItems: ComplianceItem[] = [
    {
      id: 'fact-checking',
      title: 'Fact-checking protocol',
      status: 'complete',
      criteria: [
        'All numerical data verified against source',
        'Key claims cross-referenced',
        'Timeline accuracy confirmed'
      ],
      suggestions: [
        'Verify 500 jobs figure with official source',
        'Confirm 10-year timeline accuracy'
      ]
    },
    {
      id: 'source-verification',
      title: 'Source verification',
      status: 'needs-attention',
      criteria: [
        'Primary sources identified and linked',
        'Attribution properly formatted',
        'Source credibility assessed'
      ],
      suggestions: [
        'Add link to City Council official announcement',
        'Include Mayor Johnson quote attribution'
      ]
    },
    {
      id: 'editorial-review',
      title: 'Editorial review',
      status: 'complete',
      criteria: [
        'Content aligns with editorial guidelines',
        'Tone consistency maintained',
        'Brand voice preserved'
      ],
      suggestions: []
    },
    {
      id: 'ai-policy',
      title: 'AI policy compliance',
      status: 'not-started',
      criteria: [
        'AI disclosure requirements met',
        'Human oversight documented',
        'Content accuracy verified'
      ],
      suggestions: [
        'Add AI generation disclosure',
        'Document editorial oversight process'
      ]
    }
  ];

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'needs-attention':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'not-started':
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: ComplianceStatus) => {
    const baseClasses = "text-xs font-medium";
    switch (status) {
      case 'complete':
        return <Badge className={`${baseClasses} bg-success/10 text-success`}>Complete</Badge>;
      case 'needs-attention':
        return <Badge className={`${baseClasses} bg-warning/10 text-warning`}>Needs attention</Badge>;
      case 'not-started':
        return <Badge className={`${baseClasses} bg-muted text-muted-foreground`}>Not started</Badge>;
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleApplySuggestion = (suggestion: string) => {
    console.log('Applying suggestion:', suggestion);
    // This would integrate with the draft editor to insert fixes
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Editorial Compliance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {complianceItems.map((item) => {
          const isExpanded = expandedItems.includes(item.id);
          
          return (
            <Collapsible key={item.id} open={isExpanded} onOpenChange={() => toggleExpanded(item.id)}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="ml-7 mt-3 space-y-4 pb-3">
                  {/* Criteria */}
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">Criteria:</div>
                    <ul className="space-y-1">
                      {item.criteria.map((criterion, index) => (
                        <li key={index} className="text-xs text-foreground flex items-start gap-2">
                          <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 shrink-0"></span>
                          {criterion}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions */}
                  {item.suggestions.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">Suggestions:</div>
                      <div className="space-y-2">
                        {item.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start justify-between gap-2">
                            <span className="text-xs text-foreground flex-1">
                              {suggestion}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApplySuggestion(suggestion)}
                              className="h-6 px-2 text-xs"
                            >
                              <Wand2 className="h-3 w-3 mr-1" />
                              Apply
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
};