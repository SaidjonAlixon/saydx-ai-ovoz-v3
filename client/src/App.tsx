import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileLayout from "@/components/MobileLayout";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Portfolio from "@/pages/Portfolio";
import LeadForm from "@/pages/LeadForm";
import Help from "@/pages/Help";
import Team from "@/pages/Team";
import LoginPage from "@/pages/LoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ResumePage from "@/pages/ResumePage";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import AIAssistant from "@/components/AIAssistant";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/xizmatlar" component={Services} />
      <Route path="/xizmatlar/:slug" component={ServiceDetail} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/jamoa" component={Team} />
      <Route path="/ariza" component={LeadForm} />
      <Route path="/yordam" component={Help} />
      <Route path="/login" component={LoginPage} />
      <Route path="/rezume/:id" component={ResumePage} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <MobileLayout>
            <Router />
            <AIAssistant />
          </MobileLayout>
          <Toaster />

        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
