
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import CreateGame from "./pages/CreateGame";
import GameLibrary from "./pages/GameLibrary";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <Navigation />
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/teacher" element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="/parent" element={
                <ProtectedRoute requiredRole="parent">
                  <ParentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/create-game" element={
                <ProtectedRoute requiredRole="admin">
                  <Navigation />
                  <CreateGame />
                </ProtectedRoute>
              } />
              <Route path="/games" element={
                <ProtectedRoute requiredRole="admin">
                  <Navigation />
                  <GameLibrary />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute requiredRole="admin">
                  <Navigation />
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
