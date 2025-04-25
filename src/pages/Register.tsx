
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("participant");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await register(email, password, name, role);
      toast({
        title: "Успешно зарегистрирован",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Произошла ошибка",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
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
          <h1 className="text-3xl font-bold mb-1">Создать аккаунт</h1>
          <p className="text-muted-foreground">Присоединяйся HackFlow для участия в хакатонах</p>
        </div>

        <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Зарегистрироваться</CardTitle>
            <CardDescription>Введите данные для регистрации</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                 ФИО
                </label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Пароль
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Тип аккаунта
                </label>
                <RadioGroup 
                  defaultValue="participant" 
                  value={role}
                  onValueChange={(value) => setRole(value as UserRole)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="participant" id="participant" />
                    <Label htmlFor="participant">Участник</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Администратор</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
              <p className="text-center text-sm">
                Уже есть аккаунт?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Войти
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}