import { createContext, useContext, ReactNode, useState } from "react";
import { Hackathon, Team, Challenge, Project, TimelineEvent, Assignment, JuryMember, UserProfile } from "@/types";

// Mock data for demonstration
const mockHackathons: Hackathon[] = [
  {
    id: "hack1",
    title: "AI Innovation Hackathon",
    description: "Создание решений на основе ИИ для решения",
    startDate: "2025-05-01",
    endDate: "2025-05-03",
    location: "Тех Хаб, Москва",
    image: "/placeholder.svg",
    status: "upcoming",
    organizerId: "1"
  },
  {
    id: "hack2",
    title: "Blockchain Challenge",
    description: "Создавайте инновационные блокчейн-приложения с реальной пользой",
    startDate: "2025-04-20",
    endDate: "2025-04-27",
    location: "Цифровой Центр, Санкт-Петербург",
    image: "/placeholder.svg",
    status: "active",
    organizerId: "1"
  },
  {
    id: "hack3",
    title: "Web3 Хакатон",
    description: "Создайте будущее децентрализованных веб-приложений",
    startDate: "2025-04-10",
    endDate: "2025-04-12",
    location: "Инновационный центр, Москва",
    image: "/placeholder.svg",
    status: "completed",
    organizerId: "1"
  }
];

const mockTeams: Team[] = [
  {
    id: "team1",
    name: "Code Wizards",
    hackathonId: "hack2",
    description: "Мы создаем волшебные программные решения",
    memberIds: ["2"],
    createdBy: "2",
  }
];

const mockChallenges: Challenge[] = [
  {
    id: "challenge1",
    title: "Персональный помощник на основе ИИ",
    description: "Создайте помощника на основе ИИ, который может помогать пользователям с повседневными задачами",
    hackathonId: "hack1",
    companyName: "TechCorp",
    companyLogo: "/placeholder.svg",
    requirements: "Необходимо использовать машинное обучение, иметь удобный интерфейс и возможность развертывания в Интернете",
    prizes: "1 место: 500000, 2 место: 250000, 3 место: 100000"
  },
  {
    id: "challenge2",
    title: "Блокчейн для цепочки поставок",
    description: "Разработать решение на основе блокчейна для повышения прозрачности цепочки поставок",
    hackathonId: "hack1",
    companyName: "LogiChain",
    companyLogo: "/placeholder.svg",
    requirements: "Необходимо использовать публичный блокчейн, иметь веб-интерфейс и продемонстрировать применимость в реальном мире",
    prizes: "1 место: 500000, 2 место: 250000, 3 место: 100000"
  }
];

const mockProjects: Project[] = [];

const mockTimeline: TimelineEvent[] = [
  {
    id: "event1",
    title: "Открытие хакатона",
    description: "Введение в хакатон и правила проведения",
    startTime: "2025-05-01T10:00:00",
    endTime: "2025-05-01T11:00:00",
    hackathonId: "hack1",
    location: "Главный зал"
  },
  {
    id: "event2",
    title: "Формирование команж",
    description: "Время для создания команды",
    startTime: "2025-05-01T11:00:00",
    endTime: "2025-05-01T12:00:00",
    hackathonId: "hack1",
    location: "Главный зал"
  },
  {
    id: "event3",
    title: "Начало программирования",
    description: "Начало работы для проектами",
    startTime: "2025-05-01T12:00:00",
    endTime: "2025-05-03T12:00:00",
    hackathonId: "hack1",
    location: "Вся площадка"
  },
  {
    id: "event4",
    title: "Дедлайн сдачи",
    description: "Финальная сдача проекта",
    startTime: "2025-05-03T12:00:00",
    endTime: "2025-05-03T12:30:00",
    hackathonId: "hack1",
    location: "Онлайн"
  },
];

const mockAssignments: Assignment[] = [
  {
    id: "assignment1",
    hackathonId: "hack2",
    title: "MVP Хакатонхаб",
    description: "Разработать платформу для проведения хакатонов",
    dueDate: "2025-04-25",
    requirements: "Нужно использовать ИИ",
    maxPoints: 100
  },
  {
    id: "assignment2",
    hackathonId: "hack2",
    title: "MVP Хакатонхаб",
    description: "Разработать платформу для проведения хакатонов",
    dueDate: "2025-04-27",
    requirements: "Нужно использовать ИИ",
    maxPoints: 50
  }
];

