// "use client";
// import React, { useState, useEffect } from 'react';
// import { 
//   Users, 
//   UserCheck, 
//   GraduationCap, 
//   BookOpen,
//   Clock,
//   Calendar,
//   TrendingUp, 
//   TrendingDown,
//   ArrowUpRight,
//   ArrowDownRight,
//   Plus,
//   Download,
//   Activity,
//   Award,
//   BarChart2,
//   Clipboard,
//   Bookmark
// } from 'lucide-react';
// import { useSession } from '@/context/SessionContext';

// const HodDashboard = () => {
//   const { user, refreshSession } = useSession();
//   const [timeframe, setTimeframe] = useState('monthly');
//   const [departmentData, setDepartmentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     refreshSession();
//     const fetchDepartmentData = async () => {
//       try {
//         if (!user?.id) return;
        
//         setLoading(true);
//         const response = await fetch(`/api/hod/${user.id}`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch department data');
//         }
        
//         const data = await response.json();
//         setDepartmentData(data);
//       } catch (err) {
//         console.error('Error fetching department data:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchDepartmentData();
//   }, [user?.id]);

//   const quickActions = [
//     { icon: Plus, label: 'Add Student' },
//     { icon: BookOpen, label: 'Add Subject' },
//     { icon: Calendar, label: 'Schedule Exam' },
//     { icon: Download, label: 'Generate Report' }
//   ];

//   const StatCard = ({ title, icon: Icon, value, change, trend }) => (
//     <div className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-sm transition-all duration-200">
//       <div className="flex items-center justify-between mb-4">
//         <div className="p-2 bg-gray-100 rounded-lg">
//           <Icon className="w-5 h-5 text-gray-600" />
//         </div>
//         {change && (
//           <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
//             trend === 'up' 
//               ? 'bg-green-50 text-green-700' 
//               : 'bg-red-50 text-red-700'
//           }`}>
//             {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
//             {Math.abs(change)}%
//           </div>
//         )}
//       </div>
      
//       <div className="space-y-3">
//         <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
//         <div className="flex items-baseline gap-2">
//           <span className="text-2xl font-semibold text-gray-900">{value}</span>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-pulse text-gray-500">Loading department data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-red-500">Error: {error}</div>
//       </div>
//     );
//   }

//   if (!departmentData) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-gray-500">No department data available</div>
//       </div>
//     );
//   }

//   // Transform the API data to match your component's expected structure
//   const transformedData = {
//     department: departmentData.department,
//     year: "2023-2024", // You might want to get this from your API too
//     divisions: departmentData.teachers.reduce((acc, teacher) => {
//       // This is a simplified transformation - adjust according to your actual data structure
//       const division = {
//         name: teacher.classAssigned || 'A', // Assuming teachers have classAssigned field
//         students: 0, // You'll need to get this from your data
//         subjects: teacher.subjects?.length || 0,
//         teachers: 1 // Each teacher represents one
//       };
//       return [...acc, division];
//     }, []),
//     totalStudents: 0, // You'll need to calculate this from your data
//     totalTeachers: departmentData.teachers.length,
//     attendanceRate: 92.5, // You'll need to calculate this from your data
//     upcomingExams: departmentData.academics.filter(a => a.type === 'exam').length,
//     recentActivities: departmentData.academics.slice(0, 4).map((academic, index) => ({
//       id: index,
//       type: academic.type || 'activity',
//       message: academic.title || `Academic activity for ${academic.subject}`,
//       time: 'recent' // You might want to format the actual date
//     }))
//   };
//   console.log("tD = ",transformedData)
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="p-6">
//         {/* Page Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-semibold text-gray-900">Department Overview</h2>
//             <p className="text-gray-600 text-sm mt-1">
//               {transformedData.department} Department • Academic Year: {transformedData.year}
//             </p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <select 
//               value={timeframe}
//               onChange={(e) => setTimeframe(e.target.value)}
//               className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="daily">Daily</option>
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//               <option value="yearly">Yearly</option>
//             </select>
            
//             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <StatCard 
//             title="Total Students" 
//             icon={Users} 
//             value={transformedData.totalStudents}
//             change={2.5}
//             trend="up"
//           />
//           <StatCard 
//             title="Total Teachers" 
//             icon={GraduationCap} 
//             value={transformedData.totalTeachers}
//           />
//           <StatCard 
//             title="Attendance Rate" 
//             icon={UserCheck} 
//             value={`${transformedData.attendanceRate}%`}
//             change={1.2}
//             trend="up"
//           />
//           <StatCard 
//             title="Upcoming Exams" 
//             icon={Bookmark} 
//             value={transformedData.upcomingExams}
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Quick Actions */}
//           <div className="bg-white rounded-lg p-6 border border-gray-100">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
//             <div className="grid grid-cols-2 gap-3">
//               {quickActions.map((action, index) => (
//                 <button
//                   key={index}
//                   className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all duration-200"
//                 >
//                   <div className="p-2 bg-gray-100 rounded-lg">
//                     <action.icon className="w-4 h-4 text-gray-600" />
//                   </div>
//                   <span className="text-sm font-medium text-gray-700">{action.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Recent Activities */}
//           <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-100">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
//               <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
//             </div>
            
