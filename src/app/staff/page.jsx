// "use client"
// import React, { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Filter, 
//   Download, 
//   Eye, 
//   Edit, 
//   Trash2, 
//   MoreVertical, 
//   Users, 
//   UserCheck, 
//   Calendar, 
//   BookOpen, 
//   Mail, 
//   Phone, 
//   ArrowUpRight,
//   ArrowDownRight
// } from 'lucide-react';
// import Image from 'next/image';
// import { useSession } from '@/context/SessionContext';

// const StaffOverview = () => {
//   const { user } = useSession();
//   console.log(user);
  
//   const [staffData, setStaffData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterDepartment, setFilterDepartment] = useState('all');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showFilters, setShowFilters] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Sample staff data
//   useEffect(() => {
//     setLoading(true);
//     const sampleData = [
//       {
//         id: 1,
//         employeeId: 'EMP001',
//         name: 'Dr. Sarah Johnson',
//         email: 'sarah.johnson@eduerp.com',
//         phone: '+1 (555) 123-4567',
//         department: 'Computer Science',
//         position: 'Professor',
//         qualification: 'PhD in Computer Science',
//         experience: '12 years',
//         joiningDate: '2020-08-15',
//         status: 'active',
//         salary: '$85,000',
//         subjects: ['Data Structures', 'Machine Learning'],
//         profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
//         address: '123 University Ave, City, State 12345',
//         bloodGroup: 'O+',
//         emergencyContact: '+1 (555) 987-6543'
//       },
//       {
//         id: 2,
//         employeeId: 'EMP002',
//         name: 'Prof. Michael Chen',
//         email: 'michael.chen@eduerp.com',
//         phone: '+1 (555) 234-5678',
//         department: 'Mathematics',
//         position: 'Associate Professor',
//         qualification: 'PhD in Mathematics',
//         experience: '8 years',
//         joiningDate: '2021-01-10',
//         status: 'active',
//         salary: '$75,000',
//         subjects: ['Calculus', 'Linear Algebra'],
//         profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
//         address: '456 Academic Blvd, City, State 12345',
//         bloodGroup: 'A+',
//         emergencyContact: '+1 (555) 876-5432'
//       },
//       {
//         id: 3,
//         employeeId: 'EMP003',
//         name: 'Dr. Emily Rodriguez',
//         email: 'emily.rodriguez@eduerp.com',
//         phone: '+1 (555) 345-6789',
//         department: 'Physics',
//         position: 'Assistant Professor',
//         qualification: 'PhD in Physics',
//         experience: '5 years',
//         joiningDate: '2022-03-20',
//         status: 'on_leave',
//         salary: '$70,000',
//         subjects: ['Quantum Physics', 'Thermodynamics'],
//         profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
//         address: '789 Science Park, City, State 12345',
//         bloodGroup: 'B+',
//         emergencyContact: '+1 (555) 765-4321'
//       },
//       {
//         id: 4,
//         employeeId: 'EMP004',
//         name: 'Mr. David Thompson',
//         email: 'david.thompson@eduerp.com',
//         phone: '+1 (555) 456-7890',
//         department: 'English',
//         position: 'Lecturer',
//         qualification: 'MA in English Literature',
//         experience: '6 years',
//         joiningDate: '2021-09-05',
//         status: 'active',
//         salary: '$55,000',
//         subjects: ['Creative Writing', 'Literature'],
//         profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
//         address: '321 Literary Lane, City, State 12345',
//         bloodGroup: 'AB+',
//         emergencyContact: '+1 (555) 654-3210'
//       }
//     ];
//     setStaffData(sampleData);
//     setLoading(false);
//   }, []);

//   const departments = ['Computer Science', 'Mathematics', 'Physics', 'English', 'Chemistry', 'Biology'];
//   const statusOptions = [
//     { value: 'active', label: 'Active', color: 'bg-green-50 text-green-700' },
//     { value: 'on_leave', label: 'On Leave', color: 'bg-yellow-50 text-yellow-700' },
//     { value: 'inactive', label: 'Inactive', color: 'bg-red-50 text-red-700' }
//   ];

//   // Filter and search logic
//   const filteredStaff = staffData.filter(staff => {
//     const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          staff.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesDepartment = filterDepartment === 'all' || staff.department === filterDepartment;
//     const matchesStatus = filterStatus === 'all' || staff.status === filterStatus;
//     return matchesSearch && matchesDepartment && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredStaff.length / 10);
//   const paginatedStaff = filteredStaff.slice((currentPage - 1) * 10, currentPage * 10);

