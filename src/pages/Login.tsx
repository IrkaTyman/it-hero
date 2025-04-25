
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await login(email, password);
      toast({
        title: "Успешно вошли в систему",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Что-то пошло не так, попробуйте позже",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl">
              H
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1">Добро пожаловать в HackFlow</h1>
          <p className="text-muted-foreground">Войди для управления своими хакатонами</p>
        </div>

        <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Войти</CardTitle>
            <CardDescription>Введите данные для продолжения</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Почта
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Пароль
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="text-right text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Забыли пароль?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-center text-sm">
                У вас нет аккаунта?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Зарегистрироваться
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Для демо доступов используйте:</p>
          <p>Админ: admin@example.com / password</p>
          <p>Участник: user@example.com / password</p>
        </div>
      </div>
    </div>
  );
}