import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const { hackathons, teams, getUserTeam } = useData();
  
  const userTeam = user ? getUserTeam(user.id) : undefined;
  const upcomingHackathons = hackathons.filter(h => h.status === "upcoming").slice(0, 3);
  const activeHackathons = hackathons.filter(h => h.status === "active").slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Привет, {user?.name}!</h1>
        <p className="text-muted-foreground">Твой пути в мир хакатонов начинается здесь</p>
      </div>

      {activeHackathons.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Текущие хакатоны</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeHackathons.map((hackathon) => (
              <Card key={hackathon.id} className="overflow-hidden border border-border/40 bg-card/30 backdrop-blur-sm">
                <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                  <img
                    src={hackathon.image || "/placeholder.svg"}
                    alt={hackathon.title}
                    className="h-16 w-auto object-contain"
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{hackathon.title}</CardTitle>
                      <CardDescription className="mt-1">{hackathon.description}</CardDescription>
                    </div>
                    <Badge className="bg-primary">Текущий</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{hackathon.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link to={`/hackathons/${hackathon.id}`}>Подробно</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Команда</CardTitle>
            <CardDescription>Информация о твоей текущей команде</CardDescription>
          </CardHeader>
          <CardContent>
            {userTeam ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{userTeam.name}</h3>
                  <p className="text-sm text-muted-foreground">{userTeam.description || "No team description"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userTeam.memberIds.length} участников</span>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/team">Изменить</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="flex justify-center">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground mb-4">У тебя сейчас нет команды</p>
                  <Button asChild>
                    <Link to="/team/create">Создать команду</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Будущие хакатоны</CardTitle>
            <CardDescription>Следи за новыми событиями</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingHackathons.length > 0 ? (
              <div className="space-y-4">
                {upcomingHackathons.map((hackathon) => (
                  <div key={hackathon.id} className="flex items-start gap-3 pb-3 border-b border-border/30 last:border-0">
                    <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{hackathon.title}</h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(hackathon.startDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {hackathon.location}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link to={`/hackathons/${hackathon.id}`}>Подробно</Link>
                    </Button>
                  </div>
                ))}
                <Button variant="outline" asChild className="w-full">
                  <Link to="/hackathons">Смотреть все</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="flex justify-center">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Нет будущих хакатонов</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
