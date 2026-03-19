'use client';

import {
  Globe,
  Fingerprint,
  MessageSquare,
  CalendarRange,
  ClipboardList,
  Users2,
  CreditCard,
  FlaskRound,
  Building,
  BriefcaseBusiness,
  FileCheck,
  BarChart3
} from 'lucide-react';
import { useState, useEffect } from 'react';

const iconMap = {
  Globe: <Globe className="w-10 h-10 text-white" />,
  Fingerprint: <Fingerprint className="w-10 h-10 text-white" />,
  MessageSquare: <MessageSquare className="w-10 h-10 text-white" />,
  CalendarRange: <CalendarRange className="w-10 h-10 text-white" />,
  ClipboardList: <ClipboardList className="w-10 h-10 text-white" />,
  Users2: <Users2 className="w-10 h-10 text-white" />,
  CreditCard: <CreditCard className="w-10 h-10 text-white" />,
  FlaskRound: <FlaskRound className="w-10 h-10 text-white" />,
  Building: <Building className="w-10 h-10 text-white" />,
  BriefcaseBusiness: <BriefcaseBusiness className="w-10 h-10 text-white" />,
  FileCheck: <FileCheck className="w-10 h-10 text-white" />,
  BarChart3: <BarChart3 className="w-10 h-10 text-white" />,
};

const defaultFeatures = [
  { icon: "Globe", title: "Online Admissions", description: "Digital application process document verification" },
  { icon: "Fingerprint", title: "Smart Attendance", description: "Biometric & facial recognition integration" },
  { icon: "MessageSquare", title: "SMS & Email Alert", description: "Automated notifications for all stakeholders" },
  { icon: "CalendarRange", title: "AI Timetable Scheduling", description: "Conflict-free scheduling with optimization" },
  { icon: "ClipboardList", title: "Exam Management", description: "Complete examination lifecycle handling" },
  { icon: "Users2", title: "Faculty Management", description: "Automated notifications for all stakeholders" },
  { icon: "CreditCard", title: "Fee Automation", description: "Online payments with auto-reconciliation" },
  { icon: "BarChart3", title: "Lab Analytics", description: "Utilization reports & resource planning" },
  { icon: "Building", title: "Hostel Management", description: "Room allotment & mess management" },
  { icon: "BriefcaseBusiness", title: "Placement Cell", description: "Company relations & student placements" },
  { icon: "FileCheck", title: "Accreditation Reports", description: "Ready-to-submit AICTE/NAAC documents" },
  { icon: "FileCheck", title: "Custom Modules", description: "Tailored solutions for unique needs" },
];

export default function FeaturesSection() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch("/api/features");
      const data = await response.json();
      setFeatures(data.features || defaultFeatures);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching features:", error);
      setFeatures(defaultFeatures);
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white" id="features">
      <div className="container mx-auto px-6 md:px-16">

        {/* --- Heading Section --- */}
        <div className="text-center mb-16">

          {/* Pill label */}
          <div className="flex justify-center mb-6">
            <span className="px-6 py-2 bg-blue-50/70 hover:bg-blue-100/70 rounded-full text-sm font-medium text-gray-700 shadow-sm border border-transparent hover:border-blue-200">
              {loading ? "Loading Features..." : "Powerful Features"}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Everything You Need to Succeed
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive features designed to streamline every aspect of campus operations
          </p>
        </div>

        {/* --- Features Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((item, i) => (
            <div key={item._id || i}
              className="flex items-start space-x-4 p-5 bg-blue-50/70 hover:bg-blue-100/70 rounded-xl 
                         transition-all duration-300 border border-transparent hover:border-blue-200 cursor-pointer"
            >
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-blue-600 rounded-lg shadow-sm">
                {/* Note: In the design the icon was blue on white, but typically to pop 'white on blue' works well or 'blue on white'. 
                    The previous code had bg-white text-blue-600. Let's revert to that to match exactly. */}
                {/* Reverting to original styling for icon container */}
                <div className="w-10 h-10 flex items-center justify-center bg-white text-blue-600 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center text-blue-600">
                    {/* Clone element to force color or just render it. api returns string key, we map to component. 
                            The component in iconMap defines color? 
                            Let's make iconMap have className="w-6 h-6 text-blue-600" to match previous hardcoded style.
                        */}
                    {
                      // We need to render the icon with specific classes to match the original design 
                      // original: <Globe className="w-6 h-6 text-blue-600" />
                      // Our iconMap currently has white icons. Let's fix iconMap below or inline it.
                    }
                    {(() => {
                      const IconComponent = {
                        Globe, Fingerprint, MessageSquare, CalendarRange, ClipboardList, Users2,
                        CreditCard, FlaskRound, Building, BriefcaseBusiness, FileCheck, BarChart3
                      }[item.icon] || Globe;
                      return <IconComponent className="w-6 h-6 text-blue-600" />;
                    })()}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-12 text-center">
          <button suppressHydrationWarning className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full 
                            transition shadow-md hover:shadow-lg">
            See All Feature In Detail
          </button>
        </div>

      </div>
    </section>
  );
}