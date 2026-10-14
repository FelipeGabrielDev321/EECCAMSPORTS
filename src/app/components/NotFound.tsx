import { Link } from "react-router";
import { Button } from "./ui/button";
import { Home, Search } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-[600px] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <Search className="size-24 mx-auto text-muted-foreground opacity-50" />
        </div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/">
          <Button size="lg">
            <Home className="size-4 mr-2" />
            Voltar para a Página Inicial
          </Button>
        </Link>
      </div>
    </div>
  );
}
