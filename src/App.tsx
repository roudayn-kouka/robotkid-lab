
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import CreateGame from "./pages/CreateGame";
import GameLibrary from "./pages/GameLibrary";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/auth" element={<Landing />} />
            <Route path="/" element={
              <>
                <Navigation />
                <Index />
              </>
            } />
            <Route path="/create-game" element={
              <>
                <Navigation />
                <CreateGame />
              </>
            } />
            <Route path="/games" element={
              <>
                <Navigation />
                <GameLibrary />
              </>
            } />
            <Route path="/analytics" element={
              <>
                <Navigation />
                <Analytics />
              </>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
