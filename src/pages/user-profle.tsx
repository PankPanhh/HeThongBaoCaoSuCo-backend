import React from "react";
import bg from "@/static/bg.svg";
import ProfileContainer from "@/components/profile/profile-container";

const UserProfile = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <main className="min-h-screen bg-background ">
        <ProfileContainer />
      </main>
    </div>
  );
};

export default UserProfile;
