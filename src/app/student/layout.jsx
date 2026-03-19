//main do not delete

"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import React, { useState , useEffect } from "react";
import { studentSidebarItems } from "@/data/data";
import { Bell, ChevronDown } from "lucide-react";
import Avatar from "@/components/Avatar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";

const layout = ({ children }) => {
  const router = useRouter();
  const { user , logout } = useSession();
  const [activeTab, setActiveTab] = useState(
    studentSidebarItems[0]?.id || "overview"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login"); // ⬅️ Redirect if not logged in
    }
  }, [user]);

  if (!user) return null;

  const handleTabChange = (newTab) => {
    // console.log("Changing tab to:", newTab); // Debug log
    setActiveTab(newTab);
    if (newTab === "profile") {
      router.push('/student')
    } else {
      router.push(`/student/${newTab}`)
    }
  };

  const activeTabItem = studentSidebarItems.find((item) => item.id === activeTab);

  const getTitle = () => {
    if (activeTab === "profile") {
      return activeTabItem?.label || "Dashboard Overview";
    }
    return (
      activeTabItem?.label ||
      activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
    );
  };

  // console.log(activeTab);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="print:hidden">
        <DashboardSidebar
          items={studentSidebarItems}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden print:overflow-visible print:block">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow border-b lg:ml-64 h-16 print:hidden">
          <Header title={getTitle()} onMenuClick={() => setSidebarOpen(true)}>
            

            {/* Profile section with dropdown */}
            {/* Profile section with dropdown */}
            <div className="relative">
              <div
                className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <Avatar name={user?.fullName || "Student"} />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || "Student"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role || "STUDENT"}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Enhanced Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                  {/* User Info Section */}
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        // Add profile navigation logic here
                        router.push('/student');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-5 h-5 mr-3 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        // Add settings navigation logic here
                        router.push('/student/settings');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-5 h-5 mr-3 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      Settings
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        // Add help navigation logic here
                        router.push('/student/help');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-5 h-5 mr-3 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      Help & Support
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-1"></div>

                  {/* Logout Section */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <div className="w-5 h-5 mr-3 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Header>
        </div>

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto pt-20 px-6 print:pt-0 print:px-0 print:block print:overflow-visible">{children}</main>
      </div>
    </div>
  );
};

export default layout;