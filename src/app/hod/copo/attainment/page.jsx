'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { BarChart2, Calculator, Loader2, TrendingUp, TrendingDown } from 'lucide-react';

function AttainmentBar({ value }) {
  const color = value >= 60 ? 'bg-green-500' : value >= 40 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = value >= 60 ? 'text-green-700' : value >= 40 ? 'text-amber-700' : 'text-red-700';
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className={`text-xs font-bold w-12 text-right ${textColor}`}>{value?.toFixed(1)}%</span>
    </div>
  );
}

export default function HODPOAttainmentPage() {
  const { user } = useSession();
  const [poAttainments, setPOAttainments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [department, setDepartment] = useState('Computer Science');
  const [academicYear, setAcademicYear] = useState('2024-25');

  const fetchAttainments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/copo/attainment/po?department=${department}&academicYear=${academicYear}`);
      if (res.ok) { const d = await res.json(); setPOAttainments(d.poAttainments || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const calculatePO = async () => {
    setCalculating(true);
    try {
      const res = await fetch(`/api/copo/attainment/po?department=${department}&academicYear=${academicYear}&action=calculate&calculatedBy=${user?.id}`);
      if (res.ok) { const d = await res.json(); setPOAttainments(d.poAttainments || []); }
      else { const d = await res.json(); alert(d.message); }
    } catch (err) { console.error(err); }
    finally { setCalculating(false); }
  };

  const avgPO = poAttainments.length ? poAttainments.reduce((s, a) => s + a.attainmentPercentage, 0) / poAttainments.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-moze-primary rounded-xl"><BarChart2 className="w-5 h-5 text-white" /></div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">PO Attainment</h1>
            <p className="text-xs text-gray-500">Aggregated from CO attainments using CO-PO weights</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
            <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Computer Science" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Academic Year</label>
            <input value={academicYear} onChange={e => setAcademicYear(e.target.value)} placeholder="2024-25" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none" />
          </div>
          <button onClick={fetchAttainments} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">View</button>
          <button onClick={calculatePO} disabled={calculating} className="flex items-center gap-2 px-5 py-2 bg-moze-primary text-white rounded-lg text-sm font-medium hover:bg-maroon-800 disabled:opacity-50 transition-colors">
            {calculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
            {calculating ? 'Calculating...' : 'Recalculate POs'}
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-xs text-amber-800">
          <strong>Formula:</strong> PO Attainment = Σ(CO% × mapping_level) ÷ Σ(mapping_levels) · Only approved CO-PO mappings are used.
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-moze-primary" /></div>
        ) : poAttainments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
            <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No PO attainment data. Calculate CO attainments first, then click "Recalculate POs".</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'POs Assessed', value: poAttainments.length },
                { label: 'Avg PO Attainment', value: `${avgPO.toFixed(1)}%` },
                { label: 'Target (≥60%)', value: `${poAttainments.filter(p => p.attainmentPercentage >= 60).length}/${poAttainments.length}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                  <p className="text-2xl font-serif font-bold text-gray-800">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* PO Cards */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-600">PO</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-600">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-600">Contributing COs</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-600 min-w-[200px]">Attainment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {poAttainments.sort((a, b) => a.poCode?.localeCompare(b.poCode)).map(po => (
                    <tr key={po._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-bold text-moze-primary">{po.poCode}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${po.targetType === 'PSO' ? 'bg-amber-100 text-amber-700' : 'bg-maroon-50 text-moze-primary'}`}>
                          {po.targetType}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {po.coContributions?.map((c, i) => (
                            <span key={i} className="text-xs bg-gray-100 rounded px-1.5 py-0.5 text-gray-600">{c.coCode}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 min-w-[200px]"><AttainmentBar value={po.attainmentPercentage} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
