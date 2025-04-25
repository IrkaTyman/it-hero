import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, FileText, Settings, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { hackathons, teams } = useData();
  
  const upcomingHackathons = hackathons.filter(h => h.status === "upcoming").length;
  const activeHackathons = hackathons.filter(h => h.status === "active").length;
  const completedHackathons = hackathons.filter(h => h.status === "completed").length;
  
  const totalTeams = teams.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage hackathons, teams, and challenges</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard 
          title="Upcoming Hackathons" 
          value={upcomingHackathons} 
          icon={<Calendar className="h-5 w-5" />}
          description="Events being prepared"
          linkTo="/admin/hackathons"
        />
        <StatsCard 
          title="Active Hackathons" 
          value={activeHackathons} 
          icon={<Clock className="h-5 w-5" />}
          description="Currently running"
          linkTo="/admin/hackathons"
        />
        <StatsCard 
          title="Total Teams" 
          value={totalTeams} 
          icon={<Users className="h-5 w-5" />}
          description="Participating teams"
          linkTo="/admin/teams"
        />
        <StatsCard 
          title="Completed Events" 
          value={completedHackathons} 
          icon={<FileText className="h-5 w-5" />}
          description="Past hackathons"
          linkTo="/admin/hackathons"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full justify-between">
                <Link to="/admin/hackathons/create">
                  Create New Hackathon
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-between">
                <Link to="/admin/challenges/create">
                  Add New Challenge
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-between">
                <Link to="/admin/teams">
                  Manage Teams
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-between">
                <Link to="/admin/settings">
                  System Settings
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActivityItem 
              title="New team registered"
              description="Team 'Code Wizards' has been created"
              time="2 hours ago"
            />
            <ActivityItem 
              title="Project submitted"
              description="Team 'DevMasters' submitted their project"
              time="5 hours ago"
            />
            <ActivityItem 
              title="Hackathon created"
              description="'AI Innovation Hackathon' has been set up"
              time="1 day ago"
            />
            <ActivityItem 
              title="Challenge added"
              description="New challenge added to 'Web3 Hackathon'"
              time="2 days ago"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upcoming Hackathons</CardTitle>
            <CardDescription>Next events on your calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hackathons
                .filter(h => h.status === "upcoming")
                .slice(0, 3)
                .map(hackathon => (
                  <div key={hackathon.id} className="flex items-center justify-between p-2 rounded-md hover:bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{hackathon.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(hackathon.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/hackathons/${hackathon.id}`}>
                        <Settings className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              {hackathons.filter(h => h.status === "upcoming").length === 0 && (
                <p className="text-center py-4 text-muted-foreground">
                  No upcoming hackathons scheduled
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Active Hackathons</CardTitle>
            <CardDescription>Currently running events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hackathons
                .filter(h => h.status === "active")
                .slice(0, 3)
                .map(hackathon => (
                  <div key={hackathon.id} className="flex items-center justify-between p-2 rounded-md hover:bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{hackathon.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Ends on {new Date(hackathon.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/hackathons/${hackathon.id}`}>
                        <Settings className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              {hackathons.filter(h => h.status === "active").length === 0 && (
                <p className="text-center py-4 text-muted-foreground">
                  No active hackathons at the moment
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Latest Teams</CardTitle>
            <CardDescription>Recently formed teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teams.slice(0, 3).map(team => (
                <div key={team.id} className="flex items-center justify-between p-2 rounded-md hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{team.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {team.memberIds.length} members
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/teams/${team.id}`}>
                      <Settings className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
              {teams.length === 0 && (
                <p className="text-center py-4 text-muted-foreground">
                  No teams have been formed yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  linkTo: string;
}

function StatsCard({ title, value, icon, description, linkTo }: StatsCardProps) {
  return (
    <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Link to={linkTo} className="text-xs text-primary hover:underline mt-2 inline-block">
          View details
        </Link>
      </CardContent>
    </Card>
  );
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
}

function ActivityItem({ title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
