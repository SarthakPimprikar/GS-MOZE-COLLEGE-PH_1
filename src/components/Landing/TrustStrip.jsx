"use client";

import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap, Globe } from "lucide-react";

const trustItems = [
  {
    icon: <Award className="w-8 h-8 text-moze-primary" />,
    title: "NAAC Accredited",
    desc: "A+ Grade Institution",
  },
  {
    icon: <Briefcase className="w-8 h-8 text-moze-primary" />,
    title: "Placement Assistance",
    desc: "100% Guaranteed Support",
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-moze-primary" />,
    title: "Experienced Faculty",
    desc: "Industry Experts & Ph.Ds",
  },
  {
    icon: <Globe className="w-8 h-8 text-moze-primary" />,
    title: "Industry Exposure",
    desc: "Global Standard Curriculum",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TrustStrip() {
  return (
    <section className="bg-white py-12 border-b border-gray-100 relative z-20 shadow-sm -mt-8 mx-auto max-w-7xl rounded-2xl md:-mt-16 md:px-8">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, translateY: -5 }}
              className="flex items-center p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-maroon-200 transition-all cursor-default"
            >
              <div className="w-14 h-14 rounded-full bg-maroon-50 flex items-center justify-center mr-4">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
