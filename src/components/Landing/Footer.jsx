"use client";

import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-moze-primary text-gray-300 pt-16 pb-8 border-t-4 border-yellow-400">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* About Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-block">
              <div className="bg-white p-2 rounded-lg text-moze-primary">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-white">
                <span className="font-bold text-xl leading-tight">G.S. Moze</span>
                <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase">College</span>
              </div>
            </Link>
            <p className="text-sm text-maroon-100 mb-6 leading-relaxed">
              Empowering students through quality education, holistic development, and a commitment to excellence for over two decades.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-maroon-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-gray-900 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-maroon-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-gray-900 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-maroon-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-gray-900 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-maroon-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-gray-900 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              {['About College', 'Admissions', 'Campus Facilities', 'Placement Cell', 'Alumni Network'].map((item, index) => (
                <li key={index}>
                  <Link href="#" className="text-sm text-maroon-100 hover:text-yellow-400 transition-colors flex items-center">
                    <span className="mr-2 text-yellow-500 text-xs">▸</span> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Top Courses</h3>
            <ul className="space-y-3">
              {['B.Tech Engineering', 'MBA / BBA Program', 'BCA / MCA', 'Commerce (B.Com)', 'Diploma Courses'].map((item, index) => (
                <li key={index}>
                  <Link href="#" className="text-sm text-maroon-100 hover:text-yellow-400 transition-colors flex items-center">
                    <span className="mr-2 text-yellow-500 text-xs">▸</span> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Us</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-maroon-100">Sector 12, G.S. Moze Campus, University Road, Pune 411005</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                <span className="text-sm text-maroon-100">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                <span className="text-sm text-maroon-100">admissions@gsmozecollege.edu</span>
              </li>
            </ul>

            <div className="bg-maroon-800 p-1 rounded-lg flex border border-maroon-700 focus-within:border-yellow-400 transition-colors overflow-hidden">
              <input 
                type="email" 
                placeholder="Enter email for newsletter" 
                className="bg-transparent border-none text-sm text-white px-3 py-2 w-full focus:outline-none placeholder-maroon-300"
              />
              <button className="bg-yellow-400 text-gray-900 px-4 py-2 text-sm font-bold rounded-md hover:bg-yellow-500 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-maroon-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-maroon-200 text-xs space-y-4 md:space-y-0">
          <p>
            © {new Date().getFullYear()} G.S. Moze College. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-yellow-400 transition-colors">Anti-Ragging Circular</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}