const mockJury: JuryMember[] = [
  {
    id: "jury1",
    name: "Мария Смирнова",
    email: "anna.smith@example.com",
    expertise: ["Blockchain", "Smart Contracts"],
    hackathonIds: ["hack2"]
  },
  {
    id: "jury2",
    name: "Иван Иванов",
    email: "john.doe@example.com",
    expertise: ["Web", "Backend"],
    hackathonIds: ["hack2"]
  }
];

interface DataContextType {
  hackathons: Hackathon[];
  teams: Team[];
  challenges: Challenge[];
  projects: Project[];
  timelineEvents: TimelineEvent[];
  assignments: Assignment[];
  jury: JuryMember[];
  getHackathonById: (id: string) => Hackathon | undefined;
  getTeamById: (id: string) => Team | undefined;
  getChallengesByHackathonId: (hackathonId: string) => Challenge[];
  getTimelineByHackathonId: (hackathonId: string) => TimelineEvent[];
  getAssignmentsByHackathonId: (hackathonId: string) => Assignment[];
  getJuryByHackathonId: (hackathonId: string) => JuryMember[];
  getUserTeam: (userId: string) => Team | undefined;
  createTeam: (team: Omit<Team, "id">) => Promise<Team>;
  joinTeam: (teamId: string, userId: string) => Promise<boolean>;
  leaveTeam: (teamId: string, userId: string) => Promise<boolean>;
  submitProject: (project: Omit<Project, "id" | "submissionDate">) => Promise<Project>;
  createHackathon: (hackathon: Omit<Hackathon, "id">) => Promise<Hackathon>;
  updateHackathon: (id: string, hackathon: Partial<Hackathon>) => Promise<Hackathon>;
  createChallenge: (challenge: Omit<Challenge, "id">) => Promise<Challenge>;
  updateChallenge: (id: string, challenge: Partial<Challenge>) => Promise<Challenge>;
  deleteChallenge: (id: string) => Promise<boolean>;
  removeTeamFromHackathon: (teamId: string) => Promise<boolean>;
  rateProject: (projectId: string, rating: number, feedback?: string) => Promise<boolean>;
  createAssignment: (assignment: Omit<Assignment, "id">) => Promise<Assignment>;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => Promise<Assignment>;
  deleteAssignment: (id: string) => Promise<boolean>;
  addJuryMember: (member: Omit<JuryMember, "id">) => Promise<JuryMember>;
  removeJuryMember: (id: string, hackathonId: string) => Promise<boolean>;
  requestTeamAssignment: (userId: string, hackathonId: string) => Promise<boolean>;
  updateUserProfile: (userId: string, profile: Partial<UserProfile>) => Promise<UserProfile>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [hackathons, setHackathons] = useState<Hackathon[]>(mockHackathons);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(mockTimeline);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [jury, setJury] = useState<JuryMember[]>(mockJury);

  const getHackathonById = (id: string) => {
    return hackathons.find(hack => hack.id === id);
  };

  const getTeamById = (id: string) => {
    return teams.find(team => team.id === id);
  };

  const getChallengesByHackathonId = (hackathonId: string) => {
    return challenges.filter(challenge => true);
  };

  const getTimelineByHackathonId = (hackathonId: string) => {
    return timelineEvents.filter(event => event.hackathonId === hackathonId);
  };

  const getAssignmentsByHackathonId = (hackathonId: string) => {
    return assignments.filter(assignment => assignment.hackathonId === hackathonId);
  };

  const getJuryByHackathonId = (hackathonId: string) => {
    return jury.filter(member => member.hackathonIds.includes(hackathonId));
  };

  const getUserTeam = (userId: string) => {
    return teams.find(team => team.memberIds.includes(userId));
  };

