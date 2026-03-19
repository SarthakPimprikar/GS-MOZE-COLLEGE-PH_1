"use client";

import { useState, useEffect } from "react";
import Link1 from "next/link";
import { Menu, X, User, GraduationCap } from "lucide-react";
import { Link } from "react-scroll";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { name: "Home", path: "home" },
    { name: "Benefits", path: "benefits" },
    { name: "Modules", path: "modules" },
    { name: "Features", path: "features" },
    { name: "Contact", path: "contacts" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link1 href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-moze-primary p-2 rounded-lg text-white group-hover:bg-maroon-800 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 leading-tight">G.S. Moze</span>
              <span className="text-xs font-semibold text-moze-primary tracking-widest uppercase">College</span>
            </div>
          </Link1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                smooth={true}
                spy={true}
                offset={-80}
                duration={500}
                activeClass="active-link"
                className="relative px-3 py-2 text-sm font-medium text-gray-700 hover:text-moze-primary transition-colors cursor-pointer"
              >
                {item.name}
                <span className="nav-underline"></span>
              </Link>
            ))}
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link1
              href="/login"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-moze-primary transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              Login
            </Link1>

            <Link1
              href="/enquiry-form"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-moze-primary to-maroon-700 text-white font-medium text-sm hover:from-maroon-800 hover:to-moze-primary transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              Enquiry Form
            </Link1>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-moze-primary hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  smooth={true}
                  spy={true}
                  offset={-80}
                  duration={500}
                  activeClass="active-link-mobile"
                  className="px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link1
                  href="/login"
                  className="flex items-center px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-3" />
                  Login
                </Link1>

                <Link1
                  href="/enquiry-form"
                  className="flex items-center justify-center px-4 py-3 mx-2 mt-2 rounded-md bg-gradient-to-r from-moze-primary to-maroon-700 text-white font-medium cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Enquiry Form
                </Link1>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;