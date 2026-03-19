// "use client";

// import { useState, useEffect } from "react";
// import {
//   Calendar,
//   Search,
//   User,
//   Check,
//   X,
//   Clock,
//   ChevronDown,
//   BookOpen,
//   Home,
//   GraduationCap,
// } from "lucide-react";
// import { useSession } from "@/context/SessionContext";

// const AttendancePage = () => {
//   const [allStudents, setAllStudents] = useState([]);
//   const { user } = useSession();
//   const [loading, setLoading] = useState(true);
//   const [teacherData, setTeacherData] = useState([]); // Store all teacher data
//   const [filteredData, setFilteredData] = useState({
//     years: [],
//     semesters: [],
//     divisions: [],
//     subjects: [],
//   });
//   const [attendance, setAttendance] = useState(() => ({
//     date: new Date().toISOString().split("T")[0],
//     subject: "",
//     topicName: "",
//     students: [],
//     division: "",
//     year: "",
//     semester: "",
//     department: "",
//   }));

//   const [searchTerm, setSearchTerm] = useState("");
//   const [expandedView, setExpandedView] = useState(false);

//   const fetchStudents = async (division) => {
//     try {
//       setLoading(true);
//       const res = await fetch(
//         `/api/teachers/${user.id}/students?division=${division}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch Students");
//       const { students } = await res.json();

//       setAllStudents(students);
//       setAttendance((prev) => ({
//         ...prev,
//         students: students.map((student) => ({
//           studentId: student.id,
//           schoolId: student.studentId,
//           isPresent: true,
//         })),
//       }));
//     } catch (err) {
//       console.error("Error fetching students:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTeacherSubjects = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/teachers/${user.id}/dashboard`);
//       if (!res.ok) throw new Error("Failed to fetch Teacher's Subjects");
//       const data = await res.json();

//       const teacherSubjects = data.mySubjects || [];
//       const departmentsData = data.teacher || [];
//       const department = departmentsData.department;

//       // Store all teacher data
//       setTeacherData(teacherSubjects);

//       // Extract unique years for initial dropdown
//       const uniqueYears = [
//         ...new Set(teacherSubjects.map((item) => item.year)),
//       ];

//       setFilteredData((prev) => ({
//         ...prev,
//         years: uniqueYears,
//       }));

//       // Set initial department
//       setAttendance((prev) => ({
//         ...prev,
//         department: department,
//       }));

//       return teacherSubjects;
//     } catch (error) {
//       console.error("Error fetching subjects:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter semesters based on selected year
//   const handleYearChange = (e) => {
//     const selectedYear = e.target.value;

//     // Filter data for selected year
//     const yearData = teacherData.filter((item) => item.year === selectedYear);
//     const uniqueSemesters = [...new Set(yearData.map((item) => item.semester))];

//     setFilteredData((prev) => ({
//       ...prev,
//       semesters: uniqueSemesters,
//       divisions: [],
//       subjects: [],
//     }));

//     setAttendance((prev) => ({
//       ...prev,
//       year: selectedYear,
//       semester: "",
//       division: "",
//       subject: "",
//     }));
//   };

//   // Filter divisions based on selected semester
//   const handleSemChange = (e) => {
//     const selectedSemester = e.target.value;

//     // Filter data for selected year and semester
//     const semesterData = teacherData.filter(
//       (item) =>
//         item.year === attendance.year && item.semester === selectedSemester
//     );
//     const uniqueDivisions = [
//       ...new Set(semesterData.map((item) => item.division)),
//     ];

//     setFilteredData((prev) => ({
//       ...prev,
//       divisions: uniqueDivisions,
//       subjects: [],
//     }));

//     setAttendance((prev) => ({
//       ...prev,
//       semester: selectedSemester,
//       division: "",
//       subject: "",
//     }));
//   };

//   // Filter subjects based on selected division
//   const handleDivisionChange = async (e) => {
//     const selectedDivision = e.target.value;

//     // Filter data for selected year, semester and division
//     const divisionData = teacherData.find(
//       (item) =>
//         item.year === attendance.year &&
//         item.semester === attendance.semester &&
//         item.division === selectedDivision
//     );

