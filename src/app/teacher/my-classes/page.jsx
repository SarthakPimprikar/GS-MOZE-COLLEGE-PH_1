"use client"
import { useSession } from '@/context/SessionContext';
import { BookOpen, Plus, Loader2, AlertCircle, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Classes = ({ teacherId }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSession();
    const [selectedClass, setSelectedClass] = useState(null);
    const [modalType, setModalType] = useState(null); // 'view' or 'manage'

    // Configurable settings
    const config = {
        maxClassesPerPage: 9,
        emptyStateMessage: "No classes found",
        enableRandomStudentCount: true,
        defaultStudentCount: 0,
        classCardActions: [
            { label: "View Class", variant: "primary", action: "view" },
            { label: "Manage", variant: "secondary", action: "manage" }
        ]
    };

    // Fetch classes data
    useEffect(() => {
        if (!user?.id) return;

        const fetchClasses = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`/api/teachers/${user.id}/dashboard`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch classes: ${response.status}`);
                }
                
                const data = await response.json();
                processClassData(data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message || 'Failed to load classes');
            } finally {
                setLoading(false);
            }
        };

        const processClassData = (data) => {
            if (!data?.mySubjects) {
                throw new Error("Invalid data structure from API");
            }

            const transformedClasses = data.mySubjects.flatMap(subjectGroup => 
                subjectGroup.subjects.map((subjectName, index) => ({
                    id: `${subjectGroup.year}-${subjectGroup.semester}-${subjectGroup.division}-${index}`,
                    name: subjectName,
                    meta: {
                        year: subjectGroup.year,
                        semester: subjectGroup.semester,
                        division: subjectGroup.division,
                        subjectCode: `SUB-${Math.floor(1000 + Math.random() * 9000)}` // Mock subject code
                    },
                    students: config.enableRandomStudentCount 
                        ? Math.floor(Math.random() * 30) + 10 
                        : config.defaultStudentCount,
                    nextClass: getNextClassTime(subjectGroup.year, subjectGroup.semester),
                    attendance: Math.floor(Math.random() * 100) // Mock attendance percentage
                }))
            );

            setClasses(transformedClasses.slice(0, config.maxClassesPerPage));
        };

        fetchClasses();
    }, [user?.id]);

    const getNextClassTime = (year, semester) => {
        const days = ['Today', 'Tomorrow', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
        const randomDay = days[Math.floor(Math.random() * days.length)];
        const randomTime = times[Math.floor(Math.random() * times.length)];
        return `${randomDay} ${randomTime}`;
    };

    const handleActionClick = (cls, actionType) => {
        setSelectedClass(cls);
        setModalType(actionType);
    };

    const closeModal = () => {
        setSelectedClass(null);
        setModalType(null);
    };

    const renderLoadingState = () => (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p>Loading your classes...</p>
        </div>
    );

    const renderErrorState = () => (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-red-500">
            <AlertCircle className="h-8 w-8" />
            <p>Error: {error}</p>
            <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-100 rounded-md hover:bg-red-200"
            >
                Retry
            </button>
        </div>
    );

    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-500">
            <BookOpen className="h-8 w-8" />
            <p>{config.emptyStateMessage}</p>
        </div>
    );

    const getButtonVariantStyles = (variant) => {
        switch (variant) {
            case 'primary':
                return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
            case 'secondary':
                return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
            case 'danger':
                return 'bg-red-100 text-red-600 hover:bg-red-200';
            default:
                return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
        }
    };

    const renderViewClassModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Class Details</h3>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <h4 className="text-lg font-semibold">{selectedClass.name}</h4>
                        <p className="text-sm text-gray-600">{selectedClass.meta.subjectCode}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Year/Semester</p>
                            <p>{selectedClass.meta.year} - {selectedClass.meta.semester}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Division</p>
                            <p>{selectedClass.meta.division}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Students</p>
                            <p>{selectedClass.students}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Attendance</p>
                            <p>{selectedClass.attendance}%</p>
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-sm text-gray-500">Next Class</p>
                        <p className="text-blue-600">{selectedClass.nextClass}</p>
                    </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                    <button 
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Close
                    </button>
                    <button 
                        onClick={() => handleActionClick(selectedClass, 'manage')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Manage Class
                    </button>
                </div>
            </div>
        </div>
    );

    const renderManageClassModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Manage Class: {selectedClass.name}</h3>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Attendance</h4>
                            <p>Record and view attendance</p>
                            <button className="mt-3 px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm">
                                View Records
                            </button>
                        </div>
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Assignments</h4>
                            <p>Create and grade assignments</p>
                            <button className="mt-3 px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm">
                                Manage
                            </button>
                        </div>
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Students</h4>
                            <p>View and manage students</p>
                            <button className="mt-3 px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm">
                                Student List
                            </button>
                        </div>
                    </div>
                    
                    <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Class Settings</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span>Class Time</span>
                                <button className="text-sm text-blue-600">Edit</button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Classroom Location</span>
                                <button className="text-sm text-blue-600">Edit</button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Syllabus</span>
                                <button className="text-sm text-blue-600">Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                    <button 
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Close
                    </button>
                    <button 
                        onClick={() => toast.success(`Saving changes for ${selectedClass.name}`)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) return renderLoadingState();
    if (error) return renderErrorState();
    if (classes.length === 0) return renderEmptyState();

    return (
        <div className="space-y-6">
            <Toaster/>
            {modalType === 'view' && renderViewClassModal()}
            {modalType === 'manage' && renderManageClassModal()}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold truncate" title={cls.name}>
                                {cls.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                    {cls.meta.year} - {cls.meta.semester}
                                </span>
                                <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Students:</span>
                                <span className="text-sm font-medium">
                                    {cls.students} enrolled
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Next Class:</span>
                                <span className="text-sm font-medium text-blue-600">
                                    {cls.nextClass}
                                </span>
                            </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                            {config.classCardActions.map((action, index) => (
                                <button 
                                    key={index}
                                    onClick={() => handleActionClick(cls, action.action)}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm ${getButtonVariantStyles(action.variant)}`}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {classes.length >= config.maxClassesPerPage && (
                <div className="flex justify-center">
                    <button className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                        Load More Classes
                    </button>
                </div>
            )}
        </div>
    );
};

export default Classes;