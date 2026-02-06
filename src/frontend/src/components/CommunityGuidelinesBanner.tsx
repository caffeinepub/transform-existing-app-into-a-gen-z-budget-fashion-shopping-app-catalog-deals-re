import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export default function CommunityGuidelinesBanner() {
  return (
    <Alert className="mb-4">
      <Shield className="h-4 w-4" />
      <AlertTitle>Community Guidelines</AlertTitle>
      <AlertDescription>
        Be kind, respectful, and supportive. If you see something concerning, please report it.
        We're here to help each other.
      </AlertDescription>
    </Alert>
  );
}
