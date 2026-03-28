"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import AdmissionStatusTracker from "@/components/AdmissionStatusTracker";
import { AlertCircle, FileText, Loader2, Save, Upload } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function StudentAdmissionPage() {
  const { user } = useSession();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.admissionId) {
      setLoading(false);
      return;
    }

    const fetchAdmission = async () => {
      try {
        const res = await fetch(`/api/admission/${user.admissionId}`);
        const data = await res.json();
        if (data.data) {
          setAdmission(data.data);
        }
      } catch (err) {
        console.error("Error fetching admission:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmission();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admission/${admission._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(admission),
      });

      if (res.ok) {
        toast.success("Registration details updated successfully!");
      } else {
        toast.error("Failed to update details.");
      }
    } catch (err) {
      toast.error("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
     return <div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="w-12 h-12 animate-spin text-moze-primary" /></div>;
  }

  if (!admission) {
    return (
      <div className="min-h-screen bg-gray-50 p-12 flex flex-col items-center justify-center text-center">
         <AlertCircle className="w-20 h-20 text-maroon-300 mb-6" />
         <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">No Admission Record Found</h1>
         <p className="text-gray-500 max-w-md">We couldn't find an admission application linked to your account. If you just converted your enquiry, please try logging in again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Toaster position="top-right" />
      
      {/* Tracker Section */}
      <div className="px-6 pt-12">
        <AdmissionStatusTracker currentStatus={admission.status} />
      </div>

      {/* Registration Details Form (Simplified) */}
      <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
                    <h2 className="text-2xl font-serif font-bold text-gray-800">Complete Your Registration</h2>
                </div>

                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-600">Full Name (As per Aadhar)</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-moze-primary outline-none transition-all"
                            value={admission.fullName}
                            onChange={(e) => setAdmission({...admission, fullName: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-600">Email</label>
                        <input 
                            type="email" 
                            readOnly
                            className="w-full px-4 py-3 bg-gray-100 border rounded-xl outline-none"
                            value={admission.email}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-600">Mother's Name</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-moze-primary outline-none transition-all"
                            value={admission.motherName || ""}
                            onChange={(e) => setAdmission({...admission, motherName: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-600">Gender</label>
                        <select 
                            className="w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-moze-primary outline-none transition-all"
                            value={admission.gender || ""}
                            onChange={(e) => setAdmission({...admission, gender: e.target.value})}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 pt-6">
                        <button 
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-moze-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            Save Registration Details
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Info & Help Sidebar */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-moze-primary to-maroon-700 p-8 rounded-2xl text-white shadow-xl">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <AlertCircle size={20} /> Next Steps
                </h3>
                <ul className="text-sm space-y-4 opacity-90">
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">1</div>
                        <p>Complete all personal and family details in the form.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">2</div>
                        <p>Our staff will verify your details and contact you for document originals.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">3</div>
                        <p>Once selected in the merit list, confirm your enrollment.</p>
                    </li>
                </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                    <Upload size={18} className="text-blue-500" /> Documents
                </h3>
                <p className="text-sm text-gray-500 mb-6">You will be notified once document upload feature is enabled for your application.</p>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs font-medium">
                    Please ensure all details match your Aadhar card exactly.
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
