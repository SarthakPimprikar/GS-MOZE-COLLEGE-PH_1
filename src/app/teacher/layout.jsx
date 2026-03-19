"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import React, { useState, useEffect, useRef } from "react";
import { teacherSidebarItems } from "@/data/data";
import { Bell, ChevronDown, LogOut, User, Settings } from "lucide-react";
import Avatar from "@/components/Avatar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import Unauthorized from "@/components/Unauthorized";
import { useSession } from "@/context/SessionContext";
import Loading from "@/components/Loading";

const Layout = ({ children }) => {
  const { user, loading, logout } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(teacherSidebarItems[0]?.id || "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "teacher") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }

    setIsLoading(false);
  }, [user, loading, router]);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.push(`/teacher/${tabId}`);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading || isLoading) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return <Unauthorized />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        items={teacherSidebarItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          user={user}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          profileRef={profileRef}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
