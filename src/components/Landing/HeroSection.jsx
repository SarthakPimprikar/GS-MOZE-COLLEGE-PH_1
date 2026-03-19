"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const TechnicalInstituteHero = () => {
  return (
    <section
      className="relative bg-moze-secondary text-gray-900 overflow-hidden pt-28 md:pt-36 pb-20 md:pb-32"
      name="home"
    >
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-maroon-100 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-100 rounded-full blur-3xl opacity-50 -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-6 md:px-16 relative z-10 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Content */}
        <motion.div 
          className="lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full bg-maroon-50 text-moze-primary font-semibold text-sm mb-6 shadow-sm border border-maroon-100"
          >
            Admissions Open 2026-27
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold leading-tight mb-6 text-gray-900"
          >
            Build Your Future <br className="hidden md:block"/> at <span className="text-moze-primary">G.S. Moze College</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
          >
            Experience academic excellence, dedicated placement support, and a vibrant campus life designed to shape tomorrow&apos;s leaders.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link
              href="/enquiry-form"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-moze-primary text-white font-semibold text-lg hover:bg-maroon-800 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              Apply Now
            </Link>
            <Link
              href="/courses"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-gray-800 border-2 border-gray-200 font-semibold text-lg hover:border-moze-primary hover:text-moze-primary hover:shadow-md transition-all"
            >
              Explore Courses
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Content - Hero Image with Badges */}
        <motion.div 
          className="lg:w-1/2 relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[450px] md:h-[450px] mx-auto z-10">
            {/* Circular Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-maroon-100 to-yellow-100 rounded-full shadow-inner transform -rotate-6"></div>
            
            <Image
              src="/herosection.png"
              fill
              className="object-contain drop-shadow-2xl z-20 scale-105"
              alt="Student representing G.S. Moze College"
              priority
            />
          </div>

          {/* Floating Badges */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="absolute top-10 left-0 md:left-10 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 z-30"
          >
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">NAAC A+</p>
              <p className="text-xs text-gray-500">Accredited</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="absolute bottom-10 right-0 md:-right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 z-30"
          >
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">100%</p>
              <p className="text-xs text-gray-500">Placement Assistance</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default TechnicalInstituteHero;
