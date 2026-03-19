"use client"

import { useState, useEffect } from "react";
import {
  ClipboardList,
  BookOpen,
  Users,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  FileText,
  Download,
  Printer,
  Plus,
  Edit,
  Trash2,
  Clock,
  Home,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { useSession } from "@/context/SessionContext";
import toast, { Toaster } from "react-hot-toast";

export default function MarksPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useSession()

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage] = useState(5)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState(null)
  const [marks, setMarks] = useState({
    subject: "",
    students: [],
    division: "",
    year: "",
    semester: "",
    department: "",
    examId: "",
    examType: "",
    examDate: "",
  })
  const [teacherData, setTeacherData] = useState([])
  const [filteredData, setFilteredData] = useState({
    years: [],
    semesters: [],
    divisions: [],
    subjects: [],
  })
  const [allStudents, setAllStudents] = useState([])
  const [exams, setExams] = useState([])

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // Filter students based on search term
  const filteredStudents = allStudents.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate average marks
  const averageMarks =
    filteredStudents.length > 0
      ? Math.round(filteredStudents.reduce((acc, student) => acc + (student.marks || 0), 0) / filteredStudents.length)
      : 0

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleEditStudent = (student) => {
    setCurrentStudent({ ...student })
    setIsEditModalOpen(true)
  }

  const saveMarksToDatabase = async (updatedStudents) => {
    try {
      setLoading(true)

      const marksData = {
        department: marks.department,
        year: marks.year,
        semester: marks.semester,
        division: marks.division,
        subject: marks.subject,
        examId: marks.examId,
        students: updatedStudents.map((student) => ({
          studentId: student._id || student.id,
          marks: student.marks || 0,
        })),
      }

      console.log("Marks Data : ", marksData)

      const response = await fetch(`/api/teachers/${user.id}/dashboard/result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(marksData),
      })

      const result = await response.json()

      console.log(result)

      if (!response.ok) {
        throw new Error(result.error || "Failed to save marks")
      }

      // Update local state with the new marks from response
      setAllStudents((prevStudents) =>
        prevStudents.map((student) => {
          const updatedStudent = result.data?.years
            ?.find((y) => y.year === marks.year)
            ?.semesters?.find((s) => s.semester === marks.semester)
            ?.divisions?.find((d) => d.name === marks.division)
            ?.subjects?.find((sub) => sub.name === marks.subject)
            ?.exams?.find((e) => e._id === marks.examId)
            ?.result?.find((r) => r.student.toString() === student._id || r.student.toString() === student.id)

          return updatedStudent
            ? {
                ...student,
                marks: updatedStudent.marks,
              }
            : student
        }),
      )

      toast.success("Marks saved successfully!")
    } catch (error) {
      console.error("Error saving marks:", error)
      setError(error.message)
      toast.error(`Error saving marks: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async (updatedStudent) => {
    try {
      setLoading(true)

      // Compute the new allStudents array with the updated student
      const newAllStudents = allStudents.map((student) =>
        student.id === updatedStudent.id ? { ...updatedStudent } : student,
      )

      // Update allStudents state
      setAllStudents(newAllStudents)

      // Sync marks.students with the new allStudents
      setMarks((prev) => ({
        ...prev,
        students: newAllStudents.map((student) => ({
          studentId: student.id,
          schoolId: student.studentId,
          marks: student.marks || 0,
          attendance: student.attendance || false,
        })),
      }))

      // Save to database using the newAllStudents
      await saveMarksToDatabase(newAllStudents)

      setIsEditModalOpen(false)
      setCurrentStudent(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async (division) => {
    try {
      setLoading(true)
      const url = `/api/teachers/${user.id}/students?division=${division}&year=${marks.year}&semester=${marks.semester}${
        marks.subject ? `&subject=${marks.subject}` : ""
      }${marks.examId ? `&examId=${marks.examId}` : ""}`

      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch Students")
      const { students } = await res.json()

      // Initialize students with marks default to 0 if not present
      const initializedStudents = students.map((student) => ({
        ...student,
        marks: student.marks || 0,
        attendance: student.attendance || false,
      }))

      setAllStudents(initializedStudents)
      setMarks((prev) => ({
        ...prev,
        students: initializedStudents.map((student) => ({
          studentId: student.id,
          schoolId: student.studentId,
          marks: student.marks || 0,
          attendance: student.attendance || false,
        })),
      }))
    } catch (err) {
      console.error("Error fetching students:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeacherSubjects = async () => {
  try {
    setLoading(true);
    const res = await fetch(`/api/teachers/${user.id}/dashboard`);
    if (!res.ok) throw new Error("Failed to fetch Teacher's Subjects");
    const data = await res.json();

    const teacherSubjects = data.mySubjects || [];
    const departmentsData = data.teacher || [];
    const department = departmentsData.department;

    // Combine all exams from data.myExam into a single array
    const allExams = data.myExam?.flatMap((examGroup) => examGroup.exams || []) || [];

    console.log("All Exams:", allExams);
    setTeacherData(teacherSubjects);
    setExams(allExams); // Store all exams in state

    const uniqueYears = [...new Set(teacherSubjects.map((item) => item.year))];

    setFilteredData((prev) => ({
      ...prev,
      years: uniqueYears,
    }));

    setMarks((prev) => ({
      ...prev,
      department: department,
    }));

    return teacherSubjects;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    setError(error.message);
    throw error;
  } finally {
    setLoading(false);
  }
};
  const handleYearChange = (e) => {
    const selectedYear = e.target.value

    const yearData = teacherData.filter((item) => item.year === selectedYear)
    const uniqueSemesters = [...new Set(yearData.map((item) => item.semester))]

    setFilteredData((prev) => ({
      ...prev,
      semesters: uniqueSemesters,
      divisions: [],
      subjects: [],
    }))

    setMarks((prev) => ({
      ...prev,
      year: selectedYear,
      semester: "",
      division: "",
      subject: "",
      examId: "",
    }))
  }

  const handleSemChange = (e) => {
    const selectedSemester = e.target.value

    const semesterData = teacherData.filter((item) => item.year === marks.year && item.semester === selectedSemester)
    const uniqueDivisions = [...new Set(semesterData.map((item) => item.division))]

    setFilteredData((prev) => ({
      ...prev,
      divisions: uniqueDivisions,
      subjects: [],
    }))

    setMarks((prev) => ({
      ...prev,
      semester: selectedSemester,
      division: "",
      subject: "",
      examId: "",
    }))
  }

  const handleDivisionChange = async (e) => {
    const selectedDivision = e.target.value

    const divisionData = teacherData.find(
      (item) => item.year === marks.year && item.semester === marks.semester && item.division === selectedDivision,
    )

    const divisionSubjects = divisionData?.subjects || []

    setFilteredData((prev) => ({
      ...prev,
      subjects: divisionSubjects,
    }))

    setMarks((prev) => ({
      ...prev,
      division: selectedDivision,
      subject: divisionSubjects.length > 0 ? divisionSubjects[0] : "",
      examId: "",
    }))

    await fetchStudents(selectedDivision)
  }

  const getExamsForSubject = (subject) => {
    console.log("eeeeee =", exams)
    const examsResult = exams.filter((exam) => exam.subject === subject)
    console.log("Exams for subject:", subject, examsResult)
    return examsResult
  }

  const handleSubjectChange = (subject) => {
    setMarks((prev) => ({
      ...prev,
      subject,
      examId: "",
    }))
    setCurrentPage(1)
  }

  useEffect(() => {
    if (user?.id) {
      fetchTeacherSubjects()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="text-indigo-600 text-lg">Loading student data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-indigo-50">
      <Toaster/>
      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-indigo-900">Student's Marks</h2>
            <p className="text-indigo-600 mt-1">Manage and update student grades</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-500 font-medium">Current Subject</p>
                <h3 className="text-2xl font-bold text-indigo-900 mt-1">{marks.subject || "Not selected"}</h3>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-500 font-medium">Total Students</p>
                <h3 className="text-2xl font-bold text-indigo-900 mt-1">{filteredStudents.length}</h3>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-500 font-medium">Average Marks</p>
                <h3 className="text-2xl font-bold text-indigo-900 mt-1">{averageMarks}</h3>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-indigo-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-indigo-700 mb-1">Year</label>
                <select
                  value={marks.year}
                  onChange={handleYearChange}
                  className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">Select Year</option>
                  {filteredData.years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Home className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-indigo-700 mb-1">Semester</label>
                <select
                  value={marks.semester}
                  onChange={handleSemChange}
                  disabled={!marks.year}
                  className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white disabled:opacity-50"
                >
                  <option value="">Select Semester</option>
                  {filteredData.semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Home className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-indigo-700 mb-1">Division</label>
                <select
                  value={marks.division}
                  onChange={handleDivisionChange}
                  disabled={!marks.semester}
                  className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white disabled:opacity-50"
                >
                  <option value="">Select Division</option>
                  {filteredData.divisions.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-indigo-700 mb-1">Subject</label>
                <select
                  value={marks.subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  disabled={!marks.division}
                  className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white disabled:opacity-50"
                >
                  <option value="">Select Subject</option>
                  {filteredData.subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-indigo-700 mb-1">Exam</label>
                <select
                  value={marks.examId}
                  onChange={(e) => {
                    const selectedExam = exams.find((exam) => exam.id === e.target.value)
                    setMarks((prev) => ({
                      ...prev,
                      examId: e.target.value,
                      examType: selectedExam?.type || "",
                      examDate: selectedExam?.date || "",
                    }))
                  }}
                  disabled={!marks.subject}
                  className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white disabled:opacity-50"
                >
                  <option value="">Select Exam</option>
                  {getExamsForSubject(marks.subject).map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.type} - {new Date(exam.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-800"
              />
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-indigo-100">
              <thead className="bg-indigo-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider"
                  >
                    Student
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider"
                  >
                    Student Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider"
                  >
                    Marks
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider"
                  >
                    Grade
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider"
                  >
                    Attendance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-indigo-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-indigo-100">
                {currentStudents.length > 0 ? (
                  currentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-indigo-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                            {student.fullName?.charAt(0) || "?"}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-indigo-900">{student.fullName || "Unknown"}</div>
                            <div className="text-sm text-indigo-500">{student.email || ""}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-800">
                        {student.studentId || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-900">
                        {student.marks !== undefined ? student.marks : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            student.grade === "A+"
                              ? "bg-green-100 text-green-800"
                              : student.grade === "A"
                                ? "bg-blue-100 text-blue-800"
                                : student.grade === "B+"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : student.grade === "B"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {student.grade || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-800">
                        {student.attendance ? "Present" : "Absent"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-indigo-500">
                      No students found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
            <div className="text-sm text-indigo-700 mb-4 md:mb-0">
              Showing <span className="font-medium">{indexOfFirstStudent + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastStudent, filteredStudents.length)}</span> of{" "}
              <span className="font-medium">{filteredStudents.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === number
                      ? "bg-indigo-600 text-white"
                      : "border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Edit Student Modal */}
      {isEditModalOpen && currentStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-indigo-900 mb-4">Edit Student</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={currentStudent.fullName || ""}
                    onChange={(e) =>
                      setCurrentStudent({
                        ...currentStudent,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Student Id</label>
                  <input
                    type="text"
                    value={currentStudent.studentId || ""}
                    onChange={(e) =>
                      setCurrentStudent({
                        ...currentStudent,
                        studentId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Marks</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentStudent.marks ?? ""}
                    onChange={(e) =>
                      setCurrentStudent({
                        ...currentStudent,
                        marks: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Grade</label>
                  <select
                    value={currentStudent.grade || ""}
                    onChange={(e) =>
                      setCurrentStudent({
                        ...currentStudent,
                        grade: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Grade</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Attendance</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="attendance"
                        checked={currentStudent.attendance === true}
                        onChange={() =>
                          setCurrentStudent({
                            ...currentStudent,
                            attendance: true,
                          })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-indigo-700">Present</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="attendance"
                        checked={currentStudent.attendance === false}
                        onChange={() =>
                          setCurrentStudent({
                            ...currentStudent,
                            attendance: false,
                          })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-indigo-700">Absent</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveChanges(currentStudent)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
