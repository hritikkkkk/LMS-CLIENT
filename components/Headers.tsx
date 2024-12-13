"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { jwtPayload } from "@/app/admin/page";
import { useEffect, useState, useCallback } from "react";

const Header = () => {
  const { token, logout, setToken } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  const handleLogout = useCallback(() => {
    logout();
    setRole(null);
    setToken(null);
  }, [logout, setToken]);

  useEffect(() => {
    if (token) {
      try {
        const decoded: jwtPayload = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
        handleLogout();
      }
    } else {
      setRole(null);
      router.push("/auth");
    }
  }, [token, handleLogout, router]);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://assets.academically.com/front/assets/img/logo.svg"
              alt="Logo"
              width={150}
              height={50}
            />
          </Link>
          <div className="hidden md:flex space-x-4">
            {role && (
              <Button variant="ghost" asChild>
                <Link href="/courses">Courses</Link>
              </Button>
            )}
            {role && (
              <Button variant="ghost" asChild>
                <Link href="/enrolledCourses">Enrolled Courses</Link>
              </Button>
            )}
            {role === "admin" && (
              <Button variant="ghost" asChild>
                <Link href="/admin">Admin</Link>
              </Button>
            )}
            {role ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/auth">Login</Link>
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {role && (
                <DropdownMenuItem asChild>
                  <Link href="/courses">Courses</Link>
                </DropdownMenuItem>
              )}
              {role && (
                <DropdownMenuItem asChild>
                  <Link href="/enrolledCourses">Enrolled Courses</Link>
                </DropdownMenuItem>
              )}
              {role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin</Link>
                </DropdownMenuItem>
              )}
              {role ? (
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/auth">Login</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default Header;


