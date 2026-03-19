'use client'
import { useState, useEffect } from 'react';
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <User className="mr-3 text-indigo-600" size={32} />
          <h1 className="text-2xl font-bold">Attendance Overview</h1>
        </div>
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

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter Attendance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, role, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="all">All Roles</option>
              <option value="HOD">HOD</option>
              <option value="Teacher">Teacher</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Employee Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee Name
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="all">All Employees</option>
              {uniqueEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View By
            </label>
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Period Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {periodType === 'weekly' ? 'Select Week' : periodType === 'monthly' ? 'Select Month' : 'Select Year'}
            </label>
            {periodType === 'weekly' && (
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                {getWeekOptions().map(week => (
                  <option key={week.value} value={week.value}>{week.label}</option>
                ))}
              </select>
            )}
            {periodType === 'monthly' && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                {getMonthOptions().map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            )}
            {periodType === 'yearly' && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full border rounded-md px-3 py-2"
              >
                {getYearOptions().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Selected Employee Info Card */}
      {selectedEmployee !== 'all' && selectedEmployeeData && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-xl">
              {getInitials(selectedEmployeeData.name)}
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-bold">{selectedEmployeeData.name}</h2>
              <p className="text-gray-600">
                {filteredRecords.find(r => r.id === selectedEmployee)?.role} - {filteredRecords.find(r => r.id === selectedEmployee)?.department}
              </p>
              <p className="text-sm text-gray-500">{getPeriodDisplayText()}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{attendancePercentage}%</div>
              <div className="text-sm text-gray-500">Present Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-500 text-sm">Total Records</div>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">{getPeriodDisplayText()}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <div className="text-green-700 text-sm">Present</div>
          <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          <div className="text-xs text-green-600">
            {stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <div className="text-red-700 text-sm">Absent</div>
          <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          <div className="text-xs text-red-600">
            {stats.total > 0 ? ((stats.absent / stats.total) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <div className="text-blue-700 text-sm">On Leave</div>
          <div className="text-2xl font-bold text-blue-600">{stats.leave}</div>
          <div className="text-xs text-blue-600">
            {stats.total > 0 ? ((stats.leave / stats.total) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        {pieChartData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="mr-2 text-indigo-600" size={20} />
              <h2 className="text-lg font-semibold">
                {selectedEmployee === 'all' ? 'Overall' : selectedEmployeeData?.name + "'s"} Attendance Distribution
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Status Filter for Quick View */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Status Filter</h2>
          <div className="space-y-3">
            <button
              onClick={() => setFilter('all')}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${filter === 'all'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">All Status</span>
                <span className="text-2xl font-bold text-gray-700">{stats.total}</span>
              </div>
            </button>
            <button
              onClick={() => setFilter('Present')}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${filter === 'Present'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-green-700">Present</span>
                <span className="text-2xl font-bold text-green-600">{stats.present}</span>
              </div>
            </button>
            <button
              onClick={() => setFilter('Absent')}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${filter === 'Absent'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-red-700">Absent</span>
                <span className="text-2xl font-bold text-red-600">{stats.absent}</span>
              </div>
            </button>
            <button
              onClick={() => setFilter('Leave')}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${filter === 'Leave'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-700">On Leave</span>
                <span className="text-2xl font-bold text-blue-600">{stats.leave}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {selectedEmployee === 'all' ? 'All Employees' : selectedEmployeeData?.name + "'s"} Attendance Records
          </h2>
          <p className="text-sm text-gray-500 mt-1">{getPeriodDisplayText()}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase w-1/4">Employee</th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase w-1/8">Role</th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase w-1/6">Department</th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase w-1/8">Status</th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase w-1/8">Date</th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase w-1/8">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No attendance records found for the selected period
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, idx) => (
                  <tr key={`${record.id}-${record.date}-${idx}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 w-1/4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                          {getInitials(record.employeeName)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                          <div className="text-sm text-gray-500">{record.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 w-1/8">
                      {record.role}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 w-1/6">
                      {record.department}
                    </td>
                    <td className="px-6 py-4 w-1/8">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 w-1/8">
                      <div className="flex items-center">
                        <CalendarDays className="mr-1" size={14} />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 w-1/8">
                      <div className="flex space-x-2">
                        <select
                          value={record.status}
                          onChange={(e) => handleStatusChange(record.id, record.date, e.target.value)}
                          className="text-xs border rounded p-1"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}