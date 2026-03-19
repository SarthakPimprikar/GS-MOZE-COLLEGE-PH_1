"use client";

import { motion } from "framer-motion";
import { Star, StarHalf, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const studentReviews = [
  {
    name: "Rohan Sharma",
    course: "B.Tech Computer Engineering (Alumni)",
    avatar: "/avatars/1.jpg",
    rating: 5,
    content: "The faculty here is incredibly supportive, and the placement cell works tirelessly to ensure we get the best opportunities. I secured a job at a top MNC before even graduating!"
  },
  {
    name: "Priya Patel",
    course: "MBA in Finance",
    avatar: "/avatars/2.jpg",
    rating: 4.5,
    content: "The industry-aligned curriculum and frequent guest lectures from corporate leaders gave me the practical knowledge I needed to excel in my career. Proud to be a Moze College student!"
  },
  {
    name: "Amit Desai",
    course: "B.Tech Mechanical Engineering",
    avatar: "/avatars/3.jpg",
    rating: 5,
    content: "State-of-the-art labs and hands-on projects made learning engineering concepts so much easier. The campus environment is vibrant and encourages innovation."
  },
  {
    name: "Sneha Reddy",
    course: "BCA",
    avatar: "/avatars/4.jpg",
    rating: 5,
    content: "From academics to extracurriculars, this college offers a perfect balance. The teaching methodologies are modern and highly effective."
  }
];

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState(studentReviews);

  // Auto-scroll logic (infinite marquee effect)
  return (
    <section className="py-24 bg-maroon-50 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 mb-16 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-moze-primary font-bold tracking-wider uppercase text-sm mb-3 block"
        >
          Student Success Stories
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-serif font-extrabold text-gray-900 leading-tight"
        >
          What Our Students Say
        </motion.h2>
      </div>

      {/* Auto-sliding Carousel */}
      <div className="relative w-full max-w-full overflow-hidden flex">
        {/* Double the array for seamless looping */}
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {[...reviews, ...reviews].map((review, idx) => (
            <div 
              key={idx}
              className="w-[300px] md:w-[400px] flex-shrink-0 mx-4"
            >
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full flex flex-col relative">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-maroon-50" />
                
                {/* Stars */}
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    i + 1 <= review.rating ? 
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-500" /> :
                    i + 0.5 === review.rating ?
                      <StarHalf key={i} className="w-5 h-5 fill-yellow-400 text-yellow-500" /> :
                      <Star key={i} className="w-5 h-5 text-gray-300" />
                  ))}
                </div>

                <p className="text-gray-700 italic leading-relaxed mb-8 flex-grow whitespace-normal">
                  "{review.content}"
                </p>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-50">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 relative flex-shrink-0">
                    <Image 
                      src={review.avatar} 
                      alt={review.name} 
                      fill 
                      className="object-cover"
                      onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=822c2c&color=fff` }}
                    />
                  </div>
                  <div className="whitespace-normal">
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{review.course}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
