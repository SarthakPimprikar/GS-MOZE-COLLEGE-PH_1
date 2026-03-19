"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { 
  Award, 
  Briefcase, 
  FileCheck, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  TrendingUp,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherTalentPage() {
  const { user } = useSession();
  const [activeSubTab, setActiveSubTab] = useState("election");
  const [loading, setLoading] = useState(true);
  
  // Election Duty State
  const [duties, setDuties] = useState([]);
  const [showDutyForm, setShowDutyForm] = useState(false);
  const [newDuty, setNewDuty] = useState({ dutyName: "", location: "", startDate: "", endDate: "", remarks: "" });

  // Publications State
  const [publications, setPublications] = useState([]);
  const [showPubForm, setShowPubForm] = useState(false);
  const [newPub, setNewPub] = useState({ title: "", journal: "", publicationDate: "", issn: "", impactFactor: "", paperUrl: "" });

  // C-Off State
  const [coffRequests, setCoffRequests] = useState([]);
  const [showCoffForm, setShowCoffForm] = useState(false);
  const [newCoff, setNewCoff] = useState({ earnedOnDate: "", reasonForEarning: "" });

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [dutyRes, pubRes, coffRes] = await Promise.all([
        fetch(`/api/talent/election-duty?teacherId=${user.id}`),
        fetch(`/api/talent/publications?teacherId=${user.id}`),
        fetch(`/api/talent/c-off?teacherId=${user.id}`)
      ]);
      const dutyData = await dutyRes.json();
      const pubData = await pubRes.json();
      const coffData = await coffRes.json();

      if (dutyData.success) setDuties(dutyData.data);
      if (pubData.success) setPublications(pubData.data);
      if (coffData.success) setCoffRequests(coffData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleSubmitDuty = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/talent/election-duty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newDuty, teacherId: user.id })
      });
      if (res.ok) {
        setShowDutyForm(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleSubmitPub = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/talent/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPub, teacherId: user.id })
      });
      if (res.ok) {
        setShowPubForm(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleSubmitCoff = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/talent/c-off", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCoff, teacherId: user.id })
      });
      if (res.ok) {
        setShowCoffForm(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-maroon-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl text-maroon-500"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-serif font-bold text-gray-900 flex items-center gap-3">
             <Award className="w-10 h-10 text-moze-primary" />
             Talent Corner
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Manage your professional contributions and compensatory credits.</p>
        </div>
        <div className="flex items-center gap-6 relative z-10">
           <div className="text-center px-6 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">C-Off Credits</p>
              <p className="text-2xl font-bold text-emerald-700">{coffRequests.filter(r => r.status === 'Approved').length}</p>
           </div>
           <div className="text-center px-6 py-2 bg-purple-50 rounded-2xl border border-purple-100">
              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Publications</p>
              <p className="text-2xl font-bold text-purple-700">{publications.length}</p>
           </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit">
        {[
          { id: 'election', label: 'Election Duty', icon: Briefcase },
          { id: 'publications', label: 'Paper Publications', icon: FileCheck },
          { id: 'coff', label: 'Compensatory Off', icon: Clock }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === tab.id 
                ? "bg-moze-primary text-white shadow-lg shadow-maroon-100" 
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={40} />
            <p className="font-medium">Loading talent records...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeSubTab === 'election' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Election Duty Records</h3>
                    <button 
                      onClick={() => setShowDutyForm(!showDutyForm)}
                      className="bg-moze-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
                    >
                      <Plus size={18} /> Add Duty
                    </button>
                  </div>

                  {showDutyForm && (
                     <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl animate-in slide-in-from-top-4">
                        <form onSubmit={handleSubmitDuty} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <input type="text" placeholder="Duty Name" className="p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-moze-primary" required value={newDuty.dutyName} onChange={e => setNewDuty({...newDuty, dutyName: e.target.value})} />
                           <input type="text" placeholder="Location" className="p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-moze-primary" required value={newDuty.location} onChange={e => setNewDuty({...newDuty, location: e.target.value})} />
                           <input type="date" placeholder="Start Date" className="p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-moze-primary" required value={newDuty.startDate} onChange={e => setNewDuty({...newDuty, startDate: e.target.value})} />
                           <input type="date" placeholder="End Date" className="p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-moze-primary" required value={newDuty.endDate} onChange={e => setNewDuty({...newDuty, endDate: e.target.value})} />
                           <textarea placeholder="Remarks" className="p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-moze-primary md:col-span-2" value={newDuty.remarks} onChange={e => setNewDuty({...newDuty, remarks: e.target.value})} />
                           <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                              <button type="button" onClick={() => setShowDutyForm(false)} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
                              <button type="submit" className="bg-moze-primary text-white px-8 py-2 rounded-lg font-bold">Save Record</button>
                           </div>
                        </form>
                     </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {duties.length === 0 ? (
                      <div className="md:col-span-3 py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                         <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                         <p className="text-gray-400 font-medium">No election duties logged yet.</p>
                      </div>
                    ) : duties.map((duty) => (
                      <div key={duty._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="p-3 bg-maroon-50 text-moze-primary rounded-xl group-hover:bg-moze-primary group-hover:text-white transition-colors">
                              <Briefcase size={24} />
                           </div>
                           <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                             duty.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                           }`}>
                             {duty.status}
                           </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{duty.dutyName}</h4>
                        <p className="text-gray-500 text-sm flex items-center gap-1.5"><TrendingUp size={14} /> {duty.location}</p>
                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-medium">
                           <span>{new Date(duty.startDate).toLocaleDateString()} - {new Date(duty.endDate).toLocaleDateString()}</span>
                           <ChevronRight size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSubTab === 'publications' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Research Publications</h3>
                    <button 
                      onClick={() => setShowPubForm(!showPubForm)}
                      className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-purple-700 shadow-lg shadow-purple-100"
                    >
                      <Plus size={18} /> Log Publication
                    </button>
                  </div>

                  {showPubForm && (
                     <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl animate-in slide-in-from-top-4">
                        <form onSubmit={handleSubmitPub} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <input type="text" placeholder="Paper Title" className="p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-purple-500 md:col-span-2" required value={newPub.title} onChange={e => setNewPub({...newPub, title: e.target.value})} />
                           <input type="text" placeholder="Journal/Conference Name" className="p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-purple-500" required value={newPub.journal} onChange={e => setNewPub({...newPub, journal: e.target.value})} />
                           <input type="date" placeholder="Publication Date" className="p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-purple-500" required value={newPub.publicationDate} onChange={e => setNewPub({...newPub, publicationDate: e.target.value})} />
                           <input type="text" placeholder="ISSN" className="p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-purple-500" value={newPub.issn} onChange={e => setNewPub({...newPub, issn: e.target.value})} />
                           <input type="number" step="0.01" placeholder="Impact Factor" className="p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-purple-500" value={newPub.impactFactor} onChange={e => setNewPub({...newPub, impactFactor: e.target.value})} />
                           <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                              <button type="button" onClick={() => setShowPubForm(false)} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
                              <button type="submit" className="bg-purple-600 text-white px-8 py-2 rounded-lg font-bold">Record Publication</button>
                           </div>
                        </form>
                     </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {publications.length === 0 ? (
                       <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                         <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                         <p className="text-gray-400 font-medium">No publications found.</p>
                       </div>
                    ) : publications.map(pub => (
                      <div key={pub._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-all group">
                         <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <FileText size={32} />
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg mb-1">{pub.title}</h4>
                            <p className="text-gray-500 text-sm font-medium">{pub.journal} • {new Date(pub.publicationDate).toLocaleDateString()}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-bold text-purple-600 uppercase">Impact Factor</p>
                            <p className="text-xl font-bold text-gray-900">{pub.impactFactor || 'N/A'}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSubTab === 'coff' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Compensatory Off Tracking</h3>
                    <button 
                      onClick={() => setShowCoffForm(!showCoffForm)}
                      className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100"
                    >
                      <Plus size={18} /> Request C-Off
                    </button>
                  </div>

                  {showCoffForm && (
                     <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl animate-in slide-in-from-top-4 max-w-2xl">
                        <form onSubmit={handleSubmitCoff} className="space-y-4">
                           <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Duty Performed On</label>
                              <input type="date" className="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-emerald-500" required value={newCoff.earnedOnDate} onChange={e => setNewCoff({...newCoff, earnedOnDate: e.target.value})} />
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Reason for Earning (e.g. Sunday Workshop)</label>
                              <input type="text" className="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-emerald-500" required placeholder="Describe the extra work performed" value={newCoff.reasonForEarning} onChange={e => setNewCoff({...newCoff, reasonForEarning: e.target.value})} />
                           </div>
                           <div className="flex justify-end gap-3 mt-4">
                              <button type="button" onClick={() => setShowCoffForm(false)} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
                              <button type="submit" className="bg-emerald-600 text-white px-8 py-2 rounded-lg font-bold">Submit Request</button>
                           </div>
                        </form>
                     </div>
                  )}

                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                       <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <tr>
                             <th className="px-6 py-4">Earned Date</th>
                             <th className="px-6 py-4">Reason</th>
                             <th className="px-6 py-4">Status</th>
                             <th className="px-6 py-4">Admin Remarks</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {coffRequests.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">No C-Off requests.</td></tr>
                          ) : coffRequests.map(req => (
                            <tr key={req._id}>
                               <td className="px-6 py-4 font-bold text-gray-900">{new Date(req.earnedOnDate).toLocaleDateString()}</td>
                               <td className="px-6 py-4 text-gray-600 text-sm">{req.reasonForEarning}</td>
                               <td className="px-6 py-4">
                                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                    req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                    req.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                                    'bg-amber-100 text-amber-700'
                                  }`}>
                                     {req.status === 'Approved' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                     {req.status}
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-gray-400 text-xs italic">{req.approverRemarks || 'Pending review...'}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
