import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AppShell from "@/components/layout/AppShell";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Performance from "@/pages/Performance";
import CalendarView from "@/pages/CalendarView";
import ProjectDetail from "@/pages/ProjectDetail";
import PortfolioOkr from "@/pages/PortfolioOkr";
import RiskDeviations from "@/pages/RiskDeviations";
import UpdatesPage from "@/pages/UpdatesPage";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const Protected = ({ children }: { children: JSX.Element }) => {
  const { user, isReady } = useAuth();
  const loc = useLocation();

  if (!isReady) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <AppShell>{children}</AppShell>;
};

const DirectorOnly = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (user?.role !== "drejtor_agjencie" && user?.role !== "drejtor_inovacioni_publik") {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Protected><Dashboard /></Protected>} />
              <Route path="/projects" element={<Protected><Projects /></Protected>} />
              <Route path="/projects/:id" element={<Protected><ProjectDetail /></Protected>} />
              <Route path="/performance" element={<Protected><Performance /></Protected>} />
              <Route path="/calendar" element={<Protected><CalendarView /></Protected>} />
              <Route path="/risk-devijime" element={<Protected><RiskDeviations /></Protected>} />
              <Route path="/perditesimet" element={<Protected><UpdatesPage /></Protected>} />
              <Route path="/portfolio-okr" element={<Protected><DirectorOnly><PortfolioOkr /></DirectorOnly></Protected>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

