import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // DEBUG: Check values
    console.log("Attempting login with:", email);
    // Check if Supabase keys are visible
    if (!import.meta.env.VITE_SUPABASE_URL) alert("DEBUG: VITE_SUPABASE_URL is MISSING!");

    const { error } = await signIn(email, password);

    if (error) {
      console.error("Login Error:", error);
      alert("Login Failed: " + error.message);
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      navigate("/admin");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-accent/80 hover:text-accent mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-card p-8 rounded-2xl shadow-elevated border border-border/50">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Admin Login
            </h1>
            <p className="text-muted-foreground">
              Sign in to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
