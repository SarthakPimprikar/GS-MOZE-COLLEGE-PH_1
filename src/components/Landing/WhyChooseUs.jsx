"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, BookOpen, Building2, Briefcase, GraduationCap } from "lucide-react";

const features = [
  {
    icon: <BookOpen className="w-6 h-6 text-white" />,
    title: "Best Curriculum",
    desc: "Designed alongside industry experts to ensure future-ready skills."
  },
  {
    icon: <Briefcase className="w-6 h-6 text-white" />,
    title: "Placement Record",
    desc: "100% placement assistance with top MNCs and startups."
  },
  {
    icon: <Building2 className="w-6 h-6 text-white" />,
    title: "Industry Collaboration",
    desc: "MOUs with leading companies for internships and live projects."
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-white" />,
    title: "Campus Facilities",
    desc: "State-of-the-art labs, library, and sports complexes."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-moze-secondary relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left: Content & Checklist */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="text-moze-primary font-bold tracking-wider uppercase text-sm mb-3">Why Choose Us</h4>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              A Legacy of Excellence & Innovation
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Join a vibrant community dedicated to nurturing talent, fostering leadership, and delivering an unparalleled educational experience.
            </p>

            <div className="space-y-6">
              {features.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-moze-primary flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Image Grid/Collage */}
          <motion.div 
            className="w-full lg:w-1/2 relative h-[500px]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-maroon-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="space-y-4 pt-12">
                <div className="relative h-48 w-full rounded-3xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500">
                  <Image src="/student-professional.png" fill className="object-cover" alt="Students studying" />
                </div>
                <div className="relative h-64 w-full rounded-3xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500">
                  <Image src="/herosection.png" fill className="object-cover object-top" alt="Campus Activity" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-64 w-full rounded-3xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500">
                  <Image src="/student-professional.png" fill className="object-cover object-bottom" alt="Library" />
                </div>
                <div className="relative h-48 w-full rounded-3xl overflow-hidden shadow-lg bg-moze-primary flex flex-col items-center justify-center text-white p-6 transform hover:scale-105 transition-transform duration-500">
                  <span className="text-5xl font-extrabold mb-2">5000+</span>
                  <span className="text-lg font-medium text-maroon-100 text-center">Successful Alumni Worldwide</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
