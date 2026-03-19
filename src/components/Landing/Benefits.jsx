'use client';

import {
  Users,
  LineChart,
  Folder,
  CalendarCheck,
  CheckSquare,
  FileStack,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const iconMap = {
  Users: <Users className="w-6 h-6" />,
  LineChart: <LineChart className="w-6 h-6" />,
  Folder: <Folder className="w-6 h-6" />,
  CalendarCheck: <CalendarCheck className="w-6 h-6" />,
  CheckSquare: <CheckSquare className="w-6 h-6" />,
  FileStack: <FileStack className="w-6 h-6" />,
  ClipboardList: <ClipboardList className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
};

const defaultBenefits = [
  {
    icon: "Users",
    title: "Role-Based Access",
    description: "Granular permissions for Faculty, HOD, Lab Staff, and Admin",
  },
  {
    icon: "LineChart",
    title: "Real-Time Analytics",
    description: "Live dashboards with actionable insights",
  },
  {
    icon: "Folder",
    title: "Digital Document Hub",
    description: "Centralized repository with version control",
  },
  {
    icon: "CalendarCheck",
    title: "Academic Automation",
    description: "Automate labs, exams, and workshop workflows",
  },
  {
    icon: "CheckSquare",
    title: "Compliance Reports",
    description: "One-click AICTE, NAAC, and NBA reports",
  },
  {
    icon: "FileStack",
    title: "Placement Tracking",
    description: "Complete recruitment lifecycle management",
  },
  {
    icon: "ClipboardList",
    title: "Project Management",
    description: "Track research and student projects",
  },
  {
    icon: "ShieldCheck",
    title: "Quality Assurance",
    description: "Built-in checks for academic excellence",
  },
];

export default function BenefitsSection() {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      const response = await fetch("/api/benefits");
      const data = await response.json();
      setBenefits(data.benefits || defaultBenefits);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching benefits:", error);
      setBenefits(defaultBenefits);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white" name="benefits">
        <div className="container mx-auto px-6 md:px-16 text-center">
          <p className="text-gray-600">Loading benefits...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white" name="benefits">
      <div className="container mx-auto px-6 md:px-16">
        {/* Top Pill Text */}
        <div className="flex justify-center mb-6">
          <span className="px-6 py-2 bg-blue-50/70 hover:bg-blue-100/70 rounded-full text-sm font-medium text-gray-700 shadow-sm border border-transparent hover:border-blue-200">
            Why Choose TechEdu ERP
          </span>
        </div>

        {/* Main Box Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Built for Engineering Excellence
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive features designed specifically for technical education institutions
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 p-6 rounded-xl hover:bg-blue-100 transition duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                {iconMap[item.icon] || iconMap["Users"]}
              </div>

              <h3 className="font-semibold text-gray-800 text-lg mb-1">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
