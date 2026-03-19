// app/hr/attendance/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { CalendarDays, Clock, User, Check, X, Plus, Search } from 'lucide-react';

export default function AttendanceManagement() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state for manual entry
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    checkIn: '09:00',
    checkOut: '17:00'
  });

  // Fetch attendance records
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/hr/attendance');
        const json = await res.json();

        console.log("JSON",json);
        if (json.success) {
          setAttendanceRecords(json.data.map((rec) => ({
            id: rec._id,
            employeeName: rec.staff?.name || '',
            employeeId: rec.staff?.staffId || '',
            date: rec.date,
            status: rec.status,
            //notes: rec.remarks,
            department: rec.staff?.department || '-',
            // checkIn: '', //Not supported by backend
            // checkOut: '', // Not supported by backend
            // hours: 0, // Not supported by backend
          })));
        }
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/hr/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: formData.employeeId,
          date: formData.date,
          status: formData.status,
          remarks: '', // No notes field in form, can be extended
        }),
      });
      const json = await res.json();
      if (json.success) {
        // Refresh the list
        setLoading(true);
        const res = await fetch('/api/hr/attendance');
        const json = await res.json();
        if (json.success) {
          setAttendanceRecords(json.data.map((rec) => ({
            id: rec._id,
            employeeName: rec.staff?.name || '',
            employeeId: rec.staff?.staffId || '',
            date: rec.date,
            status: rec.status,
            //notes: rec.remarks,
            department: rec.staff?.department || '-',
            // checkIn: '',
            // checkOut: '',
            // hours: 0,
          })));
        }
        setIsModalOpen(false);
      } else {
        alert(json.message || 'Failed to add record');
      }
    } catch (error) {
      alert('Failed to add record');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const record = attendanceRecords.find(r => r.id === id);
    if (!record) return;
    try {
      const res = await fetch('/api/hr/attendance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: record.employeeId,
          date: record.date,
          status: newStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        // Refresh the list
        setLoading(true);
        const res = await fetch('/api/hr/attendance');
        const json = await res.json();
        if (json.success) {
          setAttendanceRecords(json.data.map((rec) => ({
            id: rec._id,
            employeeName: rec.staff?.name || '',
            employeeId: rec.staff?.staffId || '',
            date: rec.date,
            status: rec.status,
            //notes: rec.remarks,
            department: rec.staff?.department || '-',
            // checkIn: '',
            // checkOut: '',
            // hours: 0,
          })));
        }
      } else {
        alert(json.message || 'Failed to update status');
      }
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    // Apply status filter
    if (filter !== 'all' && record.status !== filter) return false;
    
    // Apply search filter
    if (searchQuery && !`${record.employeeName} ${record.employeeId}`.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      //case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'half-day': return 'bg-blue-100 text-blue-800';
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

  if (loading) return <div className="text-center py-8">Loading attendance records...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Records</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Statuses</option>
            <option value="none">None</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            {/* <option value="late">Late</option> */}
            <option value="half-day">Half Day</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Plus className="mr-2" size={18} />
            Add Record
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase w-2/5">Employee</th>
              <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase w-1/6">Date</th>
              <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase w-1/6">Status</th>
              <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase w-1/5">Department</th>
              <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase ">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 w-1/4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {/* <User className="text-gray-600" size={16} /> */}
                      {getInitials(record.employeeName)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                      <div className="text-sm text-gray-500">{record.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 w-1/6">
                  <div className="flex items-center">
                    <CalendarDays className="mr-1" size={14} />
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 w-1/6">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 w-1/3">
                  <div className="truncate">{record.department || '-'}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <select
                      value={record.status}
                      onChange={(e) => handleStatusChange(record.id, e.target.value)}
                      className="text-xs border rounded p-1"
                    >
                      <option value="none">None</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      {/* <option value="late">Late</option> */}
                      <option value="half-day">Half Day</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Add Attendance Record</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="none">None</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    {/* <option value="late">Late</option> */}
                    <option value="half-day">Half Day</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}