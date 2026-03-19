"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Download, 
  Mail, 
  Building2, 
  Linkedin,
  Edit,
  Trash2,
  X,
  Loader2
} from "lucide-react";

export default function AlumniManagementPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    graduationYear: new Date().getFullYear(),
    branch: "",
    degree: "B.E.",
    currentCompany: "",
    designation: "",
    location: "",
    linkedInProfile: "",
    status: "Active"
  });

  const [editingId, setEditingId] = useState(null);

  const branches = [
    "Computer Science",
    "Information Technology",
    "Electronics & TC",
    "Mechanical Engineering",
    "Civil Engineering"
  ];

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      let url = "/api/alumni?";
      if (searchTerm) url += `search=${searchTerm}&`;
      if (filterYear) url += `year=${filterYear}&`;
      if (filterBranch) url += `branch=${filterBranch}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setAlumni(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch alumni", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [searchTerm, filterYear, filterBranch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModalForAdd = () => {
    setEditingId(null);
    setFormData({
      fullName: "", email: "", phone: "", 
      graduationYear: new Date().getFullYear(), branch: "", 
      degree: "B.E.", currentCompany: "", designation: "", 
      location: "", linkedInProfile: "", status: "Active"
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (alumnus) => {
    setEditingId(alumnus._id);
    setFormData({
      fullName: alumnus.fullName, email: alumnus.email, phone: alumnus.phone || "", 
      graduationYear: alumnus.graduationYear, branch: alumnus.branch, 
      degree: alumnus.degree || "B.E.", currentCompany: alumnus.currentCompany || "", 
      designation: alumnus.designation || "", location: alumnus.location || "", 
      linkedInProfile: alumnus.linkedInProfile || "", status: alumnus.status || "Active"
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingId ? `/api/alumni/${editingId}` : "/api/alumni";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setIsModalOpen(false);
        fetchAlumni();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this alumni record?")) return;
    try {
      const res = await fetch(`/api/alumni/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchAlumni();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const years = Array.from(new Array(30), (val, index) => new Date().getFullYear() - index);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-2">
              <GraduationCap className="text-moze-primary" />
              Alumni Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Maintain connections, track career progression, and manage your institution's alumni network
            </p>
          </div>
          <button 
            onClick={openModalForAdd}
            className="flex items-center gap-2 bg-moze-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-maroon-800 transition-colors shadow-sm"
          >
            <Plus size={16} /> Add Alumni
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Network</p>
              <h3 className="text-2xl font-bold text-gray-900">{alumni.length}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Employed</p>
              <h3 className="text-2xl font-bold text-gray-900">{alumni.filter(a => a.currentCompany).length}</h3>
            </div>
          </div>
        </div>

        {/* Filters and List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, company, role..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <select 
                value={filterBranch} 
                onChange={e => setFilterBranch(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-moze-primary"
              >
                <option value="">All Branches</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select 
                value={filterYear} 
                onChange={e => setFilterYear(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-moze-primary"
              >
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-moze-primary" /></div>
            ) : alumni.length === 0 ? (
              <div className="p-16 text-center text-gray-500">
                <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No alumni records found matching your criteria</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-medium">
                    <th className="px-6 py-4">Alumni Profile</th>
                    <th className="px-6 py-4">Graduation</th>
                    <th className="px-6 py-4">Career</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {alumni.map(person => (
                    <tr key={person._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-moze-primary/10 text-moze-primary flex items-center justify-center font-bold text-lg">
                            {person.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{person.fullName}</p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                              <Mail size={12} /> {person.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <p className="font-medium text-gray-800">{person.graduationYear}</p>
                        <p className="text-gray-500 text-xs">{person.branch}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-sm">
                          {person.currentCompany ? (
                            <>
                              <div className="flex items-center gap-1.5 font-medium text-gray-800">
                                <Building2 size={14} className="text-gray-400" /> {person.currentCompany}
                              </div>
                              <p className="text-gray-500 text-xs pl-5">{person.designation}</p>
                            </>
                          ) : (
                            <span className="text-gray-400 italic text-xs">Unspecified</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          person.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                          person.status === 'Pending Verification' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {person.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {person.linkedInProfile && (
                            <a href={person.linkedInProfile} target="_blank" rel="noreferrer" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Linkedin size={16} />
                            </a>
                          )}
                          <button onClick={() => openModalForEdit(person)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(person._id)} className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                            <Trash2 size={16} />
                          </button>
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

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 font-serif">
                {editingId ? "Edit Alumni Profile" : "Register New Alumni"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              <form id="alumniForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 ml-1">Personal Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                      <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-moze-primary focus:ring-1 focus:ring-moze-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-moze-primary focus:ring-1 focus:ring-moze-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-moze-primary focus:ring-1 focus:ring-moze-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-moze-primary focus:ring-1 focus:ring-moze-primary">
                        <option value="Active">Active</option>
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Academic Info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 ml-1">Academic Credentials</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Graduation Year *</label>
                      <select required name="graduationYear" value={formData.graduationYear} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-moze-primary focus:ring-1 focus:ring-moze-primary">
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Branch/Department *</label>
                      <select required name="branch" value={formData.branch} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-moze-primary focus:ring-1 focus:ring-moze-primary">
                        <option value="">Select Branch...</option>
                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 ml-1">Professional Trajectory</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Current Company</label>
                      <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleInputChange} placeholder="e.g. Google, TCS" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-moze-primary focus:ring-1 focus:ring-moze-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Designation</label>
                      <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} placeholder="e.g. Senior Software Engineer" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-moze-primary focus:ring-1 focus:ring-moze-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Pune, India" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-moze-primary focus:ring-1 focus:ring-moze-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                      <input type="url" name="linkedInProfile" value={formData.linkedInProfile} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-moze-primary focus:ring-1 focus:ring-moze-primary" />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="alumniForm"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-moze-primary text-white rounded-xl text-sm font-medium hover:bg-maroon-800 disabled:opacity-50 transition-colors shadow-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Register Alumni"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
