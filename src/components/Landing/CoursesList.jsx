"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, IndianRupee, Star, ChevronLeft, ChevronRight } from "lucide-react";

const courses = [
  {
    title: "B.Tech in Computer Engineering",
    image: "/herosection.png",
    duration: "4 Years",
    fees: "₹1,20,000 / yr",
    rating: 4.8,
    reviews: 124
  },
  {
    title: "MBA in Finance",
    image: "/student-professional.png",
    duration: "2 Years",
    fees: "₹1,50,000 / yr",
    rating: 4.9,
    reviews: 98
  },
  {
    title: "B.Tech in Mechanical",
    image: "/herosection.png",
    duration: "4 Years",
    fees: "₹1,10,000 / yr",
    rating: 4.7,
    reviews: 156
  },
  {
    title: "BCA (Bachelor of Computer App.)",
    image: "/student-professional.png",
    duration: "3 Years",
    fees: "₹80,000 / yr",
    rating: 4.6,
    reviews: 210
  },
  {
    title: "BBA in Marketing",
    image: "/herosection.png",
    duration: "3 Years",
    fees: "₹90,000 / yr",
    rating: 4.7,
    reviews: 145
  }
];

export default function CoursesList() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6 md:px-16 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="max-w-2xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-moze-primary font-bold tracking-wider uppercase text-sm mb-3 block"
          >
            Top Programs
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight"
          >
            Popular Courses
          </motion.h2>
        </div>
        
        {/* Navigation Buttons */}
        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <button 
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-moze-primary hover:text-moze-primary hover:bg-maroon-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={scrollRight}
            className="w-12 h-12 rounded-full bg-moze-primary flex items-center justify-center text-white hover:bg-maroon-800 shadow-md transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </motion.div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative w-full overflow-hidden pb-12">
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-6 md:px-16 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {courses.map((course, idx) => (
            <motion.div 
              key={idx}
              initial={{opacity: 0, scale: 0.95}}
              whileInView={{opacity: 1, scale: 1}}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="min-w-[320px] max-w-[360px] flex-shrink-0 snap-center bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                <Image 
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-900">{course.rating}</span>
                  <span className="text-xs text-gray-500">({course.reviews})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 min-h-[56px]">{course.title}</h3>
                
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center text-gray-600 text-sm font-medium">
                    <Clock className="w-4 h-4 mr-2 text-moze-primary" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-gray-900 font-bold">
                    <IndianRupee className="w-4 h-4 mr-1 text-moze-primary" />
                    {course.fees.replace('₹', '')}
                  </div>
                </div>

                <Link 
                  href="/course-details" 
                  className="block w-full text-center py-3 rounded-xl border-2 border-moze-primary text-moze-primary font-bold hover:bg-moze-primary hover:text-white transition-colors"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
