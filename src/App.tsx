
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
import LandingPage from './pages/LandingPage/index';
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./pages/NotFound";
import DiasporaForm from "@/pages/DiasporaForm"
import SupplierForm from "@/pages/SupplierForm";
import HealthcareForm from "@/pages/HealthcareForm";
import MedicationForm from "@/pages/MedicationForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diaspora-form" element={<DiasporaForm />} />
          <Route path="/supplier-form" element={<SupplierForm />} />
          <Route path="/healthcare-form" element={<HealthcareForm />} />  
          <Route path="/medication-form" element={<MedicationForm />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
