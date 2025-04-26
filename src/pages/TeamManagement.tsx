import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, FileText, Link as LinkIcon, User, Users, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SubmissionType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { findTeamsByUserId, joinTeamByInviteCode } from "@/api/team";
import { deleteArtifact, getTeamArtifacts, uploadArtifact } from "@/api/artifacts";

export default function TeamManagement() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const create = queryParams.get('create');
    const navigate = useNavigate();

    const { user } = useAuth();
    const { hackathons, leaveTeam, submitProject, projects, timelineEvents } = useData();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(create ?? false);
    const [isOpenJoinTeam, setIsOpenJoinTeam] = useState(false);

    const [team, setTeam] = useState(null);

    useEffect(() => {
        findTeamsByUserId(user?.id).then((data) => {
            setTeam(data)
        });
    }, [user?.id])

    const [artifactName, setArtifactName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [artifacts, setArtifacts] = useState<any[]>([]);

    // Загрузка списка артефактов при монтировании компонента
    useEffect(() => {
        if (team?.id) {
            getTeamArtifacts(team.id)
                .then(data => setArtifacts(data))
                .catch(error => {
                    console.error("Ошибка при загрузке артефактов:", error);
                    toast({
                        title: "Ошибка при загрузке решений",
                        variant: "destructive",
                    });
                });
        }
    }, [team?.id]);

    // Обработчик загрузки файла
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // Обработчик отправки формы
    const handleUploadArtifact = async () => {
        if (!artifactName.trim()) {
            toast({
                title: "Ошибка",
                description: "Пожалуйста, введите название решения",
                variant: "destructive"
            });
            return;
        }

        if (!selectedFile) {
            toast({
                title: "Ошибка",
                description: "Пожалуйста, выберите файл",
                variant: "destructive"
            });
            return;
        }

        if (!team) {
            toast({
                title: "Ошибка",
                description: "Команда не найдена",
                variant: "destructive"
            });
            return;
        }

        setIsUploading(true);
        try {
            await uploadArtifact({
                teamId: team.id,
                name: artifactName,
                file: selectedFile
            });

            // Обновляем список артефактов
            const updatedArtifacts = await getTeamArtifacts(team.id);
            setArtifacts(updatedArtifacts);

            // Сбрасываем форму
            setArtifactName("");
            setSelectedFile(null);

            toast({
                title: "Успешно",
                description: "Решение успешно загружено",
            });
        } catch (error) {
            console.error("Ошибка при загрузке решения:", error);
            toast({
                title: "Ошибка при загрузке решения",
                description: error instanceof Error ? error.message : "Произошла неизвестная ошибка",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Обработчик удаления артефакта
    const handleDeleteArtifact = async (artifactId: string, fileUrl: string) => {
        try {
            await deleteArtifact(artifactId, fileUrl);

            // Обновляем список артефактов
            setArtifacts(artifacts.filter(artifact => artifact.id !== artifactId));

            toast({
                title: "Успешно",
                description: "Решение успешно удалено",
            });
        } catch (error) {
            console.error("Ошибка при удалении решения:", error);
            toast({
                title: "Ошибка при удалении решения",
                variant: "destructive"
            });
        }
    };

    const hackathon = team ? hackathons.find(h => h.id === team.hackathonId) : undefined;

    const handleRemoveCreateParam = () => {
        queryParams.delete('create');
        navigate({
            pathname: location.pathname,
            search: queryParams.toString(),
        });
    };

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
                    <p className="text-muted-foreground">Создайте или присоединитесь к команде для участия в
                        хакатонах</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Создать</CardTitle>
                            <CardDescription>Создайте новую команду и пригласите участников</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center py-6">
                            <div className="flex justify-center mb-4">
                                <Users className="h-12 w-12 text-primary"/>
                            </div>
                            <p className="mb-6">Заполните форму для создания команды</p>
                        </CardContent>
                        <CardFooter>
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                if (!open) handleRemoveCreateParam()
                                setIsDialogOpen(open)
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="w-full">Создать</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <CreateTeamForm onClose={() => {
                                        handleRemoveCreateParam()
                                        setIsDialogOpen(false)
                                    }}/>
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
                                <LinkIcon className="h-12 w-12 text-primary"/>
                            </div>
                            <p className="mb-6">Введите пригласительный код</p>
                        </CardContent>
                        <CardFooter>
                            <Dialog open={isOpenJoinTeam} onOpenChange={setIsOpenJoinTeam}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">Присоединиться</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <JoinTeamForm onClose={() => {
                                        setIsOpenJoinTeam(false)
                                    }} setTeam={setTeam}/>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>

                    <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Найти участников в команду</CardTitle>
                            <CardDescription>Изучить список желающих вступить в команду</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center py-6">
                            <div className="flex justify-center mb-4">
                                <User className="h-12 w-12 text-primary"/>
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

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text) // Копируем в буфер обмена
            .then(() => {
                toast({
                    title: "Код приглашения успешно скопирован!"
                });
            });
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
                <h1 className="text-3xl font-bold mb-2">Команда "{team.name}"</h1>
                <p className="text-muted-foreground">
                    {hackathon ? (
                        <>
                            Проходите <Link to={`/hackathons/${hackathon.id}`}
                                            className="text-primary hover:underline">{hackathon.title}</Link>
                        </>
                    ) : (
                        "Управлять командой и проектами"
                    )}
                </p>
            </div>

            <div className="grid gap-6">
                <div className="space-y-6">
                    <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>О команде</CardTitle>
                            <CardDescription>Изучить и измени информацию о команде</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Название</label>
                                <Input value={team.name} disabled/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Описание</label>
                                <Textarea value={team.description || ""} disabled/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Код</label>
                                <div className="flex items-center gap-2">
                                    <Input value={`${team.code}`} disabled/>
                                    <Button size="sm" variant="outline"
                                            onClick={() => handleCopy(team.code)}>Скопировать</Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Поделитесь этим кодом с другими
                                    участниками</p>
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
                                <CardTitle>Решения</CardTitle>
                                <CardDescription>Загрузите свое решение для хактона</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Форма загрузки решения */}
                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                    <h3 className="font-medium mb-4">Добавить новое решение</h3>
                                    <div className="grid gap-4">
                                        <div>
                                            <label className="text-sm font-medium">Название решения</label>
                                            <Input
                                                placeholder="Введите название решения"
                                                value={artifactName}
                                                onChange={(e) => setArtifactName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Файл</label>
                                            <Input
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                            {selectedFile && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Выбран
                                                    файл: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} КБ)
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={handleUploadArtifact}
                                            disabled={isUploading}
                                        >
                                            {isUploading ? "Загрузка..." : "Добавить решение"}
                                        </Button>
                                    </div>
                                </div>

                                {/* Список решений */}
                                <div>
                                    <h3 className="font-medium mb-4">Ваши решения</h3>
                                    {artifacts.length > 0 ? (
                                        <div className="space-y-4">
                                            {artifacts.map((artifact) => (
                                                <div key={artifact.id}
                                                     className="p-4 rounded-lg border flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <FileText className="h-10 w-10 text-primary mr-4"/>
                                                        <div>
                                                            <h3 className="font-medium">{artifact.name}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Загружено {new Date(artifact.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => window.open(artifact.fileUrl, '_blank')}
                                                        >
                                                            Скачать
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteArtifact(artifact.id, artifact.fileUrl)}
                                                        >
                                                            Удалить
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
                                            <h3 className="text-lg font-medium mb-2">Нет загруженных решений</h3>
                                            <p className="text-muted-foreground mb-4">Загрузите ваше первое решение,
                                                используя форму выше</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
                                            <AvatarImage src=""/>
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
                        <Button className="w-full" onClick={() => handleCopy(team.code)}>
                            <User className="mr-2 h-4 w-4"/>
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
                                    <div
                                        className={`h-6 w-6 rounded-full flex items-center justify-center ${item.done ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                                        {item.done ? <Check className="h-4 w-4"/> : <X className="h-4 w-4"/>}
                                    </div>
                                    <span
                                        className={`${item.done ? "text-primary" : ""}`}>{item.title}</span>
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
                        <label className="text-sm font-medium">Хактоны</label>
                        <Select
                            value={formData.hackathonId}
                            onValueChange={handleSelectChange}
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Выберите хактон"/>
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
                                        Нет доступных хактонов
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

interface JoinTeamFormProps {
    onClose: () => void;
    setTeam: React.Dispatch<any>
}

function JoinTeamForm({ onClose, setTeam }: JoinTeamFormProps) {
    const { user } = useAuth();
    const { joinTeam } = useData();
    const { toast } = useToast();
    const [teamCode, setTeamCode] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!teamCode.trim()) {
            toast({
                title: "Ошибка",
                description: "Пожалуйста, введите код команды",
                variant: "destructive"
            });
            return;
        }

        if (!user) {
            toast({
                title: "Ошибка",
                description: "Вы должны быть авторизованы",
                variant: "destructive"
            });
            return;
        }

        setIsJoining(true);
        try {
            await joinTeamByInviteCode(teamCode, user.id);

            toast({
                title: "Успешно!",
                description: "Вы присоединились к команде",
            });

            onClose();
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Не удалось присоединиться к команде. Проверьте код и попробуйте снова.",
                variant: "destructive"
            });
        } finally {
            setIsJoining(false);
            findTeamsByUserId(user?.id).then((data) => {
                setTeam(data)
            });
        }
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Присоединиться к команде</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="team-code" className="text-right">
                            Код команды
                        </label>
                        <Input
                            id="team-code"
                            value={teamCode}
                            onChange={(e) => setTeamCode(e.target.value)}
                            placeholder="Введите код команды"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={isJoining}>
                        {isJoining ? "Присоединение..." : "Присоединиться"}
                    </Button>
                </DialogFooter>
            </form>
        </>
    );
}