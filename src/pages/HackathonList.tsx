
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HackathonList() {
  const { hackathons } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHackathons = hackathons.filter(hackathon => 
    hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hackathon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hackathon.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcoming = filteredHackathons.filter(h => h.status === "upcoming");
  const active = filteredHackathons.filter(h => h.status === "active");
  const completed = filteredHackathons.filter(h => h.status === "completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Хакатоны</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Найти хакатоны..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Будущие <Badge variant="outline" className="ml-2">{upcoming.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Текущие <Badge variant="outline" className="ml-2">{active.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Прошедщие <Badge variant="outline" className="ml-2">{completed.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.length > 0 ? (
              upcoming.map(hackathon => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Нет будущих хакатонов</h3>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {active.length > 0 ? (
              active.map(hackathon => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Нет текущих хакатонов</h3>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completed.length > 0 ? (
              completed.map(hackathon => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Нет завершенны хакатонов</h3>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HackathonCard({ hackathon }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="outline">Будущие</Badge>;
      case "active":
        return <Badge className="bg-primary">Текущие</Badge>;
      case "completed":
        return <Badge variant="secondary">Прошедшие</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden border border-border/40 bg-card/30 backdrop-blur-sm">
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
          {getStatusBadge(hackathon.status)}
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
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/hackathons/${hackathon.id}`}>Подробно</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}