"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import {
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
} from "lucide-react";
import ExportButton from "@/components/ExportButton";
import StatsCard from "@/components/StatsCard";

export default function AccountantAttendanceOverview() {
  const { user } = useSession();
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    noRecord: 0,
    averageAttendance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDepartment, setFilterDepartment] = useState("");

  useEffect(() => {
    fetchAttendanceData();
  }, [filterDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student-attendance?date=${filterDate}`);
      const data = await response.json();
      
      if (data.success) {
        setAttendanceData(data.data);
        // Use stats from API if available, otherwise calculate
        if (data.stats) {
          setStats(data.stats);
        } else {
          calculateStats(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const totalStudents = data.length;
    const presentToday = data.filter(student => student.status === 'Present').length;
    const absentToday = data.filter(student => student.status === 'Absent').length;
    const averageAttendance = totalStudents > 0 ? (presentToday / totalStudents * 100).toFixed(1) : 0;

    setStats({
      totalStudents,
      presentToday,
      absentToday,
      averageAttendance,
    });
  };

  const filteredAttendance = attendanceData.filter((record) => {
    const matchesSearch = record.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || record.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

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
        <h1 className="text-2xl font-bold text-gray-800">Attendance Overview</h1>
        <p className="text-gray-500 text-sm">Monitor student attendance for fee eligibility</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="bg-blue-500"
        />
        <StatsCard
          title="Present Today"
          value={stats.presentToday}
          icon={CheckCircle}
          color="bg-green-500"
          trend={`+${stats.averageAttendance}%`}
        />
        <StatsCard
          title="Absent Today"
          value={stats.absentToday}
          icon={XCircle}
          color="bg-red-500"
        />
        <StatsCard
          title="No Record"
          value={stats.noRecord}
          icon={AlertCircle}
          color="bg-yellow-500"
        />
        <StatsCard
          title="Average Attendance"
          value={`${stats.averageAttendance}%`}
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students by name or ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Business">Business</option>
            <option value="Arts">Arts</option>
          </select>
          <ExportButton
            data={filteredAttendance.map(record => ({
              StudentName: record.studentName,
              StudentID: record.studentId,
              Department: record.department,
              Year: record.year,
              Date: record.date,
              Status: record.status,
              CheckIn: record.checkIn,
              CheckOut: record.checkOut
            }))}
            filename={`Attendance_Report_${filterDate}`}
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Student</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Department</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Year</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Check In</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Check Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAttendance.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{record.studentName}</p>
                      <p className="text-xs text-gray-500">{record.studentId}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-800">{record.department}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-800">{record.year}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-800">{record.date}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        record.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : record.status === "Absent"
                          ? "bg-red-100 text-red-700"
                          : record.status === "No Record"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-800">{record.checkIn || "-"}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-800">{record.checkOut || "-"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fee Eligibility Warning */}
      <div className="mt-6 bg-yellow-50 rounded-lg border border-yellow-200 p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Attendance & Fee Eligibility</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Students with attendance below 75% may have restricted access to certain facilities and may be required to pay additional fees for make-up sessions.
            </p>
          </div>
        </div>
      </div>

      {filteredAttendance.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No attendance records found for the selected date</p>
        </div>
      )}
    </div>
  );
}
