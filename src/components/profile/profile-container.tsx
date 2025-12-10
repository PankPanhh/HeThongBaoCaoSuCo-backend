"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfile from "./edit-profile";
import ChangePassword from "./change-password";
import ForgotPassword from "./forgot-password";
import ProfileView from "./profile-view";

export default function ProfileContainer() {
  const [activeTab, setActiveTab] = useState("view");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 rounded-lg">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your profile and security settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="view">Profile</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="forgot">Recovery</TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <ProfileView />
          </TabsContent>

          <TabsContent value="edit">
            <EditProfile />
          </TabsContent>

          <TabsContent value="password">
            <ChangePassword />
          </TabsContent>

          <TabsContent value="forgot">
            <ForgotPassword />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
