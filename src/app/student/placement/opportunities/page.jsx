"use client";

import { useState, useEffect } from "react";
import { 
  Briefcase, 
  MapPin, 
  Search, 
  Award, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Building2,
  Calendar,
  IndianRupee,
  Clock,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { useSession } from "@/context/SessionContext";

export default function StudentOpportunitiesPage() {
  const { user } = useSession();
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]); // To track if student already applied
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [applyingId, setApplyingId] = useState(null);

  // Mock student data for eligibility demo if not fully in session
  const studentAcademicProfile = {
    cgpa: 8.2, // This would ideally come from a real Academic/Results model
    branch: user?.branch || "Computer Science",
    backlogs: 0
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const drivesRes = await fetch("/api/placement/drives");
      const drivesJson = await drivesRes.res ? {} : await drivesRes.json();
      
      if (drivesJson.success) {
        setDrives(drivesJson.data.filter(d => d.status === 'Registration Open' || d.status === 'Upcoming'));
      }

      if (user?._id) {
        const appsRes = await fetch(`/api/placement/applications?studentId=${user._id}`);
        const appsJson = await appsRes.json();
        if (appsJson.success) {
          setApplications(appsJson.data);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleApply = async (driveId) => {
    if (!user?._id) return;
    setApplyingId(driveId);
    try {
      const res = await fetch("/api/placement/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user._id, driveId })
      });
      const data = await res.json();
      if (data.success) {
        alert("Applied successfully!");
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Application failed");
    } finally {
      setApplyingId(null);
    }
  };

  const isEligible = (drive) => {
    const { minimumCGPA, allowedBranches, maxBacklogsAllowed } = drive.eligibilityCriteria || {};
    
    // Check branch
    const branchMatch = !allowedBranches || allowedBranches.length === 0 || allowedBranches.includes(studentAcademicProfile.branch);
    
    // Check CGPA
    const cgpaMatch = studentAcademicProfile.cgpa >= (minimumCGPA || 0);
    
    // Check Backlogs
    const backlogMatch = studentAcademicProfile.backlogs <= (maxBacklogsAllowed || 0);

    return {
      eligible: branchMatch && cgpaMatch && backlogMatch,
      reasons: {
        branch: branchMatch,
        cgpa: cgpaMatch,
        backlogs: backlogMatch
      }
    };
  };

  const hasApplied = (driveId) => {
    return applications.some(app => app.driveId?._id === driveId);
  };

  const filteredDrives = drives.filter(d => 
    d.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.companyId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-serif text-gray-900 tracking-tight">Placement Opportunities</h1>
            <p className="text-gray-500 text-sm font-medium">Browse active recruitment drives and kickstart your career trajectory.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by role or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-moze-primary transition-all shadow-sm outline-none"
            />
          </div>
        </div>

        {/* Academic Context Bar */}
        <div className="bg-moze-primary p-4 rounded-3xl text-white shadow-lg shadow-maroon-200/50 flex flex-wrap gap-6 items-center">
           <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md">
             <Award size={20} className="text-amber-400" />
             <div>
               <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Current CGPA</p>
               <p className="text-lg font-bold">{studentAcademicProfile.cgpa}</p>
             </div>
           </div>
           <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md">
             <Briefcase size={20} className="text-blue-300" />
             <div>
               <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Branch</p>
               <p className="text-lg font-bold">{studentAcademicProfile.branch}</p>
             </div>
           </div>
           <p className="text-xs italic opacity-80 max-w-xs ml-auto">
             Eligibility is automatically verified against your academic profile. Update your profile in settings if data is incorrect.
           </p>
        </div>

        {/* Opportunities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-moze-primary" /></div>
          ) : filteredDrives.length === 0 ? (
            <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-dashed border-gray-300">
               <Briefcase className="w-16 h-16 mx-auto text-gray-200 mb-4" />
               <h2 className="text-xl font-bold text-gray-900">No active opportunities found</h2>
               <p className="text-gray-500 mt-2">Check back later or adjust your search filters.</p>
            </div>
          ) : (
            filteredDrives.map(drive => {
              const { eligible, reasons } = isEligible(drive);
              const applied = hasApplied(drive._id);
              
              return (
                <div key={drive._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border-l-4 border-l-transparent hover:border-l-moze-primary">
                  <div className="p-6 flex-1 space-y-5">
                    
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-3 shadow-sm group-hover:scale-110 transition-transform">
                          {drive.companyId?.logoUrl ? (
                            <img src={drive.companyId.logoUrl} alt={drive.companyId.name} className="max-w-full max-h-full object-contain" />
                          ) : <Building2 size={24} className="text-gray-300" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">{drive.jobTitle}</h3>
                          <p className="text-moze-primary font-medium text-sm">{drive.companyId?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-lg">
                           <IndianRupee size={16} /> {drive.ctcPackage}
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none mt-1">LPA CTC</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-2xl">
                         <Calendar size={16} className="text-moze-primary mt-0.5" />
                         <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Drive Date</p>
                            <p className="font-semibold">{format(new Date(drive.driveDate), "MMM dd, yyyy")}</p>
                         </div>
                       </div>
                       <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-2xl">
                         <Clock size={16} className="text-rose-500 mt-0.5" />
                         <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">App Deadline</p>
                            <p className="font-semibold text-rose-600">{format(new Date(drive.registrationDeadline), "MMM dd")}</p>
                         </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest pl-1">Conditions for Eligibility</p>
                       <div className="flex flex-wrap gap-2 text-[11px] font-medium">
                          <span className={`px-2 py-1 rounded-lg border ${reasons.cgpa ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                            Min {drive.eligibilityCriteria?.minimumCGPA} CGPA
                          </span>
                          <span className={`px-2 py-1 rounded-lg border ${reasons.branch ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                            {drive.eligibilityCriteria?.allowedBranches?.length > 0 ? drive.eligibilityCriteria.allowedBranches.join("/") : "All Branches"}
                          </span>
                          <span className={`px-2 py-1 rounded-lg border ${reasons.backlogs ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                            Max {drive.eligibilityCriteria?.maxBacklogsAllowed} Backlogs
                          </span>
                       </div>
                    </div>

                  </div>

                  <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                     {!eligible ? (
                       <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                          <AlertTriangle size={14} /> Criteria Not Met
                       </div>
                     ) : applied ? (
                       <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                          <CheckCircle2 size={16} /> Already Applied
                       </div>
                     ) : (
                       <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                         <CheckCircle2 size={14} /> You are Eligible
                       </div>
                     )}

                     <button 
                       onClick={() => handleApply(drive._id)}
                       disabled={!eligible || applied || applyingId === drive._id}
                       className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                         applied ? 'bg-gray-100 text-gray-400 ring-2 ring-gray-200' :
                         eligible ? 'bg-moze-primary text-white shadow-lg shadow-maroon-200 hover:bg-maroon-800' : 
                         'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                       }`}
                     >
                       {applyingId === drive._id ? <Loader2 size={14} className="animate-spin" /> : null}
                       {applied ? "Applied" : eligible ? "Apply Now" : "Locked"}
                       {!applied && eligible && <ChevronRight size={14} />}
                     </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
