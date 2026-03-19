'use client';

import { useState, useEffect } from 'react';
import { Settings, ServerRain, Plus, Trash2, Pencil, Loader2, Save } from 'lucide-react';
import { useSession } from '@/context/SessionContext';

export default function AdminPOMacro() {
  const { user } = useSession();
  const [pos, setPOs] = useState([]);
  const [psos, setPSOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState('PO'); // 'PO' | 'PSO'
  const [filter, setFilter] = useState({ programType: 'UG', department: 'Computer Science' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams(filter);
      const [poRes, psoRes] = await Promise.all([
        fetch(`/api/copo/pos?programType=${filter.programType}`),
        fetch(`/api/copo/psos?department=${filter.department}&programType=${filter.programType}`)
      ]);
      if (poRes.ok) { const d = await poRes.json(); setPOs(d.pos || []); }
      if (psoRes.ok) { const d = await psoRes.json(); setPSOs(d.psos || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filter.programType, filter.department]);

  const seedNBA = async () => {
    if (!confirm('Seed the 12 standard NBA Program Outcomes? This will not duplicate existing ones.')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/copo/pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed: 'NBA', programType: filter.programType, createdBy: user?.id })
      });
      const d = await res.json();
      if (d.success) { alert(d.message); fetchData(); }
      else alert(d.message);
    } catch (err) { console.error(err); }
    finally { setSeeding(false); }
  };

  const deletePSO = async (id) => {
    if (!confirm('Deactivate PSO?')) return;
    await fetch('/api/copo/psos', { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-moze-primary rounded-xl"><Settings className="w-5 h-5 text-white" /></div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">PO & PSO Configuration</h1>
              <p className="text-xs text-gray-500">Manage Program Outcomes (NBA Standard) and Program Specific Outcomes</p>
            </div>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Program Type</label>
            <select value={filter.programType} onChange={e => setFilter(p => ({ ...p, programType: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none">
              <option value="UG">UG (Undergraduate)</option>
              <option value="PG">PG (Postgraduate)</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Department (for PSOs)</label>
            <select value={filter.department} onChange={e => setFilter(p => ({ ...p, department: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none">
              {['Computer Science', 'Civil Engineering', 'Mechanical Engineering', 'Electronics & TC'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 gap-6 px-2">
          {['PO', 'PSO'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-moze-primary text-moze-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab === 'PO' ? 'Program Outcomes (Institutional)' : `Program Specific Outcomes (${filter.department})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-moze-primary" /></div>
        ) : activeTab === 'PO' ? (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={seedNBA} disabled={seeding} className="flex items-center gap-2 px-4 py-2 bg-[#fee2e2] text-red-800 rounded-xl text-sm font-medium hover:bg-red-200 disabled:opacity-50 transition-colors">
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ServerRain className="w-4 h-4" />} Seed NBA Standards (PO1-PO12)
              </button>
            </div>
            {pos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center text-gray-500">No POs found. Click Seed to auto-populate the 12 NBA POs.</div>
            ) : (
              pos.map(po => (
                <div key={po._id} className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-maroon-50 text-moze-primary font-bold text-lg flex items-center justify-center border border-maroon-100">{po.code}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{po.title}</h3>
                      {po.isNBAStandard && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wide">NBA Standard</span>}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{po.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {psos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center text-gray-500">
                <p>No PSOs defined for {filter.department}.</p>
                <p className="text-xs text-gray-400 mt-1">Usually handled programmatically or via Staff forms.</p>
              </div>
            ) : (
              psos.map(pso => (
                <div key={pso._id} className="bg-white rounded-2xl border border-amber-200 p-5 flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-50 text-amber-700 font-bold text-lg flex items-center justify-center border border-amber-200">{pso.code}</div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm font-medium mb-1">{pso.statement}</p>
                    <p className="text-xs text-gray-500">{pso.department} · {pso.programType}</p>
                  </div>
                  <button onClick={() => deletePSO(pso._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