  const createTeam = async (teamData: Omit<Team, "id">) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`
    };
    
    setTeams(prev => [...prev, newTeam]);
    return newTeam;
  };

  const joinTeam = async (teamId: string, userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          memberIds: [...team.memberIds, userId]
        };
      }
      return team;
    }));
    
    return true;
  };

  const leaveTeam = async (teamId: string, userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          memberIds: team.memberIds.filter(id => id !== userId)
        };
      }
      return team;
    }));
    
    return true;
  };

  const submitProject = async (projectData: Omit<Project, "id" | "submissionDate">) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      submissionDate: new Date().toISOString(),
    };
    
    setProjects(prev => [...prev, newProject]);
    
    setTeams(prev => prev.map(team => {
      if (team.id === projectData.teamId) {
        return {
          ...team,
          projectId: newProject.id
        };
      }
      return team;
    }));
    
    return newProject;
  };

  const createHackathon = async (hackathonData: Omit<Hackathon, "id">) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newHackathon: Hackathon = {
      ...hackathonData,
      id: `hack-${Date.now()}`
    };
    
    setHackathons(prev => [...prev, newHackathon]);
    return newHackathon;
  };

  const updateHackathon = async (id: string, hackathonData: Partial<Hackathon>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let updatedHackathon: Hackathon | undefined;
    
    setHackathons(prev => {
      return prev.map(hackathon => {
        if (hackathon.id === id) {
          updatedHackathon = {
            ...hackathon,
            ...hackathonData
          };
          return updatedHackathon;
        }
        return hackathon;
      });
    });
    
    if (!updatedHackathon) {
      throw new Error("Хакатон не найден");
    }
    
    return updatedHackathon;
  };

  const createChallenge = async (challengeData: Omit<Challenge, "id">) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newChallenge: Challenge = {
      ...challengeData,
      id: `challenge-${Date.now()}`
    };
    
    setChallenges(prev => [...prev, newChallenge]);
    return newChallenge;
  };

  const updateChallenge = async (id: string, challengeData: Partial<Challenge>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let updatedChallenge: Challenge | undefined;
    
    setChallenges(prev => {
      return prev.map(challenge => {
        if (challenge.id === id) {
          updatedChallenge = {
            ...challenge,
            ...challengeData
          };
          return updatedChallenge;
        }
        return challenge;
      });
    });
    
    if (!updatedChallenge) {
      throw new Error("Кейс не найдены");
    }
    
    return updatedChallenge;
  };

  const deleteChallenge = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setChallenges(prev => prev.filter(challenge => challenge.id !== id));
    return true;
  };

  const removeTeamFromHackathon = async (teamId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTeams(prev => prev.filter(team => team.id !== teamId));
    return true;
  };

  const rateProject = async (projectId: string, rating: number, feedback?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProjects(prev => {
      return prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            rating,
            feedback
          };
        }
        return project;
      });
    });
    
    return true;
  };

  const createAssignment = async (assignmentData: Omit<Assignment, "id">) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assignment-${Date.now()}`
    };
    setAssignments(prev => [...prev, newAssignment]);
    return newAssignment;
  };

  const updateAssignment = async (id: string, data: Partial<Assignment>) => {
    let updatedAssignment: Assignment | undefined;
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === id) {
        updatedAssignment = { ...assignment, ...data };
        return updatedAssignment;
      }
      return assignment;
    }));
    if (!updatedAssignment) throw new Error("Assignment not found");
    return updatedAssignment;
  };

  const deleteAssignment = async (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    return true;
  };

  const addJuryMember = async (memberData: Omit<JuryMember, "id">) => {
    const newMember: JuryMember = {
      ...memberData,
      id: `jury-${Date.now()}`
    };
    setJury(prev => [...prev, newMember]);
    return newMember;
  };

  const removeJuryMember = async (id: string, hackathonId: string) => {
    setJury(prev => {
      return prev.map(member => {
        if (member.id === id) {
          return {
            ...member,
            hackathonIds: member.hackathonIds.filter(hId => hId !== hackathonId)
          };
        }
        return member;
      });
    });
    return true;
  };

  const requestTeamAssignment = async (userId: string, hackathonId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  };

  const updateUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: userId,
      ...profile
    } as UserProfile;
  };

  return (
    <DataContext.Provider value={{
      hackathons,
      teams,
      challenges,
      projects,
      timelineEvents,
      assignments,
      jury,
      getHackathonById,
      getTeamById,
      getChallengesByHackathonId,
      getTimelineByHackathonId,
      getAssignmentsByHackathonId,
      getJuryByHackathonId,
      getUserTeam,
      createTeam,
      joinTeam,
      leaveTeam,
      submitProject,
      createHackathon,
      updateHackathon,
      createChallenge,
      updateChallenge,
      deleteChallenge,
      removeTeamFromHackathon,
      rateProject,
      createAssignment,
      updateAssignment,
      deleteAssignment,
      addJuryMember,
      removeJuryMember,
      requestTeamAssignment,
      updateUserProfile
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
