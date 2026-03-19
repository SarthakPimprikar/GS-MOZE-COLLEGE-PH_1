"use client"
import { useSession } from '@/context/SessionContext';
import { 
  BookOpen, Clock, Calendar, Award, BarChart2, ChevronDown, ChevronUp, 
  CheckCircle, FileText, Video, Bookmark, User, FlaskConical, Library, 
  ClipboardList, Flag, CalendarCheck 
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

export default function ViewCoursePlan({ params }) {
  const { id } = React.use(params);
  const {user} = useSession();
  const [coursePlan, setCoursePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const fetchCoursePlan = async () => {
      try {
        const response = await fetch(`/api/courses/course-plan/${id}`);
        const data = await response.json();
        
        console.log(data);
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch course plan');
        }
        
        setCoursePlan(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursePlan();
  }, [id]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}min` : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <Library className="h-12 w-12 mx-auto text-indigo-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Course Plan. Course Plan Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  if (!coursePlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <Library className="h-12 w-12 mx-auto text-indigo-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Plan Not Found</h2>
          <p className="text-gray-600 mb-6">The requested course plan could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{coursePlan.title}</h1>
              <p className="text-indigo-100 mt-2">
                {coursePlan?.title || 'Subject'} • {user?.fullName || 'Instructor'}
              </p>
            </div>
            <div className="grid grid-cols-2 md:flex md:items-center md:space-x-6 gap-3">
              <div className="flex items-center space-x-2">
                <Flag className="h-5 w-5" />
                <span>{coursePlan.branch} - {coursePlan.year}</span>
              </div>
              <div className="flex items-center space-x-2">
                {coursePlan.loadType === 'Lab' ? (
                  <FlaskConical className="h-5 w-5" />
                ) : (
                  <BookOpen className="h-5 w-5" />
                )}
                <span>{coursePlan.loadType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart2 className="h-5 w-5" />
                <span>{coursePlan.division || 'All'} Division</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarCheck className="h-5 w-5" />
                <span>{new Date(coursePlan.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Course Description */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
            <ClipboardList className="h-5 w-5 mr-2" />
            Course Description
          </h2>
          <p className="text-gray-700">{coursePlan.description}</p>
        </section>

        {/* Course Plan */}
        <section className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="border-b border-gray-200 px-6 py-4 bg-indigo-50">
            <h2 className="text-xl font-semibold text-indigo-800">Course Modules</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {coursePlan.modules?.map((module) => (
              <div key={module._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleModule(module._id)}
                >
                  <div>
                    <h3 className="text-lg font-medium text-indigo-700">{module.title}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDuration(module.duration)}</span>
                      <span className="mx-2">•</span>
                      <span>{module.lessons?.length || 0} lessons</span>
                    </div>
                  </div>
                  {expandedModules[module._id] ? (
                    <ChevronUp className="h-5 w-5 text-indigo-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-indigo-500" />
                  )}
                </div>

                {expandedModules[module._id] && module.lessons?.length > 0 && (
                  <div className="mt-4 pl-2 border-l-2 border-indigo-200">
                    {module.lessons.map((lesson) => (
                      <div key={lesson._id} className="py-3 flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          {lesson.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5 flex items-center justify-center">
                              <div className="h-3 w-3 rounded-full border-2 border-indigo-300"></div>
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${lesson.completed ? 'text-gray-500' : 'text-gray-900'}`}>
                              {lesson.title}
                            </h4>
                            <span className="text-xs text-gray-500">{formatDuration(lesson.duration)}</span>
                          </div>
                          {lesson.description && (
                            <p className="text-xs text-gray-500 mt-1">{lesson.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teacher Information */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Instructor
            </h2>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium">{user?.fullName || 'Not specified'}</h3>
                <p className="text-sm text-gray-500">{user?.email || ''}</p>
              </div>
            </div>
          </section>

          {/* Course Metadata */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Course Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Branch:</span>
                <span className="font-medium">{coursePlan.branch}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Year:</span>
                <span className="font-medium">{coursePlan.year}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Division:</span>
                <span className="font-medium">{coursePlan.division || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Batch:</span>
                <span className="font-medium">{coursePlan.batch || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{coursePlan.loadType}</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}