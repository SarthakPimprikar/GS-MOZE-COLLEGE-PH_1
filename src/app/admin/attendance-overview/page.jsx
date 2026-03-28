'use client'
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CalendarDays, Search, TrendingUp, User } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ExportButton from '@/components/ExportButton';

export default function AdminAttendanceOverview() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filter, setFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // New state for period selection
  const [periodType, setPeriodType] = useState('weekly'); // 'weekly', 'monthly', 'yearly'
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Helper functions to get current period
  function getCurrentWeek() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return startOfWeek.toISOString().slice(0, 10);
  }

  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // Generate week options (last 12 weeks)
  function getWeekOptions() {
    const weeks = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (i * 7));
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      weeks.push({
        value: startOfWeek.toISOString().slice(0, 10),
        label: `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      });
    }
    return weeks;
  }

  // Generate month options (last 12 months)
  function getMonthOptions() {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
    }
    return months;
  }

  // Generate year options (last 5 years)
  function getYearOptions() {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  }

  // Get all dates in the selected period
  function getDatesInPeriod() {
    const dates = [];

    if (periodType === 'weekly') {
      const start = new Date(selectedWeek);
      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push(date.toISOString().slice(0, 10));
      }
    } else if (periodType === 'monthly') {
      const [year, month] = selectedMonth.split('-');
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        dates.push(`${year}-${month}-${String(i).padStart(2, '0')}`);
      }
    } else {
      // For yearly, we'll fetch data for each month
      for (let month = 1; month <= 12; month++) {
        const daysInMonth = new Date(selectedYear, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          dates.push(`${selectedYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
        }
      }
    }

    return dates;
  }

  const handleStatusChange = async (staffId, date, newStatus) => {
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId, date, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update attendance");

      setAttendanceRecords(prev =>
        prev.map(r => r.id === staffId && r.date === date ? { ...r, status: newStatus } : r)
      );
    } catch (error) {
      alert('Failed to update status');
    }
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const dates = getDatesInPeriod();
        const allRecords = [];

        // Fetch attendance for each date in the period
        for (const date of dates) {
          try {
            const res = await fetch(`/api/attendance?date=${date}`);
            if (!res.ok) continue;
            const data = await res.json();

            // Transform data for this date
            data.users.forEach((user) => {
              allRecords.push({
                id: user._id,
                date: date,
                employeeName: user.fullName,
                employeeId: user._id,
                role: user.role,
                department: user.department || 'N/A',
                status: user.attendanceStatus,
              });
            });
          } catch (error) {
            console.error(`Failed to fetch attendance for ${date}:`, error);
          }
        }

        setAttendanceRecords(allRecords);
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
        setAttendanceRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [periodType, selectedWeek, selectedMonth, selectedYear]);

  const filteredRecords = attendanceRecords.filter(record => {
    if (filter !== 'all' && record.status !== filter) return false;
    if (roleFilter !== 'all' && record.role !== roleFilter) return false;
    if (departmentFilter !== 'all' && record.department !== departmentFilter) return false;
    if (selectedEmployee !== 'all' && record.id !== selectedEmployee) return false;
    if (searchQuery && !`${record.employeeName} ${record.employeeId} ${record.role} ${record.department}`.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      case 'Leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Calculate statistics
  const stats = {
    total: filteredRecords.length,
    present: filteredRecords.filter(r => r.status === 'Present').length,
    absent: filteredRecords.filter(r => r.status === 'Absent').length,
    leave: filteredRecords.filter(r => r.status === 'Leave').length,
  };

  // Prepare pie chart data
  const pieChartData = [
    { name: 'Present', value: stats.present, color: '#10b981' },
    { name: 'Absent', value: stats.absent, color: '#ef4444' },
    { name: 'Leave', value: stats.leave, color: '#3b82f6' },
  ].filter(item => item.value > 0);

  // Get unique employees and departments from all records
  const uniqueEmployees = [...new Map(attendanceRecords.map(r => [r.id, { id: r.id, name: r.employeeName }])).values()];
  const departments = [...new Set(attendanceRecords.map(r => r.department).filter(Boolean))];

  // Get selected employee data
  const selectedEmployeeData = uniqueEmployees.find(e => e.id === selectedEmployee);

  // Calculate attendance percentage
  const attendancePercentage = stats.total > 0
    ? ((stats.present / stats.total) * 100).toFixed(1)
    : 0;

  // Get period display text
  function getPeriodDisplayText() {
    if (periodType === 'weekly') {
      const start = new Date(selectedWeek);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `Week of ${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    } else if (periodType === 'monthly') {
      const [year, month] = selectedMonth.split('-');
      return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else {
      return `Year ${selectedYear}`;
    }
  }

  const [activeTab, setActiveTab] = useState('attendance'); 
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/attendance/leaves');
      const data = await res.json();
      if (data.success) setLeaveRequests(data.data);
    } catch (error) { console.error(error); }
  };

  const fetchHolidays = async () => {
    try {
      const res = await fetch('/api/attendance/holidays');
      const data = await res.json();
      if (data.success) setHolidays(data.data);
    } catch (error) { console.error(error); }
  };

  const handleLeaveAction = async (leaveId, status) => {
    try {
      const res = await fetch('/api/attendance/leaves', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaveId, status })
      });
      if (res.ok) {
        toast.success(`Leave ${status} successfully!`);
        fetchLeaves();
        // Also update attendance record for those dates if approved
        if (status === 'approved') {
          const leave = leaveRequests.find(l => l._id === leaveId);
          await handleStatusChange(leave.staffId._id, leave.fromDate.split('T')[0], 'Leave');
        }
      } else {
        toast.error("Failed to update leave status");
      }
    } catch (error) { 
      console.error(error); 
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchHolidays();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading attendance records for {getPeriodDisplayText()}...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CalendarDays className="mr-3 text-indigo-600" size={32} />
          <h1 className="text-2xl font-bold">Attendance & Leave Management</h1>
        </div>
        <div className="flex gap-2">
           {['attendance', 'leaves', 'holidays'].map(t => (
             <button 
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-4 py-2 rounded-lg font-bold capitalize ${activeTab === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'attendance' && (
        <>
          <div className="flex justify-end mb-4">
            <ExportButton
              data={filteredRecords.map(r => ({
                "Employee": r.employeeName,
                "ID": r.employeeId,
                "Role": r.role,
                "Department": r.department,
                "Status": r.status,
                "Date": new Date(r.date).toLocaleDateString()
              }))}
              filename={`Attendance_Report_${getPeriodDisplayText()}`}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Filter Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full border rounded-md px-3 py-2">
                  <option value="all">All Roles</option>
                  <option value="HOD">HOD</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="w-full border rounded-md px-3 py-2">
                  <option value="all">All Departments</option>
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
               <div className="text-gray-500 text-sm">Total Records</div>
               <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-4 text-green-700">
               <div className="text-sm">Present</div>
               <div className="text-2xl font-bold">{stats.present}</div>
            </div>
            <div className="bg-red-50 rounded-lg shadow p-4 text-red-700">
               <div className="text-sm">Absent</div>
               <div className="text-2xl font-bold">{stats.absent}</div>
            </div>
            <div className="bg-blue-50 rounded-lg shadow p-4 text-blue-700">
               <div className="text-sm">Leave</div>
               <div className="text-2xl font-bold">{stats.leave}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 font-medium">{record.employeeName}</td>
                      <td className="px-6 py-4">{record.role}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(record.status)}`}>{record.status}</span>
                      </td>
                      <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <select
                          value={record.status}
                          onChange={(e) => handleStatusChange(record.id, record.date, e.target.value)}
                          className="text-xs border rounded p-1"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'leaves' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-black">
          <h2 className="text-xl font-bold mb-6">Leave Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-4 font-bold text-gray-500 text-sm">Staff</th>
                  <th className="pb-4 font-bold text-gray-500 text-sm">Role</th>
                  <th className="pb-4 font-bold text-gray-500 text-sm">Type</th>
                  <th className="pb-4 font-bold text-gray-500 text-sm">Dates</th>
                  <th className="pb-4 font-bold text-gray-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leaveRequests.map(l => (
                  <tr key={l._id}>
                    <td className="py-4">
                      <p className="font-bold">{l.staffId?.fullName || l.staffId?.username || l.staffId?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{l.staffId?.email}</p>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold uppercase text-gray-600">{l.role}</span>
                    </td>
                    <td className="py-4 font-medium">{l.type}</td>
                    <td className="py-4">
                      {new Date(l.fromDate).toLocaleDateString()} - {new Date(l.toDate).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      {l.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleLeaveAction(l._id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">Approve</button>
                          <button onClick={() => handleLeaveAction(l._id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Reject</button>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${l.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {l.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {leaveRequests.length === 0 && (
                  <tr><td colSpan="5" className="py-10 text-center text-gray-400 font-medium">No leave requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'holidays' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold mb-8">Holiday Calendar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
            {holidays.map((h, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-bold text-indigo-600 mb-1">{h.type}</p>
                <p className="font-bold text-lg">{h.title}</p>
                <p className="text-sm text-gray-500">{new Date(h.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}