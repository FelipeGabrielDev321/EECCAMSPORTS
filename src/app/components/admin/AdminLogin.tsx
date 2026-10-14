import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Lock, User, ShieldCheck, Sun, Moon } from "lucide-react";
import { ADMIN_USERS } from "./adminData";

export function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) { root.classList.add("dark"); localStorage.setItem("theme", "dark"); }
    else { root.classList.remove("dark"); localStorage.setItem("theme", "light"); }
  }, [darkMode]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const user = ADMIN_USERS.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        sessionStorage.setItem("adminUser", JSON.stringify(user));
        navigate("/admin/dashboard");
      } else {
        setError("Usuário ou senha inválidos.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4 relative">
      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        title={darkMode ? "Modo claro" : "Modo escuro"}
      >
        {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </button>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 bg-white/10 rounded-2xl mb-4">
            <ShieldCheck className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Área Restrita</h1>
          <p className="text-blue-200 mt-1">EECCAM — Gestão de Inscrições</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="text-xl">Entrar</CardTitle>
            <CardDescription>
              Acesso exclusivo para Gestão e Professores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="username"
                    className="pl-9"
                    placeholder="seu.usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-9"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verificando..." : "Entrar"}
              </Button>
            </form>

            {/* Credential hints */}
            <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Credenciais de demonstração:</p>
              <p><span className="font-mono bg-white dark:bg-slate-700 dark:text-slate-200 px-1 rounded">Gestão</span> / <span className="font-mono bg-white dark:bg-slate-700 dark:text-slate-200 px-1 rounded">eeccam2026</span> — Gestão Escolar</p>
              <p><span className="font-mono bg-white dark:bg-slate-700 dark:text-slate-200 px-1 rounded">prof.futsal</span> / <span className="font-mono bg-white dark:bg-slate-700 dark:text-slate-200 px-1 rounded">futsal2026</span> — Prof. Futsal</p>
              <p><span className="font-mono bg-white dark:bg-slate-700 dark:text-slate-200 px-1 rounded">prof.volei</span> / <span className="font-mono bg-white dark:bg-slate-700 dark:text-slate-200 px-1 rounded">volei2026</span> — Prof. Vôlei</p>
              <p><span className="font-mono bg-white dark:bg-slate-700 dark:text-slate-200 px-1 rounded">prof.judo</span> / <span className="font-mono bg-white dark:bg-slate-700 dark:text-slate-200 px-1 rounded">judo2026</span> — Prof. Judô</p>
              <p><span className="font-mono bg-white dark:bg-slate-700 dark:text-slate-200 px-1 rounded">prof.capoeira</span> / <span className="font-mono bg-white dark:bg-slate-700 dark:text-slate-200 px-1 rounded">capoeira2026</span> — Mestre Capoeira</p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-blue-300 text-sm mt-6">
          <a href="/" className="hover:text-white transition-colors">← Voltar ao site público</a>
        </p>
      </div>
    </div>
  );
}
