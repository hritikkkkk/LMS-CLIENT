"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, BarChart, Award, Briefcase, FileText, Settings, PieChart } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { jwtPayload } from "./admin/page";

export default function Home() {
  const router = useRouter();
  const { token } = useAuth();
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/auth");
    } else {
      try {
        const decoded: jwtPayload = jwtDecode(token);
        setRole(decoded.role);
        setUserName(decoded.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
        router.push("/auth");
      }
    }
  }, [token, router]);

  if (!token || !role) {
    return null; // or a loading spinner
  }



  const userFeatures = [
    {
      title: "Diverse Courses",
      description:
        "Explore a wide range of courses tailored to your interests and career goals.",
      icon: BookOpen,
    },
    {
      title: "Expert Instructors",
      description:
        "Learn from industry professionals and experienced educators.",
      icon: Users,
    },
    {
      title: "Track Progress",
      description:
        "Monitor your learning journey with detailed progress reports.",
      icon: BarChart,
    },
    {
      title: "Earn Certificates",
      description: "Receive recognized certificates upon course completion.",
      icon: Award,
    },
  ];

  const adminFeatures = [
    {
      title: "Course Management",
      description: "Create, edit, and manage courses with ease.",
      icon: Briefcase,
    },
    {
      title: "User Analytics",
      description: "Gain insights into user engagement and performance.",
      icon: PieChart,
    },
    {
      title: "Content Creation",
      description: "Develop and publish high-quality learning materials.",
      icon: FileText,
    },
    {
      title: "System Settings",
      description: "Configure and optimize the learning platform.",
      icon: Settings,
    },
  ];

  const UserDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle>Your Learning Journey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Course Progress</span>
                <span className="font-bold">60%</span>
              </div>
              <Progress value={60} className="h-2 bg-blue-200" />
            </div>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/courses">Continue Learning</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-600">Courses in Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">7</div>
                <div className="text-sm text-gray-600">Completed Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">5</div>
                <div className="text-sm text-gray-600">Certificates Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">15</div>
                <div className="text-sm text-gray-600">
                  Hours Spent Learning
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-center">
        Why Choose Our Platform?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userFeatures.map((feature, index) => (
          <Card
            key={index}
            className="bg-white hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <feature.icon className="h-8 w-8 mb-2 text-blue-600" />
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );

  const AdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">1,234</div>
                <div className="text-sm">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">56</div>
                <div className="text-sm">Active Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">89%</div>
                <div className="text-sm">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm">Avg. Course Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/admin">Manage Courses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-center">Admin Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminFeatures.map((feature, index) => (
          <Card
            key={index}
            className="bg-white hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <feature.icon className="h-8 w-8 mb-2 text-green-600" />
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome to Your {role === "admin" ? "Admin" : "Learning"} Dashboard,{" "}
        {userName}
      </h1>
      <p className="text-xl text-center mb-8 text-gray-600">
        {role === "admin"
          ? "Manage and optimize your learning platform"
          : "Your gateway to knowledge and skill development"}
      </p>

      {role === "admin" ? <AdminDashboard /> : <UserDashboard />}

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {role === "admin"
            ? "Ready to Make an Impact?"
            : "Ready to Start Learning?"}
        </h2>
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
        >
          <Link href={role === "admin" ? "/admin" : "/courses"}>
            {role === "admin" ? "Manage Courses" : "Explore Courses Now"}
          </Link>
        </Button>
      </div>
    </div>
  );
}

