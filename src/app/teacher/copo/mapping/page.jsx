'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { Map, Save, Send, CheckCircle, Loader2, Info } from 'lucide-react';

const LEVEL_STYLES = {
  0: 'bg-gray-50 text-gray-300 border-gray-200',
  1: 'bg-green-50 text-green-700 border-green-300 font-bold',
  2: 'bg-amber-50 text-amber-700 border-amber-300 font-bold',
  3: 'bg-red-50 text-red-700 border-red-300 font-bold',
};

export default function COPOMappingPage() {
  const { user } = useSession();
  const [cos, setCOs] = useState([]);
  const [pos, setPOs] = useState([]);
  const [psos, setPSOs] = useState([]);
  const [matrix, setMatrix] = useState({}); // { `${coId}_${targetId}`: level }
  const [mappingId, setMappingId] = useState(null);
  const [mappingStatus, setMappingStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState({ subjectCode: '', academicYear: '2024-25', department: '' });

  useEffect(() => {
    if (user?.department) {
      setFilter(p => ({ ...p, department: user.department }));
    }
  }, [user]);

  const loadData = async () => {
    if (!filter.subjectCode) return;
    setLoading(true);
    try {
      const [cosRes, posRes, psosRes, mappingRes] = await Promise.all([
        fetch(`/api/copo/cos?subjectCode=${filter.subjectCode}&academicYear=${filter.academicYear}`),
        fetch(`/api/copo/pos?programType=UG`),
        fetch(`/api/copo/psos?department=${filter.department}`),
        fetch(`/api/copo/mappings?subjectCode=${filter.subjectCode}&academicYear=${filter.academicYear}`),
      ]);

      const cosData = cosRes.ok ? await cosRes.json() : { cos: [] };
      const posData = posRes.ok ? await posRes.json() : { pos: [] };
      const psosData = psosRes.ok ? await psosRes.json() : { psos: [] };
      const mappingData = mappingRes.ok ? await mappingRes.json() : { mappings: [] };

      setCOs(cosData.cos || []);
      setPOs(posData.pos || []);
      setPSOs(psosData.psos || []);

      // Restore existing matrix from saved mapping
      const existingMapping = mappingData.mappings?.[0];
      if (existingMapping) {
        setMappingId(existingMapping._id);
        setMappingStatus(existingMapping.status);
        const mat = {};
        existingMapping.mappings?.forEach(m => {
          mat[`${m.coId}_${m.targetId}`] = m.level;
        });
        setMatrix(mat);
      } else {
        setMatrix({});
        setMappingId(null);
        setMappingStatus('draft');
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const cycleLevel = (coId, targetId) => {
    if (mappingStatus === 'approved') return; // locked if approved
    const key = `${coId}_${targetId}`;
    setMatrix(prev => ({ ...prev, [key]: ((prev[key] || 0) + 1) % 4 }));
  };

  const buildMappingsArray = () => {
    const allTargets = [
      ...pos.map(p => ({ id: p._id, code: p.code, type: 'PO' })),
      ...psos.map(p => ({ id: p._id, code: p.code, type: 'PSO' })),
    ];
    const result = [];
    for (const co of cos) {
      for (const target of allTargets) {
        const key = `${co._id}_${target.id}`;
        result.push({
          coId: co._id, coCode: co.code,
          targetType: target.type, targetId: target.id, targetCode: target.code,
          level: matrix[key] || 0,
        });
      }
    }
    return result;
  };

  const handleSave = async () => {
    if (!filter.subjectCode) { alert('Enter Subject Code first'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/copo/mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode: filter.subjectCode,
          subjectName: cos[0]?.subjectName || filter.subjectCode,
          department: filter.department,
          semester: cos[0]?.semester || 1,
          academicYear: filter.academicYear,
          mappings: buildMappingsArray(),
          createdBy: user?.id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMappingId(data.mapping._id);
        setMappingStatus(data.mapping.status);
        alert('Mapping saved successfully!');
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleSubmit = async () => {
    if (!mappingId) { alert('Save the mapping first.'); return; }
    setSubmitting(true);
    try {
      await fetch('/api/copo/mappings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: mappingId, submittedBy: user?.id }),
      });
      setMappingStatus('submitted');
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const allTargets = [
    ...pos.map(p => ({ id: p._id, code: p.code, type: 'PO' })),
    ...psos.map(p => ({ id: p._id, code: p.code, type: 'PSO' })),
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-full mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600 rounded-xl">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">CO-PO Mapping</h1>
              <p className="text-xs text-gray-500">Click cells to set mapping level: 0 → 1 (Low) → 2 (Med) → 3 (High)</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {mappingStatus === 'approved' && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-200">
                <CheckCircle className="w-3.5 h-3.5" /> Approved by HOD
              </span>
            )}
            <button onClick={handleSave} disabled={saving || mappingStatus === 'approved'} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting || mappingStatus === 'approved' || mappingStatus === 'submitted'} className="flex items-center gap-2 px-4 py-2 bg-moze-primary text-white rounded-xl text-sm font-medium hover:bg-maroon-800 disabled:opacity-40 transition-colors">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit to HOD
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-end">
          {[
            { label: 'Subject Code *', key: 'subjectCode', placeholder: 'CS301' },
            { label: 'Academic Year', key: 'academicYear', placeholder: '2024-25' },
            { label: 'Department', key: 'department', placeholder: 'Computer Science' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
              <input
                value={filter[key]}
                onChange={e => setFilter(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                readOnly={key === 'department' && !!user?.department}
                className={`border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none ${key === 'department' && !!user?.department ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
              />
            </div>
          ))}
          <button onClick={loadData} className="px-4 py-2 bg-moze-primary text-white rounded-lg text-sm font-medium hover:bg-maroon-800 transition-colors">
            Load Matrix
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <span className="text-xs text-gray-500 font-medium">Level:</span>
          {[['0', 'Not Mapped', LEVEL_STYLES[0]], ['1', 'Low', LEVEL_STYLES[1]], ['2', 'Medium', LEVEL_STYLES[2]], ['3', 'High', LEVEL_STYLES[3]]].map(([l, label, cls]) => (
            <span key={l} className={`px-2 py-0.5 rounded border text-xs ${cls}`}>{l} – {label}</span>
          ))}
        </div>

        {/* Matrix Grid */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-moze-primary" /></div>
        ) : cos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
            <Map className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Enter a Subject Code and click "Load Matrix"</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  {/* Program Type Row */}
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="sticky left-0 bg-gray-50 z-10 px-4 py-2 text-left text-xs font-bold text-gray-600 border-r border-gray-200 min-w-[220px]">
                      Course Outcome
                    </th>
                    {pos.length > 0 && (
                      <th colSpan={pos.length} className="px-2 py-1.5 text-center text-xs font-bold text-moze-primary bg-maroon-50 border-r border-gray-200">
                        Program Outcomes (PO)
                      </th>
                    )}
                    {psos.length > 0 && (
                      <th colSpan={psos.length} className="px-2 py-1.5 text-center text-xs font-bold text-amber-700 bg-amber-50">
                        Program Specific Outcomes (PSO)
                      </th>
                    )}
                  </tr>
                  {/* PO/PSO code row */}
                  <tr className="bg-white border-b-2 border-gray-300">
                    <th className="sticky left-0 bg-white z-10 border-r border-gray-200 px-4 py-2"></th>
                    {allTargets.map(target => (
                      <th key={`${target.type}-${target.id}`} className={`text-center text-xs font-bold py-2 px-1 min-w-[48px] border-r border-gray-100 ${target.type === 'PO' ? 'text-moze-primary' : 'text-amber-700'}`}>
                        {target.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cos.map((co, idx) => (
                    <tr key={co._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="sticky left-0 z-10 bg-inherit border-r border-gray-200 px-4 py-3">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-bold text-moze-primary bg-maroon-50 px-2 py-1 rounded-lg shrink-0">{co.code}</span>
                          <span className="text-xs text-gray-600 leading-tight line-clamp-2">{co.statement}</span>
                        </div>
                      </td>
                      {allTargets.map(target => {
                        const key = `${co._id}_${target.id}`;
                        const level = matrix[key] || 0;
                        return (
                          <td key={`${target.type}-${target.id}`} className="text-center border-r border-gray-100 p-1">
                            <button
                              onClick={() => cycleLevel(co._id, target.id)}
                              disabled={mappingStatus === 'approved'}
                              className={`w-9 h-9 rounded-lg border text-xs font-bold transition-all hover:scale-105 active:scale-95 ${LEVEL_STYLES[level]} ${mappingStatus === 'approved' ? 'cursor-default' : 'cursor-pointer'}`}
                              title={`Click to change level (current: ${level})`}
                            >
                              {level || '–'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400">Click any cell to cycle through levels 0→1→2→3. Save draft, then submit to HOD for approval.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
