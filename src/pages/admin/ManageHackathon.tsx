import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Save, Trash, Users, Award, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Define the form schema for hackathon details
const hackathonFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  registrationStartDate: z.date({
    required_error: "Registration start date is required",
  }),
  registrationEndDate: z.date({
    required_error: "Registration end date is required",
  }),
  status: z.enum(["upcoming", "active", "completed"]),
});

// Define the schema for challenges
const challengeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  prizes: z.string().optional(),
});

// Define the schema for submission types
const submissionTypeSchema = z.object({
  type: z.enum(["project", "presentation", "repository"]),
  deadline: z.date({
    required_error: "Deadline is required",
  }),
  required: z.boolean().default(true),
});

const ManageHackathon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hackathons, challenges, teams, getHackathonById } = useData();
  const [activeTab, setActiveTab] = useState("details");
  const [hackathonChallenges, setHackathonChallenges] = useState([]);
  const [hackathonTeams, setHackathonTeams] = useState([]);
  const [submissionTypes, setSubmissionTypes] = useState([]);
  const [juryMembers, setJuryMembers] = useState([]);
  const [isNewHackathon, setIsNewHackathon] = useState(true);

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(hackathonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startDate: undefined,
      endDate: undefined,
      registrationStartDate: undefined,
      registrationEndDate: undefined,
      status: "upcoming",
    },
  });

  // Load hackathon data if editing an existing one
  useEffect(() => {
    if (id) {
      const hackathon = getHackathonById(id);
      if (hackathon) {
        setIsNewHackathon(false);
        form.reset({
          title: hackathon.title,
          description: hackathon.description,
          location: hackathon.location,
          startDate: new Date(hackathon.startDate),
          endDate: new Date(hackathon.endDate),
          registrationStartDate: new Date(), // Mock data
          registrationEndDate: new Date(), // Mock data
          status: hackathon.status,
        });
        
        // Load challenges, teams, etc. for this hackathon
        const hackathonChallenges = challenges.filter(c => c.hackathonId === id);
        setHackathonChallenges(hackathonChallenges);
        
        const hackathonTeams = teams.filter(t => t.hackathonId === id);
        setHackathonTeams(hackathonTeams);
        
        // Mock data for submission types and jury
        setSubmissionTypes([
          { id: "1", type: "project", deadline: new Date(), required: true, hackathonId: id },
          { id: "2", type: "presentation", deadline: new Date(), required: true, hackathonId: id }
        ]);
        
        setJuryMembers([
          { id: "j1", name: "John Expert", email: "john@example.com", expertise: "Blockchain" },
          { id: "j2", name: "Anna Judge", email: "anna@example.com", expertise: "AI" }
        ]);
      } else {
        // Hackathon not found
        navigate("/admin/hackathons");
        toast.error("Hackathon not found");
      }
    }
  }, [id, getHackathonById]);

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form data:", data);
    
    // Here we would save the hackathon data through an API call
    // For this demo, we'll just show a success toast
    toast.success(isNewHackathon ? "Hackathon created successfully!" : "Hackathon updated successfully!");
    
    if (isNewHackathon) {
      navigate("/admin/hackathons");
    }
  };

  // Add new challenge
  const addChallenge = () => {
    // Demo function - would open a form to add a challenge
    const newChallenge = {
      id: `challenge-${Date.now()}`,
      title: "New Challenge",
      description: "Description for the new challenge",
      hackathonId: id || "new",
      companyName: "Company Name",
      requirements: "Challenge requirements"
    };
    
    setHackathonChallenges([...hackathonChallenges, newChallenge]);
    toast.success("Challenge added!");
  };

  // Remove a challenge
  const removeChallenge = (challengeId) => {
    setHackathonChallenges(hackathonChallenges.filter(c => c.id !== challengeId));
    toast.success("Challenge removed!");
  };

  // Add new submission type
  const addSubmissionType = () => {
    const newSubmission = {
      id: `sub-${Date.now()}`,
      type: "project",
      deadline: new Date(),
      required: true,
      hackathonId: id || "new"
    };
    
    setSubmissionTypes([...submissionTypes, newSubmission]);
    toast.success("Submission type added!");
  };

  // Add jury member
  const addJuryMember = () => {
    const newJury = {
      id: `jury-${Date.now()}`,
      name: "New Jury Member",
      email: "jury@example.com",
      expertise: "General"
    };
    
    setJuryMembers([...juryMembers, newJury]);
    toast.success("Jury member added!");
  };

  // Remove a team
  const removeTeam = (teamId) => {
    setHackathonTeams(hackathonTeams.filter(t => t.id !== teamId));
    toast.success("Team removed from hackathon!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isNewHackathon ? "Create New Hackathon" : "Edit Hackathon"}
        </h1>
        <Button onClick={() => navigate("/admin/hackathons")}>
          Back to Hackathons
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="jury">Jury</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hackathon Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter hackathon title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationStartDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Registration Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationEndDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Registration End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter hackathon description"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="flex gap-2">
                <Save size={16} />
                {isNewHackathon ? "Create Hackathon" : "Save Changes"}
              </Button>
            </form>
          </Form>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Challenges</h2>
            <Button onClick={addChallenge} className="flex items-center gap-2">
              <Plus size={16} /> Add Challenge
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hackathonChallenges.length > 0 ? (
              hackathonChallenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      {challenge.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeChallenge(challenge.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash size={16} />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div className="font-medium text-muted-foreground">
                        {challenge.companyName}
                      </div>
                      <p className="line-clamp-2">{challenge.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground col-span-2">
                No challenges added yet. Add a challenge to get started.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Participating Teams</h2>
            <div className="text-sm text-muted-foreground">
              {hackathonTeams.length} teams registered
            </div>
          </div>

          <div className="space-y-4">
            {hackathonTeams.length > 0 ? (
              hackathonTeams.map((team) => (
                <Card key={team.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Users size={18} />
                      {team.name}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTeam(team.id)}
                      className="text-destructive"
                    >
                      <Trash size={16} className="mr-2" /> Remove
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        {team.memberIds.length} Members
                      </div>
                      <div className="text-sm">{team.description}</div>
                      {team.projectId && (
                        <Badge variant="outline" className="bg-primary/10">
                          Project Submitted
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">
                No teams have registered for this hackathon yet.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Submission Requirements</h2>
            <Button onClick={addSubmissionType} className="flex items-center gap-2">
              <Plus size={16} /> Add Submission Type
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissionTypes.length > 0 ? (
              submissionTypes.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <FileText size={18} />
                      {submission.type.charAt(0).toUpperCase() + submission.type.slice(1)}
                    </CardTitle>
                    <Badge variant={submission.required ? "default" : "outline"}>
                      {submission.required ? "Required" : "Optional"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm flex items-center gap-1">
                        <CalendarIcon size={14} />
                        <span>Deadline: {format(new Date(submission.deadline), "PPP")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground col-span-2">
                No submission types defined yet. Add a submission type to get started.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Jury Tab */}
        <TabsContent value="jury" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Jury Members</h2>
            <Button onClick={addJuryMember} className="flex items-center gap-2">
              <Plus size={16} /> Add Jury Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {juryMembers.length > 0 ? (
              juryMembers.map((jury) => (
                <Card key={jury.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Award size={18} />
                      {jury.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash size={16} />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="text-sm">{jury.email}</div>
                      <Badge variant="outline">{jury.expertise}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground col-span-2">
                No jury members added yet. Add jury members to evaluate projects.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Evaluations Tab */}
        <TabsContent value="evaluations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Team Evaluations</h2>
          </div>

          <div className="space-y-4">
            {hackathonTeams.length > 0 ? (
              hackathonTeams.map((team) => (
                <Card key={team.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      {team.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Award size={16} /> Rate
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {team.projectId ? (
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-medium">
                            Project Submission: <span className="text-primary">Completed</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Rating: Not rated yet
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No project submission yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">
                No teams have registered for this hackathon yet.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageHackathon;
