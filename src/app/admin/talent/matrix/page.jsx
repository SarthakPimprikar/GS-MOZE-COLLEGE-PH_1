"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Briefcase,
  FileSearch,
  Clock,
  Award,
  Search,
  ChevronRight,
  Filter,
  ArrowUpRight,
  Download,
  Loader2
} from "lucide-react";

export default function TalentMatrixPage() {
  const [matrix, setMatrix] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/talent/matrix");
        const data = await res.json();
        if (data.success) {
          setMatrix(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(true); // Wait, should be false
        setIsLoading(false);
      }
    };
    fetchMatrix();
  }, []);

  const departments = ["All", ...new Set(matrix.map(item => item.department).filter(Boolean))];

  const filteredMatrix = matrix.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === "All" || item.department === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Talent Performance Matrix</h1>
            <p className="text-gray-500 mt-1">Global faculty contributions across Election Duty, Publications, and C-Offs.</p>
          </div>
          <button className="bg-moze-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-maroon-800 transition shadow-lg shadow-maroon-100">
            <Download size={18} /> Export Analytics
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search faculty name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-moze-primary transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl">
             <Filter size={18} className="text-gray-400" />
             <select 
               value={filterDept}
               onChange={(e) => setFilterDept(e.target.value)}
               className="bg-transparent border-none focus:ring-0 font-bold text-gray-700"
             >
               {departments.map(d => <option key={d} value={d}>{d}</option>)}
             </select>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 className="w-10 h-10 animate-spin text-moze-primary" />
               <p className="text-gray-500 font-medium">Analyzing institutional talent...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                   <tr>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Faculty Details</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Election Duties</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Publications</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">C-Off Balance</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Performance Index</th>
                     <th className="px-6 py-4"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMatrix.length === 0 ? (
                    <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400 italic">No matching records found.</td></tr>
                  ) : (
                    filteredMatrix.map((item, idx) => (
                      <tr key={item._id} className="hover:bg-maroon-50/20 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700">
                                 {item.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-gray-900">{item.name}</p>
                                 <p className="text-xs text-gray-500 font-medium uppercase">{item.department || 'N/A'} • {item.role}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
                              <Briefcase size={14} /> {item.metrics.electionDuty}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-bold text-sm">
                              <FileSearch size={14} /> {item.metrics.publications}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-sm">
                              <Clock size={14} /> {item.metrics.coffBalance}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-4">
                              <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden min-w-[100px]">
                                 <div 
                                    className="h-full bg-moze-primary transition-all duration-1000" 
                                    style={{ width: `${Math.min(item.metrics.performanceScore, 100)}%` }}
                                 ></div>
                              </div>
                              <span className="text-sm font-bold text-gray-700">{item.metrics.performanceScore}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 group-hover:text-moze-primary">
                              <ChevronRight size={20} />
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
