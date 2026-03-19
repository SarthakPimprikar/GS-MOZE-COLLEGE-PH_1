"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { 
  Award, 
  Clock, 
  Loader2,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Briefcase,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HodTalentPage() {
  const { user } = useSession();
  const [departmentData, setDepartmentData] = useState(null);
  const [matrix, setMatrix] = useState([]);
  const [pendingCoff, setPendingCoff] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHodData = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/dashboard/hod?hodId=${user.id}`);
      const data = await res.json();
      setDepartmentData(data);
    } catch (err) { console.error(err); }
  };

  const fetchTalentData = async () => {
    if (!departmentData?.department) return;
    setLoading(true);
    try {
      const [matrixRes, coffRes] = await Promise.all([
        fetch(`/api/talent/matrix?department=${departmentData.department}`),
        fetch(`/api/talent/c-off?department=${departmentData.department}`)
      ]);
      const matrixData = await matrixRes.json();
      const coffData = await coffRes.json();
      
      if (matrixData.success) setMatrix(matrixData.data);
      if (coffData.success) {
        setPendingCoff(coffData.data.filter(r => r.status === 'Pending'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHodData();
  }, [user?.id]);

  useEffect(() => {
    if (departmentData?.department) {
      fetchTalentData();
    }
  }, [departmentData?.department]);

  const handleAction = async (id, status) => {
    try {
      const res = await fetch('/api/talent/c-off', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, approvedBy: user.id })
      });
      if (res.ok) fetchTalentData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <Award className="w-10 h-10 text-moze-primary" />
            Staff Talent Management
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Department: <span className="text-moze-primary font-bold">{departmentData?.department || "Loading..."}</span></p>
        </div>
        <div className="flex gap-4">
           <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 text-center">
              <p className="text-[10px] font-bold text-orange-600 uppercase">Pending Approvals</p>
              <p className="text-2xl font-bold text-orange-700">{pendingCoff.length}</p>
           </div>
           <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 text-center">
              <p className="text-[10px] font-bold text-blue-600 uppercase">Faculty Tracked</p>
              <p className="text-2xl font-bold text-blue-700">{matrix.length}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Approvals Column */}
        <div className="lg:col-span-1 space-y-6">
           <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-moze-primary" />
              C-Off Approvals
           </h3>
           <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-4">
                   <div className="h-32 bg-gray-100 rounded-2xl"></div>
                   <div className="h-32 bg-gray-100 rounded-2xl"></div>
                </div>
              ) : pendingCoff.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                   <CheckCircle2 className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                   <p className="text-gray-400 font-medium">All caught up!</p>
                </div>
              ) : (
                pendingCoff.map(req => (
                  <div key={req._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                     <p className="font-bold text-gray-900">{req.teacherId?.fullName}</p>
                     <p className="text-xs text-gray-500 mb-4">{req.reasonForEarning} • {new Date(req.earnedOnDate).toLocaleDateString()}</p>
                     <div className="flex gap-2">
                        <button 
                          onClick={() => handleAction(req._id, 'Approved')}
                          className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleAction(req._id, 'Rejected')}
                          className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-rose-700 transition"
                        >
                          Reject
                        </button>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* Matrix Column */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-moze-primary" />
              Performance Matrix
           </h3>
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase">
                    <tr>
                       <th className="px-6 py-4">Faculty Member</th>
                       <th className="px-6 py-4 text-center">Duties</th>
                       <th className="px-6 py-4 text-center">Papers</th>
                       <th className="px-6 py-4 text-center">Score</th>
                       <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr><td colSpan="5" className="px-6 py-10 text-center animate-pulse">Analyzing department...</td></tr>
                    ) : matrix.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">No faculty data.</td></tr>
                    ) : (
                      matrix.map(item => (
                        <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                           <td className="px-6 py-4 text-center font-medium">{item.metrics.electionDuty}</td>
                           <td className="px-6 py-4 text-center font-medium">{item.metrics.publications}</td>
                           <td className="px-6 py-4 text-center">
                              <span className="font-bold text-moze-primary">{item.metrics.performanceScore}</span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center justify-center">
                                 <div className="w-20 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-moze-primary h-full" 
                                      style={{ width: `${Math.min(item.metrics.performanceScore, 100)}%` }}
                                    ></div>
                                 </div>
                              </div>
                           </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}
