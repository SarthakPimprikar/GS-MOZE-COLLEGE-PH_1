// // app/students/page.jsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { User, Mail, Phone, Calendar, Search, ChevronDown, ChevronUp, Frown, Filter, GraduationCap } from 'lucide-react';
// import { useSession } from '@/context/SessionContext';

// const StudentsPage = () => {
//   const [students, setStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'ascending' });
//   const [expandedStudent, setExpandedStudent] = useState(null);
//   const [statusFilter, setStatusFilter] = useState('All');
//   const { user } = useSession();
  
//   const fetchStudents = async () => {
//     try {
//       const res = await fetch(`/api/teachers/${user.id}/students`);
//       if (!res.ok) {
//         throw new Error("Failed to fetch students");
//       }
//       const data  = await res.json();

//       console.log(data);
      
//       setStudents(data.students || []);
//     } catch (err) {
//       console.error("Error fetching students:", err);
//       setStudents([]);
//     }
//   };

//   useEffect(() => {
//     if (user?.id) {
//       fetchStudents();
//     }
//   }, [user]);

//   console.log(students);
  

//   // Filter students based on search term and status
//   const filteredStudents = students.filter(student => {
//     const matchesSearch = 
//       student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.programType?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    
//     return matchesSearch && matchesStatus;
//   });

//   // Sort students
//   const sortedStudents = [...filteredStudents].sort((a, b) => {
//     // Handle undefined values by treating them as empty strings
//     const aValue = a[sortConfig.key] || '';
//     const bValue = b[sortConfig.key] || '';
    
//     if (aValue < bValue) {
//       return sortConfig.direction === 'ascending' ? -1 : 1;
//     }
//     if (aValue > bValue) {
//       return sortConfig.direction === 'ascending' ? 1 : -1;
//     }
//     return 0;
//   });

//   const requestSort = key => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const toggleExpand = id => {
//     setExpandedStudent(expandedStudent === id ? null : id);
//   };

//   const getStatusColor = status => {
//     switch (status) {
//       case 'active': return 'bg-indigo-100 text-indigo-800';
//       case 'Graduated': return 'bg-purple-100 text-purple-800';
//       case 'On Leave': return 'bg-amber-100 text-amber-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const statusOptions = ['All', 'Active', 'Graduated', 'On Leave'];

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Search and filter bar */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="text-gray-400 h-5 w-5" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search students by name, email, or course..."
//                 className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Filter className="text-gray-400 h-5 w-5" />
//                 </div>
//                 <select
//                   className="appearance-none pl-10 pr-8 py-3 border border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                 >
//                   {statusOptions.map(option => (
//                     <option key={option} value={option}>{option}</option>
//                   ))}
//                 </select>
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//                   <ChevronDown className="h-4 w-4 text-gray-400" />
//                 </div>
//               </div>
              
//               <div className="relative">
//                 <select
//                   className="appearance-none pl-4 pr-8 py-3 border border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
//                   onChange={(e) => requestSort(e.target.value)}
//                   value={sortConfig.key}
//                 >
//                   <option value="fullName">Sort by Name</option>
//                   <option value="enrollmentDate">Sort by Enrollment Date</option>
//                   <option value="course">Sort by Course</option>
//                   <option value="status">Sort by Status</option>
//                 </select>
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//                   <ChevronDown className="h-4 w-4 text-gray-400" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats bar */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
//             <div className="text-sm font-medium text-gray-500">Total Students</div>
//             <div className="text-2xl font-bold text-indigo-600 mt-1">{students.length}</div>
//           </div>
//           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
//             <div className="text-sm font-medium text-gray-500">active</div>
//             <div className="text-2xl font-bold text-indigo-600 mt-1">
//               {students.filter(s => s.status === 'active').length}
//             </div>
//           </div>
//           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
//             <div className="text-sm font-medium text-gray-500">On Leave</div>
//             <div className="text-2xl font-bold text-amber-600 mt-1">
//               {students.filter(s => s.status === 'On Leave').length}
//             </div>
//           </div>
//           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
//             <div className="text-sm font-medium text-gray-500">Graduated</div>
//             <div className="text-2xl font-bold text-purple-600 mt-1">
//               {students.filter(s => s.status === 'Graduated').length}
//             </div>
//           </div>
//         </div>

