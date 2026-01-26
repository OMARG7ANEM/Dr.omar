import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";

// Lazy Load Pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-accent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <TooltipProvider>
          <Sonner />
          <HashRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </HashRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
