'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Upload, Loader2, Save, Plus, Download } from 'lucide-react';
import { useSession } from '@/context/SessionContext';

export default function MarksEntryPage() {
  const { user } = useSession();
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [students, setStudents] = useState([]); // to be fetched from /api/students
  const [marks, setMarks] = useState({}); // { studentId: { questionNo: marks } }
  const [subjectCode, setSubjectCode] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [csvMode, setCsvMode] = useState(false);

  const fetchAssessments = async () => {
    const res = await fetch(`/api/copo/assessments?subjectCode=${subjectCode}&academicYear=${academicYear}`);
    if (res.ok) { const d = await res.json(); setAssessments(d.assessments || []); }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students?subjectCode=${subjectCode}`);
      if (res.ok) { const d = await res.json(); setStudents(d.students || d || []); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (subjectCode) { fetchAssessments(); fetchStudents(); }
  }, [subjectCode]);

  const setMark = (studentId, questionNo, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || {}), [questionNo]: value }
    }));
  };

  const handleSave = async () => {
    if (!selectedAssessment) { alert('Select an assessment'); return; }
    setSaving(true);
    try {
      const marksArray = students.map(s => ({
        assessmentId: selectedAssessment._id,
        studentId: s._id,
        studentRollNo: s.studentId || s.rollNumber,
        questionMarks: (selectedAssessment.questionCOMap || []).map(q => ({
          questionNo: q.questionNo,
          marksObtained: Number(marks[s._id]?.[q.questionNo] || 0),
        })),
      }));

      const res = await fetch('/api/copo/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marks: marksArray, uploadedBy: user?.id, source: 'manual' }),
      });
      const d = await res.json();
      if (d.success) alert(`✅ ${d.count} marks saved!`);
      else alert('Error: ' + d.message);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const downloadTemplate = () => {
    if (!selectedAssessment) { alert('Select assessment first'); return; }
    const headers = ['StudentID', 'RollNo', ...(selectedAssessment.questionCOMap || []).map(q => q.questionNo)];
    const rows = students.map(s => [s._id, s.studentId || s.rollNumber, ...selectedAssessment.questionCOMap.map(() => '')]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${selectedAssessment.name}_template.csv`; a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-600 rounded-xl"><BookOpen className="w-5 h-5 text-white" /></div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">Mark Entry</h1>
              <p className="text-xs text-gray-500">Enter marks per student per question / Upload CSV</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={downloadTemplate} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" /> Download Template
            </button>
          </div>
        </div>

        {/* Subject + Assessment Select */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Subject Code *</label>
            <input value={subjectCode} onChange={e => setSubjectCode(e.target.value)} placeholder="CS301" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Academic Year</label>
            <input value={academicYear} onChange={e => setAcademicYear(e.target.value)} placeholder="2024-25" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Assessment</label>
            <select
              value={selectedAssessment?._id || ''}
              onChange={e => setSelectedAssessment(assessments.find(a => a._id === e.target.value) || null)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-moze-primary focus:outline-none min-w-[200px]"
            >
              <option value="">-- Select Assessment --</option>
              {assessments.map(a => <option key={a._id} value={a._id}>{a.name} ({a.type})</option>)}
            </select>
          </div>
        </div>

        {/* Marks Table */}
        {!selectedAssessment ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Select a subject code and assessment to begin entering marks</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-moze-primary" /></div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400 text-sm">No students found for this subject</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="sticky left-0 bg-gray-50 z-10 text-left px-4 py-3 text-xs font-bold text-gray-600 border-r border-gray-200">Student</th>
                    {(selectedAssessment.questionCOMap || []).map(q => (
                      <th key={q.questionNo} className="text-center px-3 py-3 text-xs font-bold text-gray-600 min-w-[80px]">
                        <div>{q.questionNo}</div>
                        <div className="text-gray-400 font-normal">/{q.maxMarks}</div>
                        <div className="flex flex-wrap justify-center gap-0.5 mt-0.5">
                          {q.coCodes?.map(c => <span key={c} className="text-[9px] text-moze-primary">{c}</span>)}
                        </div>
                      </th>
                    ))}
                    <th className="text-center px-3 py-3 text-xs font-bold text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student, idx) => {
                    const total = (selectedAssessment.questionCOMap || []).reduce((s, q) => s + Number(marks[student._id]?.[q.questionNo] || 0), 0);
                    return (
                      <tr key={student._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="sticky left-0 bg-inherit z-10 border-r border-gray-200 px-4 py-2">
                          <div className="font-medium text-gray-800 text-xs">{student.fullName || student.name}</div>
                          <div className="text-gray-400 text-xs">{student.studentId}</div>
                        </td>
                        {(selectedAssessment.questionCOMap || []).map(q => (
                          <td key={q.questionNo} className="text-center px-2 py-1.5">
                            <input
                              type="number"
                              min={0}
                              max={q.maxMarks}
                              value={marks[student._id]?.[q.questionNo] ?? ''}
                              onChange={e => setMark(student._id, q.questionNo, e.target.value)}
                              className="w-14 text-center border border-gray-200 rounded-lg px-1 py-1 text-xs focus:ring-2 focus:ring-moze-primary focus:outline-none"
                            />
                          </td>
                        ))}
                        <td className="text-center px-3 py-2 font-bold text-gray-800 text-sm">{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-moze-primary text-white rounded-xl text-sm font-medium hover:bg-maroon-800 disabled:opacity-50 transition-colors">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Marks'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