//         {/* Students list */}
//         <div className="space-y-4">
//           {sortedStudents.length > 0 ? (
//             sortedStudents.map(student => (
//               <div key={student._id || student.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md">
//                 <div 
//                   className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
//                   onClick={() => toggleExpand(student._id || student.id)}
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="relative">
//                       <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border-2 border-indigo-100">
//                         {student.avatar ? (
//                           <img src={student.avatar} alt={student.fullName} className="w-full h-full object-cover" />
//                         ) : (
//                           <User className="text-indigo-500 h-6 w-6" />
//                         )}
//                       </div>
//                       <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ${getStatusColor(student.status).split(' ')[0]} border-2 border-white`}></span>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{student.fullName}</h3>
//                       <div className="flex items-center space-x-3 mt-1">
//                         <p className="text-sm text-gray-500">{student.course}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-6">
//                     <div className="hidden md:block">
//                       <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
//                         {student.status || 'Unknown'}
//                       </span>
//                     </div>
//                     <div className="text-gray-400">
//                       {expandedStudent === (student._id || student.id) ? (
//                         <ChevronUp className="h-5 w-5" />
//                       ) : (
//                         <ChevronDown className="h-5 w-5" />
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Expanded details */}
//                 {expandedStudent === (student._id || student.id) && (
//                   <div className="border-t border-gray-100 p-6 bg-indigo-50/30">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       <div className="flex items-start space-x-3">
//                         <div className="p-2 rounded-lg bg-white shadow-xs border border-gray-100">
//                           <Mail className="text-indigo-500 h-5 w-5" />
//                         </div>
//                         <div>
//                           <p className="text-xs font-medium text-gray-500">Email</p>
//                           <p className="text-sm font-medium text-gray-900 mt-1">{student.email || 'N/A'}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start space-x-3">
//                         <div className="p-2 rounded-lg bg-white shadow-xs border border-gray-100">
//                           <Phone className="text-indigo-500 h-5 w-5" />
//                         </div>
//                         <div>
//                           <p className="text-xs font-medium text-gray-500">Phone</p>
//                           <p className="text-sm font-medium text-gray-900 mt-1">{student.mobileNumber || 'N/A'}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start space-x-3">
//                         <div className="p-2 rounded-lg bg-white shadow-xs border border-gray-100">
//                           <GraduationCap className="text-indigo-500 h-5 w-5" />
//                         </div>
//                         <div>
//                           <p className="text-xs font-medium text-gray-500">Program Type</p>
//                           <p className="text-sm font-medium text-gray-900 mt-1">
//                             {student.programType}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="mt-6 pt-6 border-t border-gray-200">
//                       <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Student Summary</h4>
//                       <p className="text-sm text-gray-700">
//                         {student.fullName} is currently {(student.status || 'unknown').toLowerCase()} in the {student.programType || 'unknown'} program. 
//                         {student.status === 'active' && ' The student is actively attending classes and participating in coursework.'}
//                         {student.status === 'Graduated' && ' The student has successfully completed all program requirements.'}
//                         {student.status === 'On Leave' && ' The student is currently on a temporary leave from the program.'}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
//               <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
//                 <Frown className="text-indigo-400 h-8 w-8" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
//               <p className="text-gray-500 max-w-md mx-auto">
//                 {students.length === 0 ? 'No students are currently registered.' : 'We couldn\'t find any students matching your search criteria.'}
//               </p>
//               <button 
//                 className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
//                 onClick={() => {
//                   setSearchTerm('');
//                   setStatusFilter('All');
//                 }}
//               >
//                 Reset filters
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentsPage;

