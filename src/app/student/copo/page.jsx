'use client';

import { useState, useEffect } from 'react';
import { Target, Search, BookOpen, Loader2 } from 'lucide-react';
import { useSession } from '@/context/SessionContext';

export default function StudentAttainmentPage() {
  const { user } = useSession(); // Get student ID from session
  const [attainments, setAttainments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('2024-25');
  const [semester, setSemester] = useState('3');

  const fetchAttainments = async () => {
    setLoading(true);
    try {
      // In a real scenario, this endpoint would filter to just show subjects for this student's department/semester
      // Reusing the PO attainment endpoint which gives subject COs for now, filtered down for demo
      const res = await fetch(`/api/copo/reports?type=co&academicYear=${year}&department=Computer Science`);
      if (res.ok) {
        const d = await res.json();
        // Since we don't have per-student calculated attainment yet (only cohort level),
        // we'll display the course-level target achievements so the student can see class performance metric.
        // A full implementation would compare student marks vs threshold directly here.
        setAttainments(d.data || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAttainments(); }, [year, semester]);

  const subjects = [...new Set(attainments.map(a => a.subjectCode))];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:ml-64">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-2.5 bg-[#760e15] rounded-xl"><Target className="w-5 h-5 text-white" /></div>
          <div>
            <h1 className="text-xl font-serif font-bold text-[#4a090d]">Outcome Achievement</h1>
            <p className="text-xs text-[#9a4242]">View the attainment levels of your registered courses</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex gap-4">
             <div className="flex flex-col">
               <label className="text-[10px] uppercase font-bold text-[#b17275] mb-1 tracking-wider">Academic Year</label>
               <select value={year} onChange={e => setYear(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm min-w-[120px] focus:ring-1 focus:ring-[#760e15] outline-none text-[#2d1214] font-medium">
                 <option>2023-24</option>
                 <option>2024-25</option>
               </select>
             </div>
             <div className="flex flex-col">
               <label className="text-[10px] uppercase font-bold text-[#b17275] mb-1 tracking-wider">Semester</label>
               <select value={semester} onChange={e => setSemester(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm min-w-[100px] focus:ring-1 focus:ring-[#760e15] outline-none text-[#2d1214] font-medium">
                 {[1,2,3,4,5,6,7,8].map(s => <option key={s}>{s}</option>)}
               </select>
             </div>
          </div>
          <button onClick={fetchAttainments} className="bg-[#760e15] text-[#f7e4e5] px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-2">
            <Search className="w-4 h-4" /> Fetch Status
          </button>
        </div>

        {/* Subject wise view */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#760e15]" /></div>
        ) : subjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center text-[#7a484b]">
             <BookOpen className="w-12 h-12 text-[#e3c4c5] mx-auto mb-3" />
             <p className="font-medium text-lg">No outcome data available</p>
             <p className="text-sm">No course targets have been evaluated for this semester yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {subjects.map(subjectCode => {
              const subAttainments = attainments.filter(a => a.subjectCode === subjectCode);
              const subjectName = subAttainments[0]?.subjectName || 'Course';
              const avgClassResult = subAttainments.reduce((s,a)=>s+a.attainmentPercentage, 0) / subAttainments.length;

              return (
                <div key={subjectCode} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-[#dbc0c0] transition-colors">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center text-[#4a090d]">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-[#f7e4e5] text-[#9a4242] font-serif font-bold flex flex-col justify-center items-center text-[10px]">
                         <span>SUB</span>
                         <span className="text-[#760e15] text-sm leading-none">{subAttainments.length}</span>
                       </div>
                       <div>
                          <h2 className="font-bold text-lg">{subjectName}</h2>
                          <p className="text-xs text-[#b17275]">{subjectCode}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] uppercase font-bold text-[#b17275] mb-0.5">Course Cohort Target Rate</p>
                       <p className="text-lg font-bold font-serif tabular-nums text-[#760e15]">{avgClassResult.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    {subAttainments.map(co => (
                       <div key={co._id} className="flex flex-col sm:flex-row gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-16 flex items-center justify-center shrink-0">
                            <span className="bg-[#f7e4e5] text-[#760e15] px-2 py-1 rounded text-xs font-bold w-full text-center border border-[#e3c4c5]">{co.coCode}</span>
                          </div>
                          <div className="flex-1 min-w-0 flex items-center">
                            <p className="text-sm text-[#4a090d] truncate opacity-90">{co.coId?.statement || 'Statement details'}</p>
                          </div>
                          <div className="w-full sm:w-48 flex items-center gap-3 shrink-0">
                             <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                               <div className="h-full bg-gradient-to-r from-[#b17275] to-[#760e15] transition-all duration-700" style={{width: `${Math.min(co.attainmentPercentage, 100)}%`}} />
                             </div>
                             <span className="text-xs font-bold text-[#760e15] w-12 text-right">{co.attainmentPercentage.toFixed(1)}%</span>
                          </div>
                       </div>
                    ))}
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
