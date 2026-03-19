'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { BarChart2, Calculator, Loader2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

function AttainmentBar({ value }) {
  const color = value >= 60 ? 'bg-green-500' : value >= 40 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = value >= 60 ? 'text-green-700' : value >= 40 ? 'text-amber-700' : 'text-red-700';
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-bold ${textColor}`}>{value?.toFixed(1)}%</span>
        <span className="text-xs text-gray-400">{value >= 60 ? '✅ Target Met' : value >= 40 ? '⚠️ Below Target' : '❌ Low'}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

export default function COAttainmentPage() {
  const { user } = useSession();
  const [attainments, setAttainments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [subjectCode, setSubjectCode] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-25');

  const fetchAttainments = async () => {
    if (!subjectCode) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/copo/reports?type=co&subjectCode=${subjectCode}&academicYear=${academicYear}`);
      if (res.ok) { const d = await res.json(); setAttainments(d.data || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCalculate = async () => {
    if (!subjectCode) { alert('Enter a subject code'); return; }
    setCalculating(true);
    try {
      const res = await fetch('/api/copo/attainment/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectCode, academicYear, calculatedBy: user?.id }),
      });
      const data = await res.json();
      if (data.success) { setAttainments(data.results || []); }
      else { alert(data.message); }
    } catch (err) { console.error(err); }
    finally { setCalculating(false); }
  };

  const avg = attainments.length ? attainments.reduce((s, a) => s + (a.attainmentPercentage || 0), 0) / attainments.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-violet-600 rounded-xl"><BarChart2 className="w-5 h-5 text-white" /></div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">CO Attainment</h1>
            <p className="text-xs text-gray-500">Calculated using NBA standard formula</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Subject Code *</label>
            <input value={subjectCode} onChange={e => setSubjectCode(e.target.value)} placeholder="CS301" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Academic Year</label>
            <input value={academicYear} onChange={e => setAcademicYear(e.target.value)} placeholder="2024-25" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none" />
          </div>
          <button onClick={fetchAttainments} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">View Stored</button>
          <button onClick={handleCalculate} disabled={calculating} className="flex items-center gap-2 px-5 py-2 bg-moze-primary text-white rounded-lg text-sm font-medium hover:bg-maroon-800 disabled:opacity-50 transition-colors">
            {calculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
            {calculating ? 'Calculating...' : 'Calculate Now'}
          </button>
        </div>

        {/* Formula Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-xs text-amber-800">
          <strong>Formula:</strong> CO Attainment (%) = (Students scoring ≥ threshold%) ÷ Total Students × 100 · <strong>Default threshold: 60%</strong>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-moze-primary" /></div>
        ) : attainments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
            <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No attainment data yet</p>
            <p className="text-xs text-gray-400 mt-1">Enter marks first, then click "Calculate Now"</p>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'COs Assessed', value: attainments.length, color: 'text-gray-800' },
                { label: 'Average Attainment', value: `${avg.toFixed(1)}%`, color: avg >= 60 ? 'text-green-700' : avg >= 40 ? 'text-amber-700' : 'text-red-700' },
                { label: 'Target Achievement', value: `${attainments.filter(a => a.attainmentPercentage >= 60).length}/${attainments.length}`, color: 'text-moze-primary' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                  <p className={`text-2xl font-serif font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* CO Attainment Cards */}
            <div className="space-y-4">
              {attainments.map(att => (
                <div key={att._id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-moze-primary bg-maroon-50 px-2.5 py-1 rounded-lg">{att.coCode}</span>
                        <span className="text-sm text-gray-600">{att.subjectCode} · Sem {att.semester}</span>
                      </div>
                      <p className="text-xs text-gray-400">{att.totalStudents} students · Threshold: {att.threshold}%</p>
                    </div>
                    <div className="text-right">
                      {att.attainmentPercentage >= 60
                        ? <TrendingUp className="w-5 h-5 text-green-500 ml-auto" />
                        : <TrendingDown className="w-5 h-5 text-red-500 ml-auto" />
                      }
                    </div>
                  </div>
                  <AttainmentBar value={att.attainmentPercentage} />

                  {/* Per-assessment breakdown */}
                  {att.assessmentBreakdown?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-2">Assessment Breakdown</p>
                      <div className="flex flex-wrap gap-2">
                        {att.assessmentBreakdown.map((ab, i) => (
                          <div key={i} className="bg-gray-50 rounded-lg px-3 py-1.5 text-xs">
                            <span className="font-medium text-gray-700">{ab.assessmentName}</span>
                            <span className="text-gray-400 mx-1">·</span>
                            <span className={ab.attainment >= 60 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{ab.attainment?.toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
