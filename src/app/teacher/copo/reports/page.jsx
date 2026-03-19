'use client';

import { useState } from 'react';
import { FileText, Download, Target, Map, BarChart2, Loader2, Building2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSession } from '@/context/SessionContext';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('matrix'); // 'matrix' | 'co-attainment' | 'po-attainment'
  const [subjectCode, setSubjectCode] = useState('');
  const { user } = useSession();
  const [department, setDepartment] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user?.department) {
      setDepartment(user.department);
    }
  }, [user]);

  const fetchReport = async () => {
    if ((reportType === 'matrix' || reportType === 'co-attainment') && !subjectCode) {
      alert('Please enter a subject code'); return;
    }
    setLoading(true);
    try {
      let query = `type=${reportType}&academicYear=${academicYear}`;
      if (reportType === 'matrix' || reportType === 'co-attainment') {
        const type = reportType === 'co-attainment' ? 'co' : 'matrix';
        query = `type=${type}&subjectCode=${subjectCode}&academicYear=${academicYear}`;
      } else {
        query = `type=po&department=${department}&academicYear=${academicYear}`;
      }

      const res = await fetch(`/api/copo/reports?${query}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      } else { alert('Failed to generate report data'); setData(null); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const exportPDF = () => {
    const doc = new jsPDF('landscape');
    const accent = [118, 14, 21]; // #760e15 (Moze maroon)

    // Header
    doc.setFontSize(20);
    doc.setTextColor(...accent);
    doc.text('G.S. Moze College of Engineering', 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Outcome-Based Education Report', 14, 28);
    doc.setDrawColor(...accent);
    doc.setLineWidth(1);
    doc.line(14, 32, 280, 32);

    if (reportType === 'po-attainment' && Array.isArray(data)) {
      doc.setFontSize(14);
      doc.setTextColor(30);
      doc.text(`PO Attainment Report - ${department} (${academicYear})`, 14, 45);

      const tableData = data.map(item => [
        item.poCode, item.targetType,
        item.coContributions?.map(c => c.coCode).join(', ') || 'None',
        `${item.attainmentPercentage?.toFixed(2)}%`
      ]);

      doc.autoTable({
        startY: 52,
        head: [['Outcome', 'Type', 'Contributing COs', 'Final Attainment']],
        body: tableData,
        headStyles: { fillColor: accent, textColor: 255 },
        styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
      });
      doc.save(`PO_Attainment_${department.replace(/\s+/g,'_')}_${academicYear}.pdf`);
    } else if (reportType === 'co-attainment' && Array.isArray(data)) {
      doc.setFontSize(14);
      doc.setTextColor(30);
      doc.text(`CO Attainment Report - Subject: ${subjectCode} (${academicYear})`, 14, 45);

      const tableData = data.map(item => [
        item.coCode, item.totalStudents, item.studentsAboveThreshold,
        `${item.attainmentPercentage?.toFixed(2)}%`
      ]);

      doc.autoTable({
        startY: 52,
        head: [['CO Code', 'Total Evaluated', `Target Met (>=${data[0]?.threshold}%)`, 'Attainment']],
        body: tableData,
        headStyles: { fillColor: accent, textColor: 255 },
      });
      doc.save(`CO_Attainment_${subjectCode}_${academicYear}.pdf`);
    } else if (reportType === 'matrix' && data?.mapping) {
      doc.setFontSize(14);
      doc.setTextColor(30);
      doc.text(`CO-PO Articulation Matrix - Subject: ${subjectCode} (${academicYear})`, 14, 45);

      const allTargets = [
        ...data.pos.map(p => ({ id: p._id, code: p.code })),
        // if PSOs were loaded they'd go here
      ];

      const headRow = ['CO', ...allTargets.map(t => t.code), 'CO Attainment'];
      const bodyRows = data.mapping.mappings.reduce((acc, current) => {
        let row = acc.find(r => r[0] === current.coCode);
        if (!row) {
          row = new Array(headRow.length).fill('-');
          row[0] = current.coCode;
          row[headRow.length - 1] = data.coAttainments[current.coId]?.toFixed(2) + '%' || 'N/A';
          acc.push(row);
        }
        const colIdx = headRow.indexOf(current.targetCode);
        if (colIdx > 0) row[colIdx] = current.level?.toString() || '-';
        return acc;
      }, []);

      doc.autoTable({
        startY: 52,
        head: [headRow],
        body: bodyRows,
        headStyles: { fillColor: accent, textColor: 255 },
        theme: 'grid',
      });
      doc.save(`CO_PO_Matrix_${subjectCode}_${academicYear}.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-600 rounded-xl"><FileText className="w-5 h-5 text-white" /></div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Accreditation Reports</h1>
            <p className="text-xs text-gray-500">Generate and export NBA/NAAC format OBE reports</p>
          </div>
        </div>

        {/* Builder Panel */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2">1. Select Report</h3>
            {[
              { id: 'matrix', label: 'CO-PO Articulation Matrix', icon: Map },
              { id: 'co-attainment', label: 'Course (CO) Attainment', icon: Target },
              { id: 'po-attainment', label: 'Program (PO) Attainment', icon: BarChart2 },
            ].map(rt => {
              const Icon = rt.icon;
              return (
                <button
                  key={rt.id}
                  onClick={() => setReportType(rt.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${reportType === rt.id ? 'bg-rose-50 border-rose-200 text-rose-800 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:border-rose-200'}`}
                >
                  <Icon className={`w-4 h-4 ${reportType === rt.id ? 'text-rose-600' : 'text-gray-400'}`} />
                  {rt.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2">2. Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Academic Year *</label>
                <input value={academicYear} onChange={e => setAcademicYear(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              {(reportType === 'matrix' || reportType === 'co-attainment') && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Subject Code *</label>
                  <input value={subjectCode} onChange={e => setSubjectCode(e.target.value)} placeholder="e.g. CS301" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
              )}
              {reportType === 'po-attainment' && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Department *</label>
                  <input 
                    value={department} 
                    onChange={e => setDepartment(e.target.value)} 
                    placeholder="Computer Science" 
                    readOnly={!!user?.department}
                    className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none ${!!user?.department ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`} 
                  />
                </div>
              )}
            </div>
            <div className="pt-4 flex gap-3">
              <button onClick={fetchReport} className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition">
                Generate Preview
              </button>
              {data && (
                <button onClick={exportPDF} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-rose-600 text-rose-700 rounded-xl text-sm font-bold hover:bg-rose-50 transition">
                  <Download className="w-4 h-4" /> Export as PDF
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Data Preview */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-rose-600" /></div>
        ) : data ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="border-b pb-4 mb-4 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <h2 className="text-lg font-serif font-bold text-gray-900 border-l-4 border-rose-600 pl-3 uppercase tracking-wide">
                  {reportType === 'matrix' ? 'CO-PO Matrix' : reportType === 'co-attainment' ? 'Course Attainment' : 'Program Attainment'}
                </h2>
                <p className="text-xs text-gray-500 pl-4 mt-1">Generated snapshot view</p>
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4 text-sm text-gray-600">
              <p>Data successfully generated. {Array.isArray(data) ? `Found ${data.length} records.` : 'Matrix loaded.'}</p>
              <p className="mt-2 text-xs text-gray-400">Click "Export as PDF" to download the fully formatted accreditation report.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center text-gray-400">
            Set parameters and click "Generate Preview" to begin
          </div>
        )}
      </div>
    </div>
  );
}
