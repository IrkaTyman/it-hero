import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, User, PlusCircle, Link as LinkIcon, FileText, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SubmissionCard } from "@/components/submissions/SubmissionCard";
import { SubmissionType } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function TeamManagement() {
  const { user } = useAuth();
  const { getUserTeam, hackathons, leaveTeam, submitProject, projects, timelineEvents } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const team = user ? getUserTeam(user.id) : undefined;
  const hackathon = team ? hackathons.find(h => h.id === team.hackathonId) : undefined;

  const handleLeaveTeam = async () => {
    try {
      if (!user || !team) return;
      await leaveTeam(team.id, user.id);
      toast({
        title: "Успешно покинули команду",
      });
    } catch (error) {
      toast({
        title: "Произошла ошибка",
        variant: "destructive",
      });
    }
  };

  if (!team) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление командой</h1>
          <p className="text-muted-foreground">Создайте или присоединитесь к команде для участия в хакатонах</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Создать</CardTitle>
              <CardDescription>Создайте новую команду и пригласите участников</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <p className="mb-6">Заполните форму для создания команды</p>
            </CardContent>
            <CardFooter>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Создать</Button>
                </DialogTrigger>
                <DialogContent>
                  <CreateTeamForm onClose={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Присоединиться к команде</CardTitle>
              <CardDescription>Присоединиться к команде по коду</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="flex justify-center mb-4">
                <LinkIcon className="h-12 w-12 text-primary" />
              </div>
              <p className="mb-6">Введите пригласительный код</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Присоединиться</Button>
            </CardFooter>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Найти участников в команду</CardTitle>
              <CardDescription>Изучить список желающих вступить в команду</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="flex justify-center mb-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <p className="mb-6">Обьединиться с другими участниками</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Найти</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const handleSubmitUrl = async (type: SubmissionType["type"], url: string) => {
    try {
      if (!user || !team) return;
      
      await submitProject({
        ...team.projectId ? { id: team.projectId } : {},
        title: team.name,
        description: team.description || "",
        teamId: team.id,
        hackathonId: team.hackathonId,
        submissions: {
          [type]: {
            url,
            submittedAt: new Date().toISOString(),
          },
        },
      });
      
      toast({
        title: "Успешно",
      });
    } catch (error) {
      toast({
        title: "Произошла ошибка",
        variant: "destructive",
      });
    }
  };

  // Find the submission deadlines from the timeline events
  const submissionDeadlines = timelineEvents?.filter(event => 
    event.title.toLowerCase().includes('submission') ||
    event.title.toLowerCase().includes('present')
  );

  const projectDeadline = submissionDeadlines?.find(e => 
    e.title.toLowerCase().includes('project'))?.endTime || hackathon?.endDate;
  const presentationDeadline = submissionDeadlines?.find(e => 
    e.title.toLowerCase().includes('present'))?.endTime || hackathon?.endDate;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Team: {team.name}</h1>
        <p className="text-muted-foreground">
          {hackathon ? (
            <>
              Проходите <Link to={`/hackathons/${hackathon.id}`} className="text-primary hover:underline">{hackathon.title}</Link>
            </>
          ) : (
            "Управлять командой и проектами"
          )}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>О команде</CardTitle>
              <CardDescription>Изучить и измени информацию о команде</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Название</label>
                <Input value={team.name} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Описание</label>
                <Textarea value={team.description || ""} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Код</label>
                <div className="flex items-center gap-2">
                  <Input value={`TEAM-${team.id.substring(0, 6).toUpperCase()}`} disabled />
                  <Button size="sm" variant="outline">Скопировать</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Поделитесь этим кодом с другими участниками</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Изменить</Button>
              <Button variant="destructive" onClick={handleLeaveTeam}>Покинуть</Button>
            </CardFooter>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Проекты</CardTitle>
                <CardDescription>Подтвердите свои проекты</CardDescription>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Новое решение
              </Button>
            </CardHeader>
            <CardContent>
              {team.projectId ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-10 w-10 text-primary mr-4" />
                        <div>
                          <h3 className="font-medium">Название проекта</h3>
                          <p className="text-sm text-muted-foreground">Сдан {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge>Submitted</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">GitHub</label>
                      <Input value="https://github.com/username/project" disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Демо URL</label>
                      <Input value="https://project-demo.example.com" disabled />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Не сданы проекты</h3>
                  <p className="text-muted-foreground mb-4">Сдайте проект до дедлайна</p>
                  <Button>Create Submission</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Решения</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <SubmissionCard
              type="repository"
              deadline={projectDeadline}
              submitted={team?.projectId ? projects.find(p => p.id === team.projectId)?.submissions?.repository : undefined}
              onSubmit={handleSubmitUrl}
            />
            <SubmissionCard
              type="project"
              deadline={projectDeadline}
              submitted={team?.projectId ? projects.find(p => p.id === team.projectId)?.submissions?.project : undefined}
              onSubmit={handleSubmitUrl}
            />
            <SubmissionCard
              type="presentation"
              deadline={presentationDeadline}
              submitted={team?.projectId ? projects.find(p => p.id === team.projectId)?.submissions?.presentation : undefined}
              onSubmit={handleSubmitUrl}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Участники команды</CardTitle>
            <CardDescription>{team.memberIds.length} участников</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {team.memberIds.map((memberId, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {index === 0 ? "U" : `M${index}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{index === 0 ? "Вы" : `Участник ${index + 1}`}</p>
                      {memberId === team.createdBy && (
                        <span className="text-xs text-muted-foreground">Тимлид</span>
                      )}
                    </div>
                  </div>
                  {memberId === team.createdBy && (
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      Лидер
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <User className="mr-2 h-4 w-4" />
              Пригласить
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Чеклист</CardTitle>
            <CardDescription>Отслеживайте прогресс</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { title: "Завершить формирование команды", done: true },
                { title: "Выбрать задачу", done: true },
                { title: "Отправить идею проекта", done: false },
                { title: "Создать репозиторий", done: false },
                { title: "Отправить проект", done: false },
                { title: "Подготовить презентацию", done: false },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 py-2">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${item.done ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {item.done ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </div>
                  <span className={item.done ? "line-through text-muted-foreground" : ""}>{item.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface CreateTeamFormProps {
  onClose: () => void;
}

function CreateTeamForm({ onClose }: CreateTeamFormProps) {
  const { user } = useAuth();
  const { hackathons, createTeam } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hackathonId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const upcomingHackathons = hackathons.filter(h => h.status !== "completed");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, hackathonId: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      await createTeam({
        name: formData.name,
        description: formData.description,
        hackathonId: formData.hackathonId,
        memberIds: [user.id],
        createdBy: user.id,
      });
      
      toast({
        title: "Команда создана",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Произошла ошибка",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Создайте новую команду</DialogTitle>

      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите название команды"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Описание</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишите навыки команды"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Хакатоны</label>
            <Select
              value={formData.hackathonId}
              onValueChange={handleSelectChange}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите хакатон" />
              </SelectTrigger>
              <SelectContent>
                {upcomingHackathons.length > 0 ? (
                  upcomingHackathons.map((hackathon) => (
                    <SelectItem key={hackathon.id} value={hackathon.id}>
                      {hackathon.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Нет доступных хакатонов
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Отменить
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Создание..." : "Создать"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}