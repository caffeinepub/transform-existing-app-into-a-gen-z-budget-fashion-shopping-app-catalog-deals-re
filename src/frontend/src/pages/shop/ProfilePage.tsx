import { useNavigate } from '@tanstack/react-router';
import PageContainer from '../../components/shop/PageContainer';
import PreferencesForm from '../../components/shop/PreferencesForm';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useShopQueries';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Package, Heart, LogOut, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const { mutateAsync: saveProfile } = useSaveCallerUserProfile();

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading || !profile) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {profile.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.email && (
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => navigate({ to: '/orders' })}
          >
            <Package className="w-6 h-6" />
            <span className="text-sm">Orders</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => navigate({ to: '/wishlist' })}
          >
            <Heart className="w-6 h-6" />
            <span className="text-sm">Wishlist</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Style Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PreferencesForm profile={profile} onSave={saveProfile} />
          </CardContent>
        </Card>

        <Button
          variant="destructive"
          className="w-full gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>

        <footer className="text-center text-xs text-muted-foreground pt-6 border-t">
          © 2026. Built with ❤️ using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline">
            caffeine.ai
          </a>
        </footer>
      </div>
    </PageContainer>
  );
}
