"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, BookOpen, GraduationCap } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
}

interface EnrolledCoursesResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    userId: string;
    role: string;
    enrolledCourses: Course[];
  };
  error: unknown;
}

export default function MyEnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth");
          return;
        }

        const response = await axios.get<EnrolledCoursesResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/users/enrolledCourses`,
          {
            headers: { Authorization: `${token}` },
          }
        );

        if (response.data.success && response.data.data.enrolledCourses) {
          setEnrolledCourses(response.data.data.enrolledCourses);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        My Enrolled Courses
      </h1>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <Card
              key={course._id}
              className="w-full hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {course.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  {course.instructor}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    Duration: {course.duration}
                  </div>
                  <Badge variant="secondary">Enrolled</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Continue Learning
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            No Enrolled Courses Yet
          </h2>
          <p className="text-muted-foreground mb-4">
            Explore our course catalog and start your learning journey today!
          </p>
          <Button onClick={() => router.push("/courses")}>
            Browse Courses
          </Button>
        </div>
      )}
    </div>
  );
}
