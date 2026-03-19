"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  BookOpen,
  FileText,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  Users,
  GraduationCap,
  Bookmark,
  Hash,
  AlertCircle,
  CheckCircle,
  Eye,
  MoreVertical,
} from "lucide-react";
import { useSession } from "@/context/SessionContext";

function ExamModal({
  isOpen,
  onClose,
  onSave,
  selectedSubject,
  loading = false,
  teacherId,
}) {
  const [examData, setExamData] = useState({
    type: "",
    subject: selectedSubject?.name || "",
    totalMarks: "",
    date: "",
    duration: "",
    year: selectedSubject?.year || "",
    semester: selectedSubject?.semester || "",
    division: selectedSubject?.division || "",
    resultPublished: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedSubject) {
      setExamData((prev) => ({
        ...prev,
        subject: selectedSubject.name,
        year: selectedSubject.year,
        semester: selectedSubject.semester,
        division: selectedSubject.division,
      }));
    }
  }, [selectedSubject]);

  const validateForm = () => {
    const newErrors = {};

    if (!examData.type.trim()) newErrors.type = "Exam type is required";
    if (!examData.subject.trim()) newErrors.subject = "Subject is required";
    if (!examData.totalMarks || examData.totalMarks <= 0)
      newErrors.totalMarks = "Valid total marks required";
    if (!examData.date) newErrors.date = "Date is required";
    if (!examData.duration || examData.duration <= 0)
      newErrors.duration = "Valid duration required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({ ...examData, teacherId });
    }
  };

  const handleInputChange = (field, value) => {
    setExamData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <BookOpen className="mr-2" size={20} />
            Create New Exam
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Type *
            </label>
            <select
              value={examData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.type ? "border-red-500" : "border-gray-300"
                }`}
              disabled={loading}
            >
              <option value="">Select exam type</option>
              <option value="Unit Test 1">Unit Test 1</option>
              <option value="Unit Test 2">Unit Test 2</option>
              <option value="Mid Term">Surprise Test</option>
              <option value="Assignment">Assignment</option>
              <option value="Quiz">Quiz</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.type}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={examData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.subject ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Enter subject name"
              disabled={loading}
              readOnly={selectedSubject?.name}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Hash size={16} className="mr-1" />
              Total Marks *
            </label>
            <input
              type="number"
              value={examData.totalMarks}
              onChange={(e) => handleInputChange("totalMarks", e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.totalMarks ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Enter total marks"
              min="1"
              disabled={loading}
            />
            {errors.totalMarks && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.totalMarks}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar size={16} className="mr-1" />
              Exam Date *
            </label>
            <input
              type="date"
              value={examData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? "border-red-500" : "border-gray-300"
                }`}
              disabled={loading}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.date}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Clock size={16} className="mr-1" />
              Duration (minutes) *
            </label>
            <input
              type="number"
              value={examData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.duration ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Enter duration in minutes"
              min="1"
              disabled={loading}
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.duration}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <CheckCircle size={16} className="mr-1" />
              Publish Results
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={examData.resultPublished}
                onChange={(e) => handleInputChange("resultPublished", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-600">
                {examData.resultPublished
                  ? "Results will be visible to students"
                  : "Results will be hidden from students"}
              </span>
            </div>
          </div>

          {selectedSubject && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700 font-medium">
                Academic Information
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-blue-600">
                <div className="flex items-center">
                  <GraduationCap size={14} className="mr-1" />
                  <span>Year {selectedSubject.year}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen size={14} className="mr-1" />
                  <span>Semester {selectedSubject.semester}</span>
                </div>
                <div className="flex items-center">
                  <Users size={14} className="mr-1" />
                  <span>Division {selectedSubject.division}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors disabled:opacity-50 font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-1" />
                  Create Exam
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ExamManagement() {
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { user } = useSession();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    answer: 0,
    marks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [showExamModal, setShowExamModal] = useState(false);
  const [examLoading, setExamLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/teachers/${user.id}/dashboard`);
        const data = await response.json();

        if (data) {
          const transformedSubjects = [];
          let subjectId = 1;

          data.mySubjects.forEach((subjectGroup, groupIndex) => {
            subjectGroup.subjects.forEach((subjectName, subjectIndex) => {
              transformedSubjects.push({
                id: subjectId++,
                name: subjectName,
                description: `${subjectGroup.year}, ${subjectGroup.semester}, Division ${subjectGroup.division}`,
                year: subjectGroup.year,
                semester: subjectGroup.semester,
                division: subjectGroup.division,
                groupId: groupIndex + 1,
                studentCount: Math.floor(Math.random() * 50) + 30,
              });
            });
          });

          setSubjects(transformedSubjects);

          const allExams = data.myExam.flatMap((examGroup) => examGroup.exams);

          const transformedExams = allExams.map((exam) => {
            const examDate = new Date(exam.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            examDate.setHours(0, 0, 0, 0);

            const diffTime = examDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let status;
            if (diffDays === 0) {
              status = "today";
            } else if (diffDays > 0) {
              status = "upcoming";
            } else {
              status = "completed";
            }

            const matchingSubject = transformedSubjects.find(
              (s) => s.name.toLowerCase() === exam.subject.toLowerCase()
            );

            return {
              ...exam,
              subjectId: matchingSubject?.id || null,
              status: status,
              resultPublished: exam.resultPublished || false,
            };
          });

          setExams(transformedExams);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchData();
    }
  }, [user]);

  const handleCreateExam = async (examData) => {
    try {
      setExamLoading(true);

      const examDate = new Date(examData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      examDate.setHours(0, 0, 0, 0);

      const diffTime = examDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let status;
      if (diffDays === 0) {
        status = "today";
      } else if (diffDays > 0) {
        status = "upcoming";
      } else {
        status = "completed";
      }

      const requestData = {
        ...examData,
        teacherId: user.id,
      };

      const response = await fetch(`/api/teachers/${user.id}/exams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create exam");
      }

      const result = await response.json();

      const newExam = {
        ...result.exam,
        subjectId: selectedSubject?.id,
        status,
      };

      setExams((prevExams) => [...prevExams, newExam]);
      setShowExamModal(false);
      setError(null);
    } catch (err) {
      setError("Error creating exam: " + err.message);
    } finally {
      setExamLoading(false);
    }
  };

  const handleToggleResultPublished = async (examId, currentStatus) => {
    try {
      setExamLoading(true);

      const response = await fetch(`/api/teachers/${user.id}/exams/${examId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resultPublished: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update result visibility");
      }

      const result = await response.json();

      setExams((prevExams) =>
        prevExams.map((exam) =>
          exam.id === examId
            ? { ...exam, resultPublished: result.exam.resultPublished }
            : exam
        )
      );
    } catch (err) {
      setError("Error updating result visibility: " + err.message);
    } finally {
      setExamLoading(false);
    }
  };

  const toggleSubjectExpansion = (subjectId) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedSubjects = [...subjects].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredSubjects = sortedSubjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExams = selectedSubject
    ? exams.filter((exam) => exam.subjectId === selectedSubject.id)
    : [];

  const filteredQuestions = selectedExam
    ? questions.filter((question) => question.examId === selectedExam.id)
    : [];

  const addQuestionToAPI = async (questionData) => {
    try {
      const requestData = {
        question: questionData.question,
        options: questionData.options.map((opt) => opt.text),
        correctOption: questionData.answer,
        examId: selectedExam.id,
        createdBy: user.id,
        marks: questionData.marks || 1,
      };

      const response = await fetch(`/api/teachers/${user.id}/exam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add question: ${response.status} ${errorData.message || "Unknown error"
          }`
        );
      }

      const responseData = await response.json();
      const data = responseData.question;

      return {
        id: data._id || data.id,
        examId: selectedExam.id,
        question: data.question,
        options: data.options || [],
        answer: data.options.findIndex((opt) => opt.isCorrect === true) !== -1 ? data.options.findIndex((opt) => opt.isCorrect === true) : 0,
        marks: data.marks,
      };
    } catch (error) {
      setError("Error adding question: " + error.message);
      throw error;
    }
  };

  const handleAddQuestion = async () => {
    const allOptionsFilled = newQuestion.options.every(
      (opt) => opt.text.trim() !== ""
    );

    if (newQuestion.question.trim() && allOptionsFilled && selectedExam) {
      try {
        setLoading(true);
        const savedQuestion = await addQuestionToAPI(newQuestion);

        setQuestions((prevQuestions) => [...prevQuestions, savedQuestion]);

        setNewQuestion({
          question: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
          answer: 0,
          marks: 0,
        });
        setIsAddingQuestion(false);
      } catch (error) {
        console.error("Error in handleAddQuestion:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please fill in all fields and select an exam");
    }
  };

  const fetchQuestionsForExam = async () => {
    if (!selectedExam) {
      setQuestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/teachers/${user.id}/exam`);

      if (response.ok) {
        const questionsData = await response.json();
        const queData = questionsData.questions;

        const transformedQuestions = queData.map((q) => ({
          id: q._id || q.id,
          examId: q.examId || selectedExam.id,
          question: q.questionText || q.question,
          options: q.options || [],
          answer: q.options.findIndex((opt) => opt.isCorrect === true) || 0,
          marks: q.marks || 1,
        }));

        setQuestions(transformedQuestions);
      } else {
        setError("Failed to fetch questions");
        setQuestions([]);
      }
    } catch (err) {
      setError("Error fetching questions: " + err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionsForExam();
  }, [selectedExam, user?.id]);

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = { ...updatedOptions[index], text: value };
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleAnswerChange = (index) => {
    const updatedOptions = newQuestion.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
      answer: index,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
        <p className="text-gray-600 mt-1">
          Create and manage exams for your subjects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <BookOpen className="mr-2" size={20} /> Subjects
            </h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="p-2 border rounded-lg hover:bg-gray-50"
                onClick={() => handleSort("name")}
              >
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredSubjects.map((subject) => (
              <div
                key={subject.id}
                className={`rounded-lg transition-all overflow-hidden ${selectedSubject?.id === subject.id
                    ? "ring-2 ring-blue-500 shadow-md"
                    : "bg-white border border-gray-200 hover:shadow-md"
                  }`}
              >
                <div
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    setSelectedSubject(subject);
                    setSelectedExam(null);
                    toggleSubjectExpansion(subject.id);
                  }}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {subject.description}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Users size={14} className="mr-1" />
                      <span className="mr-3">
                        {subject.studentCount} students
                      </span>
                      <GraduationCap size={14} className="mr-1" />
                      <span>Year {subject.year}</span>
                    </div>
                  </div>
                  <div>
                    {expandedSubjects[subject.id] ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>

                {expandedSubjects[subject.id] && (
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        Exams: {filteredExams.length}
                      </span>
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        onClick={() => {
                          setShowExamModal(true);
                        }}
                      >
                        <Plus size={16} className="mr-1" />
                        New Exam
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredSubjects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "No subjects match your search."
                  : "No subjects available."}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FileText className="mr-2" size={20} />
              {selectedSubject ? `Exams for ${selectedSubject.name}` : "Exams"}
            </h2>
            {selectedSubject && (
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center text-sm hover:bg-blue-700 transition-colors font-medium"
                onClick={() => setShowExamModal(true)}
              >
                <Plus size={16} className="mr-1" /> Create Exam
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredExams.map((exam) => {
              const formattedDate = new Date(exam.date).toLocaleDateString(
                "en-GB"
              );
              const subject = subjects.find((s) => s.id === exam.subjectId);
              return (
                <div
                  key={exam.id}
                  className={`rounded-lg transition-all overflow-hidden ${selectedExam?.id === exam.id
                      ? "ring-2 ring-blue-500 shadow-md"
                      : "bg-white border border-gray-200 hover:shadow-md"
                    }`}
                  onClick={() => setSelectedExam(exam)}
                >
                  <div className="p-4 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 flex items-center">
                          {exam.type || exam.name || `Exam ${exam.id}`}
                          <span
                            className={`ml-2 text-xs px-2 py-1 rounded-full ${exam.status === "upcoming"
                                ? "bg-yellow-100 text-yellow-800"
                                : exam.status === "today"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                          >
                            {exam.status === "upcoming"
                              ? "Upcoming"
                              : exam.status === "today"
                                ? "Today"
                                : "Completed"}
                          </span>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {subject?.name || "Unknown Subject"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{exam.duration} mins</span>
                      </div>
                    </div>

                    <div className="flex justify-end items-center mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
                        Total Marks: {exam.totalMarks}
                      </div>
                      <div className="ml-2 flex items-center">
                        <label className="text-xs font-medium text-gray-600 mr-2">
                          Results Published:
                        </label>
                        <input
                          type="checkbox"
                          checked={exam.resultPublished}
                          onChange={() =>
                            handleToggleResultPublished(exam.id, exam.resultPublished)
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          disabled={examLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredExams.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {selectedSubject
                  ? "No exams for this subject yet. Create your first exam!"
                  : "Select a subject to view exams."}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedExam ? `Questions for ${selectedExam.type}` : "Questions"}
          </h2>
          {selectedExam ? (
            <span className="bg-blue-100 p-0.5 px-6 rounded-xl text-blue-600">{`Total No Of Question: ${filteredQuestions.length}`}</span>
          ) : (
            ""
          )}
          <button
            onClick={() => setIsAddingQuestion(true)}
            disabled={!selectedExam}
            className={`px-4 py-2 rounded-lg flex items-center font-medium ${selectedExam
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
          >
            <Plus size={18} className="mr-1" /> Add Question
          </button>
        </div>

        {isAddingQuestion && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-blue-800 flex items-center">
                <Bookmark size={16} className="mr-1" />
                Add Question to {selectedExam.type}
              </h3>
              <div className="flex items-center">
                <label htmlFor="marks" className="text-sm text-gray-600 mr-2">
                  Marks:
                </label>
                <input
                  type="number"
                  id="marks"
                  min="1"
                  value={newQuestion.marks}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      marks: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-16 p-1 border rounded text-sm"
                />
              </div>
            </div>
            <textarea
              placeholder="Enter your question"
              className="w-full p-3 mb-3 border rounded-lg h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newQuestion.question}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, question: e.target.value })
              }
            />

            <h4 className="font-medium text-gray-700 text-sm mb-2">Options:</h4>
            {newQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={newQuestion.answer === index}
                  onChange={() => handleAnswerChange(index)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </div>
            ))}

            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => setIsAddingQuestion(false)}
                className="px-3 py-2 border rounded-lg flex items-center hover:bg-gray-50 text-gray-700 font-medium"
              >
                <X size={16} className="mr-1" /> Cancel
              </button>
              <button
                onClick={handleAddQuestion}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center font-medium"
              >
                <Save size={16} className="mr-1" /> Save Question
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredQuestions.map((question, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800 w-[720px]">
                  <span className="bg-blue-100 text-blue-800 rounded-full h-6 w-6 inline-flex items-center justify-center text-sm mr-2">
                    {index + 1}
                  </span>
                  {question.question}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {question.marks} marks
                  </span>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                {question.options.map((option, optIndex) => {
                  const optionText =
                    typeof option === "string" ? option : option.text;
                  const optionId =
                    typeof option === "object" ? option._id || optIndex : optIndex;

                  return (
                    <div
                      key={optionId}
                      className={`p-3 rounded-lg text-sm flex items-center ${question.answer === optIndex
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-white border border-gray-200"
                        }`}
                    >
                      <span className="font-medium mr-2">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      <span>{optionText}</span>
                      {question.answer === optIndex && (
                        <CheckCircle size={16} className="ml-auto text-green-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {selectedExam
                ? "No questions added to this exam yet. Add your first question!"
                : "Select an exam to view and manage its questions."}
            </div>
          )}
        </div>
      </div>

      <ExamModal
        isOpen={showExamModal}
        onClose={() => setShowExamModal(false)}
        onSave={handleCreateExam}
        selectedSubject={selectedSubject}
        loading={examLoading}
        teacherId={user?.id}
      />
    </div>
  );
}