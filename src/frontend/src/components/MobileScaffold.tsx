import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import { useRouterState } from '@tanstack/react-router';

interface MobileScaffoldProps {
  children: ReactNode;
}

export default function MobileScaffold({ children }: MobileScaffoldProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  
  // Hide nav on auth gate, onboarding, and checkout
  const hideNav = currentPath === '/' || currentPath === '/checkout';

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto bg-background">
      <main className={hideNav ? 'flex-1' : 'flex-1 pb-20'}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
