"use client";
import Link from "next/link";
import ExportButton from "@/components/ExportButton";
import { useEffect, useState } from "react";

const StudentsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [programTypeFilter, setProgramTypeFilter] = useState("all");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all students from API
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching students from API...");
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error("Failed to fetch Students");
      const data = await res.json(); // <-- API returns { success: true, data: [...] }
      console.log("Received students data:", data);
      
      if (data.success && data.students) {
        console.log("Setting students:", data.students.length, "students");
        setStudents(data.students);
      } else {
        console.log("No students found or API error");
        setStudents([]);
      }
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      console.error("Failed to Load Students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Get all unique program types
  const programTypes = [...new Set(students.map(s => s.programType))].filter(Boolean);

  // Get branches based on selected program type
  const getFilteredBranches = () => {
    if (programTypeFilter === "all") {
      return [...new Set(students.map(s => s.branch).filter(Boolean))];
    }
    return [...new Set(students.filter(s => s.programType === programTypeFilter).map(s => s.branch).filter(Boolean))];
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.branch && student.branch.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    const matchesCourse = courseFilter === "all" || student.branch === courseFilter;
    const matchesProgramType = programTypeFilter === "all" || student.programType === programTypeFilter;

    return matchesSearch && matchesStatus && matchesCourse && matchesProgramType;
  });

  const statusOptions = ["active", "inactive"];

  // Reset course filter when program type changes
  useEffect(() => {
    setCourseFilter("all");
  }, [programTypeFilter]);

  // Handle delete student
  const handleDelete = async (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      try {
        const res = await fetch(`/api/students/${studentId}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error("Failed to delete student");
        // Refresh students list
        fetchStudents();
        alert("Student deleted successfully");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete student");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Student Profiles</h1>
            <p className="text-gray-500 text-sm">Manage all student records</p>
          </div>
          <ExportButton
            data={filteredStudents.map(s => ({
              "Name": s.fullName || s.name,
              "Email": s.email,
              "Program": s.programType,
              "Branch": s.branch || "Not Assigned",
              "Division": s.division || 'Not Assigned',
              "Status": s.status
            }))}
            filename="Student_Profiles"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Search & Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Students</label>
              <input
                type="text"
                placeholder="Search by name, email or branch"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Program Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={programTypeFilter}
                onChange={(e) => setProgramTypeFilter(e.target.value)}
              >
                <option value="all">All Program Types</option>
                {programTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                disabled={getFilteredBranches().length === 0}
              >
                <option value="all">All Branches</option>
                {getFilteredBranches().map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
              {getFilteredBranches().length === 0 && programTypeFilter !== "all" && (
                <p className="text-xs text-gray-500 mt-1">No branches available for this program type</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredStudents.length} of {students.length} students
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Division</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900 hover:text-blue-600 text-sm">
                      <Link href={`/admin/student-profiles/${student.studentId}`}>
                        {student.fullName || student.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-sm">{student.email}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-sm">{student.programType || "N/A"}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-sm">{student.branch || "Not Assigned"}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.division === 'A' ? 'bg-blue-100 text-blue-800' :
                        student.division === 'B' ? 'bg-green-100 text-green-800' :
                        student.division === 'C' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {student.division || 'Not Assigned'}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : "N/A"}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/student-profiles/${student.studentId}?edit=true`}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(student.studentId, student.fullName || student.name)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No students found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsDashboard;
