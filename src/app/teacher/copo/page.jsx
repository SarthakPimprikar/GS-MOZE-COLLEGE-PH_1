'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Target, Map, ClipboardList, BarChart2, FileText, ChevronRight, GraduationCap, Award } from 'lucide-react';

const modules = [
  {
    id: 'cos',
    title: 'Course Outcomes',
    subtitle: 'Define & manage COs with Bloom\'s Taxonomy',
    icon: Target,
    href: '/teacher/copo/cos',
    color: 'from-maroon-600 to-maroon-800',
    badge: null,
  },
  {
    id: 'mapping',
    title: 'CO-PO Mapping',
    subtitle: 'Build the matrix linking COs to Program Outcomes',
    icon: Map,
    href: '/teacher/copo/mapping',
    color: 'from-amber-600 to-amber-800',
    badge: null,
  },
  {
    id: 'assessments',
    title: 'Assessments',
    subtitle: 'Create assessment types and map questions to COs',
    icon: ClipboardList,
    href: '/teacher/copo/assessments',
    color: 'from-emerald-600 to-emerald-800',
    badge: null,
  },
  {
    id: 'marks',
    title: 'Mark Entry',
    subtitle: 'Upload marks manually or via CSV import',
    icon: BookOpen,
    href: '/teacher/copo/marks',
    color: 'from-sky-600 to-sky-800',
    badge: null,
  },
  {
    id: 'attainment',
    title: 'CO Attainment',
    subtitle: 'Calculate and view attainment results',
    icon: BarChart2,
    href: '/teacher/copo/attainment',
    color: 'from-violet-600 to-violet-800',
    badge: null,
  },
  {
    id: 'reports',
    title: 'Reports',
    subtitle: 'Generate NBA/NAAC compliant reports',
    icon: FileText,
    href: '/teacher/copo/reports',
    color: 'from-rose-600 to-rose-800',
    badge: null,
  },
];

export default function COPOLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-moze-primary rounded-xl">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">CO-PO Management</h1>
              <p className="text-gray-500 text-sm mt-0.5">Outcome-Based Education · NBA / NAAC Compliant</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-white border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <Award className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Accreditation Ready</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Define Course Outcomes → Map to Program Outcomes → Enter Marks → Auto-calculate Attainment → Export NBA/NAAC Reports
            </p>
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => router.push(mod.href)}
                className="group relative bg-white rounded-2xl border border-gray-200 p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${mod.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">{mod.title}</h3>
                <p className="text-sm text-gray-500 leading-snug">{mod.subtitle}</p>
                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-moze-primary group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>

        {/* Quick Workflow */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-serif font-bold text-gray-800 mb-4">Recommended Workflow</h2>
          <div className="flex flex-wrap gap-3 items-center text-sm text-gray-600">
            {['Define COs', 'Map CO → PO', 'Create Assessments', 'Enter Marks', 'Calculate Attainment', 'Generate Report'].map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-moze-primary text-white text-xs font-bold">{idx + 1}</span>
                <span className="font-medium text-gray-700">{step}</span>
                {idx < 5 && <ChevronRight className="w-4 h-4 text-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
