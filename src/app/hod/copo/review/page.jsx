'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { CheckCircle, XCircle, Clock, Loader2, Map, Target, ChevronRight } from 'lucide-react';

const STATUS = {
  submitted: { label: 'Pending Review', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'Approved', cls: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 border-red-200' },
  draft: { label: 'Draft', cls: 'bg-gray-50 text-gray-600 border-gray-200' },
};

export default function HODReviewPage() {
  const { user } = useSession();
  const [pendingMappings, setPendingMappings] = useState([]);
  const [pendingCOs, setPendingCOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (user?.department) {
      setDepartment(user.department);
    }
  }, [user]);

  const fetchPending = async () => {
    if (!department) return;
    setLoading(true);
    try {
      const [mapRes, coRes] = await Promise.all([
        fetch(`/api/copo/mappings?department=${department}&academicYear=${academicYear}`),
        fetch(`/api/copo/cos?department=${department}&academicYear=${academicYear}&status=submitted`),
      ]);
      if (mapRes.ok) { const d = await mapRes.json(); setPendingMappings(d.mappings?.filter(m => m.status === 'submitted') || []); }
      if (coRes.ok) { const d = await coRes.json(); setPendingCOs(d.cos || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPending(); }, [department, academicYear]);

  const handleMappingAction = async (mappingId, action) => {
    setProcessingId(mappingId);
    try {
      await fetch('/api/copo/mappings/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mappingId, action, hodId: user?.id, rejectionReason }),
      });
      fetchPending();
    } catch (err) { console.error(err); }
    finally { setProcessingId(null); setRejectionReason(''); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-moze-primary rounded-xl"><CheckCircle className="w-5 h-5 text-white" /></div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">CO-PO Review</h1>
            <p className="text-xs text-gray-500">Review and approve faculty-submitted COs and mappings</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex gap-3 flex-wrap">
          <input 
            value={department} 
            onChange={e => setDepartment(e.target.value)} 
            placeholder="Department" 
            readOnly={user?.role === 'hod' && !!user?.department}
            className={`border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none ${user?.role === 'hod' && !!user?.department ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`} 
          />
          <input value={academicYear} onChange={e => setAcademicYear(e.target.value)} placeholder="Academic Year" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none" />
          <button onClick={fetchPending} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">Refresh</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-moze-primary" /></div>
        ) : (
          <div className="space-y-6">
            {/* Pending CO-PO Mappings */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Map className="w-4 h-4 text-amber-600" />Pending CO-PO Mappings ({pendingMappings.length})
              </h2>
              {pendingMappings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">No pending mappings to review</div>
              ) : (
                pendingMappings.map(m => (
                  <div key={m._id} className="bg-white rounded-2xl border border-amber-200 p-5 mb-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="font-semibold text-gray-800">{m.subjectName} <span className="text-gray-400 text-sm">({m.subjectCode})</span></p>
                        <p className="text-xs text-gray-500 mt-0.5">Sem {m.semester} · {m.academicYear} · {m.mappings?.length || 0} mapping entries</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          value={rejectionReason}
                          onChange={e => setRejectionReason(e.target.value)}
                          placeholder="Reason (for rejection)"
                          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-moze-primary w-44"
                        />
                        <button
                          disabled={processingId === m._id}
                          onClick={() => handleMappingAction(m._id, 'reject')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 disabled:opacity-40 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button
                          disabled={processingId === m._id}
                          onClick={() => handleMappingAction(m._id, 'approve')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-40 transition-colors"
                        >
                          {processingId === m._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pending COs */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-moze-primary" />Submitted Course Outcomes ({pendingCOs.length})
              </h2>
              {pendingCOs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">No pending COs to review</div>
              ) : (
                pendingCOs.map(co => (
                  <div key={co._id} className="bg-white rounded-2xl border border-gray-200 p-5 mb-3 flex items-start gap-3">
                    <span className="text-xs font-bold text-moze-primary bg-maroon-50 px-2 py-1 rounded-lg shrink-0">{co.code}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{co.statement}</p>
                      <p className="text-xs text-gray-500 mt-1">{co.subjectCode} · Bloom's: {co.bloomsLevel} · v{co.version}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs rounded-full">Submitted</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
