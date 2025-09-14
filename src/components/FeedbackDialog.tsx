import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackType: 'up' | 'down' | null;
}

export const FeedbackDialog = ({ isOpen, onClose, feedbackType }: FeedbackDialogProps) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    // Here you would send the feedback data to your backend
    console.log('Feedback submitted:', {
      type: feedbackType,
      comment: feedback,
      timestamp: new Date().toISOString()
    });
    
    setFeedback("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {feedbackType === 'up' ? (
              <>
                <ThumbsUp className="h-5 w-5 text-success" />
                What went well?
              </>
            ) : (
              <>
                <ThumbsDown className="h-5 w-5 text-destructive" />
                What could be improved?
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="feedback" className="text-sm font-medium text-foreground">
              {feedbackType === 'up' 
                ? "Tell us what you liked about this summary:" 
                : "Tell us what didn't work well:"
              }
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={feedbackType === 'up' 
                ? "The summary was accurate and well-structured..." 
                : "The summary was missing key information..."
              }
              className="mt-2 min-h-[100px] bg-background border-border text-foreground"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!feedback.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};