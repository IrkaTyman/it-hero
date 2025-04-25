export type UserRole = "admin" | "participant";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  teamId?: string;
}

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  status: "upcoming" | "active" | "completed";
  organizerId: string;
}

export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  description?: string;
  memberIds: string[];
  projectId?: string;
  createdBy: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  hackathonId: string;
  companyName?: string;
  companyLogo?: string;
  requirements?: string;
  prizes?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  hackathonId: string;
  location?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
}

export interface SubmissionType {
  type: "project" | "presentation" | "repository";
  deadline: string;
  required: boolean;
  hackathonId: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  teamId: string;
  hackathonId: string;
  repositoryUrl?: string;
  demoUrl?: string;
  presentationUrl?: string;
  submissionDate: string;
  submissions: {
    [key in "project" | "presentation" | "repository"]?: {
      url: string;
      submittedAt: string;
    };
  };
  rating?: number;
  feedback?: string;
}

export interface Assignment {
  id: string;
  hackathonId: string;
  title: string;
  description: string;
  dueDate: string;
  requirements: string;
  maxPoints: number;
}

export interface JuryMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  expertise: string[];
  hackathonIds: string[];
}

export interface UserProfile extends User {
  fullName: string;
  skills: string[];
  bio: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
}
