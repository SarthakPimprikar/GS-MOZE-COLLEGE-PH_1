'use client';

import { useState, useEffect } from 'react';
import { BarChart2, Loader2, Calculator, Building2, ChevronRight } from 'lucide-react';

const DEPARTMENTS = ['Computer Science', 'Civil Engineering', 'Mechanical Engineering', 'Electronics & TC'];

function AttainmentRing({ value, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  const color = value >= 60 ? '#22c55e' : value >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={10} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="bold" fill={color}>
        {value?.toFixed(0)}%
      </text>
    </svg>
  );
}

export default function AdminCOPOOverview() {
  const [deptData, setDeptData] = useState({});
  const [loading, setLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState('2024-25');

  const fetchAll = async () => {
    setLoading(true);
    const results = {};
    await Promise.all(DEPARTMENTS.map(async dept => {
      try {
        const res = await fetch(`/api/copo/attainment/po?department=${encodeURIComponent(dept)}&academicYear=${academicYear}`);
        if (res.ok) { const d = await res.json(); results[dept] = d.poAttainments || []; }
        else { results[dept] = []; }
      } catch { results[dept] = []; }
    }));
    setDeptData(results);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [academicYear]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-moze-primary rounded-xl"><BarChart2 className="w-5 h-5 text-white" /></div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">CO-PO Analytics</h1>
              <p className="text-xs text-gray-500">Cross-department PO attainment overview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              placeholder="2024-25"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none w-28"
            />
            <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2 bg-moze-primary text-white rounded-xl text-sm font-medium hover:bg-maroon-800 transition-colors">
              <Calculator className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-moze-primary" /></div>
        ) : (
          <div className="space-y-6">
            {DEPARTMENTS.map(dept => {
              const pos = deptData[dept] || [];
              const avg = pos.length ? pos.reduce((s, p) => s + p.attainmentPercentage, 0) / pos.length : 0;

              return (
                <div key={dept} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* dept header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-moze-primary" />
                      <h2 className="font-serif font-bold text-gray-800">{dept}</h2>
                      <span className="text-xs text-gray-400">· {pos.length} POs assessed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Dept Avg:</span>
                      <span className={`text-sm font-bold ${avg >= 60 ? 'text-green-700' : avg >= 40 ? 'text-amber-700' : 'text-red-700'}`}>{avg.toFixed(1)}%</span>
                    </div>
                  </div>

                  {pos.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">
                      No PO attainment data. Calculate CO attainments and run PO aggregation for this department.
                    </div>
                  ) : (
                    <div className="p-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                      {pos.sort((a, b) => a.poCode?.localeCompare(b.poCode)).map(po => (
                        <div key={po._id} className="flex flex-col items-center gap-1">
                          <AttainmentRing value={po.attainmentPercentage} size={72} />
                          <span className="text-xs font-bold text-gray-700">{po.poCode}</span>
                          {po.targetType === 'PSO' && <span className="text-[9px] text-amber-600 font-medium">PSO</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