//   const StatCard = ({ title, value, icon: Icon, }) => (
//     <div className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-sm transition-all duration-200">
//       <div className="flex items-center justify-between mb-4">
//         <div className="p-2 bg-gray-100 rounded-lg">
//           <Icon className="w-5 h-5 text-gray-600" />
//         </div>
//       </div>
      
//       <div className="space-y-3">
//         <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
//         <div className="text-2xl font-semibold text-gray-900">{value}</div>
//       </div>
//     </div>
//   );

//   const stats = [
//     { 
//       title: 'Total Staff', 
//       value: staffData.length, 
//       icon: Users, 
//     },
//     { 
//       title: 'Active Staff', 
//       value: staffData.filter(s => s.status === 'active').length, 
//       icon: UserCheck, 
//     },
//     { 
//       title: 'On Leave', 
//       value: staffData.filter(s => s.status === 'on_leave').length, 
//       icon: Calendar, 
//     },
//     { 
//       title: 'Departments', 
//       value: departments.length, 
//       icon: BookOpen, 
//     }
//   ];

//   if (loading)
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Image 
//           src="/loading.svg" 
//           alt="Loading..."
//           width={300} 
//           height={300}
//           className="mb-4"
//         />
//       </div>
//     );

//   if (error)
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="p-6 text-red-600">Error: {error}</div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="p-6">

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           {stats.map((stat, index) => (
//             <StatCard key={index} {...stat} />
//           ))}
//         </div>

//         {/* Filters and Search */}
//         <div className="bg-white rounded-lg p-6 border border-gray-100 mb-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search staff..."
//                   className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80 text-sm"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
              
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
//               >
//                 <Filter className="w-4 h-4" />
//                 Filters
//               </button>
//             </div>

//             <div className="text-sm text-gray-600">
//               Showing {paginatedStaff.length} of {filteredStaff.length} staff
//             </div>
//           </div>

//           {showFilters && (
//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                   <select
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     value={filterDepartment}
//                     onChange={(e) => setFilterDepartment(e.target.value)}
//                   >
//                     <option value="all">All Departments</option>
//                     {departments.map(dept => (
//                       <option key={dept} value={dept}>{dept}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                   <select
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                   >
//                     <option value="all">All Status</option>
//                     {statusOptions.map(status => (
//                       <option key={status.value} value={status.value}>{status.label}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex items-end">
//                   <button
//                     onClick={() => {
//                       setFilterDepartment('all');
//                       setFilterStatus('all');
//                       setSearchTerm('');
//                     }}
//                     className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
//                   >
//                     Clear Filters
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Staff Table */}
//         <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <input type="checkbox" className="rounded border-gray-300" />
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedStaff.map((staff) => (
//                   <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <input type="checkbox" className="rounded border-gray-300" />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-3">
//                         <img
//                           className="h-10 w-10 rounded-lg object-cover"
//                           src={staff.profileImage}
//                           alt={staff.name}
//                         />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{staff.name}</div>
//                           <div className="text-xs text-gray-500">{staff.employeeId}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900 flex items-center gap-2">
//                         <Mail className="w-3 h-3 text-gray-400" />
//                         {staff.email}
//                       </div>
//                       <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
//                         <Phone className="w-3 h-3 text-gray-400" />
//                         {staff.phone}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{staff.department}</div>
//                       <div className="text-xs text-gray-500">{staff.qualification}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{staff.position}</div>
//                       <div className="text-xs text-gray-500">{staff.subjects.join(', ')}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {staff.experience}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
//                         statusOptions.find(s => s.value === staff.status)?.color
//                       }`}>
//                         {statusOptions.find(s => s.value === staff.status)?.label}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center gap-1">
//                         <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                         <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors">
//                           <MoreVertical className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
//               <div className="flex-1 flex justify-between sm:hidden">
//                 <button
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className="relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                   disabled={currentPage === totalPages}
//                   className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
//                 >
//                   Next
//                 </button>
//               </div>
//               <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                     <span className="font-medium">{totalPages}</span>
//                   </p>
//                 </div>
//                 <div>
//                   <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
//                     {[...Array(totalPages)].map((_, i) => (
//                       <button
//                         key={i + 1}
//                         onClick={() => setCurrentPage(i + 1)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
//                           currentPage === i + 1
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
//                         } ${i === 0 ? 'rounded-l-lg' : ''} ${i === totalPages - 1 ? 'rounded-r-lg' : ''}`}
//                       >
//                         {i + 1}
//                       </button>
//                     ))}
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StaffOverview;

'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function StaffOverview() {
  const { user, loading } = useSession();
  const [stats, setStats] = useState({
    totalEnquiries: 0,
    pendingEnquiries: 0,
    approvedEnquiries: 0,
    leavesCount: 0,
    recentEnquiries: [],
    recentActivities: [],
    totalEnquiriesChange: 0,
    pendingEnquiriesChange: 0,
    approvedEnquiriesChange: 0,
    leavesCountChange: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const router= useRouter();

  useEffect(() => {
    if (!loading && user?.id) {
      fetchStaffOverview(user.id);
    }
  }, [loading, user]);

  const fetchStaffOverview = async (staffId) => {
    try {
      const res = await fetch(`/api/dashboard/staff?staffId=${staffId}`);
      const data = await res.json();
      if (res.ok) {
        setStats(prev => ({
          ...prev,
          ...data,
          recentActivities: data.recentActivities || [],
          recentEnquiries: data.recentEnquiries || []
        }));
      } else {
        console.error('Failed to fetch staff overview:', data.error);
      }
    } catch (err) {
      console.error('Error fetching staff overview:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || loadingStats) {
    return <DashboardSkeleton />;
  }

  // Chart data for enquiries status
  const enquiriesData = {
    labels: ['Pending', 'Approved', 'Other'],
    datasets: [
      {
        data: [stats.pendingEnquiries, stats.approvedEnquiries, stats.totalEnquiries - stats.pendingEnquiries - stats.approvedEnquiries],
        backgroundColor: [
          'rgba(245, 158, 11, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(99, 102, 241, 0.7)'
        ],
        borderColor: [
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(99, 102, 241, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">Staff Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name || 'User'}!</p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Enquiries"
          value={stats.totalEnquiries}
          icon={<EnquiryIcon />}
          color="bg-indigo-100 text-indigo-600"
          trend={stats.totalEnquiriesChange}
        />
        <StatCard
          title="Pending Enquiries"
          value={stats.pendingEnquiries}
          icon={<PendingIcon />}
          color="bg-amber-100 text-amber-600"
          trend={stats.pendingEnquiriesChange}
        />
        <StatCard
          title="Approved Enquiries"
          value={stats.approvedEnquiries}
          icon={<ApprovedIcon />}
          color="bg-green-100 text-green-600"
          trend={stats.approvedEnquiriesChange}
        />
        <StatCard
          title="Leaves Taken"
          value={stats.leavesCount}
          icon={<LeaveIcon />}
          color="bg-blue-100 text-blue-600"
          trend={stats.leavesCountChange}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Enquiries Status Distribution</h2>
          <div className="h-64">
            <Pie
              data={enquiriesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      pointStyle: 'circle'
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                },
              }}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Recent Enquiries</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium" onClick={() => router.push('/staff/enquiry&leads') }>
              View All
            </button>
          </div>
          {stats.recentEnquiries && stats.recentEnquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>

                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentEnquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {enquiry.first?.charAt(0)}{enquiry.last?.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {enquiry.first} {enquiry.last}
                            </div>
                            <div className="text-sm text-gray-500">
                              {enquiry.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enquiry.courseInterested}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={enquiry.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enquiry.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">No recent enquiries found</div>
              <div className="text-sm text-indigo-500">New enquiries will appear here</div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// ... (Keep all the existing helper functions and components below)

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`rounded-xl p-5 shadow-sm border border-gray-100 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-current opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1 text-current">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color.split(' ')[0]} bg-opacity-30`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusClasses = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800'
  };

  const className = statusClasses[status.toLowerCase()] || statusClasses.default;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}>
      {status}
    </span>
  );
}

// Simple SVG Icons
function EnquiryIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ApprovedIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LeaveIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-xl h-24"></div>
        ))}
      </div>
      {/* Pie Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-6 bg-gray-200 rounded w-1/3 m-4"></div>
        <div className="p-4">
          <div className="bg-gray-200 h-64 rounded"></div>
        </div>
      </div>
      {/* Recent Enquiries Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-6 bg-gray-200 rounded w-1/3 m-4"></div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
