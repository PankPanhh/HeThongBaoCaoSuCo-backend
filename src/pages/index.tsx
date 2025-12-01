import { openMiniApp } from "zmp-sdk";
import { Box, Button, Icon, Page, Text } from "zmp-ui";

import Clock from "@/components/clock";
import Logo from "@/components/logo";
import bg from "@/static/bg.svg";
import { useState } from "react";
import HeaderComponent from "@/components/HeaderComponent";
import BannerComponent from "@/components/BannerComponent";
import MiniStatsComponent from "@/components/MiniStatsComponent";
import ActionCardsComponent from "@/components/ActionCardsComponent";
import FloatingButtonComponent from "@/components/FloatingButtonComponent";
import PublicMapComponent from "@/components/PublicMapComponent";
import RecentIncidentsComponent from "@/components/RecentIncidentsComponent";

function HomePage() {
  const [showBanner] = useState(true);

  return (
    <Page
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-gray-50 dark:bg-black"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="max-w-4xl mx-auto p-4">
        <HeaderComponent />
        <BannerComponent show={showBanner} />

        {/* Action area */}
        <ActionCardsComponent />


        {/* Public map */}
        <PublicMapComponent />

        {/* Recent incidents list */}
        <RecentIncidentsComponent />

        {/* Footer / logo */}
        <div className="flex justify-center my-3">
          <Logo />
        </div>
      </div>
      <FloatingButtonComponent />
      
    </Page>
  );
}

export default HomePage;
