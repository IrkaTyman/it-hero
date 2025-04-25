
import { useParams, Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, FileText, Link as LinkIcon } from "lucide-react";

export default function HackathonDetail() {
  const { id } = useParams();
  const { getHackathonById, getChallengesByHackathonId, getTimelineByHackathonId } = useData();
  
  const hackathon = getHackathonById(id || "");
  const challenges = getChallengesByHackathonId(id || "");
  const timeline = getTimelineByHackathonId(id || "");

  if (!hackathon) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Хакатон не найден</h2>
          <Button asChild>
            <Link to="/hackathons">К хакатонам</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
        <Link to="/hackathons" className="hover:text-primary">
          Хакатоны
        </Link>
        <span>/</span>
        <span className="text-foreground">{hackathon.title}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{hackathon.title}</h1>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {hackathon.location}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={hackathon.status === "active" ? "bg-primary" : ""}>
            {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
          </Badge>
          <Button>Зарегистрироваться</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Описание</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{hackathon.description}</p>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to={`/hackathons/${hackathon.id}/challenges`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Посмотреть кейсы
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/team/create">
                  <Users className="mr-2 h-4 w-4" />
                 Создать команду
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="#schedule">
                  <Clock className="mr-2 h-4 w-4" />
                 Посмотреть события
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <LinkIcon className="mr-2 h-4 w-4" />
                Посмотреть ресурсы
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="challenges">
        <TabsList>
          <TabsTrigger value="challenges">Кейсы</TabsTrigger>
        </TabsList>
        <TabsContent value="challenges" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Доступные кейсы</h2>
            {challenges.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="border border-border/40 bg-card/30 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{challenge.title}</CardTitle>
                          <CardDescription>by {challenge.companyName}</CardDescription>
                        </div>
                        {challenge.companyLogo && (
                          <img
                            src={challenge.companyLogo}
                            alt={`${challenge.companyName} logo`}
                            className="h-8 w-auto"
                          />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{challenge.description}</p>
                      
                      <div>
                        <h4 className="font-medium mb-1">Требования</h4>
                        <p className="text-sm text-muted-foreground">{challenge.requirements}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">Призы</h4>
                        <p className="text-sm text-muted-foreground">{challenge.prizes}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Нет кейсов</h3>
                <p className="text-muted-foreground">Кейсы сейчас не запланированы</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="schedule" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">События</h2>
            {timeline.length > 0 ? (
              <div className="relative border-l border-border pl-8 ml-4 space-y-8">
                {timeline.map((event, index) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-[2.35rem] h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                    </div>
                    <div className={`relative pb-8 ${index === timeline.length - 1 ? "pb-0" : ""}`}>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                          {new Date(event.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        {event.description && <p className="mt-1 text-muted-foreground">{event.description}</p>}
                        {event.location && (
                          <div className="flex items-center mt-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Нет событий</h3>
                <p className="text-muted-foreground">Пока нет событий :(</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
