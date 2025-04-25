import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { registerUser } from "@/api/user.ts";
import { mapAirtableUserToUser } from "@/types/mappers.ts";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    avatar: "",
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Regular User",
    role: "participant",
    avatar: "",
    teamId: "team1",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user data in localStorage
    const savedUser = localStorage.getItem("hackathonUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Find user with matching email (for demo purposes)
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        throw new Error("Invalid email or password");
      }

      
      // Save user to state and localStorage
      setUser(user);
      localStorage.setItem("hackathonUser", JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const newUser = await registerUser({
        password,
        fullName: name,
        email,
      })

      setUser(mapAirtableUserToUser(newUser));
      localStorage.setItem("hackathonUser", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hackathonUser");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
