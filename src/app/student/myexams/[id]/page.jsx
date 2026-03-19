"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import {
  Loader2,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useSession();
  const studentId = user?.id;
  const [exam, setExam] = useState(null);
  const [examInfo, setExamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [warningShown, setWarningShown] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [timeUp, setTimeUp] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [examAlreadyTaken, setExamAlreadyTaken] = useState(false);
  const [previousScore, setPreviousScore] = useState(null);
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // First check if exam was already taken
        const checkRes = await fetch(`/api/students/myexams?examId=${id}&studentId=${studentId}`);
        const checkData = await checkRes.json();

        if (checkRes.ok && checkData.alreadyTaken) {
          setExamAlreadyTaken(true);
          setPreviousScore(checkData.score);
          setExamInfo(checkData.examInfo || { totalMarks: 0 });
          setLoading(false);
          return;
        }

        // Fetch exam questions
        const examRes = await fetch(`/api/students/myexams/${id}`);
        const examData = await examRes.json();


        if (!examRes.ok)
          throw new Error(examData.error || "Failed to fetch exam");

        // Fetch exam info
        if (studentId) {
          const infoRes = await fetch(`/api/students/${studentId}/academics`);
          const infoData = await infoRes.json();

          if (!infoRes.ok)
            throw new Error(infoData.error || "Failed to fetch exam info");

          const academic = infoData.academic;
          const division = academic?.years?.[0]?.divisions?.[0];
          const examsArray = division?.exams || [];
          const examId = Array.isArray(id) ? id[0] : id;
          const selectedExam = examsArray.find((e) => e._id === examId);

          setExam(examData.exam);
          setExamInfo(selectedExam || null);

          if (selectedExam) {
            setTimeLeft(selectedExam.duration * 60);
            setExamStarted(true);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, studentId]);

  useEffect(() => {
    if (!examStarted || timeLeft === null || timeLeft <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;

        if (newTime === 300 && !warningShown) {
          setWarningShown(true);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [examStarted, timeLeft, warningShown]);

  useEffect(() => {
    if (examStarted && timeLeft === 0 && !timeUp && !hasAutoSubmitted.current) {
      setTimeUp(true);
      hasAutoSubmitted.current = true;
      handleAutoSubmit();
    }
  }, [timeLeft, timeUp, examStarted]);

  const handleAutoSubmit = async () => {
    if (submitting || submissionResult) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/students/myexams/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: user.id,
          answers,
          autoSubmitted: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.score !== undefined) {
          setSubmissionResult({
            score: data.score,
            totalMarks: examInfo?.totalMarks || data.totalMarks || 0,
            percentage: calculatePercentage(data.score, examInfo?.totalMarks || data.totalMarks || 0),
            message: "Time's up! Exam auto-submitted",
            alreadySubmitted: true,
          });
          setShowResultModal(true);
          return;
        }
        throw new Error(data.error || "Failed to submit exam");
      }

      setSubmissionResult({
        score: data.score,
        totalMarks: examInfo?.totalMarks || data.totalMarks || 0,
        percentage: calculatePercentage(data.score, examInfo?.totalMarks || data.totalMarks || 0),
        message: "Time's up! Exam auto-submitted",
        alreadySubmitted: false,
      });
      setShowResultModal(true);
    } catch (err) {
      console.error("Error auto-submitting exam:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const calculatePercentage = (score, totalMarks) => {
    if (!totalMarks || totalMarks === 0) return 0;
    return ((score / totalMarks) * 100).toFixed(2);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/students/myexams/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: user.id,
          answers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.score !== undefined) {
          setSubmissionResult({
            score: data.score,
            totalMarks: examInfo?.totalMarks || data.totalMarks || 0,
            percentage: calculatePercentage(data.score, examInfo?.totalMarks || data.totalMarks || 0),
            message: "You have already taken this exam",
            alreadySubmitted: true,
          });
          setShowResultModal(true);
          return;
        }
        throw new Error(data.error || "Failed to submit exam");
      }

      setSubmissionResult({
        score: data.score,
        totalMarks: examInfo?.totalMarks || data.totalMarks || 0,
        percentage: calculatePercentage(data.score, examInfo?.totalMarks || data.totalMarks || 0),
        message: "Exam submitted successfully",
        alreadySubmitted: false,
      });
      setShowResultModal(true);
    } catch (err) {
      console.error("Error submitting exam:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseResult = () => {
    setShowResultModal(false);
    setSubmissionResult(null);
    router.push("/student/myexams");
  };

  const ResultDisplay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-full ${submissionResult.alreadySubmitted
                ? "bg-yellow-100"
                : "bg-green-100"
              } flex items-center justify-center mx-auto mb-4`}
          >
            {submissionResult.alreadySubmitted ? (
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            ) : (
              <CheckCircle className="w-8 h-8 text-green-600" />
            )}
          </div>

          <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">
            {submissionResult.alreadySubmitted
              ? "Exam Already Submitted"
              : submissionResult.message.includes("Time's up")
                ? "Time's Up!"
                : "Exam Submitted"}
          </h3>

          <p className="text-gray-600 mb-4">{submissionResult.message}</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            {examInfo?.resultPublished ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-serif font-bold text-moze-primary">
                      {submissionResult.score}
                    </div>
                    <div className="text-sm text-gray-500">Your Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-serif font-bold text-gray-700">
                      {submissionResult.totalMarks}
                    </div>
                    <div className="text-sm text-gray-500">Total Marks</div>
                  </div>
                </div>

                {submissionResult.percentage !== undefined && (
                  <div className="mt-4 text-center">
                    <div className="text-lg font-semibold text-gray-800">
                      Percentage: {submissionResult.percentage}%
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  Exam Submitted Successfully
                </div>
                <p className="text-gray-500">
                  Your results will be available once they are published by the teacher.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleCloseResult}
            className="w-full bg-moze-primary text-white py-2 rounded-lg hover:bg-maroon-800 transition-colors"
          >
            Back to Exams
          </button>
        </div>
      </div>
    </div>
  );

  if (showResultModal && submissionResult) {
    return <ResultDisplay />;
  }

  if (examAlreadyTaken && previousScore !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maroon-50/30 to-maroon-50/50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-maroon-50 text-moze-primary rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-moze-primary" />
          </div>

          <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">
            Exam Already Completed
          </h1>

          <p className="text-gray-600 mb-6">
            You have already taken this exam. Here are your results:
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-serif font-bold text-moze-primary">
                  {previousScore}
                </div>
                <div className="text-sm text-gray-500">Your Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-serif font-bold text-gray-700">
                  {examInfo?.totalMarks || 0}
                </div>
                <div className="text-sm text-gray-500">Total Marks</div>
              </div>
            </div>

            {examInfo?.totalMarks && (
              <div className="mt-4 text-center">
                <div className="text-lg font-semibold text-gray-800">
                  Percentage: {((previousScore / examInfo.totalMarks) * 100).toFixed(2)}%
                </div>
              </div>
            )}
          </div>

          <Link
            href="/student/myexams"
            className="inline-flex items-center justify-center w-full bg-moze-primary text-white py-2 rounded-lg hover:bg-maroon-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maroon-50/30 to-maroon-50/50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <Loader2 className="w-12 h-12 animate-spin text-moze-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Loading Exam</h2>
          <p className="text-gray-500 mt-2">Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  if (!exam || !examInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maroon-50/30 to-maroon-50/50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            Exam Not Found
          </h2>
          <p className="text-gray-500 mt-2">Could not load exam data.</p>
          <Link
            href="/student/myexams"
            className="inline-flex items-center mt-4 px-4 py-2 bg-moze-primary text-white rounded-lg hover:bg-maroon-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Exams
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maroon-50/30 to-maroon-50/50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Exam
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/student/myexams"
            className="inline-flex items-center px-4 py-2 bg-moze-primary text-white rounded-lg hover:bg-maroon-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Exams
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = exam?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50/30 to-maroon-50/50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <Link
              href="/student/myexams"
              className="inline-flex items-center text-moze-primary hover:text-blue-800 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Exams
            </Link>

            <div
              className={`inline-flex items-center px-4 py-2 rounded-full ${timeLeft !== null && timeLeft < 300
                  ? "bg-red-100 text-red-700"
                  : "bg-maroon-50 text-moze-primary text-blue-700"
                } font-semibold`}
            >
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-2">
              {examInfo?.subject} - {examInfo?.type}
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <span className="inline-flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Total Marks: {examInfo?.totalMarks}
              </span>
              <span className="inline-flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Duration: {examInfo?.duration} minutes
              </span>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-sm font-medium text-moze-primary">
                {answeredCount}/{totalQuestions} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-moze-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {exam &&
            Array.isArray(exam) &&
            exam.map((question, index) => (
              <div
                key={question._id || index}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-maroon-50 text-moze-primary text-blue-700 rounded-full mr-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{question.question}</span>
                </h3>

                <div className="space-y-3 pl-11">
                  {question.options &&
                    question.options.map((option, optIndex) => (
                      <label
                        key={option._id || optIndex}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name={`question-${question._id || index}`}
                          value={option.text}
                          checked={answers[question._id] === option.text}
                          onChange={() =>
                            handleAnswerChange(question._id, option.text)
                          }
                          className="h-4 w-4 text-moze-primary focus:ring-moze-primary border-gray-300"
                        />
                        <span className="text-gray-700">{option.text}</span>
                      </label>
                    ))}
                </div>
              </div>
            ))}
        </div>

        {/* Fixed Submit Button */}
        <div className="sticky bottom-6 mt-8 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              {timeLeft !== null && timeLeft > 0 ? (
                <span>You have {formatTime(timeLeft)} remaining</span>
              ) : timeUp ? (
                <span className="text-red-600 font-medium">
                  Time's up! Exam has been submitted automatically.
                </span>
              ) : (
                <span>Loading time...</span>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || timeUp || timeLeft === null}
              className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submit Exam
                </>
              )}
            </button>
          </div>
        </div>

        {/* Warning when time is running low */}
        {warningShown && timeLeft > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg animate-fade-in-up max-w-md">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">
                Only 5 minutes remaining! Please review your answers.
              </span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}