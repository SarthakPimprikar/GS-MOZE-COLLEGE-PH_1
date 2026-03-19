import { Menu } from "lucide-react";
import React from "react";

const Header = ({ title, onMenuClick, children }) => {
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm z-30">
      <div className="flex items-center h-20 px-6">
        {/* Left Section - Menu & Title */}
        <div className="flex items-center space-x-5 flex-shrink-0">
          <button
            className="lg:hidden p-2.5 rounded-xl bg-gray-50 hover:bg-maroon-50 text-gray-500 hover:text-moze-primary transition-colors duration-200"
            onClick={onMenuClick}
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 leading-none">{title}</h1>
            <div className="text-[11px] font-bold tracking-wider text-moze-primary uppercase mt-1.5 hidden sm:block">
              Dashboard / {title}
            </div>
          </div>
        </div>

        {/* Center Section - School Name */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-4">
          <div className="px-6 py-2 rounded-full bg-maroon-50 border border-maroon-100">
            <h2 className="text-lg font-serif font-bold bg-gradient-to-r from-maroon-800 via-moze-primary to-maroon-600 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
              G.S. Moze College
            </h2>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3 flex-shrink-0 ml-auto lg:ml-0">
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;