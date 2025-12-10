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
import TrackProgressComponent from "@/components/ProgressAndNotification/TrackProgressComponent";

function HomePage() {
  const [showBanner] = useState(true);
  const [showTrackProgress, setShowTrackProgress] = useState(false);

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
        <ActionCardsComponent onTrackProgressClick={() => setShowTrackProgress(true)} />

        {/* Track Progress Modal/Section */}
        {showTrackProgress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-start justify-center overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg m-4 w-full max-w-5xl mt-10 relative">
              <div className="flex items-center justify-between p-5 border-b">
                <h2 className="text-xl font-semibold">Theo dõi tiến độ báo cáo</h2>
                <button
                  onClick={() => setShowTrackProgress(false)}
                  className="text-2xl text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-5 overflow-y-auto max-h-[calc(100vh-200px)]">
                <TrackProgressComponent />
              </div>
            </div>
          </div>
        )}

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
