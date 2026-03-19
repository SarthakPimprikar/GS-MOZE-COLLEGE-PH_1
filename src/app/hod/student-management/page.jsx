'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, TrendingUp, Users, BookOpen, Award, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
export default function StudentManagementDashboard({ hodId }) {
    const [activeTab, setActiveTab] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [attendanceFilter, setAttendanceFilter] = useState('all');
    const [selectedDivision, setSelectedDivision] = useState('all');
    const [academicData, setAcademicData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [collapsedDivisions, setCollapsedDivisions] = useState({});


    const { user } = useSession();
    // Fetch academic data from API
    const fetchAcademicData = async () => {
        try {
            setError(null);
            const response = await fetch(`/api/hod/${user.id}/students`);

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Transform API data to match component structure
            const transformedData = transformApiData(data);
            setAcademicData(transformedData);

            // Set default active tab to first available year
            const availableYears = Object.keys(transformedData);
            console.log('Available Years:', availableYears); // Debug log

            if (availableYears.length > 0) {
                // Always set the first year as active if no tab is selected
                if (!activeTab || !availableYears.includes(activeTab)) {
                    console.log('Setting active tab to:', availableYears[0]); // Debug log
                    setActiveTab(availableYears[0]);
                }
            }

        } catch (err) {
            console.error('Error fetching academic data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Transform API data to component format
    const transformApiData = (apiData) => {
        console.log('Raw API Data:', apiData); // Debug log

        const transformed = {};

        // Handle different possible API response formats
        let yearsData = [];

        if (apiData?.years) {
            yearsData = apiData.years;
        } else if (Array.isArray(apiData)) {
            yearsData = apiData;
        } else if (apiData?.data?.years) {
            yearsData = apiData.data.years;
        } else {
            console.warn('Unexpected API data format:', apiData);
            return {};
        }

        yearsData.forEach(yearData => {
            const yearName = yearData.year || yearData.name || `Year ${yearData.id}`;

            if (yearData.divisions && Array.isArray(yearData.divisions)) {
                transformed[yearName] = yearData.divisions.map(divData => ({
                    division: divData.division || divData.name || divData.id,
                    students: (divData.students || []).map(student => {
                        let attendanceObj = {};

                        // Handle different attendance formats
                        if (Array.isArray(student.attendance)) {
                            student.attendance.forEach(att => {
                                attendanceObj[att.subject || att.name] = att.percentage || att.value || 0;
                            });
                        } else if (typeof student.attendance === 'object' && student.attendance !== null) {
                            attendanceObj = student.attendance;
                        }

                        return {
                            id: student.id,
                            name: student.name || 'Unknown Student',
                            roll: student.roll || student.rollNo || student.rollNumber || 'N/A',
                            email: student.email || '',
                            attendance: attendanceObj
                        };
                    })
                }));
            }
        });

        console.log('Transformed Data:', transformed); // Debug log
        return transformed;
    };

    // Initial data fetch
    useEffect(() => {
        if (user) {
            fetchAcademicData();
        }
    }, [user]);

    useEffect(() => {
        if (academicData && Object.keys(academicData).length > 0) {
            const collapsedInit = {};
            Object.values(academicData).forEach(year =>
                year.forEach(div => {
                    collapsedInit[div.division] = true;
                })
            );
            setCollapsedDivisions(collapsedInit);
        }
    }, [academicData]);


    // Refresh data
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAcademicData();
    };

    const calculateOverall = (attendanceObj) => {
        const values = Object.values(attendanceObj);
        if (values.length === 0) return '0';
        const sum = values.reduce((a, b) => a + b, 0);
        return (sum / values.length).toFixed(1);
    };

    const getAttendanceStatus = (percentage) => {
        if (percentage >= 90) return { status: 'Excellent', color: 'text-green-600 bg-green-50' };
        if (percentage >= 80) return { status: 'Good', color: 'text-blue-600 bg-blue-50' };
        if (percentage >= 75) return { status: 'Average', color: 'text-yellow-600 bg-yellow-50' };
        return { status: 'Poor', color: 'text-red-600 bg-red-50' };
    };

    const filteredData = useMemo(() => {
        console.log('Filtering data for activeTab:', activeTab); // Debug log
        console.log('Current academicData:', academicData); // Debug log

        if (!academicData[activeTab]) {
            console.log('No data found for activeTab:', activeTab); // Debug log
            return [];
        }

        const currentYearData = academicData[activeTab];
        console.log('Current year data:', currentYearData); // Debug log

        return currentYearData
            .filter(divData => selectedDivision === 'all' || divData.division === selectedDivision)
            .map(divData => ({
                ...divData,
                students: divData.students.filter(student => {
                    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.roll.includes(searchTerm);

                    const overallAttendance = parseFloat(calculateOverall(student.attendance));
                    const matchesFilter = attendanceFilter === 'all' ||
                        (attendanceFilter === 'excellent' && overallAttendance >= 90) ||
                        (attendanceFilter === 'good' && overallAttendance >= 80 && overallAttendance < 90) ||
                        (attendanceFilter === 'average' && overallAttendance >= 75 && overallAttendance < 80) ||
                        (attendanceFilter === 'poor' && overallAttendance < 75);

                    return matchesSearch && matchesFilter;
                })
            }))
            .filter(divData => divData.students.length > 0);
    }, [activeTab, searchTerm, attendanceFilter, selectedDivision, academicData]);

    const yearStats = useMemo(() => {
        const allStudents = academicData[activeTab]?.flatMap(div => div.students) || [];
        const totalStudents = allStudents.length;
        const avgAttendance = totalStudents > 0
            ? (allStudents.reduce((sum, student) => sum + parseFloat(calculateOverall(student.attendance)), 0) / totalStudents).toFixed(1)
            : 0;
        const excellentCount = allStudents.filter(student => parseFloat(calculateOverall(student.attendance)) >= 90).length;

        return { totalStudents, avgAttendance, excellentCount };
    }, [activeTab, academicData]);

    const availableDivisions = academicData[activeTab]?.map(div => div.division) || [];
    const availableYears = Object.keys(academicData);

    // Export functionality
    const handleExport = async () => {
        try {
            const dataToExport = filteredData.flatMap(div =>
                div.students.map(student => ({
                    Year: activeTab,
                    Division: div.division,
                    'Roll No': student.roll,
                    Name: student.name,
                    Email: student.email,
                    ...student.attendance,
                    'Overall Attendance': calculateOverall(student.attendance) + '%'
                }))
            );

            // Convert to CSV
            const headers = Object.keys(dataToExport[0] || {});
            const csvContent = [
                headers.join(','),
                ...dataToExport.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
            ].join('\n');

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `attendance_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Academic Data</h2>
                    <p className="text-gray-600">Please wait while we fetch the latest information...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 mx-auto"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // No data state
    if (availableYears.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No Academic Data Found</h2>
                    <p className="text-gray-600">No student data is available for this HOD.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="scale-90 origin-top-left">
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                                    <p className="text-2xl font-bold text-gray-900">{yearStats.totalStudents}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                                    <p className="text-2xl font-bold text-gray-900">{yearStats.avgAttendance}%</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Excellent (90%+)</p>
                                    <p className="text-2xl font-bold text-gray-900">{yearStats.excellentCount}</p>
                                </div>
                                <Award className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Year</p>
                                    <p className="text-2xl font-bold text-gray-900">{activeTab}</p>
                                </div>
                                <BookOpen className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    {/* Year Tabs */}
                    {availableYears.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6">
                            <div className="flex gap-2 flex-wrap">
                                {availableYears.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => setActiveTab(year)}
                                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === year
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name or roll number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Division Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <select
                                    value={selectedDivision}
                                    onChange={(e) => setSelectedDivision(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                >
                                    <option value="all">All Divisions</option>
                                    {availableDivisions.map(div => (
                                        <option key={div} value={div}>Division {div}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Attendance Filter */}
                            <div>
                                <select
                                    value={attendanceFilter}
                                    onChange={(e) => setAttendanceFilter(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Students</option>
                                    <option value="excellent">Excellent (90%+)</option>
                                    <option value="good">Good (80-89%)</option>
                                    <option value="average">Average (75-79%)</option>
                                    <option value="poor">Poor (&lt;75%)</option>
                                </select>
                            </div>

                            {/* Export Button */}
                            <button
                                onClick={handleExport}
                                disabled={filteredData.length === 0}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <Download className="h-4 w-4" />
                                Export Data
                            </button>
                        </div>
                    </div>

                    {/* Division-wise Tables */}
                    {filteredData.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No students found matching your criteria.</p>
                            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter settings.</p>
                        </div>
                    ) : (
                        filteredData.map((divisionData, divIndex) => (
                            <div key={divIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                                {/* Header with Collapse Toggle */}
                                <div
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 cursor-pointer flex items-center justify-between"
                                    onClick={() =>
                                        setCollapsedDivisions(prev => ({
                                            ...prev,
                                            [divisionData.division]: !prev[divisionData.division]
                                        }))
                                    }
                                >
                                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Division {divisionData.division}
                                    </h2>
                                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                                        {divisionData.students.length} students
                                        <span className="transition-transform">
                                            {collapsedDivisions[divisionData.division] ? '▼' : '▲'}
                                        </span>
                                    </div>
                                </div>

                                {/* Table only if expanded */}
                                {!collapsedDivisions[divisionData.division] && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                                    {Object.keys(divisionData.students[0]?.attendance || {}).map((subject, idx) => (
                                                        <th key={idx} className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            {subject}
                                                        </th>
                                                    ))}
                                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Overall</th>
                                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {divisionData.students.map((student, stuIndex) => {
                                                    const overallAttendance = parseFloat(calculateOverall(student.attendance));
                                                    const attendanceStatus = getAttendanceStatus(overallAttendance);

                                                    return (
                                                        <tr key={student.id || stuIndex} className="hover:bg-gray-50 transition-colors duration-150">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                                    <div className="text-sm text-gray-500">Roll: {student.roll}</div>
                                                                    {student.email && <div className="text-xs text-gray-400">{student.email}</div>}
                                                                </div>
                                                            </td>
                                                            {Object.values(student.attendance).map((percent, index) => (
                                                                <td key={index} className="px-6 py-4 whitespace-nowrap text-center">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${percent >= 90 ? 'bg-green-100 text-green-800' :
                                                                        percent >= 80 ? 'bg-blue-100 text-blue-800' :
                                                                            percent >= 75 ? 'bg-yellow-100 text-yellow-800' :
                                                                                'bg-red-100 text-red-800'
                                                                        }`}>
                                                                        {percent}%
                                                                    </span>
                                                                </td>
                                                            ))}
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <span className="text-lg font-bold text-gray-900">
                                                                    {overallAttendance}%
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${attendanceStatus.color}`}>
                                                                    {attendanceStatus.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

