"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Clock, User, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { jwtDecode } from "jwt-decode";
import { jwtPayload } from "../../page";

interface CourseForm {
  title: string;
  description: string;
  duration: string;
  instructor: string;
}

export default function AddEditCourse() {
  const { action, id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CourseForm>({
    title: "",
    description: "",
    duration: "",
    instructor: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded: jwtPayload = jwtDecode(token as string);
    if (!token || decoded.role !== "admin") {
      router.push("/courses");
      return;
    }

    if (action === "edit-course" && id && id !== "null") {
      setIsLoading(true);
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/course/${id}`, {
          headers: { Authorization: `${token}` },
        })
        .then((response) => setForm(response.data.data.courses))
        .catch((error) => {
          console.error("Error fetching course details:", error);
          toast({
            title: "Error",
            description: "Failed to fetch course details. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [action, id, router, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const url =
      action === "add-course"
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/courses`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${id}`;
    const method = action === "add-course" ? "POST" : "PUT";

    const token = localStorage.getItem("token");
    const decoded: jwtPayload = jwtDecode(token as string);
    if (!decoded.userId || !token) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await axios({
        method,
        url,
        data: { ...form, createdBy: decoded.userId },
        headers: { Authorization: `${token}` },
      });

      toast({
        title: "Success",
        description: `Course ${
          action === "add-course" ? "added" : "updated"
        } successfully`,
      });
      router.push("/admin");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {action === "add-course" ? "Add New Course" : "Edit Course"}
          </CardTitle>
          <CardDescription>
            {action === "add-course"
              ? "Create a new course by filling out the form below."
              : "Update the course details using the form below."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg">
                Course Title
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter course title"
                required
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a detailed course description"
                rows={4}
                required
                className="resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-lg">
                  Duration
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    id="duration"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g., 8 weeks"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor" className="text-lg">
                  Instructor
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    id="instructor"
                    name="instructor"
                    value={form.instructor}
                    onChange={handleChange}
                    placeholder="Enter instructor name"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-4 w-4" />
                  {action === "add-course" ? "Add Course" : "Update Course"}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
