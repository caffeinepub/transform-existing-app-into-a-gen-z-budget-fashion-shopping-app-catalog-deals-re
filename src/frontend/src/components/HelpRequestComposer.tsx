import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HandHeart } from 'lucide-react';
import { toast } from 'sonner';

interface HelpRequestComposerProps {
  onSubmit: (description: string, category: string, isAnonymous: boolean) => Promise<void>;
}

const CATEGORIES = [
  'School & Homework',
  'Family Issues',
  'Friendship',
  'Mental Health',
  'Bullying',
  'Other',
];

export default function HelpRequestComposer({ onSubmit }: HelpRequestComposerProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Please describe what you need help with');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(description.trim(), category, isAnonymous);
      toast.success('Help request posted. The community is here for you.');
      setOpen(false);
      setDescription('');
      setCategory('');
      setIsAnonymous(true);
    } catch (error) {
      toast.error('Failed to post help request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          <HandHeart className="w-5 h-5 mr-2" />
          Ask for Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ask for Help</DialogTitle>
          <DialogDescription>
            It's okay to ask for support. Your community is here to help you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">What do you need help with?</Label>
            <Textarea
              id="description"
              placeholder="Describe your situation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="anonymous">Post anonymously</Label>
            <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