// app/students/page.jsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { User, Mail, Phone, Calendar, Search, ChevronDown, ChevronUp, Frown, Filter, GraduationCap } from 'lucide-react';
import { useSession } from '@/context/SessionContext';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'ascending' });
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const { user } = useSession();
  
  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/teachers/${user.id}/students`);
      if (!res.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await res.json();
      
      // Remove duplicates based on studentId
      const uniqueStudents = data.students.reduce((acc, current) => {
        const x = acc.find(item => item.studentId === current.studentId);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      console.log(uniqueStudents);
      
      
      setStudents(uniqueStudents || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchStudents();
    }
  }, [user]);

  // Memoize filtered and sorted students
  const { filteredStudents, sortedStudents } = useMemo(() => {
    // Filter students based on search term and status
    const filtered = students.filter(student => {
      const matchesSearch = 
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || 
        (statusFilter === 'Active' ? student.status === 'active' : student.status === statusFilter);
      
      return matchesSearch && matchesStatus;
    });

    // Sort students
    const sorted = [...filtered].sort((a, b) => {
      // Handle undefined values by treating them as empty strings
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return { filteredStudents: filtered, sortedStudents: sorted };
  }, [students, searchTerm, statusFilter, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const toggleExpand = id => {
    setExpandedStudent(expandedStudent === id ? null : id);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'active': return 'bg-indigo-100 text-indigo-800';
      case 'Graduated': return 'bg-purple-100 text-purple-800';
      case 'On Leave': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = ['All', 'Active', 'Graduated', 'On Leave'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search and filter bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400 h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search students by name, email, or ID..."
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="text-gray-400 h-5 w-5" />
                </div>
                <select
                  className="appearance-none pl-10 pr-8 py-3 border border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-8 py-3 border border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                  onChange={(e) => requestSort(e.target.value)}
                  value={sortConfig.key}
                >
                  <option value="fullName">Sort by Name</option>
                  <option value="studentId">Sort by ID</option>
                  <option value="department">Sort by Department</option>
                  <option value="status">Sort by Status</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Total Students</div>
            <div className="text-2xl font-bold text-indigo-600 mt-1">{students.length}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Active</div>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              {students.filter(s => s.status === 'active').length}
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">On Leave</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {students.filter(s => s.status === 'On Leave').length}
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Graduated</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              {students.filter(s => s.status === 'Graduated').length}
            </div>
          </div>
        </div>

        {/* Students list */}
        <div className="space-y-4">
          {sortedStudents.length > 0 ? (
            sortedStudents.map(student => (
              <div key={student.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md">
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(student.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border-2 border-indigo-100">
                        {student.avatar ? (
                          <img src={student.avatar} alt={student.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <User className="text-indigo-500 h-6 w-6" />
                        )}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ${getStatusColor(student.status).split(' ')[0]} border-2 border-white`}></span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.fullName}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <p className="text-sm text-gray-500">{student.department}</p>
                        <p className="text-sm text-gray-400">{student.studentId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="hidden md:block">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                        {student.status === 'active' ? 'Active' : student.status}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      {expandedStudent === student.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded details */}
                {expandedStudent === student.id && (
                  <div className="border-t border-gray-100 p-6 bg-indigo-50/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-white shadow-xs border border-gray-100">
                          <Mail className="text-indigo-500 h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">{student.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-white shadow-xs border border-gray-100">
                          <Phone className="text-indigo-500 h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">{student.mobileNumber || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-white shadow-xs border border-gray-100">
                          <GraduationCap className="text-indigo-500 h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Student ID</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {student.studentId}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Student Summary</h4>
                      <p className="text-sm text-gray-700">
                        {student.fullName} is currently {(student.status === 'active' ? 'active' : student.status?.toLowerCase() || 'unknown')} in the {student.department || 'unknown'} program. 
                        {student.status === 'active' && ' The student is actively attending classes and participating in coursework.'}
                        {student.status === 'Graduated' && ' The student has successfully completed all program requirements.'}
                        {student.status === 'On Leave' && ' The student is currently on a temporary leave from the program.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <Frown className="text-indigo-400 h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {students.length === 0 ? 'No students are currently registered.' : 'We couldn\'t find any students matching your search criteria.'}
              </p>
              <button 
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;