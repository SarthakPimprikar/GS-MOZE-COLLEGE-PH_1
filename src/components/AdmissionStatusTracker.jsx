"use client";

import React from "react";
import { CheckCircle, Clock, ShieldCheck, Target, UserCheck, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const AdmissionStatusTracker = ({ currentStatus }) => {
  const allStatuses = [
    { id: "pending", label: "Application Submitted", icon: <Clock className="w-5 h-5" />, description: "Your enquiry has been converted to an admission application." },
    { id: "inProcess", label: "In Review", icon: <Clock className="w-5 h-5" />, description: "Your documents are being reviewed by our office staff." },
    { id: "verified", label: "Documents Verified", icon: <ShieldCheck className="w-5 h-5" />, description: "Your documents have been successfully verified." },
    { id: "selected", label: "Selected in Merit List", icon: <Target className="w-5 h-5" />, description: "Congratulations! You have been selected for admission." },
    { id: "enrolled", label: "Enrolled", icon: <UserCheck className="w-5 h-5" />, description: "Welcome to G.S. Moze College! You are now a student." }
  ];

  const getStatusIndex = (status) => {
    const idx = allStatuses.findIndex((s) => s.id === status);
    return idx === -1 ? 0 : idx;
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 max-w-5xl mx-auto my-12 relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-moze-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-maroon-700/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-10 text-center tracking-tight">Admission <span className="text-moze-primary">Journey</span></h2>
        
        <div className="relative pt-4">
          {/* Progress Line */}
          <div className="absolute top-[26px] left-[26px] right-[26px] h-1 bg-gray-100 hidden md:block" />
          <div 
             className="absolute top-[26px] left-[26px] h-1 bg-gradient-to-r from-moze-primary to-maroon-300 hidden md:block transition-all duration-1000 ease-in-out" 
             style={{ width: `${(currentIndex / (allStatuses.length - 1)) * 100 - 5}%` }}
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-8">
            {allStatuses.map((status, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isRejected = currentStatus === "rejected";

              return (
                <motion.div 
                  key={status.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex md:flex-col items-center gap-4 flex-1 text-center group"
                >
                  <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500
                    ${isCompleted ? "bg-moze-primary border-maroon-100 text-white" : ""}
                    ${isCurrent ? "bg-white border-moze-primary text-moze-primary animate-pulse shadow-lg" : ""}
                    ${!isCompleted && !isCurrent ? "bg-white border-gray-100 text-gray-400" : ""}
                    ${isRejected && isCurrent ? "border-red-500 text-red-500" : ""}
                  `}>
                    {isCompleted ? <CheckCircle className="w-7 h-7" /> : status.icon}
                  </div>
                  
                  <div className="text-left md:text-center">
                    <h3 className={`font-bold mt-2 text-sm md:text-base ${isCurrent ? "text-moze-primary" : "text-gray-700"}`}>
                      {status.label}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-[150px] hidden md:block mx-auto font-medium">
                      {status.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {currentStatus === "rejected" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 p-8 bg-red-50 border-l-8 border-red-500 rounded-2xl flex items-center gap-6 shadow-sm"
          >
             <XCircle className="w-16 h-16 text-red-500 flex-shrink-0" />
             <div>
               <h4 className="font-bold text-red-800 text-xl">Application Rejected</h4>
               <p className="text-red-700 opacity-90 leading-relaxed">We regret to inform you that your application has been rejected. Please contact the admission office at admissions@mozecollege.edu.in for further clarification.</p>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdmissionStatusTracker;
