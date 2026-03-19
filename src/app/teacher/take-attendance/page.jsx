"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { Search, Calendar, Users, Check, X, Save } from "lucide-react";

export default function TakeAttendancePage() {
  const { user } = useSession();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableDivisions, setAvailableDivisions] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [attendanceData, setAttendanceData] = useState({
    date: new Date().toISOString().split("T")[0],
    subject: "",
    topic: "",
    department: "",
    year: "",
    division: ""
  });

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch years and divisions when department changes
  useEffect(() => {
    if (attendanceData.department) {
      fetchDepartmentYears();
    } else {
      setAvailableYears([]);
      setAvailableDivisions([]);
      setAttendanceData(prev => ({ ...prev, year: "", division: "" }));
    }
  }, [attendanceData.department]);

  // Fetch divisions when year changes
  useEffect(() => {
    if (attendanceData.department && attendanceData.year) {
      fetchDepartmentDivisions();
    } else {
      setAvailableDivisions([]);
      setAttendanceData(prev => ({ ...prev, division: "" }));
    }
  }, [attendanceData.year]);

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      console.log("Fetching departments...");
      const response = await fetch('/api/courses');
      const data = await response.json();
      console.log("Courses API response:", data);
      if (data.courses) {
        setDepartments(data.courses);
        console.log("Departments set:", data.courses);
      } else {
        console.log("No courses in response");
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoadingDepartments(false);
      console.log("Departments loading finished");
    }
  };

  const fetchDepartmentYears = async () => {
    try {
      setLoadingYears(true);
      const response = await fetch(`/api/academics/years?department=${encodeURIComponent(attendanceData.department)}`);
      const data = await response.json();
      if (data.success) {
        setAvailableYears(data.years || []);
      }
    } catch (error) {
      console.error("Error fetching years:", error);
    } finally {
      setLoadingYears(false);
    }
  };

  const fetchDepartmentDivisions = async () => {
    try {
      setLoadingDivisions(true);
      const response = await fetch(`/api/divisions?department=${encodeURIComponent(attendanceData.department)}&year=${attendanceData.year}`);
      const data = await response.json();
      if (data.success) {
        setAvailableDivisions(data.divisions || []);
      }
    } catch (error) {
      console.error("Error fetching divisions:", error);
    } finally {
      setLoadingDivisions(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [attendanceData.division, attendanceData.year, attendanceData.department]);

  const fetchStudents = async () => {
    if (!attendanceData.division || !attendanceData.year || !attendanceData.department) {
      setStudents([]);
      return;
    }
    
    try {
      setLoading(true);
      // Fetch students based on selected division, year, and department
      const response = await fetch(`/api/students?division=${attendanceData.division}&year=${attendanceData.year}&department=${encodeURIComponent(attendanceData.department)}`);
      const data = await response.json();
      
      if (data.success) {
        const studentsWithAttendance = data.data.map(student => ({
          ...student,
          isPresent: true // Default to present
        }));
        setStudents(studentsWithAttendance);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (studentId) => {
    setStudents(prev => prev.map(student => 
      student._id === studentId 
        ? { ...student, isPresent: !student.isPresent }
        : student
    ));
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, isPresent: true })));
  };

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ ...student, isPresent: false })));
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      
      const attendancePayload = {
        date: attendanceData.date,
        subject: attendanceData.subject,
        topic: attendanceData.topic,
        teacherId: user.id,
        department: attendanceData.department,
        year: attendanceData.year,
        division: attendanceData.division,
        students: students.map(student => ({
          studentId: student._id,
          isPresent: student.isPresent
        }))
      };

      const response = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendancePayload)
      });

      const result = await response.json();
      
      if (result.success) {
        alert("Attendance saved successfully!");
        // Reset form
        setAttendanceData({
          date: new Date().toISOString().split("T")[0],
          subject: "",
          topic: "",
          department: "",
          year: "",
          division: ""
        });
        fetchStudents();
      } else {
        alert(result.message || "Failed to save attendance");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = students.filter(s => s.isPresent).length;
  const absentCount = students.filter(s => !s.isPresent).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Take Attendance</h1>
        <p className="text-gray-500 text-sm">Mark student attendance for your classes</p>
      </div>

      {/* Attendance Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={attendanceData.date}
              onChange={(e) => setAttendanceData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={attendanceData.subject}
              onChange={(e) => setAttendanceData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g., Mathematics"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <input
              type="text"
              value={attendanceData.topic}
              onChange={(e) => setAttendanceData(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="e.g., Differential Equations"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={attendanceData.department}
              onChange={(e) => setAttendanceData(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loadingDepartments}
            >
              <option value="">Select Department</option>
              {loadingDepartments ? (
                <option>Loading departments...</option>
              ) : departments.length === 0 ? (
                <option>No departments available</option>
              ) : (
                departments.map(dept => (
                  <option key={dept.name} value={dept.name}>{dept.name}</option>
                ))
              )}
            </select>
            {loadingDepartments && (
              <p className="text-xs text-gray-500 mt-1">Loading departments...</p>
            )}
            {!loadingDepartments && departments.length === 0 && (
              <p className="text-xs text-red-500 mt-1">No departments found. Please create academic records first.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={attendanceData.year}
              onChange={(e) => setAttendanceData(prev => ({ ...prev, year: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={!attendanceData.department || loadingYears}
            >
              <option value="">Select Year</option>
              {loadingYears ? (
                <option>Loading...</option>
              ) : (
                availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))
              )}
            </select>
            {!attendanceData.department && (
              <p className="text-xs text-gray-500 mt-1">Select department first</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
            <select
              value={attendanceData.division}
              onChange={(e) => setAttendanceData(prev => ({ ...prev, division: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={!attendanceData.year || loadingDivisions}
            >
              <option value="">Select Division</option>
              {loadingDivisions ? (
                <option>Loading...</option>
              ) : (
                availableDivisions.map(division => (
                  <option key={division} value={division}>Division {division}</option>
                ))
              )}
            </select>
            {!attendanceData.year && (
              <p className="text-xs text-gray-500 mt-1">Select year first</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={markAllPresent}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={markAllAbsent}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Mark All Absent
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Present: {presentCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Absent: {absentCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Total: {students.length}</span>
          </div>
        </div>

        {/* Students List */}
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No students found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleAttendance(student._id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      student.isPresent 
                        ? 'bg-green-500 border-green-500' 
                        : 'bg-white border-gray-300'
                    }`}>
                      {student.isPresent && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.studentId} - {student.department}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    student.isPresent 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {student.isPresent ? 'Present' : 'Absent'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={saveAttendance}
            disabled={saving || !attendanceData.subject}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
}
