import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const { updateUserProfile } = useData();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    skills: [] as string[],
    bio: "",
    github: "",
    linkedin: "",
    portfolio: "",
    newSkill: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && formData.newSkill.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ""
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUserProfile(user.id, {
        ...formData,
        name: formData.fullName
      });
      
      toast({
        title: "Профиль обновлен",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Произршла ошибка",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Профиль</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-2xl">{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">ФИО</label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="text-sm font-medium">О себе</label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Навыки</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Input
                    name="newSkill"
                    value={formData.newSkill}
                    onChange={handleChange}
                    onKeyDown={handleAddSkill}
                    placeholder="Type a skill and press Enter"
                  />
                )}
              </div>

              <div>
                <label className="text-sm font-medium">GitHub</label>
                <Input
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Портфолио</label>
                <Input
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://portfolio.com"
                />
              </div>

              {isEditing && (
                <Button type="submit" className="w-full">Сохранить изменения</Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}