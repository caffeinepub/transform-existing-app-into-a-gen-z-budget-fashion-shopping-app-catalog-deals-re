import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ChallengeShareComposerProps {
  challengeText: string;
  onShare: (content: string) => Promise<void>;
}

export default function ChallengeShareComposer({ challengeText, onShare }: ChallengeShareComposerProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please share how you completed the challenge');
      return;
    }

    setIsSubmitting(true);
    try {
      await onShare(content.trim());
      toast.success('Challenge completion shared anonymously!');
      setOpen(false);
      setContent('');
    } catch (error) {
      toast.error('Failed to share. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Share2 className="w-4 h-4 mr-2" />
          Share Anonymously
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
          <DialogDescription>
            Tell the community how you completed today's challenge (posted anonymously).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Today's Challenge:</p>
            <p className="text-sm text-muted-foreground mt-1">{challengeText}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="share-content">How did you complete it?</Label>
            <Textarea
              id="share-content"
              placeholder="I completed this challenge by..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Sharing...' : 'Share'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
