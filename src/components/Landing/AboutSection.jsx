"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

const AboutSection = () => {
  const highlights = [
    "State-of-the-art Infrastructure",
    "Industry-aligned Curriculum",
    "Expert Faculty Members",
    "Focus on Innovation & Research"
  ];

  return (
    <section className="py-20 bg-moze-secondary overflow-hidden relative">
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-maroon-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left: Image Box */}
          <motion.div 
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            {/* Background Accent Box */}
            <div className="absolute top-6 -left-6 w-full h-full border-2 border-moze-primary rounded-3xl -z-10 bg-white"></div>
            
            <div className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
              <Image 
                src="/student-professional.png" 
                alt="G.S. Moze College Campus Life" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
            </div>

            {/* Floating Experience Badge */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="text-4xl font-extrabold text-moze-primary">25+</div>
              <div className="text-sm font-semibold text-gray-600 leading-tight">Years of <br/> Academic <br/> Excellence</div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-moze-primary font-bold tracking-wider uppercase text-sm mb-3">About G.S. Moze College</h4>
            <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-gray-900 leading-tight mb-6">
              Empowering Students for a Better Tomorrow
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              At G.S. Moze College, we are committed to providing top-tier education, fostering innovation, and building character. With a strong emphasis on holistic development, our institution prepares students to excel in the professional world and become global leaders.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-moze-primary flex-shrink-0" />
                  <span className="font-medium text-gray-800">{highlight}</span>
                </div>
              ))}
            </div>

            <Link href="/about" className="inline-flex items-center gap-2 bg-moze-primary text-white px-8 py-3.5 rounded-full font-semibold hover:bg-maroon-800 transition-colors group">
              Read More 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
