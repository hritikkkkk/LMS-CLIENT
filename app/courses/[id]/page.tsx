"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Clock, User, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { jwtDecode } from "jwt-decode";
import { jwtPayload } from "@/app/admin/page";

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
  createdBy: string;
}

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      router.push("/courses");
      return;
    }

    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded: jwtPayload = jwtDecode(token as string);
        const userId = decoded.userId;
        const role = decoded.role;

        if (!role || !token || !userId) {
          router.push("/auth");
          return;
        }

        const courseResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/course/${id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setCourse(courseResponse.data.data.courses);

        // Check if the user is already enrolled
        const enrollmentResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/check-enrollment`,
          {
            params: { userId, courseId: id },
            headers: { Authorization: `${token}` },
          }
        );
        setEnrolled(enrollmentResponse.data.data === true);
      } catch (error) {
        console.error(
          "Error fetching course details or enrollment status:",
          error
        );
        alert("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, router]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      const decoded: jwtPayload = jwtDecode(token as string);
      const userId = decoded.userId;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/enroll/${id}`,
        { userId },
        { headers: { Authorization: `${token}` } }
      );

      if (response.status === 200) {
        alert("Successfully enrolled in the course!");
        setEnrolled(true);
      } else {
        console.error("Enrollment failed:", response.data);
        alert("Failed to enroll in course. Please try again later.");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert("Failed to enroll in course. Please try again later.");
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!course) {
    return (
      <div className="text-center text-2xl mt-8">
        No course found or failed to load course details.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <div className="relative h-64 md:h-80">
          <Image
            src="https://images.unsplash.com/photo-1478104718532-efe04cc3ff7f?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>
        <CardHeader>
          <div className="space-y-4">
            <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                Most Popular
              </span>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                Bestseller
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{course.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {course.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Instructor</p>
                <p className="text-sm text-muted-foreground">
                  {course.instructor}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Certificate</p>
                <p className="text-sm text-muted-foreground">Upon Completion</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleEnroll}
            className="w-full"
            size="lg"
            disabled={enrolled}
          >
            {enrolled ? "You're Enrolled" : "Enroll Now - Start Learning Today"}
          </Button>
          {!enrolled && (
            <p className="text-sm text-center text-muted-foreground">
              30-Day Money-Back Guarantee • Instant Access
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <Skeleton className="h-64 md:h-80 w-full" />
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-5/6 mb-4" />
          <Skeleton className="h-4 w-4/6 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
}
