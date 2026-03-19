"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import * as XLSX from "xlsx";

export default function ReportPage() {
  const { id } = useParams();
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/courses/course-plan/${id}`);
        if (!response.ok) throw new Error("Failed to fetch report data");
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reportData) {
    return <div className="container mx-auto px-6 py-12 text-center text-gray-600">No data available</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExcelExport = () => {
    const table = document.getElementById("report-table");
    const wsData = [];
    
    // Add header row
    const headers = Array.from(table.querySelectorAll("th")).map(th => th.textContent);
    wsData.push(headers);

    // Add data rows
    const rows = table.querySelectorAll("tr");
    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
      const rowData = Array.from(rows[i].querySelectorAll("td")).map(td => td.textContent);
      wsData.push(rowData);
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `report_${reportData._id}.xlsx`);
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-gradient-to-br from-white to-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Navigation */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Course Plan
          </button>
          <div className="flex gap-4">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Print
            </button>
            <button
              onClick={handleExcelExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Excel
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Laboratory Session Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-700">
            <div>
              <p className="text-sm"><span className="font-medium">Branch:</span> {reportData.branch}</p>
              <p className="text-sm"><span className="font-medium">Year:</span> {reportData.year}</p>
              <p className="text-sm"><span className="font-medium">Division:</span> {reportData.division}</p>
              <p className="text-sm"><span className="font-medium">Batch:</span> {reportData.batch}</p>
              <p className="text-sm"><span className="font-medium">Load Type:</span> {reportData.loadType}</p>
              <p className="text-sm"><span className="font-medium">Title:</span> {reportData.title}</p>
              <p className="text-sm"><span className="font-medium">Description:</span> {reportData.description}</p>
            </div>
            <div>
              <p className="text-sm"><span className="font-medium">Teacher ID:</span> {reportData.teacherId}</p>
              <p className="text-sm"><span className="font-medium">Subject:</span> {reportData.subject}</p>
              <p className="text-sm"><span className="font-medium">Created At:</span> {new Date(reportData.createdAt).toLocaleString()}</p>
              <p className="text-sm"><span className="font-medium">Updated At:</span> {new Date(reportData.updatedAt).toLocaleString()}</p>
              <p className="text-sm"><span className="font-medium">Execute:</span> {reportData.execute ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Table Section */}
          <div id="report-table" className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-medium border-b border-gray-200">Sr. No.</th>
                  <th className="py-3 px-4 text-left font-medium border-b border-gray-200">Lesson Title</th>
                  <th className="py-3 px-4 text-left font-medium border-b border-gray-200">Duration (min)</th>
                  <th className="py-3 px-4 text-left font-medium border-b border-gray-200">Description</th>
                  <th className="py-3 px-4 text-left font-medium border-b border-gray-200">Completed</th>
                </tr>
              </thead>
              <tbody>
                {reportData.modules.flatMap((module, moduleIndex) =>
                  module.lessons.map((lesson, lessonIndex) => (
                    <tr key={`${module._id}-${lesson._id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 border-b border-gray-200">{moduleIndex * module.lessons.length + lessonIndex + 1}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{lesson.title}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{lesson.duration}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{lesson.description}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{lesson.completed ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

         
        </div>
      </div>
    </div>
  );
}