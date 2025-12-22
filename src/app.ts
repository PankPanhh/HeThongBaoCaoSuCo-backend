// ZaUI stylesheet
import "zmp-ui/zaui.css";
// Tailwind stylesheet
import "@/css/tailwind.scss";
// Your stylesheet
import "@/css/app.scss";

// Mobile touch support
import { initTouchSupport } from "@/lib/touch-support";

// React core
import React from "react";
import { createRoot } from "react-dom/client";

// Mount the app
import Layout from "@/components/layout";

// Expose app configuration
import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig as any;
}

// Initialize touch support for mobile
initTouchSupport();

const root = createRoot(document.getElementById("app")!);
root.render(React.createElement(Layout));