//             <div className="space-y-3">
//               {transformedData.recentActivities.map((activity) => (
//                 <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
//                   <div className="p-2 bg-gray-100 rounded-lg mt-0.5">
//                     {activity.type === 'attendance' ? <Clipboard className="w-4 h-4 text-gray-600" /> :
//                      activity.type === 'exam' ? <BookOpen className="w-4 h-4 text-gray-600" /> :
//                      activity.type === 'timetable' ? <Calendar className="w-4 h-4 text-gray-600" /> :
//                      <Activity className="w-4 h-4 text-gray-600" />}
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
//                     <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       {activity.time}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Divisions Overview */}
//         <div className="mt-6 bg-white rounded-lg p-6 border border-gray-100">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Divisions Overview</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {transformedData.divisions.map((division, index) => (
//               <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
//                 <div className="flex items-center justify-between mb-3">
//                   <h4 className="font-medium text-gray-900">Division {division.name}</h4>
//                   <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                     {division.students} Students
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <BookOpen className="w-4 h-4 text-gray-500" />
//                     {division.subjects} Subjects
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <UserCheck className="w-4 h-4 text-gray-500" />
//                     {division.teachers} Teachers
//                   </div>
//                 </div>
//                 <div className="mt-3 pt-3 border-t border-gray-100">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600">Attendance Rate</span>
//                     <span className="font-medium text-green-600">92%</span>
//                   </div>
//                   <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
//                     <div 
//                       className="h-2 rounded-full bg-green-500" 
//                       style={{ width: '92%' }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Additional Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
//           <div className="bg-white rounded-lg p-6 border border-gray-100">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="p-2 bg-gray-100 rounded-lg">
//                 <BarChart2 className="w-4 h-4 text-gray-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-600">Subject Performance</span>
//             </div>
//             <div className="space-y-4">
//               {departmentData.teachers.flatMap(t => t.subjects || [])
//                 .slice(0, 4)
//                 .map((subject, i) => (
//                   <div key={i}>
//                     <div className="flex items-center justify-between text-sm mb-1">
//                       <span className="text-gray-700">{subject}</span>
//                       <span className="font-medium">78%</span>
//                     </div>
//                     <div className="w-full bg-gray-100 rounded-full h-1.5">
//                       <div 
//                         className="h-1.5 rounded-full bg-blue-600" 
//                         style={{ width: `${78}%` }}
//                       ></div>
//                     </div>
//                   </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white rounded-lg p-6 border border-gray-100">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="p-2 bg-gray-100 rounded-lg">
//                 <Award className="w-4 h-4 text-gray-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-600">Top Students</span>
//             </div>
//             <div className="space-y-3">
//               {[
//                 { name: 'Rahul Sharma', score: '98%' },
//                 { name: 'Priya Patel', score: '96%' },
//                 { name: 'Amit Kumar', score: '95%' },
//                 { name: 'Neha Gupta', score: '94%' }
//               ].map((student, i) => (
//                 <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
//                   <span className="text-sm font-medium text-gray-700">{student.name}</span>
//                   <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
//                     {student.score}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white rounded-lg p-6 border border-gray-100">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="p-2 bg-gray-100 rounded-lg">
//                 <Calendar className="w-4 h-4 text-gray-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-600">Upcoming Events</span>
//             </div>
//             <div className="space-y-3">
//               {departmentData.academics
//                 .filter(a => a.type === 'exam' || a.type === 'event')
//                 .slice(0, 4)
//                 .map((event, i) => (
//                   <div key={i} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
//                     <div className="p-1.5 bg-gray-100 rounded mt-0.5">
//                       <Calendar className="w-3.5 h-3.5 text-gray-500" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">{event.title}</p>
//                       <p className="text-xs text-gray-500">{event.date || 'Coming soon'}</p>
//                     </div>
//                   </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HodDashboard;

"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Award,
  BarChart2,
  X,
  Clipboard,
  Phone,
  Bookmark,
} from "lucide-react";
import { useSession } from "@/context/SessionContext";

