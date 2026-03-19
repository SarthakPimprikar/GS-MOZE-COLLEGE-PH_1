'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { Plus, Target, Pencil, Trash2, CheckCircle, Clock, XCircle, Loader2, ChevronDown } from 'lucide-react';

const BLOOMS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
const BLOOMS_COLORS = {
  Remember: 'bg-blue-100 text-blue-700',
  Understand: 'bg-sky-100 text-sky-700',
  Apply: 'bg-green-100 text-green-700',
  Analyze: 'bg-amber-100 text-amber-700',
  Evaluate: 'bg-orange-100 text-orange-700',
  Create: 'bg-rose-100 text-rose-700',
};

const STATUS_STYLES = {
  draft: { icon: Clock, cls: 'text-gray-500 bg-gray-100', label: 'Draft' },
  submitted: { icon: Clock, cls: 'text-amber-600 bg-amber-50', label: 'Submitted' },
  approved: { icon: CheckCircle, cls: 'text-green-600 bg-green-50', label: 'Approved' },
  rejected: { icon: XCircle, cls: 'text-red-600 bg-red-50', label: 'Rejected' },
};

const EMPTY_FORM = {
  code: '', statement: '', bloomsLevel: 'Apply',
  subjectCode: '', subjectName: '', department: '',
  programType: 'UG', semester: 1, academicYear: '2024-25', batch: ''
};

export default function COsPage() {
  const { user } = useSession();
  const [cos, setCOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState({ subjectCode: '', academicYear: '2024-25', status: '' });

  const getEmptyForm = () => ({
    ...EMPTY_FORM,
    department: user?.department || ''
  });

  const fetchCOs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filter);
      const res = await fetch(`/api/copo/cos?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCOs(data.cos || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCOs(); }, [filter.academicYear, filter.status]);

  const handleSave = async () => {
    if (!form.code || !form.statement || !form.subjectCode) {
      alert('Please fill all required fields (Code, Statement, Subject Code)');
      return;
    }
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? { id: editingId, updatedBy: user?.id, ...form }
        : { ...form, createdBy: user?.id };
      const res = await fetch('/api/copo/cos', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setForm(getEmptyForm());
        fetchCOs();
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this CO?')) return;
    await fetch('/api/copo/cos', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, deletedBy: user?.id }) });
    fetchCOs();
  };

  const startEdit = (co) => {
    setForm({
      code: co.code, statement: co.statement, bloomsLevel: co.bloomsLevel,
      subjectCode: co.subjectCode, subjectName: co.subjectName, department: co.department,
      programType: co.programType, semester: co.semester, academicYear: co.academicYear, batch: co.batch || ''
    });
    setEditingId(co._id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-moze-primary rounded-xl">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">Course Outcomes</h1>
              <p className="text-xs text-gray-500">Define COs with Bloom's Taxonomy levels</p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(getEmptyForm()); }}
            className="flex items-center gap-2 px-4 py-2 bg-moze-primary text-white rounded-xl text-sm font-medium hover:bg-maroon-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add CO
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3">
          <input
            placeholder="Subject Code (e.g. CS301)"
            value={filter.subjectCode}
            onChange={e => setFilter(p => ({ ...p, subjectCode: e.target.value }))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none"
          />
          <input
            placeholder="Academic Year (e.g. 2024-25)"
            value={filter.academicYear}
            onChange={e => setFilter(p => ({ ...p, academicYear: e.target.value }))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none"
          />
          <select
            value={filter.status}
            onChange={e => setFilter(p => ({ ...p, status: e.target.value }))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={fetchCOs} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
            Search
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-serif font-bold text-gray-900">{editingId ? 'Edit Course Outcome' : 'New Course Outcome'}</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'CO Code *', key: 'code', placeholder: 'e.g. CO1' },
                  { label: 'Subject Code *', key: 'subjectCode', placeholder: 'e.g. CS301' },
                  { label: 'Subject Name', key: 'subjectName', placeholder: 'e.g. Data Structures' },
                  { label: 'Department', key: 'department', placeholder: 'e.g. Computer Science' },
                  { label: 'Academic Year', key: 'academicYear', placeholder: '2024-25' },
                  { label: 'Semester', key: 'semester', type: 'number', placeholder: '3' },
                  { label: 'Batch', key: 'batch', placeholder: '2022-26' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input
                      type={type || 'text'}
                      value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      readOnly={key === 'department' && !!user?.department}
                      className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none ${key === 'department' && !!user?.department ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Bloom's Level</label>
                  <select
                    value={form.bloomsLevel}
                    onChange={e => setForm(p => ({ ...p, bloomsLevel: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none"
                  >
                    {BLOOMS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">CO Statement *</label>
                  <textarea
                    value={form.statement}
                    onChange={e => setForm(p => ({ ...p, statement: e.target.value }))}
                    rows={3}
                    placeholder="Students will be able to..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none resize-none"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-moze-primary text-white rounded-lg text-sm font-medium hover:bg-maroon-800 flex items-center gap-2 disabled:opacity-50">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Update CO' : 'Create CO'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CO List */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-moze-primary" /></div>
        ) : cos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No Course Outcomes found</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add CO" to define outcomes for your subject</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cos.map((co) => {
              const status = STATUS_STYLES[co.status] || STATUS_STYLES.draft;
              const StatusIcon = status.icon;
              return (
                <div key={co._id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-moze-primary/10 flex items-center justify-center">
                    <span className="text-moze-primary text-xs font-bold">{co.code}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      <span className="font-semibold text-gray-900 text-sm">{co.subjectCode} – {co.subjectName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${BLOOMS_COLORS[co.bloomsLevel] || 'bg-gray-100 text-gray-600'}`}>{co.bloomsLevel}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>
                        <StatusIcon className="w-3 h-3" />{status.label}
                      </span>
                      {co.version > 1 && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">v{co.version}</span>}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{co.statement}</p>
                    <p className="text-xs text-gray-400 mt-1">Sem {co.semester} · {co.academicYear}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => startEdit(co)} className="p-2 text-gray-400 hover:text-moze-primary hover:bg-maroon-50 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(co._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
