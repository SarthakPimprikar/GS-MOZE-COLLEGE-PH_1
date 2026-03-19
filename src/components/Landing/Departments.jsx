"use client";

import { motion } from "framer-motion";
import { Laptop, Briefcase, Calculator, Cpu } from "lucide-react";
import Link from "next/link";

const departments = [
  {
    icon: <Cpu className="w-10 h-10" />,
    title: "Engineering",
    desc: "Innovative programs in Civil, Mechanical, and Electronics Engineering.",
    link: "/departments/engineering"
  },
  {
    icon: <Laptop className="w-10 h-10" />,
    title: "Computer Science",
    desc: "Building the future with AI, Software Engineering, and Data Science.",
    link: "/departments/cs"
  },
  {
    icon: <Briefcase className="w-10 h-10" />,
    title: "Management",
    desc: "Shaping leaders with top-tier MBA and BBA programs.",
    link: "/departments/management"
  },
  {
    icon: <Calculator className="w-10 h-10" />,
    title: "Commerce",
    desc: "Excellence in Finance, Accounting, and Business Administration.",
    link: "/departments/commerce"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const DepartmentsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-16">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-moze-primary font-bold tracking-wider uppercase text-sm mb-3 block"
          >
            Our Academic Pillars
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif font-extrabold text-gray-900 leading-tight mb-4"
          >
            Explore Our Departments
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Discover diverse disciplines designed to ignite your passion and prepare you for a successful career.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {departments.map((dept, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-maroon-50 text-moze-primary flex items-center justify-center mb-6 group-hover:bg-moze-primary group-hover:text-white transition-colors duration-300">
                {dept.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{dept.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {dept.desc}
              </p>

              <Link href={dept.link} className="inline-flex items-center text-moze-primary font-semibold hover:text-maroon-800 transition-colors">
                Explore Programs
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {/* Decorative line on hover */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-moze-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-3xl duration-300"></div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default DepartmentsSection;
