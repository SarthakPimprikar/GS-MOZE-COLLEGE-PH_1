"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter, 
  ArrowRight, 
  Loader2,
  MoreVertical,
  Calendar,
  Building2
} from "lucide-react";
import { format } from "date-fns";

export default function PlacementTrackingPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState("");

  const statusOptions = [
    'Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Waitlisted', 'Offer Accepted'
  ];

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let url = "/api/placement/applications";
      const params = new URLSearchParams();
      if (selectedDrive) params.append("driveId", selectedDrive);
      if (params.toString()) url += "?" + params.toString();
      
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setApplications(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrives = async () => {
    try {
      const res = await fetch("/api/placement/drives");
      const json = await res.json();
      if (json.success) setDrives(json.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchApplications();
    fetchDrives();
  }, [selectedDrive]);

  const updateStatus = async (appId, newStatus) => {
    try {
      const res = await fetch(`/api/placement/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredApps = applications.filter(app => 
    !filterStatus || app.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-2">
            <Users className="text-moze-primary" />
            Interview Tracker
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage student application flows and update recruitment pipeline statuses.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedDrive} 
              onChange={e => setSelectedDrive(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-moze-primary"
            >
              <option value="">All Placement Drives</option>
              {drives.map(d => (
                <option key={d._id} value={d._id}>{d.companyId?.name} - {d.jobTitle}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
             {statusOptions.slice(0, 4).map(s => (
               <button 
                 key={s} 
                 onClick={() => setFilterStatus(filterStatus === s ? "" : s)}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                   filterStatus === s 
                     ? 'bg-moze-primary text-white border-moze-primary shadow-sm' 
                     : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                 }`}
               >
                 {s}
               </button>
             ))}
          </div>
        </div>

        {/* Tracking List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
             <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-moze-primary" /></div>
          ) : filteredApps.length === 0 ? (
            <div className="p-20 text-center text-gray-500">
               <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
               <p>No student applications found for the selected criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left">
               <thead className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                 <tr>
                   <th className="px-6 py-4">Student Candidate</th>
                   <th className="px-6 py-4">Target Drive</th>
                   <th className="px-6 py-4">Current Status</th>
                   <th className="px-6 py-4 text-right">Workflow Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-sm">
                 {filteredApps.map(app => (
                   <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-moze-primary/5 text-moze-primary border border-moze-primary/10 flex items-center justify-center font-bold">
                             {app.studentId?.fullName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{app.studentId?.fullName}</p>
                            <p className="text-[11px] text-gray-500">{app.studentId?.branch} • ID: {app.studentId?.studentId}</p>
                          </div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <Building2 size={14} className="text-gray-400" />
                           <div>
                              <p className="font-medium text-gray-800">{app.driveId?.companyId?.name}</p>
                              <p className="text-[11px] text-gray-500">{app.driveId?.jobTitle}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          app.status === 'Selected' || app.status === 'Offer Accepted' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                          app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {app.status === 'Selected' && <CheckCircle2 size={10} />}
                          {app.status === 'Rejected' && <XCircle size={10} />}
                          {app.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <select 
                             value={app.status}
                             onChange={(e) => updateStatus(app._id, e.target.value)}
                             className="bg-white border border-gray-200 rounded-lg text-xs px-2 py-1 outline-none focus:ring-1 focus:ring-moze-primary"
                          >
                             {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