//     const divisionSubjects = divisionData?.subjects || [];

//     setFilteredData((prev) => ({
//       ...prev,
//       subjects: divisionSubjects,
//     }));

//     setAttendance((prev) => ({
//       ...prev,
//       division: selectedDivision,
//       subject: divisionSubjects.length > 0 ? divisionSubjects[0] : "",
//     }));

//     // Fetch students for the selected division
//     await fetchStudents(selectedDivision);
//   };

//   const handleSubjectChange = (e) => {
//     setAttendance((prev) => ({
//       ...prev,
//       subject: e.target.value,
//     }));
//   };

//   useEffect(() => {
//     if (user?.id) {
//       fetchTeacherSubjects();
//     }
//   }, [user]);

//   const toggleAndSaveAttendance = async (studentId) => {
//     // Optimistically update UI first
//     setAttendance((prev) => {
//       const updatedStudents = prev.students.map((student) =>
//         student.studentId === studentId
//           ? { ...student, isPresent: !student.isPresent }
//           : student
//       );

//       return {
//         ...prev,
//         students: updatedStudents,
//       };
//     });
//   };

//   const handleTopicChange = (e) => {
//     setAttendance((prev) => ({
//       ...prev,
//       topicName: e.target.value,
//     }));
//   };

//   const handleDateChange = (e) => {
//     setAttendance((prev) => ({
//       ...prev,
//       date: e.target.value,
//     }));
//   };

