import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Link as LinkIcon, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SubmissionType } from "@/types";

interface SubmissionCardProps {
  type: SubmissionType["type"];
  deadline: string;
  submitted?: {
    url: string;
    submittedAt: string;
  };
  onSubmit: (type: SubmissionType["type"], url: string) => Promise<void>;
}

export function SubmissionCard({ type, deadline, submitted, onSubmit }: SubmissionCardProps) {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const isExpired = deadlineDate < now;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      setIsSubmitting(true);
      await onSubmit(type, url);
      setUrl("");
      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} submitted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{type.charAt(0).toUpperCase() + type.slice(1)} Submission</CardTitle>
            <CardDescription>Submit your {type} URL</CardDescription>
          </div>
          {submitted ? (
            <Badge variant="outline" className="bg-green-500/20 text-green-500">
              <Check className="mr-1 h-3 w-3" />
              Submitted
            </Badge>
          ) : isExpired ? (
            <Badge variant="destructive" className="bg-destructive/20">
              <X className="mr-1 h-3 w-3" />
              Expired
            </Badge>
          ) : (
            <Badge variant="outline" className="border-primary/30 text-primary">
              <Clock className="mr-1 h-3 w-3" />
              Due {deadlineDate.toLocaleDateString()}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <a
            href={submitted.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <LinkIcon className="h-4 w-4" />
            View Submission
          </a>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="url"
              placeholder={`Enter your ${type} URL`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isExpired}
            />
            <Button type="submit" disabled={isExpired || isSubmitting || !url} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        )}
      </CardContent>
      {submitted && (
        <CardFooter className="text-sm text-muted-foreground">
          Submitted on {new Date(submitted.submittedAt).toLocaleString()}
        </CardFooter>
      )}
    </Card>
  );
}