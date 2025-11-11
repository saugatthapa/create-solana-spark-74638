import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import Index from "./pages/Index";
import Create from "./pages/Create";
import CreateLiquidity from "./pages/CreateLiquidity";
import Dashboard from "./pages/Dashboard";
import TokenAnalytics from "./pages/TokenAnalytics";
import NotFound from "./pages/NotFound";
import { NetworkProvider } from "@/contexts/NetworkContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GoogleAnalytics />
        <NetworkProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<Create />} />
            <Route path="/create-liquidity" element={<CreateLiquidity />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics/:tokenAddress" element={<TokenAnalytics />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NetworkProvider>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
