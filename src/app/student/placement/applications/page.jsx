"use client";

import { useState, useEffect } from "react";
import { 
  Briefcase, 
  MapPin, 
  Search, 
  Loader2, 
  Building2,
  Calendar,
  IndianRupee,
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  HelpCircle
} from "lucide-react";
import { format } from "date-fns";
import { useSession } from "@/context/SessionContext";

export default function StudentApplicationsPage() {
  const { user } = useSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/placement/applications?studentId=${user._id}`);
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

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Selected':
      case 'Offer Accepted': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Shortlisted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Interview Scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Application Tracker</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Follow your recruitment journey and response status from corporate partners.</p>
        </div>

        {/* List of Applications */}
        <div className="space-y-6">
          {loading ? (
             <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-moze-primary" /></div>
          ) : applications.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center">
               <HelpCircle className="w-16 h-16 text-gray-200 mb-4" />
               <p className="text-lg font-bold text-gray-900">No applications yet</p>
               <p className="text-gray-500 mt-1 max-w-sm">You haven't applied for any placement drives yet. Head over to Opportunities to start.</p>
            </div>
          ) : (
            applications.map(app => (
              <div key={app._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 group hover:shadow-md transition-shadow">
                
                {/* Company & Role Info */}
                <div className="p-6 md:w-2/5 flex items-center gap-5">
                   <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-3 shrink-0">
                      {app.driveId?.companyId?.logoUrl ? (
                         <img src={app.driveId.companyId.logoUrl} alt={app.driveId.companyId.name} className="max-w-full max-h-full object-contain" />
                      ) : <Building2 size={24} className="text-gray-300" />}
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900 break-words line-clamp-2">{app.driveId?.jobTitle}</h3>
                      <p className="text-moze-primary font-medium text-sm">{app.driveId?.companyId?.name}</p>
                      <div className="mt-2 flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                         <span className="flex items-center gap-1"><IndianRupee size={12} /> {app.driveId?.ctcPackage}</span>
                      </div>
                   </div>
                </div>

                {/* Status & Timeline */}
                <div className="p-6 md:flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                   <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(app.status)}`}>
                          {app.status}
                        </span>
                        <p className="text-[10px] text-gray-400 font-medium">Applied on {format(new Date(app.createdAt), "MMM dd, yyyy")}</p>
                      </div>

                      {/* Progress Visual */}
                      <div className="flex items-center gap-1.5 pt-2">
                         <div className={`h-1.5 w-8 rounded-full ${app.status !== 'Applied' ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                         <div className={`h-1.5 w-8 rounded-full ${['Shortlisted', 'Interview Scheduled', 'Selected', 'Offer Accepted'].includes(app.status) ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                         <div className={`h-1.5 w-8 rounded-full ${['Interview Scheduled', 'Selected', 'Offer Accepted'].includes(app.status) ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                         <div className={`h-1.5 w-8 rounded-full ${['Selected', 'Offer Accepted'].includes(app.status) ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                      </div>
                   </div>

                   <div className="shrink-0 flex items-center gap-3">
                      {app.status === 'Selected' ? (
                        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200 animate-pulse">
                              <CheckCircle2 size={18} />
                           </div>
                           <p className="text-xs font-bold text-emerald-800">Offer Pending acceptance</p>
                        </div>
                      ) : app.status === 'Rejected' ? (
                        <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl flex items-center gap-3">
                           <XCircle size={20} className="text-rose-500" />
                           <p className="text-xs font-bold text-rose-800">Better luck next time</p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 font-medium italic">Status tracking in progress...</p>
                      )}
                   </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
