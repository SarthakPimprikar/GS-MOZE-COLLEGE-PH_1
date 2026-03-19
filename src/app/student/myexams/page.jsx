"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  BookOpenCheck,
  AlertCircle,
  CheckCircle,
  Loader2,
  Filter,
  Search,
  Calendar,
  Eye,
  Trophy,
  Play,
  XCircle,
} from "lucide-react";
import { useSession } from "@/context/SessionContext";
import Link from "next/link";

function formatDate(isoDate) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(isoDate).toLocaleDateString(undefined, options);
}

function getExamStatus(exam, studentId) {
  const now = new Date();
  const examDate = new Date(exam.date);
  const examStartOfDay = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate());
  const nowStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const timeDiff = examStartOfDay - nowStartOfDay;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // Check if student has a result entry
  const studentResult = exam.result?.find((result) => result.student.toString() === studentId);

  // If exam is in the past
  if (days < 0 || (days === 0 && studentResult)) {
    if (studentResult) {
      if (studentResult.isAttend) {
        return { status: "completed", color: "green", bgColor: "bg-green-50" };
      } else {
        return { status: "missed", color: "red", bgColor: "bg-red-50" };
      }
    }
    return { status: "missed", color: "red", bgColor: "bg-red-50" };
  }

  // If exam is today or in the future
  if (days === 0) return { status: "today", color: "rose", bgColor: "bg-rose-50" };
  if (days <= 3) return { status: "urgent", color: "red", bgColor: "bg-red-50" };
  if (days <= 7) return { status: "soon", color: "yellow", bgColor: "bg-yellow-50" };
  return { status: "upcoming", color: "blue", bgColor: "bg-maroon-50/50" };
}

function getTimeUntilExam(examDate) {
  const now = new Date();
  const exam = new Date(examDate);
  const examStartOfDay = new Date(exam.getFullYear(), exam.getMonth(), exam.getDate());
  const nowStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const timeDiff = examStartOfDay - nowStartOfDay;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (days < 0) return "Past";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `${days} days`;
  return `${days} days`;
}

function isToday(date) {
  const today = new Date();
  const examDate = new Date(date);
  return (
    examDate.getDate() === today.getDate() &&
    examDate.getMonth() === today.getMonth() &&
    examDate.getFullYear() === today.getFullYear()
  );
}

function getStudentResult(exam, studentId) {
  if (!exam.resultPublished || !exam.result || !Array.isArray(exam.result) || !studentId) {
    return null;
  }
  return exam.result.find((result) => result.student.toString() === studentId);
}

export default function ExamsPage() {
  const { user } = useSession();
  const studentId = user?.id;
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        if (!studentId) return;
        const res = await fetch(`/api/students/${studentId}/academics`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch");

        const academic = data.academic;
        const division = academic?.years?.[0]?.divisions?.[0];
        const examsArray = division?.exams || [];

        setExams(examsArray);
      } catch (err) {
        console.error("Error fetching exams:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [studentId]);

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.type.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;

    const status = getExamStatus(exam, studentId).status;
    return matchesSearch && status === filterStatus;
  });

  const upcomingCount = exams.filter((exam) => {
    const status = getExamStatus(exam, studentId).status;
    return status !== "completed" && status !== "missed" && status !== "past";
  }).length;

  const urgentCount = exams.filter((exam) => {
    const status = getExamStatus(exam, studentId).status;
    return status === "today" || status === "urgent";
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-moze-primary mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Exams
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50/30 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-maroon-50 text-moze-primary rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium">
                    Total Exams
                  </div>
                  <div className="text-3xl font-serif font-bold text-gray-800">
                    {exams.length}
                  </div>
                </div>
                <div className="p-3 bg-moze-primary rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-green-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium">
                    Upcoming
                  </div>
                  <div className="text-3xl font-serif font-bold text-gray-800">
                    {upcomingCount}
                  </div>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-purple-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium">
                    Urgent
                  </div>
                  <div className="text-3xl font-serif font-bold text-gray-800">
                    {urgentCount}
                  </div>
                </div>
                <div className="p-3 bg-purple-500 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search exams by subject or type..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-transparent appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Exams</option>
                <option value="today">Today</option>
                <option value="urgent">Urgent</option>
                <option value="soon">This Week</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moze-primary mx-auto mb-4"></div>
              <div className="text-gray-600">Loading your exams...</div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <div className="text-red-600 font-semibold">Error: {error}</div>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <BookOpenCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-600">
                {searchTerm || filterStatus !== "all"
                  ? "No exams match your search criteria."
                  : "No upcoming exams."}
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredExams.map((exam) => {
                const examStatus = getExamStatus(exam, studentId);
                const timeUntil = getTimeUntilExam(exam.date);
                const studentResult = getStudentResult(exam, studentId);
                const examIsToday = isToday(exam.date);
                const isExamAvailable =
                  examIsToday &&
                  examStatus.status !== "completed" &&
                  examStatus.status !== "missed";

                return (
                  <div
                    key={exam._id}
                    className={`bg-white rounded-2xl shadow-lg border-l-4 border-${examStatus.color}-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${examStatus.bgColor}`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 bg-${examStatus.color}-100 rounded-lg`}
                          >
                            <BookOpenCheck
                              className={`w-5 h-5 text-${examStatus.color}-600`}
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-serif font-bold text-gray-800">
                              {exam.subject}
                            </h3>
                            <p className="text-gray-600 font-medium">
                              {exam.type}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold bg-${examStatus.color}-100 text-${examStatus.color}-800`}
                        >
                          {timeUntil}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="flex items-center gap-2 text-gray-700">
                          <CalendarDays className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">
                            {formatDate(exam.date)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">
                            Total Marks: {exam.totalMarks}
                          </span>
                        </div>

                        <div className="flex justify-end">
                          {examStatus.status === "completed" && exam.resultPublished ? (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 px-3 py-2 bg-maroon-50 text-moze-primary text-blue-700 rounded-lg">
                                <Trophy className="w-4 h-4" />
                                <span className="font-semibold text-sm">
                                  {studentResult?.marks ?? "N/A"}/{exam.totalMarks}
                                </span>
                              </div>
                            </div>
                          ) : examStatus.status === "completed" && !exam.resultPublished ? (
                            <div className="text-gray-500 text-sm font-medium">
                              Results not yet published
                            </div>
                          ) : examStatus.status === "missed" ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                              <XCircle className="w-4 h-4" />
                              <span>You missed this exam</span>
                            </div>
                          ) : examStatus.status === "today" ||
                            (isToday(exam.date) &&
                              examStatus.status !== "completed" &&
                              examStatus.status !== "missed") ? (
                            <Link
                              href={`/student/myexams/${exam._id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Play className="w-4 h-4" />
                              <span>Attend Exam</span>
                            </Link>
                          ) : (
                            <div className="text-gray-500 text-sm font-medium">
                              Available on {formatDate(exam.date)}
                            </div>
                          )}
                        </div>
                      </div>

                      {(examStatus.status === "urgent" ||
                        examStatus.status === "today") && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {examStatus.status === "today"
                                ? "Exam is today! Make sure you're prepared."
                                : "Exam is coming up soon! Make sure you're prepared."}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}