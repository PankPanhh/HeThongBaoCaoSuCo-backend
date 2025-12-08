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

const SnackbarProviderComponent = SnackbarProvider as unknown as React.ComponentType<
  React.PropsWithChildren<Record<string, unknown>>
>;

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
          </AnimationRoutes>
        </ZMPRouter>
      </SnackbarProviderComponent>
    </App>
  );
};
export default Layout;