const HodDashboard = () => {
  const { user } = useSession();
  const [popupData, setPopupData] = useState(null);
  const [listLoading, setListLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Dashboard Stats States
  const [departmentData, setDepartmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Talent Data
  const [departmentalMatrix, setDepartmentalMatrix] = useState([]);
  const [pendingCoffRequests, setPendingCoffRequests] = useState([]);
  const [isTalentLoading, setIsTalentLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/dashboard/hod?hodId=${user.id}`);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }

        const data = await res.json();
        if (isMounted) setDepartmentData(data);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load data");
          setDepartmentData(null);
        }
        console.error("Failed to fetch department data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const fetchDepartmentalTalent = async () => {
    if (!departmentData?.department) return;
    setIsTalentLoading(true);
    try {
      const [matrixRes, coffRes] = await Promise.all([
        fetch(`/api/talent/matrix?department=${departmentData.department}`),
        fetch(`/api/talent/c-off?department=${departmentData.department}`)
      ]);
      const matrixData = await matrixRes.json();
      const coffData = await coffRes.json();
      
      if (matrixData.success) setDepartmentalMatrix(matrixData.data);
      if (coffData.success) {
        setPendingCoffRequests(coffData.data.filter(r => r.status === 'Pending'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTalentLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "talent") {
      fetchDepartmentalTalent();
    }
  }, [activeTab, departmentData?.department]);

  const handleCoffAction = async (id, status) => {
    try {
      const res = await fetch('/api/talent/c-off', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, approvedBy: user.id })
      });
      if (res.ok) {
        fetchDepartmentalTalent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchListData = async (type) => {
    if (!user?.id) return;

    try {
      setListLoading(true);
      setError(null);

      const res = await fetch(`/api/dashboard/hod?hodId=${user.id}&listType=${type}`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      const data = await res.json();

      let columns, title, icon;
      if (type === "students") {
        title = "Students List";
        icon = <Users className="w-5 h-5 mr-2" />;
        columns = [
          { name: "Student ID", key: "studentId" },
          { name: "Full Name", key: "fullName" },
          { name: "Email", key: "email" },
          { name: "Status", key: "status" },
        ];
      } else if (type === "teachers") {
        title = "Teachers List";
        icon = <GraduationCap className="w-5 h-5 mr-2" />;
        columns = [
          { name: "Teacher ID", key: "teacherId" },
          { name: "Full Name", key: "fullName" },
          { name: "Email", key: "email" },
          { name: "Phone", key: "phone" },
        ];
      } else if (type === "activeStudents") {
        title = "Active Students";
        icon = <UserCheck className="w-5 h-5 mr-2" />;
        columns = [
          { name: "Student ID", key: "studentId" },
          { name: "Full Name", key: "fullName" },
          { name: "Email", key: "email" },
          { name: "Status", key: "status" },
        ];
      }

      setPopupData({
        title,
        icon,
        items: data,
        columns,
      });
    } catch (err) {
      setError(err.message || "Failed to load list data");
      console.error("Failed to fetch list data:", err);
    } finally {
      setListLoading(false);
    }
  };

  const handleStatClick = (type) => {
    fetchListData(type);
  };

  const quickActions = [
    { icon: Plus, label: "Add Student" },
    { icon: BookOpen, label: "Add Subject" },
    { icon: Calendar, label: "Schedule Exam" },
    { icon: Download, label: "Generate Report" },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg font-medium animate-pulse">Loading department data...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600 text-lg font-medium">Error: {error}</p>
      </div>
    );

  if (!departmentData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg font-medium">No department data available</p>
      </div>
    );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Popup Modal */}
      {popupData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                {popupData.icon}
                <h3 className="text-xl font-semibold text-gray-900">{popupData.title}</h3>
              </div>
              <button
                onClick={() => setPopupData(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {listLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-600 text-lg font-medium animate-pulse">Loading {popupData.title.toLowerCase()}...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs text-gray-800 uppercase bg-gray-50">
                      <tr>
                        {popupData.columns.map((col) => (
                          <th key={col.key} scope="col" className="px-4 py-3 sm:px-6">
                            {col.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {popupData.items.length > 0 ? (
                        popupData.items.map((item) => (
                          <tr
                            key={item._id || item.id}
                            className="bg-white border-b hover:bg-gray-50 transition-colors"
                          >
                            {popupData.columns.map((col) => (
                              <td key={`${item._id || item.id}-${col.key}`} className="px-4 py-4 sm:px-6">
                                {col.key === "status" ? (
                                  <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                                      item[col.key] === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {item[col.key]}
                                  </span>
                                ) : (
                                  item[col.key] || "-"
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-white border-b">
                          <td
                            colSpan={popupData.columns.length}
                            className="px-4 py-4 sm:px-6 text-center text-gray-600"
                          >
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 p-4 sm:p-6 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Showing {popupData.items.length} records
              </span>
              <button
                onClick={() => setPopupData(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {departmentData.department || "Department"} Dashboard
          </h2>
          <p className="text-gray-600 text-sm mt-1">Academic Year: 2023-2024</p>
        </div>
        
        <nav className="flex bg-gray-200 p-1 rounded-xl">
           {['overview', 'talent'].map(tab => (
             <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab 
                  ? "bg-white text-moze-primary shadow-sm" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }`}
             >
               {tab === 'overview' ? 'Overview' : 'Talent Management'}
             </button>
           ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
      <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div onClick={() => handleStatClick("students")} className="cursor-pointer">
          <StatCard
            title="Total Students"
            icon={Users}
            value={departmentData.totalStudents ?? 0}
            change={2.5}
            trend="up"
          />
        </div>
        <div onClick={() => handleStatClick("teachers")} className="cursor-pointer">
          <StatCard
            title="Total Teachers"
            icon={GraduationCap}
            value={departmentData.totalTeachers ?? 0}
          />
        </div>
        <div onClick={() => handleStatClick("activeStudents")} className="cursor-pointer">
          <StatCard
            title="Active Students"
            icon={UserCheck}
            value={departmentData.activeStudents ?? 0}
            change={1.2}
            trend="up"
          />
        </div>
      </div>
      </>
      )}

      {activeTab === 'talent' && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* C-Off Approvals */}
              <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-moze-primary" />
                    Pending C-Offs
                 </h3>
                 <div className="space-y-3">
                   {isTalentLoading ? (
                     <div className="animate-pulse space-y-2">
                       <div className="h-20 bg-gray-50 rounded-xl"></div>
                       <div className="h-20 bg-gray-50 rounded-xl"></div>
                     </div>
                   ) : pendingCoffRequests.length === 0 ? (
                     <p className="text-sm text-gray-400 italic py-10 text-center">No pending requests.</p>
                   ) : (
                     pendingCoffRequests.map(req => (
                       <div key={req._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="font-bold text-gray-900 text-sm">{req.teacherId?.fullName}</p>
                          <p className="text-xs text-gray-500 mb-3">{req.reasonForEarning} ({new Date(req.earnedOnDate).toLocaleDateString()})</p>
                          <div className="flex gap-2">
                             <button 
                               onClick={() => handleCoffAction(req._id, 'Approved')}
                               className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition"
                             >
                               Approve
                             </button>
                             <button 
                               onClick={() => handleCoffAction(req._id, 'Rejected')}
                               className="flex-1 bg-rose-600 text-white py-2 rounded-lg text-[10px] font-bold hover:bg-rose-700 transition"
                             >
                               Reject
                             </button>
                          </div>
                       </div>
                     ))
                   )}
                 </div>
              </div>

              {/* Talent Matrix */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                       <Award className="w-5 h-5 text-moze-primary" />
                       Departmental Talent Matrix
                    </h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                       <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                          <tr>
                             <th className="px-6 py-4">Staff Name</th>
                             <th className="px-6 py-4 text-center">Duties</th>
                             <th className="px-6 py-4 text-center">Publications</th>
                             <th className="px-6 py-4 text-center">C-Off Credits</th>
                             <th className="px-6 py-4 text-center">Performance</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                          {isTalentLoading ? (
                             <tr><td colSpan="5" className="px-6 py-10 text-center animate-pulse">Calculating matrix...</td></tr>
                          ) : departmentalMatrix.length === 0 ? (
                             <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">No staff data available.</td></tr>
                          ) : (
                            departmentalMatrix.map(item => (
                               <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                                  <td className="px-6 py-4 text-center">{item.metrics.electionDuty}</td>
                                  <td className="px-6 py-4 text-center">{item.metrics.publications}</td>
                                  <td className="px-6 py-4 text-center">
                                     <span className="text-emerald-600 font-bold">{item.metrics.coffBalance}</span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                     <div className="flex items-center justify-center gap-2">
                                        <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                           <div 
                                              className="bg-moze-primary h-full" 
                                              style={{ width: `${Math.min(item.metrics.performanceScore, 100)}%` }}
                                           ></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500">{item.metrics.performanceScore} pts</span>
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
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, icon: Icon, value, change, trend }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gray-50 rounded-lg">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
      {change !== undefined && (
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
            trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold text-gray-900">{value}</span>
    </div>
  </div>
);

const ActivityItem = ({ icon, title, description, time }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1">{icon}</div>
    <div>
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-xs text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);

export default HodDashboard;