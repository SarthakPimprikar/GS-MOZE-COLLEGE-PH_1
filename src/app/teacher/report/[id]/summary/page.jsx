"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import * as XLSX from "xlsx";

export default function SummaryReportPage() {
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

  const totalPlannedLectures = reportData.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const totalClassesConducted = reportData.modules.reduce((sum, module) => 
    sum + module.lessons.filter(lesson => lesson.completed).length, 0);
  const totalSharedResources = 0; // Placeholder; update if API provides this
  const totalAssignments = 0; // Placeholder; update if API provides this
  const totalQuiz = 1; // Placeholder; update if API provides this
  const totalNumberOfCourseOutcome = 9; // Placeholder; update if API provides this
  const courseProgress = totalClassesConducted > 0 ? Math.round((totalClassesConducted / totalPlannedLectures) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExcelExport = () => {
    const wsData = [
      ["Course Progress Summary"],
      [],
      ["Name:", reportData.teacherId || "JOTIRAM REDE"],
      ["Course Mode:", "Lab"],
      ["Class:", "5Y"],
      ["Subject:", reportData.title || "SYFT001 - Trade Practical"],
      ["Department:", reportData.branch || "Fitter"],
      [],
      ["Metric", "Value"],
      ["Total Planned Lectures", totalPlannedLectures],
      ["Total Classes Conducted", totalClassesConducted],
      ["Total Shared Resources", totalSharedResources],
      ["Total Assignments", totalAssignments],
      ["Total Quiz", totalQuiz],
      ["Total Number of Course Outcome", totalNumberOfCourseOutcome],
      ["Course Progress", `${courseProgress}%`],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SummaryReport");
    XLSX.writeFile(wb, `summary_report_${reportData._id}.xlsx`);
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-gradient-to-br from-white to-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Navigation */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back
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

     

        {/* Summary Content */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Course Progress Summary</h2>
          <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
            <div>
              <p className="text-sm"><span className="font-medium">Name:</span> {reportData.teacherId || "JOTIRAM REDE"}</p>
              <p className="text-sm"><span className="font-medium">Course Mode:</span> Lab</p>
              <p className="text-sm"><span className="font-medium">Class:</span> 5Y</p>
            </div>
            <div>
              <p className="text-sm"><span className="font-medium">Subject:</span> {reportData.title || "SYFT001 - Trade Practical"}</p>
              <p className="text-sm"><span className="font-medium">Department:</span> {reportData.branch || "Fitter"}</p>
            </div>
          </div>

          {/* Summary Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="w-full text-sm text-gray-700 border-collapse">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 font-medium">Total Planned Lectures</td>
                  <td className="py-2 px-4">{totalPlannedLectures}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 font-medium">Total Classes Conducted</td>
                  <td className="py-2 px-4">{totalClassesConducted}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 font-medium">Total Shared Resources</td>
                  <td className="py-2 px-4">{totalSharedResources}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 font-medium">Total Assignments</td>
                  <td className="py-2 px-4">{totalAssignments}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 font-medium">Total Quiz</td>
                  <td className="py-2 px-4">{totalQuiz}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 font-medium">Total Number of Course Outcome</td>
                  <td className="py-2 px-4">{totalNumberOfCourseOutcome}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 font-medium">Course Progress</td>
                  <td className="py-2 px-4">{courseProgress}%</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}