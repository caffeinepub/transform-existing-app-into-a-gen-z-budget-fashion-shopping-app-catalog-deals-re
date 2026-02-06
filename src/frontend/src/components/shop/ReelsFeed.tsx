import { ReactNode } from 'react';

interface ReelsFeedProps {
  children: ReactNode;
}

export default function ReelsFeed({ children }: ReelsFeedProps) {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory scrollbar-hide space-y-4 p-4">
      {children}
    </div>
  );
}
