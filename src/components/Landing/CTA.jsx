"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-16">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-moze-primary shadow-2xl">
          
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-maroon-900 to-transparent opacity-80 z-0"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center">
            
            {/* Left Content */}
            <div className="w-full md:w-3/5 p-10 md:p-16 lg:p-20 text-white">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
              >
                Join 5000+ Students at <br className="hidden md:block" />
                <span className="text-yellow-400">G.S. Moze College</span>
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-maroon-100 mb-10 max-w-xl"
              >
                Take the first step towards a brilliant career. Admissions for the 2026-27 academic year are now open. Don&apos;t miss your chance to be part of a legacy of excellence.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/enquiry-form"
                  className="px-8 py-4 bg-white text-moze-primary font-bold rounded-full hover:bg-yellow-400 hover:text-gray-900 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-full hover:border-white hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Contact Admission Desk</span>
                </Link>
              </motion.div>

              {/* Trust markers */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-12 flex flex-wrap gap-4 text-sm text-maroon-100 font-medium"
              >
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-yellow-400" /> UGC Recognized</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-yellow-400" /> NAAC A+ Grade</div>
                <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-yellow-400" /> 100% Placement</div>
              </motion.div>
            </div>

            {/* Right Image */}
            <div className="w-full md:w-2/5 relative h-64 md:h-auto min-h-[400px] hidden md:block">
              <Image 
                src="/student-professional.png"
                alt="Excited student at G.S. Moze College"
                fill
                className="object-cover object-left-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-moze-primary to-transparent md:w-32 z-10"></div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}