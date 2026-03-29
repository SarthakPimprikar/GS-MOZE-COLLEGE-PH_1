"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Landing/Navbar";
import HeroSection from "@/components/Landing/HeroSection";
import TrustStrip from "@/components/Landing/TrustStrip";
import AboutSection from "@/components/Landing/AboutSection";
import Benefits from "@/components/Landing/Benefits";
import Modules from "@/components/Landing/Modules";
import Features from "@/components/Landing/Features";
import Departments from "@/components/Landing/Departments";
import WhyChooseUs from "@/components/Landing/WhyChooseUs";
import CoursesList from "@/components/Landing/CoursesList";
import EventsSection from "@/components/Landing/EventsSection";
import Testimonials from "@/components/Landing/Testimonials";
import Contact from "@/components/Landing/Contact";
import CTA from "@/components/Landing/CTA";
import Footer from "@/components/Landing/Footer";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-moze-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main className="bg-white min-h-screen font-sans">
        <HeroSection />
        <TrustStrip />
        <AboutSection />
        <Benefits />
        <Modules />
        <Features />
        <Departments />
        <WhyChooseUs />
        <CoursesList />
        <EventsSection />
        <Testimonials />
        <Contact />
        <CTA />
      </main>
      
      <Footer />
    </>
  );
}

