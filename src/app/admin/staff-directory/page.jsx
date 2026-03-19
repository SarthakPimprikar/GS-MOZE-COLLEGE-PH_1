"use client"
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Users, 
  UserCheck, 
  Calendar, 
  BookOpen, 
  Mail, 
  Phone, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Image from 'next/image';
import { useSession } from '@/context/SessionContext';

const StaffOverview = () => {
  const { user } = useSession();
  console.log(user);
  
  const [staffData, setStaffData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample staff data
  useEffect(() => {
    setLoading(true);
    const sampleData = [
      {
        id: 1,
        employeeId: 'EMP001',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@eduerp.com',
        phone: '+1 (555) 123-4567',
        department: 'Computer Science',
        position: 'Professor',
        qualification: 'PhD in Computer Science',
        experience: '12 years',
        joiningDate: '2020-08-15',
        status: 'active',
        salary: '$85,000',
        subjects: ['Data Structures', 'Machine Learning'],
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        address: '123 University Ave, City, State 12345',
        bloodGroup: 'O+',
        emergencyContact: '+1 (555) 987-6543'
      },
      {
        id: 2,
        employeeId: 'EMP002',
        name: 'Prof. Michael Chen',
        email: 'michael.chen@eduerp.com',
        phone: '+1 (555) 234-5678',
        department: 'Mathematics',
        position: 'Associate Professor',
        qualification: 'PhD in Mathematics',
        experience: '8 years',
        joiningDate: '2021-01-10',
        status: 'active',
        salary: '$75,000',
        subjects: ['Calculus', 'Linear Algebra'],
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        address: '456 Academic Blvd, City, State 12345',
        bloodGroup: 'A+',
        emergencyContact: '+1 (555) 876-5432'
      },
      {
        id: 3,
        employeeId: 'EMP003',
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@eduerp.com',
        phone: '+1 (555) 345-6789',
        department: 'Physics',
        position: 'Assistant Professor',
        qualification: 'PhD in Physics',
        experience: '5 years',
        joiningDate: '2022-03-20',
        status: 'on_leave',
        salary: '$70,000',
        subjects: ['Quantum Physics', 'Thermodynamics'],
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        address: '789 Science Park, City, State 12345',
        bloodGroup: 'B+',
        emergencyContact: '+1 (555) 765-4321'
      },
      {
        id: 4,
        employeeId: 'EMP004',
        name: 'Mr. David Thompson',
        email: 'david.thompson@eduerp.com',
        phone: '+1 (555) 456-7890',
        department: 'English',
        position: 'Lecturer',
        qualification: 'MA in English Literature',
        experience: '6 years',
        joiningDate: '2021-09-05',
        status: 'active',
        salary: '$55,000',
        subjects: ['Creative Writing', 'Literature'],
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        address: '321 Literary Lane, City, State 12345',
        bloodGroup: 'AB+',
        emergencyContact: '+1 (555) 654-3210'
      }
    ];
    setStaffData(sampleData);
    setLoading(false);
  }, []);

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'English', 'Chemistry', 'Biology'];
  const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-green-50 text-green-700' },
    { value: 'on_leave', label: 'On Leave', color: 'bg-yellow-50 text-yellow-700' },
    { value: 'inactive', label: 'Inactive', color: 'bg-red-50 text-red-700' }
  ];

  // Filter and search logic
  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || staff.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || staff.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStaff.length / 10);
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * 10, currentPage * 10);

  const StatCard = ({ title, value, icon: Icon, change, trend }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
          trend === 'up' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-blue-50 text-blue-700'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );

  const stats = [
    { 
      title: 'Total Staff', 
      value: staffData.length, 
      icon: Users, 
      change: '+5 this month',
      trend: 'up'
    },
    { 
      title: 'Active Staff', 
      value: staffData.filter(s => s.status === 'active').length, 
      icon: UserCheck, 
      change: '+2 this week',
      trend: 'up'
    },
    { 
      title: 'On Leave', 
      value: staffData.filter(s => s.status === 'on_leave').length, 
      icon: Calendar, 
      change: '3 returning soon',
      trend: 'neutral'
    },
    { 
      title: 'Departments', 
      value: departments.length, 
      icon: BookOpen, 
      change: 'All active',
      trend: 'neutral'
    }
  ];

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Image 
          src="/loading.svg" 
          alt="Loading..."
          width={300} 
          height={300}
          className="mb-4"
        />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-red-600">Error: {error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Staff Overview</h2>
            <p className="text-gray-600 text-sm mt-1">Manage and monitor your educational staff</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {paginatedStaff.length} of {filteredStaff.length} staff
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterDepartment('all');
                      setFilterStatus('all');
                      setSearchTerm('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={staff.profileImage}
                          alt={staff.name}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                          <div className="text-xs text-gray-500">{staff.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {staff.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {staff.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staff.department}</div>
                      <div className="text-xs text-gray-500">{staff.qualification}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staff.position}</div>
                      <div className="text-xs text-gray-500">{staff.subjects.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {staff.experience}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        statusOptions.find(s => s.value === staff.status)?.color
                      }`}>
                        {statusOptions.find(s => s.value === staff.status)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                          currentPage === i + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        } ${i === 0 ? 'rounded-l-lg' : ''} ${i === totalPages - 1 ? 'rounded-r-lg' : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffOverview;