import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "./pages/Landing";
import UvLedInfo from "./pages/UvLedInfo";
import UvTechnology from "./pages/UvTechnology";
import BrandModels from "./pages/BrandModels";
import ModelDetail from "./pages/ModelDetail";
import ModelSpecs from "./pages/ModelSpecs";
import ModelAccessories from "./pages/ModelAccessories";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/uv-led-info" element={<UvLedInfo />} />
              <Route path="/uv-technology" element={<UvTechnology />} />
              <Route path="/brand/:brandId" element={<BrandModels />} />
              <Route path="/model/:modelId" element={<ModelDetail />} />
              <Route path="/model/:modelId/specs" element={<ModelSpecs />} />
              <Route path="/model/:modelId/accessories" element={<ModelAccessories />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
