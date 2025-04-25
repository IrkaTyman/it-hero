import React from "react";
import { useParams } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon } from "lucide-react";

export default function TeamSubmissions() {
  const { id: hackathonId } = useParams();
  const { teams, projects, getHackathonById } = useData();
  
  const hackathon = getHackathonById(hackathonId || "");
  const hackathonTeams = teams.filter(team => team.hackathonId === hackathonId);
  const hackathonProjects = projects.filter(project => project.hackathonId === hackathonId);

  if (!hackathon) {
    return <div>Хакатон не найден</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Решения команд</h1>
        <p className="text-muted-foreground">
          Проверка решений команд в хакатоне {hackathon.title}
        </p>
      </div>

      <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Все решения</CardTitle>
          <CardDescription>Посмотреть все решения команд</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название команды</TableHead>
                <TableHead>Репозиторий</TableHead>
                <TableHead>Проект</TableHead>
                <TableHead>Презентация</TableHead>
                <TableHead>Дата сдачи</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hackathonTeams.map((team) => {
                const project = hackathonProjects.find(p => p.teamId === team.id);
                return (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>
                      {project?.submissions?.repository ? (
                        <a
                          href={project.submissions.repository.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <LinkIcon className="h-4 w-4" />
                          Смотреть
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Не сдано</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {project?.submissions?.project ? (
                        <a
                          href={project.submissions.project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <LinkIcon className="h-4 w-4" />
                          Смотреть
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Не сдано</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {project?.submissions?.presentation ? (
                        <a
                          href={project.submissions.presentation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <LinkIcon className="h-4 w-4" />
                          Смотреть
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Не сдано</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {project ? new Date(project.submissionDate).toLocaleString() : "-"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