//   const filteredStudents = allStudents.filter(
//     (student) =>
//       student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (student.email &&
//         student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getStudentAttendance = (studentId) => {
//     const record = attendance.students.find((s) => s.studentId === studentId);
//     return record ? record.isPresent : true;
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const handleSubmit = async () => {
//     const confirmed = window.confirm(
//       `Save attendance for ${formatDate(attendance.date)}?`
//     );
//     if (!confirmed) return;

//     try {
//       const response = await fetch(
//         `/api/teachers/${user.id}/dashboard/attendance`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             ...attendance,
//             teacher: user.id,
//           }),
//         }
//       );

//       if (response.ok) {
//         alert(`Attendance saved for ${formatDate(attendance.date)}`);
//       } else {
//         throw new Error(await response.text());
//       }
//     } catch (error) {
//       console.error("Error saving attendance:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
//           <p className="mt-4 text-indigo-700">Loading students...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-indigo-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Attendance Summary */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-white rounded-xl shadow-md p-5 border border-indigo-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-indigo-600">
//                   Total Students
//                 </p>
//                 <p className="text-2xl font-bold text-indigo-900 mt-1">
//                   {filteredStudents.length}
//                 </p>
//               </div>
//               <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
//                 <User className="h-6 w-6" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-5 border border-indigo-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-green-600">Present</p>
//                 <p className="text-2xl font-bold text-green-700 mt-1">
//                   {attendance.students.filter((s) => s.isPresent).length}
//                 </p>
//               </div>
//               <div className="p-3 rounded-full bg-green-100 text-green-600">
//                 <Check className="h-6 w-6" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-5 border border-indigo-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-red-600">Absent</p>
//                 <p className="text-2xl font-bold text-red-700 mt-1">
//                   {attendance.students.filter((s) => !s.isPresent).length}
//                 </p>
//               </div>
//               <div className="p-3 rounded-full bg-red-100 text-red-600">
//                 <X className="h-6 w-6" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Attendance Header */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-indigo-100">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
//                 <Calendar className="h-5 w-5" />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-indigo-700 mb-1">
//                   Date
//                 </label>
//                 <input
//                   type="date"
//                   value={attendance.date}
//                   onChange={handleDateChange}
//                   className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                 />
//               </div>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
//                 <GraduationCap className="h-5 w-5" />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-indigo-700 mb-1">
//                   Year
//                 </label>
//                 <select
//                   value={attendance.year}
//                   onChange={handleYearChange}
//                   className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                 >
//                   <option value="">Select Year</option>
//                   {filteredData.years.map((year) => (
//                     <option key={year} value={year}>
//                       {year}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Semester Select */}
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
//                 <Home className="h-5 w-5" />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-indigo-700 mb-1">
//                   Semester
//                 </label>
//                 <select
//                   value={attendance.semester}
//                   onChange={handleSemChange}
//                   disabled={!attendance.year}
//                   className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white disabled:opacity-50"
//                 >
//                   <option value="">Select Semester</option>
//                   {filteredData.semesters.map((sem) => (
//                     <option key={sem} value={sem}>
//                       {sem}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Division Select */}
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
//                 <Home className="h-5 w-5" />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-indigo-700 mb-1">
//                   Division
//                 </label>
//                 <select
//                   value={attendance.division}
//                   onChange={handleDivisionChange}
//                   disabled={!attendance.semester}
//                   className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white disabled:opacity-50"
//                 >
//                   <option value="">Select Division</option>
//                   {filteredData.divisions.map((div) => (
//                     <option key={div} value={div}>
//                       {div}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Subject Select */}
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
//                 <BookOpen className="h-5 w-5" />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-indigo-700 mb-1">
//                   Subject
//                 </label>
//                 <select
//                   value={attendance.subject}
//                   onChange={handleSubjectChange}
//                   disabled={!attendance.division}
//                   className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white disabled:opacity-50"
//                 >
//                   <option value="">Select Subject</option>
//                   {filteredData.subjects.map((subject) => (
//                     <option key={subject} value={subject}>
//                       {subject}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
//                 <Clock className="h-5 w-5" />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-indigo-700 mb-1">
//                   Topic
//                 </label>
//                 <input
//                   type="text"
//                   value={attendance.topicName}
//                   onChange={handleTopicChange}
//                   placeholder="Enter topic name"
//                   className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
//             <h3 className="text-lg font-semibold text-indigo-800">
//               {formatDate(attendance.date)}
//             </h3>
//             <div className="flex items-center space-x-4 mt-1">
//               <span className="text-indigo-600 font-medium">
//                 {attendance.subject}
//               </span>
//               {attendance.topicName && (
//                 <>
//                   <span className="text-indigo-300">•</span>
//                   <span className="text-indigo-500">
//                     {attendance.topicName}
//                   </span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-indigo-100">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="text-indigo-400 h-5 w-5" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search students by name or email..."
//                 className="pl-10 pr-4 py-2.5 w-full border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setExpandedView(!expandedView)}
//                 className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 transition-colors"
//               >
//                 <span className="font-medium">
//                   {expandedView ? "Compact View" : "Detailed View"}
//                 </span>
//                 <ChevronDown
//                   className={`h-4 w-4 transition-transform ${
//                     expandedView ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Students List */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-indigo-100">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-indigo-100">
//               <thead className="bg-indigo-50">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider"
//                   >
//                     Student
//                   </th>
//                   {expandedView && (
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider"
//                     >
//                       Email
//                     </th>
//                   )}
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider"
//                   >
//                     Division
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider"
//                   >
//                     Status
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-right text-xs font-semibold text-indigo-700 uppercase tracking-wider"
//                   >
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-indigo-100">
//                 {filteredStudents.length > 0 ? (
//                   filteredStudents.map((student) => {
//                     const isPresent = getStudentAttendance(student.id);
//                     return (
//                       <tr
//                         key={student.id}
//                         className="hover:bg-indigo-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10">
//                               <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-200">
//                                 <User className="text-indigo-500 h-5 w-5" />
//                               </div>
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-semibold text-indigo-900">
//                                 {student.fullName}
//                               </div>
//                               <div className="text-xs text-indigo-400 mt-1">
//                                 ID: {student.studentId} | Dept:{" "}
//                                 {student.department}
//                               </div>
//                               {!expandedView && (
//                                 <div className="text-xs text-indigo-500">
//                                   {student.email}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                         {expandedView && (
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm text-indigo-600">
//                               {student.email}
//                             </div>
//                           </td>
//                         )}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="rounded-2xl px-6 py-0.5 text-indigo-600 bg-indigo-100">
//                             {student.division}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               isPresent
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-red-100 text-red-800"
//                             }`}
//                           >
//                             {isPresent ? "Present" : "Absent"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <button
//                             onClick={() => toggleAndSaveAttendance(student.id)}
//                             className={`p-2 rounded-lg transition-colors ${
//                               isPresent
//                                 ? "bg-green-100 text-green-600 hover:bg-green-200"
//                                 : "bg-red-100 text-red-600 hover:bg-red-200"
//                             }`}
//                           >
//                             {isPresent ? (
//                               <Check className="h-5 w-5" />
//                             ) : (
//                               <X className="h-5 w-5" />
//                             )}
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={expandedView ? 5 : 4}
//                       className="px-6 py-8 text-center"
//                     >
//                       <div className="flex flex-col items-center justify-center">
//                         <Search className="h-10 w-10 text-indigo-300 mb-3" />
//                         <h3 className="text-lg font-medium text-indigo-700">
//                           No students found
//                         </h3>
//                         <p className="text-indigo-400 mt-1">
//                           Try adjusting your search or filter
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={handleSubmit}
//             className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//           >
//             Save Attendance
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendancePage;

"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  User,
  Check,
  X,
  Clock,
  ChevronDown,
  BookOpen,
  Home,
  GraduationCap,
} from "lucide-react";
import { useSession } from "@/context/SessionContext";
import toast, { Toaster } from "react-hot-toast";

