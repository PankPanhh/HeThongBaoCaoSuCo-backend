"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
} from "lucide-react";
import userAvatar from "@/static/user.jpg";

export default function ProfileView() {
  // Mock user data - Replace with real data from your backend
  const [user] = useState({
    id: "usr_123456",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Product Designer & Developer",
    avatar: userAvatar,
    joinDate: "January 2023",
    verified: true,
    lastLogin: "2 hours ago",
  });

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="border-0 shadow-md bg-white dark:bg-slate-900">
        <CardContent className="pt-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary bg-muted">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {user.name}
                </h2>
                {user.verified && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-4">{user.bio}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  {user.phone}
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  {user.location}
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  Joined {user.joinDate}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-900">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                Account Status
              </p>
              <p className="font-semibold text-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-900">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                Email Verified
              </p>
              <p className="font-semibold text-foreground">Yes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-900">
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Last Login</p>
              <p className="font-semibold text-foreground">{user.lastLogin}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Details Card */}
      <Card className="border-0 shadow-md bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your account details and identification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-mono text-sm text-foreground">
                {user.id}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-muted-foreground">Member Since</span>
              <span className="text-foreground">{user.joinDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
