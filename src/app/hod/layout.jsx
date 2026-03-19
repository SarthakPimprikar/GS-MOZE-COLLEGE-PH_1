"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import React, { useState, useEffect } from "react";
import { 
  Bell, 
  BookOpen, 
  ChevronDown, 
  LayoutDashboard, 
  LogOut, 
  User, 
  Settings, 
  HelpCircle, 
  Clock, 
  Users, 
  Target, 
  Award 
} from "lucide-react";
import Avatar from "@/components/Avatar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import Unauthorized from "@/components/Unauthorized";
import { useSession } from "@/context/SessionContext";
import Loading from "@/components/Loading";

// HOD specific sidebar items
const hodSidebarItems = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard, // You'll need to import or define this icon
  },
  {
    id: "academic-management",
    label: "Academic Management",
    icon: BookOpen, // You'll need to import or define this icon
    subItems: [
      { id: "courses", label: "Courses" },
      { id: "timetable", label: "Timetable" },
      { id: "faculty", label: "Faculty" },
      { id: "students", label: "Students" },
    ],
  },
  {
    id: "student-management",
    label: "Student Management",
    icon: Users, // You'll need to import or define this icon
  },
  {
    id: "timetable",
    label: "TimeTable",
    icon: Clock, // You'll need to import or define this icon
  },
  {
    id: "copo/review",
    label: "CO-PO Analytics",
    icon: Target,
  },
  {
    id: "talent",
    label: "Staff Talent",
    icon: Award,
  },
];

const HodLayout = ({ children }) => {
  const { user, loading } = useSession();
  console.log("user----------------", user);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(hodSidebarItems[0]?.id || "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //-------------------------------------------------
  const [dropdownOpen, setDropdownOpen] = useState(false);
  //-------------------------------------------------

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    // Check if user is HOD
    if (user.role === "hod") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }

    setIsLoading(false);
  }, [user, loading, router]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab === "overview") {
      router.push('/hod');
    } else {
      router.push(`/hod/${newTab}`);
    }
  };
  //---------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("session"); // or use your context method
    router.push("/login");
  };
  //--------------------------------------------

  const activeTabItem = hodSidebarItems.find((item) => item.id === activeTab);

  const getTitle = () => {
    if (activeTab === "overview") {
      return activeTabItem?.label || "HOD Dashboard";
    }
    return (
      activeTabItem?.label ||
      activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
    );
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
        items={hodSidebarItems}
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

            {/* User Profile Section */}
            <div className="flex items-center space-x-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group">
              {/* Avatar
              <div className="relative">
                <Avatar name={user?.name || "HOD"} />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              {/* User Info 
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {user?.name || "HOD"}
                </p>
                <p className="text-xs text-gray-500">Head of Department</p>
              </div> */}

              {/* Dropdown Arrow */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar name={user?.fullName || "HOD"} />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>

                  {/* Name + Role */}
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                      {user?.fullName || "HOD"}
                    </p>
                    <p className="text-xs text-gray-500">Head of Department</p>
                  </div>

                  {/* Down arrow */}
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden">
                    <button
                      onClick={() => router.push('/hod/profile')}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => router.push('/hod/settings')}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => router.push('/help')}
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


            </div>
          </Header>
        </div>

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto pt-20 px-6">{children}</main>
      </div>
    </div>
  );
};

export default HodLayout;