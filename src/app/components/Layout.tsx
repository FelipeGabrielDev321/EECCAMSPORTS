import { Outlet, Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="size-10 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-slate-800">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_CgbjsEf5-HqAxSckdz6zFhVGP4794K8oPShQnA5LYg&s=10"
                  alt="Escudo EEPCA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none dark:text-white">EECCAM</h1>
                <p className="text-xs text-muted-foreground">Processo Seletivo Esportivo</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/">
                <Button variant={isActive("/") ? "default" : "ghost"}>
                  Início
                </Button>
              </Link>
              <Link to="/modalidades">
                <Button variant={isActive("/modalidades") ? "default" : "ghost"}>
                  Modalidades
                </Button>
              </Link>
              <Link to="/sobre">
                <Button variant={isActive("/sobre") ? "default" : "ghost"}>
                  Sobre
                </Button>
              </Link>
              <Link to="/inscricao">
                <Button variant={isActive("/inscricao") ? "default" : "ghost"}>
                  Inscrição
                </Button>
              </Link>
            </nav>

            {/* Dark mode + Mobile Menu */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Modo claro" : "Modo escuro"}
              >
                {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-1 dark:bg-slate-900">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Button variant={isActive("/") ? "default" : "ghost"} className="w-full justify-start">
                  Início
                </Button>
              </Link>
              <Link to="/modalidades" onClick={() => setMobileMenuOpen(false)}>
                <Button variant={isActive("/modalidades") ? "default" : "ghost"} className="w-full justify-start">
                  Modalidades
                </Button>
              </Link>
              <Link to="/sobre" onClick={() => setMobileMenuOpen(false)}>
                <Button variant={isActive("/sobre") ? "default" : "ghost"} className="w-full justify-start">
                  Sobre
                </Button>
              </Link>
              <Link to="/inscricao" onClick={() => setMobileMenuOpen(false)}>
                <Button variant={isActive("/inscricao") ? "default" : "ghost"} className="w-full justify-start">
                  Inscrição
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-3">EECCAM</h3>
              <p className="text-sm text-slate-300">
                Escola Estadual Professora Calpúrnia Caldas de Amorim
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Contato</h3>
              <p className="text-sm text-slate-300">
                Email: contato@eeccam.edu.br<br />
                Telefone: (84) 1234-5678
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Endereço</h3>
              <p className="text-sm text-slate-300">
                Rua Manoel Gonçalves de Melo, 42, bairro Barra Nova,<br />
               Caico,RN - CEP 59300-000
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-slate-400">
            <span>© 2026 EECCAM. Todos os direitos reservados.</span>
            <a href="/admin" className="text-slate-500 hover:text-slate-300 transition-colors text-xs">
              Área Restrita — Secretaria / Professores
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
