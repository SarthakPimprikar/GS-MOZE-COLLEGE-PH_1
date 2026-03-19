'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { ClipboardList, Plus, Loader2, Pencil, Trash2, ChevronDown } from 'lucide-react';

const ASSESSMENT_TYPES = ['Internal', 'External', 'Assignment', 'Quiz', 'Lab', 'Project', 'Seminar', 'Other'];

const EMPTY_FORM = {
  name: '', type: 'Internal', subjectCode: '', subjectName: '', department: '',
  semester: 1, academicYear: '2024-25', maxMarks: 100, threshold: 60, weightage: 100,
  conductedDate: '', questionCOMap: [],
};

export default function AssessmentsPage() {
  const { user } = useSession();
  const [assessments, setAssessments] = useState([]);
  const [cos, setCOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('2024-25');

  const getEmptyForm = () => ({
    ...EMPTY_FORM,
    department: user?.department || ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aRes, coRes] = await Promise.all([
        fetch(`/api/copo/assessments?subjectCode=${subjectFilter}&academicYear=${yearFilter}`),
        fetch(`/api/copo/cos?subjectCode=${subjectFilter}&academicYear=${yearFilter}&status=approved`),
      ]);
      if (aRes.ok) { const d = await aRes.json(); setAssessments(d.assessments || []); }
      if (coRes.ok) { const d = await coRes.json(); setCOs(d.cos || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [subjectFilter, yearFilter]);

  const addQuestion = () => {
    setForm(p => ({
      ...p,
      questionCOMap: [...(p.questionCOMap || []), { questionNo: `Q${(p.questionCOMap?.length || 0) + 1}`, maxMarks: 10, coIds: [], coCodes: [] }]
    }));
  };

  const removeQuestion = (idx) => {
    setForm(p => ({ ...p, questionCOMap: p.questionCOMap.filter((_, i) => i !== idx) }));
  };

  const toggleCOforQuestion = (qIdx, coId, coCode) => {
    setForm(p => {
      const updated = [...p.questionCOMap];
      const q = { ...updated[qIdx] };
      if (q.coIds.includes(coId)) {
        q.coIds = q.coIds.filter(id => id !== coId);
        q.coCodes = q.coCodes.filter(c => c !== coCode);
      } else {
        q.coIds = [...q.coIds, coId];
        q.coCodes = [...q.coCodes, coCode];
      }
      updated[qIdx] = q;
      return { ...p, questionCOMap: updated };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...form } : { ...form, createdBy: user?.id };
      const res = await fetch('/api/copo/assessments', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); setEditingId(null); setForm(getEmptyForm()); fetchData(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl"><ClipboardList className="w-5 h-5 text-white" /></div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">Assessments</h1>
              <p className="text-xs text-gray-500">Define assessments and map questions to COs</p>
            </div>
          </div>
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm(getEmptyForm()); }} className="flex items-center gap-2 px-4 py-2 bg-moze-primary text-white rounded-xl text-sm font-medium hover:bg-maroon-800 transition-colors">
            <Plus className="w-4 h-4" />Add Assessment
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex gap-3 flex-wrap">
          <input value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} placeholder="Subject Code" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none" />
          <input value={yearFilter} onChange={e => setYearFilter(e.target.value)} placeholder="Academic Year" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none" />
          <button onClick={fetchData} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">Search</button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[88vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-serif font-bold text-gray-900">{editingId ? 'Edit' : 'New'} Assessment</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Name *', key: 'name', placeholder: 'Mid-Term Exam' },
                    { label: 'Subject Code *', key: 'subjectCode', placeholder: 'CS301' },
                    { label: 'Subject Name', key: 'subjectName', placeholder: 'Data Structures' },
                    { label: 'Department', key: 'department', placeholder: 'Computer Science' },
                    { label: 'Academic Year', key: 'academicYear', placeholder: '2024-25' },
                    { label: 'Semester', key: 'semester', type: 'number' },
                    { label: 'Max Marks', key: 'maxMarks', type: 'number' },
                    { label: 'Threshold (%)', key: 'threshold', type: 'number' },
                    { label: 'Weightage (%)', key: 'weightage', type: 'number' },
                    { label: 'Date Conducted', key: 'conductedDate', type: 'date' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                      <input 
                        type={type || 'text'} 
                        value={form[key]} 
                        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} 
                        placeholder={placeholder || ''} 
                        readOnly={key === 'department' && !!user?.department}
                        className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none ${key === 'department' && !!user?.department ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`} 
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none">
                      {ASSESSMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Question–CO Mapping */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">Question → CO Mapping</h3>
                    <button onClick={addQuestion} className="flex items-center gap-1 text-xs text-moze-primary font-medium hover:underline">
                      <Plus className="w-3.5 h-3.5" />Add Question
                    </button>
                  </div>
                  {form.questionCOMap?.map((q, qIdx) => (
                    <div key={qIdx} className="bg-gray-50 rounded-xl p-3 mb-2 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <input value={q.questionNo} onChange={e => {
                          const u = [...form.questionCOMap]; u[qIdx] = { ...u[qIdx], questionNo: e.target.value }; setForm(p => ({ ...p, questionCOMap: u }));
                        }} placeholder="Q No" className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs w-20 focus:outline-none focus:ring-moze-primary" />
                        <input type="number" value={q.maxMarks} onChange={e => {
                          const u = [...form.questionCOMap]; u[qIdx] = { ...u[qIdx], maxMarks: +e.target.value }; setForm(p => ({ ...p, questionCOMap: u }));
                        }} placeholder="Marks" className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs w-20 focus:outline-none focus:ring-moze-primary" />
                        <span className="text-xs text-gray-500 flex-1">Map to COs:</span>
                        <button onClick={() => removeQuestion(qIdx)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cos.map(co => (
                          <button key={co._id} onClick={() => toggleCOforQuestion(qIdx, co._id, co.code)}
                            className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${q.coIds.includes(co._id) ? 'bg-moze-primary text-white border-moze-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-moze-primary'}`}>
                            {co.code}
                          </button>
                        ))}
                        {cos.length === 0 && <span className="text-xs text-gray-400">No approved COs found. Add and approve COs first.</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-moze-primary text-white rounded-lg text-sm font-medium hover:bg-maroon-800 flex items-center gap-2 disabled:opacity-50">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assessment List */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-moze-primary" /></div>
        ) : assessments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No assessments found for this subject. Add one to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map(a => (
              <div key={a._id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className="flex-shrink-0 text-center">
                  <span className="block text-xs text-gray-400 font-medium">{a.type}</span>
                  <span className="block text-2xl font-serif font-bold text-gray-800">{a.maxMarks}</span>
                  <span className="block text-xs text-gray-400">marks</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{a.name} <span className="text-gray-400 text-xs">· {a.subjectCode}</span></h3>
                  <p className="text-xs text-gray-500 mt-0.5">Threshold: {a.threshold}% · Weightage: {a.weightage}% · {a.questionCOMap?.length || 0} questions mapped</p>
                </div>
                <button onClick={() => { setForm({ ...a, conductedDate: a.conductedDate?.split('T')[0] || '' }); setEditingId(a._id); setShowForm(true); }} className="p-2 text-gray-400 hover:text-moze-primary hover:bg-maroon-50 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
