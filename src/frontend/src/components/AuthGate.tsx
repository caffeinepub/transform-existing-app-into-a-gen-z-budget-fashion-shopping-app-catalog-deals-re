import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function AuthGate() {
  const { login, loginStatus } = useAuth();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/assets/generated/genz-gradient-bg.dim_1440x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Card className="w-full max-w-md shadow-2xl relative z-10 border-2">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <img 
              src="/assets/generated/genz-shop-logo.dim_512x512.png" 
              alt="Logo" 
              className="w-24 h-24 mx-auto"
            />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Vibe Shop
          </CardTitle>
          <CardDescription className="text-base">
            Your go-to spot for affordable Gen Z fashion. Fresh fits, low prices, zero stress.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                Connecting...
              </span>
            ) : (
              'Get Started'
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Secure login powered by Internet Identity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
