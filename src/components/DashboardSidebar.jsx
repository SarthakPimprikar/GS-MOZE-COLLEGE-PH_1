import { X, GraduationCap } from "lucide-react";
import React from "react";
import Link from "next/link";

const DashboardSidebar = ({
  items,
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-maroon-900 bg-opacity-40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Wrapper */}
      <div
        className={`fixed top-0 left-0 z-50 w-72 h-screen bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-100 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100 bg-white shrink-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="bg-moze-primary p-2 rounded-xl text-white shadow-md group-hover:bg-maroon-800 transition-colors">
                <GraduationCap className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg text-gray-900 leading-tight">G.S. Moze</span>
                <span className="text-[10px] font-bold text-yellow-500 tracking-widest uppercase mt-0.5">College ERP</span>
              </div>
            </Link>

            <button
              className="lg:hidden p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-maroon-50 hover:text-moze-primary transition-colors shrink-0"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 custom-scrollbar">
            {items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    // Close on mobile when selecting a tab
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 group ${
                    isActive
                      ? "bg-moze-secondary text-moze-primary shadow-sm border border-maroon-100 box-border"
                      : "text-gray-600 hover:bg-maroon-50 hover:text-moze-primary border border-transparent box-border"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-xl transition-all duration-200 shrink-0 ${
                      isActive
                        ? "bg-moze-primary text-white shadow-lg shadow-maroon-200"
                        : "bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-moze-primary group-hover:shadow-sm"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2]" : "stroke-[1.5]"}`} />
                  </div>
                  <span className={`font-medium text-sm transition-colors ${isActive ? 'font-bold' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 shrink-0">
            <div className="text-xs text-gray-600 text-center font-medium">
              © {new Date().getFullYear()} G.S. Moze College
            </div>
            <div className="text-[10px] text-gray-400 text-center mt-1 uppercase tracking-wider">
              Student ERP Portal
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
