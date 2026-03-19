"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import React, { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarOff,
  CreditCard,
  IndianRupeeIcon,
  LogOut,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";
import Avatar from "@/components/Avatar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import Unauthorized from "@/components/Unauthorized";
import { useSession } from "@/context/SessionContext";
import Loading from "@/components/Loading";

// HR specific sidebar items
const hrSidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "staff", label: "Staff Management", icon: Users },
  { id: "payslip", label: "Payroll", icon: IndianRupeeIcon },
  { id: "attendance", label: "Attendance", icon: CalendarCheck },
  { id: "leave", label: "Leave Applications", icon: CalendarOff },
  { id: "salary", label: "Salary Structure", icon: CreditCard },
];

const HrLayout = ({ children }) => {
  const { user, loading } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(hrSidebarItems[0]?.id || "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Session & role check
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "hr") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }

    setIsLoading(false);
  }, [user, loading, router]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab === "overview") {
      router.push("/hr");
    } else {
      router.push(`/hr/${newTab}`);
    }
  };

  const activeTabItem = hrSidebarItems.find((item) => item.id === activeTab);

  const getTitle = () => {
    if (activeTab === "overview") {
      return activeTabItem?.label || "HR Dashboard";
    }
    return activeTabItem?.label || activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("session"); // if using localStorage
    router.push("/login");
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return <Unauthorized />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        items={hrSidebarItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 lg:ml-64 h-16 shadow-sm">
          <Header title={getTitle()} onMenuClick={() => setSidebarOpen(true)}>
            {/* Notification Button */}
            <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 group">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white">
                <span className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></span>
              </span>
            </button>

            {/* User Profile */}
            <div className="relative" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="flex items-center space-x-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group">
                <div className="relative">
                  <Avatar name={user?.fullName || "HR"} />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                    {user?.fullName || "HR User"}
                  </p>
                  <p className="text-xs text-gray-500">Human Resources</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200 ${
                    dropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden">
                  <button
                    onClick={() => router.push("/hr/profile")}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => router.push("/hr/settings")}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => router.push("/help")}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Help & Support</span>
                  </button>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </Header>
        </div>

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto pt-20 px-6">{children}</main>
      </div>
    </div>
  );
};

export default HrLayout;
