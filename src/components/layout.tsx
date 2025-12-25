import React from "react";
import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import HomePage from "@/pages/index";
import IncidentsListPage from "@/pages/IncidentsListPage";
import IncidentDetailPage from "@/pages/IncidentDetailPage";
import SupportChatPage from "@/pages/SupportChatPage";
import DetailBannerPage from '@/pages/DetailBanner';
import ReportFloodPage from '@/pages/ReportFlood';

const SnackbarProviderComponent = SnackbarProvider as unknown as React.ComponentType<
  React.PropsWithChildren<Record<string, unknown>>
>;
import UserProfile from "@/pages/user-profle";
import IncidentManagement from "@/pages/incident-management";
import UserReport from "@/pages/user-report";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <SnackbarProviderComponent>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/incidents" element={<IncidentsListPage />}></Route>
            <Route path="/incidents/:id" element={<IncidentDetailPage />}></Route>
            <Route path="/support-chat" element={<SupportChatPage />}></Route>
            <Route path="/user-profile" element={<UserProfile />}></Route>
            <Route path="/user-report" element={<UserReport />}></Route>
            <Route
              path="/incident-management"
              element={<IncidentManagement />}
            ></Route>
            <Route path="/alerts/weather-detail" element={<DetailBannerPage />}></Route>
            <Route path="/report/flood" element={<ReportFloodPage />}></Route>
          </AnimationRoutes>
        </ZMPRouter>
      </SnackbarProviderComponent>
    </App>
  );
};
export default Layout;
