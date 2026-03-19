"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

const events = [
  {
    title: "Annual Tech Innovation Fest 2026",
    date: "March 15, 2026",
    location: "Main Auditorium",
    image: "/student-professional.png"
  },
  {
    title: "Mega Placement Drive",
    date: "April 02, 2026",
    location: "Campus Grounds",
    image: "/herosection.png"
  },
  {
    title: "Alumni Meet & Networking",
    date: "April 20, 2026",
    location: "Seminar Hall",
    image: "/student-professional.png"
  }
];

export default function EventsSection() {
  return (
    <section className="py-24 bg-moze-secondary relative">
      <div className="container mx-auto px-6 md:px-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-moze-primary font-bold tracking-wider uppercase text-sm mb-3 block"
            >
              Campus Life
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-serif font-extrabold text-gray-900 leading-tight"
            >
              Upcoming Events
            </motion.h2>
          </div>
          <Link href="/events" className="hidden md:inline-flex items-center text-moze-primary font-bold hover:text-maroon-800 transition-colors group">
            Check All Events
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image 
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl flex items-center justify-between shadow-lg">
                  <div className="flex items-center text-sm font-bold text-gray-800">
                    <CalendarDays className="w-4 h-4 text-moze-primary mr-2" />
                    {event.date}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-moze-primary transition-colors">{event.title}</h3>
                <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    {event.location}
                  </div>
                  <button className="w-10 h-10 rounded-full bg-maroon-50 text-moze-primary flex items-center justify-center group-hover:bg-moze-primary group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <div className="mt-10 text-center md:hidden">
          <Link href="/events" className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-moze-primary text-moze-primary font-bold hover:bg-moze-primary hover:text-white transition-colors">
            Check All Events
          </Link>
        </div>

      </div>
    </section>
  );
}
