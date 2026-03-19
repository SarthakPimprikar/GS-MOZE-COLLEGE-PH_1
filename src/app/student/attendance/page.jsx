
"use client";

import React, { useEffect, useState } from 'react';
import {
    Calendar, ChevronDown, ChevronUp, CheckCircle2, XCircle, Download, Search,
    BookOpen, User, TrendingUp, Award, AlertCircle, Filter, Loader2
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import axios from 'axios';

const AttendancePage = ({ params }) => {
    const { user } = useSession();
    const studentId = user?.id;// from dynamic route /students/[id]/attendance

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSubject, setExpandedSubject] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [loading, setLoading] = useState(true);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const toggleExpand = (code) => {
        setExpandedSubject(expandedSubject === code ? null : code);
    };

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/students/${studentId}/academics`);
            const { academic, attendance } = res.data;

            const subjectMap = {};

            // Map subjects
            academic?.years?.[0]?.divisions?.[0]?.subjects?.forEach(subject => {
                subjectMap[subject.name] = {
                    code: subject.code || subject.name,
                    name: subject.name,
                    teacher: subject.teacherName,
                    sessions: [],
                    present: 0,
                    total: 0,
                };
            });

            // Add attendance per subject
            attendance.forEach((record) => {
                const subj = subjectMap[record.subject];
                if (subj) {
                    subj.sessions.push({
                        date: record.date,
                        status: record.isPresent ? 'present' : 'absent',
                        topic: record.topicName
                    });
                    subj.total += 1;
                    if (record.isPresent) subj.present += 1;
                }
            });

            // Calculate percentage and add trend data
            const finalSubjects = Object.values(subjectMap).map(subj => {
                const percentage = subj.total === 0 ? 0 : Math.round((subj.present / subj.total) * 100);

                // Calculate trend based on last 5 sessions
                const recentSessions = subj.sessions.slice(-5);
                const recentPresent = recentSessions.filter(s => s.status === 'present').length;
                const recentPercentage = recentSessions.length > 0 ? (recentPresent / recentSessions.length) * 100 : 0;

                return {
                    ...subj,
                    percentage,
                    recentTrend: recentPercentage >= percentage ? 'up' : 'down',
                    lastClass: subj.sessions.length > 0 ?
                        new Date(subj.sessions[subj.sessions.length - 1].date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        }) : 'No classes'
                };
            });

            setSubjects(finalSubjects);
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!studentId) return;
        fetchStudentData();
    }, [studentId]);


    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return 'emerald';
        if (percentage >= 80) return 'blue';
        if (percentage >= 70) return 'amber';
        return 'red';
    };

    const getAttendanceGradient = (percentage) => {
        if (percentage >= 90) return 'from-emerald-500 to-emerald-600';
        if (percentage >= 80) return 'from-maroon-50/300 to-blue-600';
        if (percentage >= 70) return 'from-amber-500 to-amber-600';
        return 'from-red-500 to-red-600';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 animate-spin text-moze-primary mx-auto mb-4" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Attendance</h2>
                    <p className="text-gray-600">Please wait while we fetch your information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Attendance Dashboard</h1>
                        <p className="text-gray-600">Track your academic progress and attendance</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search subjects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary bg-white shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary appearance-none text-gray-900 bg-white shadow-sm"
                            >
                                <option value={-1}>All</option>
                                {months.map((month, index) => (
                                    <option key={month} value={index}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-moze-primary text-white rounded-lg hover:bg-maroon-800 transition-colors shadow-sm">
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Subjects List */}
                <div className="space-y-4">
                    {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject) => {
                            const isExpanded = expandedSubject === subject.code;
                            const isHovered = hoveredCard === subject.code;

                            return (
                                <div
                                    key={subject.code}
                                    className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 transform ${isHovered ? 'shadow-xl scale-[1.02]' : 'hover:shadow-xl hover:scale-[1.01]'
                                        }`}
                                    onMouseEnter={() => setHoveredCard(subject.code)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    {/* Main Card Content */}
                                    <div
                                        className="p-6 cursor-pointer"
                                        onClick={() => toggleExpand(subject.code)}
                                    >
                                        <div className="flex items-center justify-between">
                                            {/* Left Section */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 bg-gradient-to-r from-moze-primary to-maroon-800 rounded-lg">
                                                        <BookOpen className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900 truncate">{subject.name}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <User className="w-4 h-4" />
                                                            <span>{subject.teacher}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Stats Row */}
                                                <div className="flex items-center gap-4 mt-4">
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                                                        <Calendar className="w-4 h-4 text-gray-500" />
                                                        <span className="text-sm text-gray-700">Total: <span className="font-semibold">{subject.total}</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm text-green-700">Present: <span className="font-semibold">{subject.present}</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full">
                                                        <XCircle className="w-4 h-4 text-red-600" />
                                                        <span className="text-sm text-red-700">Absent: <span className="font-semibold">{subject.total - subject.present}</span></span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Section - Attendance Percentage */}
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${getAttendanceGradient(subject.percentage)} text-white shadow-lg`}>
                                                        <span className="text-2xl font-serif font-bold">{subject.percentage}%</span>
                                                        {subject.recentTrend === 'up' ? (
                                                            <TrendingUp className="w-5 h-5" />
                                                        ) : (
                                                            <AlertCircle className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">Attendance</p>
                                                </div>

                                                {/* Expand/Collapse Button */}
                                                <button
                                                    className={`p-2 rounded-full transition-all duration-200 ${isExpanded
                                                        ? 'bg-maroon-100 text-moze-primary rotate-180'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <ChevronDown className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100">
                                            <div className="p-6">
                                                {/* Attendance Details Table */}
                                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                                        <h4 className="font-semibold text-gray-900">Attendance Details</h4>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {subject.sessions
                                                                    .filter((session) => {
                                                                        if (selectedMonth === -1) return true; // Show all
                                                                        const sessionMonth = new Date(session.date).getMonth(); // 0 = Jan, 11 = Dec
                                                                        return sessionMonth === selectedMonth;
                                                                    })
                                                                    .map((session, idx) => (
                                                                        <tr key={idx}>
                                                                            <td className="px-4 py-3 text-sm text-gray-800">
                                                                                {new Date(session.date).toLocaleDateString('en-US', {
                                                                                    weekday: 'short',
                                                                                    month: 'short',
                                                                                    day: 'numeric'
                                                                                })}
                                                                            </td>
                                                                            <td className="px-4 py-3">
                                                                                {session.status === 'present' ? (
                                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                                        <CheckCircle2 className="w-3 h-3" /> Present
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                                        <XCircle className="w-3 h-3" /> Absent
                                                                                    </span>
                                                                                )}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-800">
                                                                                {session.topic}
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                }

                                                                {subject.sessions.filter((session) => new Date(session.date).getMonth() === selectedMonth).length === 0 && (
                                                                    <tr>
                                                                        <td colSpan="3" className="px-4 py-3 text-center text-sm text-gray-500">
                                                                            No attendance records for {months[selectedMonth]}.
                                                                        </td>
                                                                    </tr>
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
                        })
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No subjects found</h3>
                            <p className="text-gray-600">Try adjusting your search terms or check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;