"use client";

import { useState, useEffect } from "react";
import { Building2, Search, Plus, Edit, Trash2, X, Loader2, Globe } from "lucide-react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
    tier: "MNC",
    status: "Active",
    description: ""
  });

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      let url = "/api/placement/companies";
      if (searchTerm) url += `?search=${searchTerm}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setCompanies(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModalForAdd = () => {
    setEditingId(null);
    setFormData({ name: "", industry: "", website: "", tier: "MNC", status: "Active", description: "" });
    setIsModalOpen(true);
  };

  const openModalForEdit = (company) => {
    setEditingId(company._id);
    setFormData({
      name: company.name,
      industry: company.industry || "",
      website: company.website || "",
      tier: company.tier || "MNC",
      status: company.status || "Active",
      description: company.description || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/placement/companies/${editingId}` : "/api/placement/companies";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCompanies();
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
    if (!confirm("Delete this corporate partner?")) return;
    try {
      const res = await fetch(`/api/placement/companies/${id}`, { method: "DELETE" });
      if (res.ok) fetchCompanies();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-2">
              <Building2 className="text-moze-primary" />
              Corporate Partners
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage recruiting companies and relationship tracking.</p>
          </div>
          <button onClick={openModalForAdd} className="flex items-center gap-2 bg-moze-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-maroon-800 transition shadow-sm">
            <Plus size={16} /> Add Company
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search partners..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-moze-primary outline-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-moze-primary" /></div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Industry / Tier</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {companies.map(company => (
                    <tr key={company._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            {company.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{company.name}</p>
                            {company.website && (
                              <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
                                <Globe size={12} /> Website
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800">{company.industry || "N/A"}</p>
                        <p className="text-xs text-gray-500 pt-0.5">{company.tier}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${company.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                          {company.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModalForEdit(company)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(company._id)} className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
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

      {/* Model */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
           <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center p-5 border-b border-gray-100">
               <h2 className="text-lg font-bold font-serif">{editingId ? "Edit Company" : "Partner with Company"}</h2>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-xl"><X size={20} /></button>
             </div>
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Company Name *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-moze-primary" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Industry</label>
                    <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-moze-primary" />
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-moze-primary">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Blacklisted">Blacklisted</option>
                    </select>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tier</label>
                    <select name="tier" value={formData.tier} onChange={handleInputChange} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-moze-primary">
                      <option value="Tier 1">Tier 1</option>
                      <option value="Tier 2">Tier 2</option>
                      <option value="Tier 3">Tier 3</option>
                      <option value="MNC">MNC</option>
                      <option value="Startup">Startup</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Website URL</label>
                    <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-moze-primary" />
                 </div>
               </div>
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description / Notes</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-moze-primary resize-none"></textarea>
               </div>
               <div className="flex justify-end gap-3 pt-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm text-gray-600 font-medium">Cancel</button>
                 <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-moze-primary text-white rounded-xl text-sm font-medium hover:bg-maroon-800 disabled:opacity-50 flex items-center gap-2">
                   {isSubmitting && <Loader2 className="w-4 h-4 animate-spin"/>} {editingId ? "Save Changes" : "Create Partner"}
                 </button>
               </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}
