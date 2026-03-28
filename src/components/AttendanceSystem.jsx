'use client'
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  CalendarDays, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AttendanceSystem = ({ user, role }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [myRecords, setMyRecords] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    fromDate: '',
    toDate: '',
    type: 'Casual',
    reason: ''
  });

  const userId = user?.id || user?._id;
  const userName = user?.fullName || user?.username || user?.name || 'User';

  const fetchMyData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // 1. Fetch Attendance Records for this user
      const res = await fetch(`/api/attendance?userId=${userId}`);
      const data = await res.json();
      if (data.data) {
        setMyRecords(data.data);
      }
      
      // 2. Fetch Leaves
      const leaveRes = await fetch(`/api/attendance/leaves?userId=${userId}`);
      const leaveData = await leaveRes.json();
      if (leaveData.success) setLeaves(leaveData.data);

      // 3. Fetch Holidays
      const holidayRes = await fetch('/api/attendance/holidays');
      const holidayData = await holidayRes.json();
      if (holidayData.success) setHolidays(holidayData.data);
      
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchMyData();
  }, [userId]);

  const handleMarkAttendance = async () => {
    if (!userId) return;
    setIsMarking(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: userId,
          role: role,
          date: today,
          status: 'Present',
          remarks: 'Self Check-in'
        })
      });
      if (res.ok) {
        toast.success("Attendance marked for today!");
        fetchMyData();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to mark");
      }
    } catch (error) {
      toast.error(error.message || "Could not mark attendance");
    } finally {
      setIsMarking(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    try {
      // Ensure type matches schema enum: ['Sick', 'Casual', 'Other']
      const sanitizedType = ['Sick', 'Casual'].includes(leaveForm.type) ? leaveForm.type : 'Other';

      const res = await fetch('/api/attendance/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: userId,
          role: role,
          ...leaveForm,
          type: sanitizedType
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Leave application submitted!");
        setShowLeaveModal(false);
        fetchMyData();
      } else {
        toast.error(data.error || "Failed to submit leave");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  // Calculate Real Stats
  const attendanceRate = myRecords.length > 0 
    ? ((myRecords.filter(r => r.status === 'Present').length / myRecords.length) * 100).toFixed(1)
    : 0;
  
  const leavesThisMonth = leaves.filter(l => {
    const leaveDate = new Date(l.fromDate);
    const now = new Date();
    return l.status === 'approved' && leaveDate.getMonth() === now.getMonth() && leaveDate.getFullYear() === now.getFullYear();
  }).length;

  const todayStatus = leaves.some(l => {
    const today = new Date();
    return l.status === 'approved' && today >= new Date(l.fromDate) && today <= new Date(l.toDate);
  }) ? 'Leave' : 'Working';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Toaster />
      
      {/* Header & Quick Action */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Clock size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Attendance System</h1>
              <p className="text-gray-500 font-medium">Hello, {userName} • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setShowLeaveModal(true)}
              className="px-6 py-3 border-2 border-indigo-100 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              <FileText size={20} />
              Apply for Leave
            </button>
            <button 
              onClick={handleMarkAttendance}
              disabled={isMarking}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle size={20} />
              {isMarking ? 'Marking...' : 'Mark Present Today'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-2 p-1 bg-gray-100 rounded-2xl inline-flex w-full md:w-auto">
        {['summary', 'history', 'leaves', 'holidays'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-bold capitalize transition-all ${
              activeTab === tab 
                ? 'bg-white text-indigo-600 shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {activeTab === 'summary' && (
          <>
            {/* Quick Stats */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 h-fit">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase">Attendance Rate</p>
                  <p className="text-2xl font-black text-gray-900">{attendanceRate}%</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <CalendarDays size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase">Leaves Approved</p>
                  <p className="text-2xl font-black text-gray-900">{leavesThisMonth} Days</p>
                </div>
              </div>
              {/* Ongoing Leaves */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sm:col-span-2">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <AlertCircle className="text-orange-500" size={24} />
                  Pending Approvals
                </h3>
                <div className="space-y-4">
                  {leaves.filter(l => l.status === 'pending').map(l => (
                    <div key={l._id} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900">{l.type} Leave Request</p>
                        <p className="text-sm text-gray-500">{new Date(l.fromDate).toLocaleDateString()} - {new Date(l.toDate).toLocaleDateString()}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-black uppercase tracking-wider">Pending</span>
                    </div>
                  ))}
                  {leaves.filter(l => l.status === 'pending').length === 0 && (
                    <p className="text-center py-6 text-gray-400 font-medium italic">No pending requests</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Calendar Preview */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CalendarDays className="text-indigo-600" size={24} />
                Upcoming Holidays
              </h3>
              <div className="space-y-6">
                {holidays.slice(0, 4).map((h, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-600 font-black shrink-0">
                        <span className="text-[10px] uppercase">{new Date(h.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                        <span className="text-lg leading-none">{new Date(h.date).getDate()}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{h.title}</p>
                        <p className="text-xs text-gray-500">{h.type} Holiday</p>
                      </div>
                   </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="md:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <h2 className="text-2xl font-black text-gray-900 mb-10">Attendance History</h2>
             <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="pb-4 font-bold text-gray-400 uppercase text-xs tracking-widest px-4">Date</th>
                      <th className="pb-4 font-bold text-gray-400 uppercase text-xs tracking-widest px-4">Status</th>
                      <th className="pb-4 font-bold text-gray-400 uppercase text-xs tracking-widest px-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {myRecords.map(r => (
                      <tr key={r._id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-5 px-4 font-bold text-gray-900">{new Date(r.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        <td className="py-5 px-4">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                            r.status === 'Present' ? 'bg-green-100 text-green-700' : 
                            r.status === 'Absent' ? 'bg-red-100 text-red-700' : 
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-gray-500 font-medium italic">{r.remarks || 'No remarks'}</td>
                      </tr>
                    ))}
                    {myRecords.length === 0 && (
                      <tr><td colSpan="3" className="py-20 text-center text-gray-400 font-bold italic">No attendance records found yet.</td></tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'leaves' && (
          <div className="md:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-gray-900">Leave History</h2>
                <button 
                  onClick={() => setShowLeaveModal(true)}
                  className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                >
                  <Plus size={20} />
                  New Request
                </button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="pb-4 font-bold text-gray-400 uppercase text-xs tracking-widest px-4">Period</th>
                      <th className="pb-4 font-bold text-gray-400 uppercase text-xs tracking-widest px-4">Type</th>
                      <th className="pb-4 font-bold text-gray-400 uppercase text-xs tracking-widest px-4">Reason</th>
                      <th className="pb-4 font-bold text-gray-400 uppercase text-xs tracking-widest px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {leaves.map(l => (
                      <tr key={l._id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-5 px-4">
                          <p className="font-bold text-gray-900">{new Date(l.fromDate).toLocaleDateString()} - {new Date(l.toDate).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-400">{Math.ceil((new Date(l.toDate) - new Date(l.fromDate)) / (1000 * 60 * 60 * 24)) + 1} Days</p>
                        </td>
                        <td className="py-5 px-4 font-bold text-indigo-600">{l.type}</td>
                        <td className="py-5 px-4 text-gray-600 font-medium max-w-xs truncate">{l.reason}</td>
                        <td className="py-5 px-4 text-right">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                            l.status === 'approved' ? 'bg-green-100 text-green-700' : 
                            l.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'holidays' && (
          <div className="md:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-10">Holiday Calendar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {holidays.map((h, i) => (
                 <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center text-indigo-600 font-black">
                        <span className="text-xs uppercase">{new Date(h.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                        <span className="text-xl leading-none">{new Date(h.date).getDate()}</span>
                      </div>
                      <span className="px-3 py-1 bg-white border border-gray-200 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">{h.type}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{h.title}</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{h.description || 'Public holiday observed across the department.'}</p>
                 </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[40px] w-full max-w-xl p-10 shadow-2xl animate-in zoom-in duration-300">
              <h2 className="text-3xl font-serif font-black text-gray-900 mb-8">Apply for Leave</h2>
              <form onSubmit={handleLeaveSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">From Date</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                      onChange={e => setLeaveForm({...leaveForm, fromDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">To Date</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                      onChange={e => setLeaveForm({...leaveForm, toDate: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Leave Type</label>
                  <select 
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold appearance-none"
                    onChange={e => setLeaveForm({...leaveForm, type: e.target.value})}
                  >
                    <option value="Sick">Sick Leave</option>
                    <option value="Casual">Casual Leave</option>
                    <option value="Emergency">Emergency Leave</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Reason</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Brief description of your leave request..."
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold resize-none"
                    onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})}
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowLeaveModal(false)}
                    className="flex-1 px-8 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default AttendanceSystem;
