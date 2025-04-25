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
        title: "Left team",
        description: "You have successfully left the team.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave the team. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!team) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team Management</h1>
          <p className="text-muted-foreground">Create or join a team to participate in hackathons</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Create a New Team</CardTitle>
              <CardDescription>Start your own team for a hackathon</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <p className="mb-6">Form a team and invite others to join you</p>
            </CardContent>
            <CardFooter>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Create Team</Button>
                </DialogTrigger>
                <DialogContent>
                  <CreateTeamForm onClose={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Join an Existing Team</CardTitle>
              <CardDescription>Join a team using an invite code</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="flex justify-center mb-4">
                <LinkIcon className="h-12 w-12 text-primary" />
              </div>
              <p className="mb-6">Enter a team code to join an existing team</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Join with Code</Button>
            </CardFooter>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Find Teammates</CardTitle>
              <CardDescription>Looking for team members?</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="flex justify-center mb-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <p className="mb-6">Connect with other participants looking for teams</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Find Teammates</Button>
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
        title: "Success",
        description: `Your ${type} has been submitted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
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
              Participating in <Link to={`/hackathons/${hackathon.id}`} className="text-primary hover:underline">{hackathon.title}</Link>
            </>
          ) : (
            "Manage your team and project"
          )}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Team Details</CardTitle>
              <CardDescription>View and edit your team information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Team Name</label>
                <Input value={team.name} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea value={team.description || ""} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Team Code</label>
                <div className="flex items-center gap-2">
                  <Input value={`TEAM-${team.id.substring(0, 6).toUpperCase()}`} disabled />
                  <Button size="sm" variant="outline">Copy</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Share this code with others to invite them to your team</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Edit Team</Button>
              <Button variant="destructive" onClick={handleLeaveTeam}>Leave Team</Button>
            </CardFooter>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Project Submission</CardTitle>
                <CardDescription>Submit your hackathon project</CardDescription>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Submission
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
                          <h3 className="font-medium">Project Title</h3>
                          <p className="text-sm text-muted-foreground">Submitted on {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge>Submitted</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">GitHub Repository</label>
                      <Input value="https://github.com/username/project" disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Demo URL</label>
                      <Input value="https://project-demo.example.com" disabled />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No project submitted yet</h3>
                  <p className="text-muted-foreground mb-4">Submit your project before the deadline</p>
                  <Button>Create Submission</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Submissions</h2>
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
            <CardTitle>Team Members</CardTitle>
            <CardDescription>{team.memberIds.length} members</CardDescription>
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
                      <p className="font-medium">{index === 0 ? "You" : `Member ${index + 1}`}</p>
                      {memberId === team.createdBy && (
                        <span className="text-xs text-muted-foreground">Team Leader</span>
                      )}
                    </div>
                  </div>
                  {memberId === team.createdBy && (
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      Leader
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <User className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Team Checklist</CardTitle>
            <CardDescription>Track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { title: "Complete team formation", done: true },
                { title: "Select challenge", done: true },
                { title: "Submit project idea", done: false },
                { title: "Create repository", done: false },
                { title: "Submit project", done: false },
                { title: "Prepare presentation", done: false },
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
        title: "Team created",
        description: "Your team has been created successfully.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create a New Team</DialogTitle>
        <DialogDescription>
          Fill out the form below to create your hackathon team
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Team Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your team name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your team and skills"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Hackathon</label>
            <Select
              value={formData.hackathonId}
              onValueChange={handleSelectChange}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a hackathon" />
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
                    No hackathons available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Team"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}