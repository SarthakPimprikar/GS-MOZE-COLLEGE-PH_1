'use client';

import {
  BookOpenText, GraduationCap, IndianRupee, Library, CalendarDays,
  UserCog, ClipboardSignature, BarChart4, FlaskConical, Building2,
  Briefcase, FileSearch
} from 'lucide-react';
import { useState, useEffect } from 'react';

const iconMap = {
  BookOpenText: <BookOpenText className="w-8 h-8" />,
  GraduationCap: <GraduationCap className="w-8 h-8" />,
  IndianRupee: <IndianRupee className="w-8 h-8" />,
  Library: <Library className="w-8 h-8" />,
  CalendarDays: <CalendarDays className="w-8 h-8" />,
  UserCog: <UserCog className="w-8 h-8" />,
  ClipboardSignature: <ClipboardSignature className="w-8 h-8" />,
  BarChart4: <BarChart4 className="w-8 h-8" />,
  FlaskConical: <FlaskConical className="w-8 h-8" />,
  Building2: <Building2 className="w-8 h-8" />,
  Briefcase: <Briefcase className="w-8 h-8" />,
  FileSearch: <FileSearch className="w-8 h-8" />,
};

const defaultModules = [
  { icon: "BookOpenText", title: "Admissions", description: "Online application & enrollment" },
  { icon: "GraduationCap", title: "Academics", description: "Curriculum & course management" },
  { icon: "IndianRupee", title: "Fee Management", description: "Automated billing & receipts" },
  { icon: "Library", title: "Examination", description: "Scheduling & result processing" },
  { icon: "CalendarDays", title: "Timetable", description: "AI-powered scheduling" },
  { icon: "UserCog", title: "HR & Payroll", description: "Staff management & salary" },
  { icon: "ClipboardSignature", title: "Placement", description: "Recruitment lifecycle management" },
  { icon: "BarChart4", title: "Analytics", description: "Insights & reporting dashboard" },
  { icon: "FlaskConical", title: "Lab Management", description: "Resource & equipment tracking" },
  { icon: "Building2", title: "Hostel", description: "Room allocation & facilities" },
  { icon: "Briefcase", title: "Industry Collaboration", description: "MOUs & partnerships" },
  { icon: "FileSearch", title: "Accreditation", description: "NBA, NAAC & AICTE reports" }
];

export default function ModulesSection() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch("/api/modules");
      const data = await response.json();
      setModules(data.modules || defaultModules);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching modules:", error);
      setModules(defaultModules);
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="modules">
      <div className="container mx-auto px-6 md:px-16">

        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <span className="px-6 py-2 bg-blue-50/70 hover:bg-blue-100/70 rounded-full text-sm font-medium text-gray-700 shadow-sm border border-transparent hover:border-blue-200">
              {loading ? "Loading Modules..." : `${modules.length}+ Integrated Modules`}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Complete ERP Ecosystem</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Every module your institution needs, seamlessly integrated</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {modules.map((m, i) => (
            <div key={m._id || i}
              className="group bg-white rounded-2xl p-7 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-100 transition">
                  {iconMap[m.icon] || iconMap["BookOpenText"]}
                </div>
                <h3 className="font-semibold text-gray-900 text-base">{m.title}</h3>
                <p className="text-gray-600 text-sm">{m.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">

          <button suppressHydrationWarning className="px-7 py-3.5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition">

            View All Module Features
          </button>
        </div>
      </div>
    </section>

  )
}


