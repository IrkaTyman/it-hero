import { createContext, useContext, ReactNode, useState } from "react";
import { Hackathon, Team, Challenge, Project, TimelineEvent, Assignment, JuryMember, UserProfile } from "@/types";

// Mock data for demonstration
const mockHackathons: Hackathon[] = [
  {
    id: "hack1",
    title: "AI Innovation Hackathon",
    description: "Create AI-powered solutions to solve real-world problems",
    startDate: "2025-05-01",
    endDate: "2025-05-03",
    location: "Tech Hub, Moscow",
    image: "/placeholder.svg",
    status: "upcoming",
    organizerId: "1"
  },
  {
    id: "hack2",
    title: "Blockchain Challenge",
    description: "Build innovative blockchain applications with real-world utility",
    startDate: "2025-04-20",
    endDate: "2025-04-27",
    location: "Digital Center, Saint Petersburg",
    image: "/placeholder.svg",
    status: "active",
    organizerId: "1"
  },
  {
    id: "hack3",
    title: "Web3 Hackathon",
    description: "Create the future of decentralized web applications",
    startDate: "2025-04-10",
    endDate: "2025-04-12",
    location: "Innovation Hub, Moscow",
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
    description: "We build magical software solutions",
    memberIds: ["2"],
    createdBy: "2",
  }
];

const mockChallenges: Challenge[] = [
  {
    id: "challenge1",
    title: "AI Personal Assistant",
    description: "Create an AI assistant that can help users with daily tasks",
    hackathonId: "hack1",
    companyName: "TechCorp",
    companyLogo: "/placeholder.svg",
    requirements: "Must use machine learning, have a user-friendly interface, and be deployable on the web",
    prizes: "1st Place: $5000, 2nd Place: $2500, 3rd Place: $1000"
  },
  {
    id: "challenge2",
    title: "Blockchain for Supply Chain",
    description: "Develop a blockchain solution to improve supply chain transparency",
    hackathonId: "hack1",
    companyName: "LogiChain",
    companyLogo: "/placeholder.svg",
    requirements: "Must use a public blockchain, have a web interface, and demonstrate real-world applicability",
    prizes: "1st Place: $7000, 2nd Place: $3000"
  }
];

const mockProjects: Project[] = [];

const mockTimeline: TimelineEvent[] = [
  {
    id: "event1",
    title: "Opening Ceremony",
    description: "Introduction to the hackathon and rules explanation",
    startTime: "2025-05-01T10:00:00",
    endTime: "2025-05-01T11:00:00",
    hackathonId: "hack1",
    location: "Main Hall"
  },
  {
    id: "event2",
    title: "Team Formation",
    description: "Time for participants to form teams",
    startTime: "2025-05-01T11:00:00",
    endTime: "2025-05-01T12:00:00",
    hackathonId: "hack1",
    location: "Collaboration Space"
  },
  {
    id: "event3",
    title: "Hacking Begins",
    description: "Start working on your projects",
    startTime: "2025-05-01T12:00:00",
    endTime: "2025-05-03T12:00:00",
    hackathonId: "hack1",
    location: "All Areas"
  },
  {
    id: "event4",
    title: "Submission Deadline",
    description: "Final time to submit your projects",
    startTime: "2025-05-03T12:00:00",
    endTime: "2025-05-03T12:30:00",
    hackathonId: "hack1",
    location: "Online Submission"
  },
  {
    id: "event5",
    title: "Judging",
    description: "Judges review submissions",
    startTime: "2025-05-03T13:00:00",
    endTime: "2025-05-03T15:00:00",
    hackathonId: "hack1",
    location: "Judging Room"
  },
  {
    id: "event6",
    title: "Awards Ceremony",
    description: "Winners announced and prizes awarded",
    startTime: "2025-05-03T16:00:00",
    endTime: "2025-05-03T17:00:00",
    hackathonId: "hack1",
    location: "Main Hall"
  }
];

const mockAssignments: Assignment[] = [
  {
    id: "assignment1",
    hackathonId: "hack2",
    title: "MVP Development",
    description: "Create a minimum viable product for your blockchain solution",
    dueDate: "2025-04-25",
    requirements: "Must include smart contracts and a web interface",
    maxPoints: 100
  },
  {
    id: "assignment2",
    hackathonId: "hack2",
    title: "Final Presentation",
    description: "Present your solution to the jury",
    dueDate: "2025-04-27",
    requirements: "10-minute presentation with demo",
    maxPoints: 50
  }
];

const mockJury: JuryMember[] = [
  {
    id: "jury1",
    name: "Dr. Anna Smith",
    email: "anna.smith@example.com",
    expertise: ["Blockchain", "Smart Contracts"],
    hackathonIds: ["hack2"]
  },
  {
    id: "jury2",
    name: "John Doe",
    email: "john.doe@example.com",
    expertise: ["Web3", "DeFi"],
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
    return challenges.filter(challenge => challenge.hackathonId === hackathonId);
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
      throw new Error("Hackathon not found");
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
      throw new Error("Challenge not found");
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
