import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { format } from "date-fns";
import { Edit, LoaderIcon, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { findAllHackathon } from "@/api/hackathon.ts";

const AdminHackathonList = () => {
    const navigate = useNavigate();
    const { hackathons, teams } = useData();
    const [statusFilter, setStatusFilter] = useState<string>("all");


    const [allHackathon, setAllHackathon] = useState<any[] | null>(null);

    useEffect(() => {
        findAllHackathon().then(result => setAllHackathon(result))

    }, [])

    const filteredHackathons = statusFilter === "all"
        ? allHackathon // Ensure allHackathon is not null
        : (allHackathon || []).filter(h => h.status === statusFilter);

    const getTeamCount = (hackathonId: string) => {
        return teams.filter(team => team.hackathonId === hackathonId).length;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "upcoming":
                return <Badge variant="outline" className="bg-blue-100 text-blue-800">Будущие</Badge>;
            case "active":
                return <Badge variant="outline" className="bg-green-100 text-green-800">Текущие</Badge>;
            case "completed":
                return <Badge variant="outline" className="bg-gray-100 text-gray-800">Прошедшие</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Управление хакатонами</h1>
                <Button onClick={() => navigate("/admin/hackathons/new")} className="flex items-center gap-2">
                    <Plus size={16}/> Создать новый
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Хакатоны</CardTitle>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">По статусу:</span>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все</SelectItem>
                                    <SelectItem value="upcoming">Будущие</SelectItem>
                                    <SelectItem value="active">Текущие</SelectItem>
                                    <SelectItem value="completed">Прошедшие</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Название</TableHead>
                                <TableHead>Статус</TableHead>
                                <TableHead>Дата начала</TableHead>
                                <TableHead>Дата завершения</TableHead>
                                <TableHead>Команды</TableHead>
                                <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                filteredHackathons ?
                                    filteredHackathons.length > 0 ? (
                                        filteredHackathons.map((hackathon) => (
                                            <TableRow key={hackathon.id}>
                                                <TableCell className="font-medium">{hackathon.title}</TableCell>
                                                <TableCell>{getStatusBadge(hackathon.status)}</TableCell>
                                                <TableCell>{format(new Date(hackathon.startDate), "MMM dd, yyyy")}</TableCell>
                                                <TableCell>{format(new Date(hackathon.endDate), "MMM dd, yyyy")}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Users size={16}/>
                                                        <span>{getTeamCount(hackathon.id)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => navigate(`/admin/hackathons/${hackathon.id}`)}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Edit size={14}/> Редактировать
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => navigate(`/admin/hackathons/${hackathon.id}/submissions`)}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Users size={14}/> Задания
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                                {statusFilter !== "all"
                                                    ? `No ${statusFilter} hackathons found.`
                                                    : "No hackathons found. Create one to get started."}
                                            </TableCell>
                                        </TableRow>
                                    ) : <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            <LoaderIcon className="animate-spin top-[50%] left-[50%] absolute"/>
                                        </TableCell>
                                    </TableRow>
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminHackathonList;
