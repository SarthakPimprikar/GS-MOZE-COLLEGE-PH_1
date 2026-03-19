"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

// Safe fallback for icons to debug
const Icon = ({ name }) => <span className="text-[10px] font-bold border border-current px-1 rounded uppercase mr-1">{name}</span>;

export default function DrivesPage() {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyId: "",
    jobTitle: "",
    jobDescription: "",
    ctcPackage: "",
    driveDate: "",
    registrationDeadline: "",
    status: "Upcoming",
    eligibilityCriteria: {
      minimumCGPA: 0,
      allowedBranches: [],
      maxBacklogsAllowed: 0
    }
  });

  const branches = [
    "Computer Science",
    "Information Technology",
    "Electronics & TC",
    "Mechanical Engineering",
    "Civil Engineering"
  ];

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/placement/drives");
      const json = await res.json();
      if (json.success) setDrives(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/placement/companies");
      const json = await res.json();
      if (json.success) setCompanies(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDrives();
    fetchCompanies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBranchToggle = (branch) => {
    setFormData(prev => {
      const current = prev.eligibilityCriteria.allowedBranches;
      const updated = current.includes(branch)
        ? current.filter(b => b !== branch)
        : [...current, branch];
      return {
        ...prev,
        eligibilityCriteria: { ...prev.eligibilityCriteria, allowedBranches: updated }
      };
    });
  };

  const openModalForAdd = () => {
    setEditingId(null);
    setFormData({
      companyId: "", jobTitle: "", jobDescription: "", ctcPackage: "",
      driveDate: "", registrationDeadline: "", status: "Upcoming",
      eligibilityCriteria: { minimumCGPA: 0, allowedBranches: [], maxBacklogsAllowed: 0 }
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (drive) => {
    setEditingId(drive._id);
    setFormData({
      companyId: drive.companyId?._id || "",
      jobTitle: drive.jobTitle,
      jobDescription: drive.jobDescription || "",
      ctcPackage: drive.ctcPackage,
      driveDate: format(new Date(drive.driveDate), "yyyy-MM-dd"),
      registrationDeadline: format(new Date(drive.registrationDeadline), "yyyy-MM-dd"),
      status: drive.status,
      eligibilityCriteria: {
        minimumCGPA: drive.eligibilityCriteria?.minimumCGPA || 0,
        allowedBranches: drive.eligibilityCriteria?.allowedBranches || [],
        maxBacklogsAllowed: drive.eligibilityCriteria?.maxBacklogsAllowed || 0
      }
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/placement/drives/${editingId}` : "/api/placement/drives";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchDrives();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to cancel and delete this drive?")) return;
    try {
      const res = await fetch(`/api/placement/drives/${id}`, { method: "DELETE" });
      if (res.ok) fetchDrives();
    } catch (err) {
      alert("Failed to delete drive");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Registration Open': return 'bg-emerald-100 text-emerald-800';
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Ongoing': return 'bg-amber-100 text-amber-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-2">
              <Icon name="DRV" />
              Placement Drives
            </h1>
            <p className="text-sm text-gray-500 mt-1">Configure recruitment events, set eligibility, and manage drive lifecycles.</p>
          </div>
          <button onClick={openModalForAdd} className="flex items-center gap-2 bg-moze-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-maroon-800 transition shadow-sm">
            <Icon name="+" /> Schedule Drive
          </button>
        </div>

        {/* Drives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full p-20 flex justify-center uppercase font-bold text-gray-400 tracking-widest animate-pulse">Loading...</div>
          ) : drives.length === 0 ? (
            <div className="col-span-full p-20 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
              <Icon name="EMPTY" />
              <p>No placement drives scheduled yet.</p>
            </div>
          ) : (
            drives.map(drive => (
              <div key={drive._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                <div className="p-5 border-b border-gray-50">
                   <div className="flex justify-between items-start">
                     <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2">
                        {drive.companyId?.logoUrl ? (
                          <img src={drive.companyId.logoUrl} alt={drive.companyId.name} className="max-w-full max-h-full object-contain" />
                        ) : <Icon name="COMP" />}
                     </div>
                     <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(drive.status)}`}>
                       {drive.status}
                     </span>
                   </div>
                   <div className="mt-4">
                     <h3 className="font-bold text-gray-900 text-lg group-hover:text-moze-primary transition-colors">{drive.jobTitle}</h3>
                     <p className="text-sm text-gray-500 font-medium">{drive.companyId?.name || "Unassigned Company"}</p>
                   </div>
                </div>

                <div className="p-5 flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Package (CTC)</p>
                      <p className="text-sm font-bold text-emerald-600">{drive.ctcPackage}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Drive Date</p>
                      <p className="text-sm font-semibold text-gray-700">{format(new Date(drive.driveDate), "MMM dd, yyyy")}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Eligibility Criteria</p>
                    <div className="flex flex-wrap gap-2">
                       <span className="bg-gray-50 px-2 py-1 rounded-lg text-xs font-medium border border-gray-100 flex items-center gap-1">
                         <Icon name="CG" /> {drive.eligibilityCriteria?.minimumCGPA} CGPA
                       </span>
                       <span className="bg-gray-50 px-2 py-1 rounded-lg text-xs font-medium border border-gray-100 flex items-center gap-1">
                         <Icon name="WRN" /> {drive.eligibilityCriteria?.maxBacklogsAllowed} Max Backlogs
                       </span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight italic">
                      {drive.eligibilityCriteria?.allowedBranches?.join(", ") || "All Branches"}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-rose-500">
                    <Icon name="DEAD" /> Deadline: {format(new Date(drive.registrationDeadline), "MMM dd")}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openModalForEdit(drive)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition border border-transparent hover:border-blue-100 shadow-sm"><Icon name="ED" /></button>
                    <button onClick={() => handleDelete(drive._id)} className="p-2 text-gray-500 hover:text-rose-600 hover:bg-white rounded-xl transition border border-transparent hover:border-rose-100 shadow-sm"><Icon name="DEL" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Drive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold font-serif">{editingId ? "Edit Placement Drive" : "Schedule New Drive"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-xl transition"><Icon name="X" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
              <form id="driveForm" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="md:col-span-2">
                     <h3 className="text-xs font-bold uppercase tracking-wider text-moze-primary mb-4 flex items-center gap-2">
                        <Icon name="INFO" /> Basic Drive Details
                     </h3>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Recruiting Company *</label>
                    <select required name="companyId" value={formData.companyId} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moze-primary transition">
                      <option value="">Select a company...</option>
                      {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Job Title *</label>
                    <input required type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} placeholder="e.g. Graduate Engineer Trainee" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moze-primary transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">CTC Package *</label>
                    <input required type="text" name="ctcPackage" value={formData.ctcPackage} onChange={handleInputChange} placeholder="e.g. 6.5 LPA" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moze-primary transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Drive Date *</label>
                    <input required type="date" name="driveDate" value={formData.driveDate} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moze-primary transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Registration Deadline *</label>
                    <input required type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moze-primary transition" />
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1">Current Status</label>
                     <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moze-primary transition">
                       <option value="Upcoming">Upcoming</option>
                       <option value="Registration Open">Registration Open</option>
                       <option value="Registration Closed">Registration Closed</option>
                       <option value="Ongoing">Ongoing</option>
                       <option value="Completed">Completed</option>
                       <option value="Cancelled">Cancelled</option>
                     </select>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                   <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4 flex items-center gap-2">
                      <Icon name="ELG" /> Eligibility Enforcement
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-xs font-medium text-gray-700 mb-1">Min Cumulative CGPA</label>
                         <input type="number" step="0.1" name="eligibilityCriteria.minimumCGPA" value={formData.eligibilityCriteria.minimumCGPA} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moze-primary transition" />
                      </div>
                      <div>
                         <label className="block text-xs font-medium text-gray-700 mb-1">Max Active Backlogs Allowed</label>
                         <input type="number" name="eligibilityCriteria.maxBacklogsAllowed" value={formData.eligibilityCriteria.maxBacklogsAllowed} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moze-primary transition" />
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-xs font-medium text-gray-700 mb-2">Allowed Branches (Selection)</label>
                         <div className="flex flex-wrap gap-2">
                           {branches.map(b => (
                             <button
                               key={b}
                               type="button"
                               onClick={() => handleBranchToggle(b)}
                               className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                                 formData.eligibilityCriteria.allowedBranches.includes(b)
                                   ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                   : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-200'
                               }`}
                             >
                               {b} {formData.eligibilityCriteria.allowedBranches.includes(b) && <Icon name="OK" />}
                             </button>
                           ))}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Description */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                   <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Role Description & Recruitment Process</h3>
                   <textarea name="jobDescription" value={formData.jobDescription} onChange={handleInputChange} rows={3} placeholder="Outline the job role, selection process, and requirements..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moze-primary transition resize-none"></textarea>
                </div>

              </form>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
              <button form="driveForm" type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-moze-primary text-white rounded-xl text-sm font-medium hover:bg-maroon-800 disabled:opacity-50 transition shadow-sm">
                {isSubmitting && <span className="animate-spin opacity-50 font-bold mr-1">...</span>}
                {editingId ? "Save Changes" : "Confirm Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