const AttendancePage = () => {
  const [allStudents, setAllStudents] = useState([]);
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState([]);
  const [filteredData, setFilteredData] = useState({
    years: [],
    semesters: [],
    divisions: [],
    subjects: [],
  });
  const [attendance, setAttendance] = useState(() => ({
    date: new Date().toISOString().split("T")[0],
    subject: "Workshop Calculations and Science Theory",
    topicName: "ET003 - Lecture I",
    students: [],
    division: "",
    year: "FY",
    semester: "",
    department: "ET",
  }));

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedView, setExpandedView] = useState(false);

  const fetchStudents = async (division) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/teachers/${user.id}/students?division=${division}`
      );
      if (!res.ok) throw new Error("Failed to fetch Students");
      const { students } = await res.json();

      setAllStudents(students);
      setAttendance((prev) => ({
        ...prev,
        students: students.map((student) => ({
          studentId: student.id,
          schoolId: student.studentId,
          isPresent: true,
        })),
      }));
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherSubjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/teachers/${user.id}/dashboard`);
      if (!res.ok) throw new Error("Failed to fetch Teacher's Subjects");
      const data = await res.json();

      const teacherSubjects = data.mySubjects || [];
      const departmentsData = data.teacher || [];
      const department = departmentsData.department;

      setTeacherData(teacherSubjects);

      const uniqueYears = [...new Set(teacherSubjects.map((item) => item.year))];
      const uniqueSemesters = [...new Set(teacherSubjects.map((item) => item.semester))];

      setFilteredData((prev) => ({
        ...prev,
        years: uniqueYears,
        semesters: uniqueSemesters,
      }));

      setAttendance((prev) => ({
        ...prev,
        department: department,
      }));

      // Pre-select values based on the image
      if (teacherSubjects.length > 0) {
        const fySubjects = teacherSubjects.filter(sub => sub.year === "FY");
        if (fySubjects.length > 0) {
          const divisions = [...new Set(fySubjects.map(item => item.division))];
          setFilteredData(prev => ({
            ...prev,
            divisions: divisions,
          }));
          
          // Set the division to the first one available (or specific one from image)
          const targetDivision = "A";
          if (divisions.includes(targetDivision)) {
            await fetchStudents(targetDivision);
            setAttendance(prev => ({
              ...prev,
              division: targetDivision,
              semester: fySubjects.find(sub => sub.division === targetDivision)?.semester || "",
            }));
          }
        }
      }

      return teacherSubjects;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

   const handleYearChange = (e) => {
    const selectedYear = e.target.value;

    // Filter data for selected year
    const yearData = teacherData.filter((item) => item.year === selectedYear);
    const uniqueSemesters = [...new Set(yearData.map((item) => item.semester))];

    setFilteredData((prev) => ({
      ...prev,
      semesters: uniqueSemesters,
      divisions: [],
      subjects: [],
    }));

    setAttendance((prev) => ({
      ...prev,
      year: selectedYear,
      semester: "",
      division: "",
      subject: "",
    }));
  };

  // Filter divisions based on selected semester
  const handleSemChange = (e) => {
    const selectedSemester = e.target.value;

    // Filter data for selected year and semester
    const semesterData = teacherData.filter(
      (item) =>
        item.year === attendance.year && item.semester === selectedSemester
    );
    const uniqueDivisions = [
      ...new Set(semesterData.map((item) => item.division)),
    ];

    setFilteredData((prev) => ({
      ...prev,
      divisions: uniqueDivisions,
      subjects: [],
    }));

    setAttendance((prev) => ({
      ...prev,
      semester: selectedSemester,
      division: "",
      subject: "",
    }));
  };

  // Filter subjects based on selected division
  const handleDivisionChange = async (e) => {
    const selectedDivision = e.target.value;

    // Filter data for selected year, semester and division
    const divisionData = teacherData.find(
      (item) =>
        item.year === attendance.year &&
        item.semester === attendance.semester &&
        item.division === selectedDivision
    );

    const divisionSubjects = divisionData?.subjects || [];

    setFilteredData((prev) => ({
      ...prev,
      subjects: divisionSubjects,
    }));

    setAttendance((prev) => ({
      ...prev,
      division: selectedDivision,
      subject: divisionSubjects.length > 0 ? divisionSubjects[0] : "",
    }));

    // Fetch students for the selected division
    await fetchStudents(selectedDivision);
  };

  const handleSubjectChange = (e) => {
    setAttendance((prev) => ({
      ...prev,
      subject: e.target.value,
    }));
  };


  useEffect(() => {
    if (user?.id) {
      fetchTeacherSubjects();
    }
  }, [user]);

    const toggleAndSaveAttendance = async (studentId) => {
    // Optimistically update UI first
    setAttendance((prev) => {
      const updatedStudents = prev.students.map((student) =>
        student.studentId === studentId
          ? { ...student, isPresent: !student.isPresent }
          : student
      );

      return {
        ...prev,
        students: updatedStudents,
      };
    });
  };

  const handleTopicChange = (e) => {
    setAttendance((prev) => ({
      ...prev,
      topicName: e.target.value,
    }));
  };

  const handleDateChange = (e) => {
    setAttendance((prev) => ({
      ...prev,
      date: e.target.value,
    }));
  };

  const filteredStudents = allStudents.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email &&
        student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentAttendance = (studentId) => {
    const record = attendance.students.find((s) => s.studentId === studentId);
    return record ? record.isPresent : true;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = async () => {
    const confirmed = window.confirm(
      `Save attendance for ${formatDate(attendance.date)}?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/teachers/${user.id}/dashboard/attendance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...attendance,
            teacher: user.id,
          }),
        }
      );

      if (response.ok) {
        toast.success(`Attendance saved for ${formatDate(attendance.date)}`);
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-indigo-700">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <Toaster/>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {attendance.subject} - {attendance.topicName}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>Faculty: {user?.name || ""}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Execution Date: {attendance.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Timings: 08:30-09:30, 13:15-14:15, 14:15-15:30</span>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {filteredStudents.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <User className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Present</p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {attendance.students.filter((s) => s.isPresent).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Check className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Absent</p>
                <p className="text-2xl font-bold text-red-700 mt-1">
                  {attendance.students.filter((s) => !s.isPresent).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <X className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={attendance.year}
                onChange={handleYearChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="FY">FY</option>
                <option value="SY">SY</option>
                <option value="TY">TY</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                value={attendance.semester}
                onChange={handleSemChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Semester</option>
                {filteredData.semesters.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
              <select
                value={attendance.division}
                onChange={handleDivisionChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Division</option>
                {filteredData.divisions.map((div) => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={attendance.subject}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Students List</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400 h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isPresent = getStudentAttendance(student.id);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="text-gray-500 h-5 w-5" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.fullName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isPresent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {isPresent ? "Present" : "Absent"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleAndSaveAttendance(student.id)}
                            className={`p-2 rounded-md ${
                              isPresent 
                                ? "bg-green-100 text-green-600 hover:bg-green-200" 
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                            }`}
                          >
                            {isPresent ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-10 w-10 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-700">No students found</h3>
                        <p className="text-gray-500 mt-1">
                          Try adjusting your search or filter
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;