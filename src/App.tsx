
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import CrashPage from "./pages/CrashPage";
import UpgradePage from "./pages/UpgradePage";
import DepositPage from "./pages/DepositPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cases" element={<Index />} />
          <Route path="/crash" element={<CrashPage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/case-opening/:id" element={<Index />} />
          <Route path="/profile" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
