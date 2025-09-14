import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, User, Shield, Sun, Moon, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';

interface LoginProps {
  onLogin: (userType: 'user' | 'admin') => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [userCredentials, setUserCredentials] = useState({ email: '', password: '' });
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userCredentials.email && userCredentials.password) {
      onLogin('user');
      toast({
        title: "Login Successful",
        description: "Welcome to Civic Reporter!",
      });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCredentials.email === 'admin@civic.com' && adminCredentials.password === 'admin123') {
      onLogin('admin');
      toast({
        title: "Admin Login Successful",
        description: "Welcome to Admin Dashboard!",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={toggleLanguage}>
          <Languages className="h-4 w-4" />
          <span className="ml-1 text-xs">{language === 'en' ? 'हि' : 'EN'}</span>
        </Button>
        <Button variant="outline" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 glow-primary">
            <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('appName')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t('appDescription')}</p>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass-dark h-12 sm:h-10">
            <TabsTrigger value="user" className="flex items-center gap-1 sm:gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t('userLogin')}</span>
              <span className="sm:hidden">{t('user')}</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-1 sm:gap-2 text-sm">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t('adminLogin')}</span>
              <span className="sm:hidden">{t('admin')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card className="glass-dark border-border">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">User Login</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleUserLogin} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="user-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="Enter your email"
                      value={userCredentials.email}
                      onChange={(e) => setUserCredentials({...userCredentials, email: e.target.value})}
                      className="h-12 sm:h-10 text-base sm:text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="user-password"
                      type="password"
                      placeholder="Enter your password"
                      value={userCredentials.password}
                      onChange={(e) => setUserCredentials({...userCredentials, password: e.target.value})}
                      className="h-12 sm:h-10 text-base sm:text-sm"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 sm:h-10 text-base sm:text-sm font-medium">
                    Login as User
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card className="glass-dark border-border">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Admin Login</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleAdminLogin} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@civic.com"
                      value={adminCredentials.email}
                      onChange={(e) => setAdminCredentials({...adminCredentials, email: e.target.value})}
                      className="h-12 sm:h-10 text-base sm:text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="admin123"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                      className="h-12 sm:h-10 text-base sm:text-sm"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 sm:h-10 text-base sm:text-sm font-medium">
                    Login as Admin
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <span className="font-medium">Demo credentials:</span><br />
                    📧 admin@civic.com<br />
                    🔑 admin123
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;