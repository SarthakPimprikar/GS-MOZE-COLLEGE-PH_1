"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  CalendarDays,
  Award,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function PlacementOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/placement/stats");
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch placement stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-moze-primary" />
      </div>
    );
  }

  const { metrics, topRecruiters = [], upcomingDrives = [] } = stats || {};

  const formatCurrency = (amount) => {
    if (!amount) return 'TBD';
    return (amount / 100000).toFixed(2) + ' LPA';
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-2">
            <Briefcase className="text-moze-primary" />
            Placement Cell Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time insights across corporate relations, active drives, and student success metrics.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard 
          title="Total Partners" 
          value={metrics?.totalCompanies || 0} 
          icon={<Building2 size={24} />} 
          color="bg-blue-50 text-blue-600"
        />
        <MetricCard 
          title="Total Drives" 
          value={metrics?.totalDrives || 0} 
          icon={<CalendarDays size={24} />} 
          color="bg-purple-50 text-purple-600"
        />
        <MetricCard 
          title="Placed Students" 
          value={metrics?.placedStudents || 0} 
          icon={<GraduationCap size={24} />} 
          color="bg-emerald-50 text-emerald-600"
        />
        <MetricCard 
          title="Highest CTC" 
          value={formatCurrency(metrics?.highestCTC)} 
          icon={<Award size={24} />} 
          color="bg-amber-50 text-amber-600"
        />
        <MetricCard 
          title="Average CTC" 
          value={formatCurrency(metrics?.averageCTC)} 
          icon={<TrendingUp size={24} />} 
          color="bg-moze-primary/10 text-moze-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Drives */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-serif text-gray-900">Upcoming Placement Drives</h2>
            <Link href="/admin/placement/drives" className="text-sm text-moze-primary hover:underline font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingDrives.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No upcoming drives scheduled.</p>
            ) : (
              upcomingDrives.map((drive, idx) => (
                <div key={drive._id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-moze-primary/30 transition-colors bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center p-2 shadow-sm">
                      {drive.companyId?.logoUrl ? (
                         <img src={drive.companyId.logoUrl} alt={drive.companyId.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="font-bold text-gray-400 text-lg">{drive.companyId?.name?.charAt(0) || 'C'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{drive.companyId?.name || 'Unknown Company'}</h3>
                      <p className="text-sm text-gray-500">{drive.jobTitle} • {drive.ctcPackage}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-row sm:flex-col gap-2 sm:gap-0">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {format(new Date(drive.driveDate), 'MMM dd, yyyy')}
                    </span>
                    <p className="text-xs text-rose-500 mt-1 sm:mt-1.5 font-medium">
                      Closes: {format(new Date(drive.registrationDeadline), 'MMM dd')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Recruiters */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-serif text-gray-900">Top Recruiters</h2>
            <Link href="/admin/placement/companies" className="text-sm text-moze-primary hover:underline font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {topRecruiters.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No historical placement data.</p>
            ) : (
              topRecruiters.map((company, idx) => (
                <div key={company._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{company.name}</h3>
                      <p className="text-xs text-gray-500">{company.industry}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-600">{company.totalHiresHistorically}</span>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Hires</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3"
    >
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">{title}</p>
      </div>
    </motion.div>
  );
}
