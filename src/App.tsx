
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/Cross-shield-access-hub">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/diaspora-form" element={<DiasporaForm />} />
            <Route path="/supplier-form" element={<SupplierForm />} />
            <Route path="/healthcare-form" element={<HealthcareForm />} />
            <Route path="/medication-form" element={<MedicationForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
