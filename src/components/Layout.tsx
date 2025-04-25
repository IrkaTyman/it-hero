import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Home,
  LogOut,
  User,
  Users,
  Bell,
  Settings,
  Menu,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { mapRoleToAirtable } from "@/types/mappers.ts";

interface LayoutProps {
  children: ReactNode;
}

function MainSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  const participantMenu = [
    {
      title: "Дашборд",
      icon: Home,
      url: "/",
      isActive: location.pathname === "/",
    },
    {
      title: "Хакатоны",
      icon: Calendar,
      url: "/hackathons",
      isActive: location.pathname.includes("/hackathons"),
    },
    {
      title: "Команда",
      icon: Users,
      url: "/team",
      isActive: location.pathname.includes("/team"),
    },
    {
      title: "Профиль",
      icon: User,
      url: "/profile",
      isActive: location.pathname.includes("/profile"),
    },
  ];

  const adminMenu = [
    {
      title: "Дашборд",
      icon: Home,
      url: "/admin",
      isActive: location.pathname === "/admin",
    },
    {
      title: "Хакатоны",
      icon: Calendar,
      url: "/admin/hackathons",
      isActive: location.pathname.includes("/admin/hackathons"),
    },
    {
      title: "Команды",
      icon: Users,
      url: "/admin/teams",
      isActive: location.pathname.includes("/admin/teams"),
    },
    {
      title: "Настройки",
      icon: Settings,
      url: "/admin/settings",
      isActive: location.pathname.includes("/admin/settings"),
    },
  ];

  const menuItems = user?.role === "admin" ? adminMenu : participantMenu;

  return (
    <Sidebar>
      <SidebarHeader className="py-2 px-4">
        <div className="flex gap-3 items-center">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
            H
          </div>
          <div className="font-bold text-lg">HackFlow</div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className={item.isActive ? "bg-primary/10" : ""} asChild>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {user?.name.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">{user?.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{mapRoleToAirtable(user?.role)}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MainSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className={cn("flex items-center mb-6", isMobile && "justify-between")}>
            {isMobile && (
              <SidebarTrigger>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
            )}
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
