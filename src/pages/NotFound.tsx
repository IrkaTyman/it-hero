
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-6">
          <div className="text-8xl font-bold text-gradient">404</div>
          <div className="text-xl mt-2 mb-6">Страница не найдена</div>
          <p className="text-muted-foreground mb-8">
            Страница, которую вы ищете, не существует. Попробуйте вернуться на главную страницу.
          </p>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
             Главная
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}