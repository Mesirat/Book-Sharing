import { useState } from "react";
import Navbar from "./NavBar";
import Sidebar from "./SideBar";

const DashboardLayout = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      <div className="flex-1">
        <Navbar toggleSidebar={() => setSidebarExpanded((prev) => !prev)} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
