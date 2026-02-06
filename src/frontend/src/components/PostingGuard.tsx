import { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PostingGuardProps {
  children: ReactNode;
  canPost?: boolean;
  message?: string;
}

export default function PostingGuard({ children, canPost = true, message }: PostingGuardProps) {
  if (!canPost) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Unable to Post</AlertTitle>
        <AlertDescription>
          {message || 'You are currently unable to post content. Please contact a moderator if you believe this is an error.'}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
