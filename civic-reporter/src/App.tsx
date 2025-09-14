import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{ type: 'user' | 'admin' } | null>(() => {
    const stored = localStorage.getItem('civic-user');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = (userType: 'user' | 'admin') => {
    const userData = { type: userType };
    setUser(userData);
    localStorage.setItem('civic-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('civic-user');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!user && <Login onLogin={handleLogin} />}
        {user?.type === 'user' && <Index onLogout={handleLogout} />}
        {user?.type === 'admin' && <AdminDashboard onLogout={handleLogout} />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
