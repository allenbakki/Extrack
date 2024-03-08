import React from "react";
import SideNavbar from "./SideNavbar";
import { DashboardProvider } from "../context/DashboardContext";

export default function Dashboard() {
  return (
    <div>
      <DashboardProvider>
        <SideNavbar />
      </DashboardProvider>
    </div>
  );
}
