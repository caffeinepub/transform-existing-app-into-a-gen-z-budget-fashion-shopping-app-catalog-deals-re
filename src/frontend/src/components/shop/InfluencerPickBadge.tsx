import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export default function InfluencerPickBadge() {
  return (
    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 gap-1 animate-pulse">
      <Sparkles className="w-3 h-3" />
      Influencer Pick
    </Badge>
  );
}
