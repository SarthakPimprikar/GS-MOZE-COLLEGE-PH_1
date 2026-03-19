// "use client"
// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { 
//   BookOpen, Calendar, Clock, Code2, GraduationCap, 
//   Layers, ListChecks, School, Settings, Shield, 
//   Users, Loader2, AlertCircle, ChevronDown, ChevronRight 
// } from 'lucide-react';
// import { useSession } from '@/context/SessionContext';

// export default function CoursePlanPage() {
//   const { id } = useParams();
//   const [coursePlan, setCoursePlan] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedModules, setExpandedModules] = useState({});
//   const { user } = useSession();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(`/api/courses/course-plan/${id}`);
//         if (!res.ok) throw new Error(res.statusText);
//         const data = await res.json();
//         setCoursePlan(data);
        
//         // Initialize expanded state for modules with lessons
//         if (data?.modules?.length) {
//           const initialExpanded = {};
//           data.modules.forEach((module, index) => {
//             initialExpanded[module._id || index] = false;
//           });
//           setExpandedModules(initialExpanded);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const toggleModule = (moduleId) => {
//     setExpandedModules(prev => ({
//       ...prev,
//       [moduleId]: !prev[moduleId]
//     }));
//   };

//   const formatDuration = (minutes) => {
//     if (!minutes) return 'N/A';
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
//         <p className="mt-4 text-indigo-800">Loading course details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <AlertCircle className="w-12 h-12 text-red-600" />
//         <p className="mt-4 text-red-800">Failed to load course</p>
//         <p className="mt-2 text-gray-600 max-w-md text-center">{error}</p>
//       </div>
//     );
//   }

//   if (!coursePlan) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <AlertCircle className="w-12 h-12 text-yellow-600" />
//         <p className="mt-4 text-yellow-800">Course plan not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-4 md:p-6">
//       <div className="flex items-center gap-3 mb-8">
//         <BookOpen className="w-8 h-8 text-indigo-600" />
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//           {coursePlan.title} Course Plan
//         </h1>
//       </div>
      
//       <div className="space-y-6">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               <TableRow 
//                 icon={<ListChecks className="w-5 h-5 text-indigo-600" />}
//                 label="Description"
//                 value={coursePlan.description}
//               />
//               <TableRow 
//                 icon={<Code2 className="w-5 h-5 text-indigo-600" />}
//                 label="Branch"
//                 value={coursePlan.branch}
//               />
//               <TableRow 
//                 icon={<GraduationCap className="w-5 h-5 text-indigo-600" />}
//                 label="Year"
//                 value={coursePlan.year}
//               />
//               <TableRow 
//                 icon={<School className="w-5 h-5 text-indigo-600" />}
//                 label="Division"
//                 value={coursePlan.division}
//               />
//               <TableRow 
//                 icon={<Layers className="w-5 h-5 text-indigo-600" />}
//                 label="Load Type"
//                 value={coursePlan.loadType}
//               />
//               <TableRow 
//                 icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
//                 label="Subject"
//                 value={coursePlan.title}
//               />
//               <TableRow 
//                 icon={<Settings className="w-5 h-5 text-indigo-600" />}
//                 label="Teacher"
//                 value={user?.fullName || 'N/A'}
//               />
//             </tbody>
//           </table>
//         </div>
        
//         {coursePlan.modules?.length > 0 && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
//                 <Layers className="w-5 h-5 text-indigo-600" />
//                 Course Modules
//               </h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {coursePlan.modules.map((module, index) => (
//                     <>
//                       <tr 
//                         key={module._id || index} 
//                         className="hover:bg-gray-50 cursor-pointer"
//                         onClick={() => toggleModule(module._id || index)}
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-2">
//                           {expandedModules[module._id || index] ? (
//                             <ChevronDown className="w-4 h-4" />
//                           ) : (
//                             <ChevronRight className="w-4 h-4" />
//                           )}
//                           {module.title}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-500">
//                           {formatDuration(module.duration)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-500">
//                           {module.lessons?.length || 0} lessons
//                         </td>
//                       </tr>
//                       {expandedModules[module._id || index] && module.lessons?.length > 0 && (
//                         <tr className="bg-gray-50">
//                           <td colSpan="3" className="px-6 py-4">
//                             <div className="ml-8 space-y-4">
//                               <h4 className="font-medium text-gray-700">Lessons:</h4>
//                               <ul className="space-y-3">
//                                 {module.lessons.map((lesson, lessonIndex) => (
//                                   <li key={lesson._id || lessonIndex} className="pl-4 border-l-2 border-indigo-200">
//                                     <div className="flex justify-between">
//                                       <span className="font-medium text-gray-800">{lesson.title}</span>
//                                       <span className="text-sm text-gray-500">{formatDuration(lesson.duration)}</span>
//                                     </div>
//                                     {lesson.description && (
//                                       <p className="mt-1 text-sm text-gray-600">{lesson.description}</p>
//                                     )}
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function TableRow({ icon, label, value }) {
//   return (
//     <tr>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex items-center">
//           <div className="flex-shrink-0">
//             {icon}
//           </div>
//           <div className="ml-2 font-medium text-gray-900">
//             {label}
//           </div>
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         {typeof value === 'string' || typeof value === 'number' ? (
//           <span className="text-gray-700">{value || 'N/A'}</span>
//         ) : (
//           value
//         )}
//       </td>
//     </tr>
//   );
// }

"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  BookOpen, Calendar, Clock, Code2, GraduationCap, 
  Layers, ListChecks, School, Settings, Shield, 
  Users, Loader2, AlertCircle, ChevronDown, ChevronRight,
  Play
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';

export default function CoursePlanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [coursePlan, setCoursePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const { user } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/courses/course-plan/${id}`);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setCoursePlan(data);
        
        // Initialize expanded state for modules with lessons
        if (data?.modules?.length) {
          const initialExpanded = {};
          data.modules.forEach((module, index) => {
            initialExpanded[module._id || index] = false;
          });
          setExpandedModules(initialExpanded);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleExecuteLesson = (moduleId) => {
    // Navigate to lesson execution page
    router.push(`/teacher/course-plan/execute/${id}/attendance?moduleId=${moduleId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-indigo-800">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-red-600" />
        <p className="mt-4 text-red-800">Failed to load course</p>
        <p className="mt-2 text-gray-600 max-w-md text-center">{error}</p>
      </div>
    );
  }

  if (!coursePlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-yellow-600" />
        <p className="mt-4 text-yellow-800">Course plan not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {coursePlan.title} Course Plan
        </h1>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <TableRow 
                icon={<ListChecks className="w-5 h-5 text-indigo-600" />}
                label="Description"
                value={coursePlan.description}
              />
              <TableRow 
                icon={<Code2 className="w-5 h-5 text-indigo-600" />}
                label="Branch"
                value={coursePlan.branch}
              />
              <TableRow 
                icon={<GraduationCap className="w-5 h-5 text-indigo-600" />}
                label="Year"
                value={coursePlan.year}
              />
              <TableRow 
                icon={<School className="w-5 h-5 text-indigo-600" />}
                label="Division"
                value={coursePlan.division}
              />
              <TableRow 
                icon={<Layers className="w-5 h-5 text-indigo-600" />}
                label="Load Type"
                value={coursePlan.loadType}
              />
              <TableRow 
                icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
                label="Subject"
                value={coursePlan.title}
              />
              <TableRow 
                icon={<Settings className="w-5 h-5 text-indigo-600" />}
                label="Teacher"
                value={user?.fullName || 'N/A'}
              />
            </tbody>
          </table>
        </div>
        
        {coursePlan.modules?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Course Modules
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coursePlan.modules.map((module, index) => (
                    <>
                      <tr 
                        key={module._id || index} 
                        className="hover:bg-gray-50"
                      >
                        <td 
                          className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-2 cursor-pointer"
                          onClick={() => toggleModule(module._id || index)}
                        >
                          {expandedModules[module._id || index] ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          {module.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {formatDuration(module.duration)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {module.lessons?.length || 0} lessons
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {module.lessons?.length > 0 && (
                            <button
                              onClick={() => handleExecuteLesson(module._id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Start
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedModules[module._id || index] && module.lessons?.length > 0 && (
                        <tr className="bg-gray-50">
                          <td colSpan="4" className="px-6 py-4">
                            <div className="ml-8 space-y-4">
                              <h4 className="font-medium text-gray-700">Lessons:</h4>
                              <ul className="space-y-3">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <li key={lesson._id || lessonIndex} className="pl-4 border-l-2 border-indigo-200">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <span className="font-medium text-gray-800">{lesson.title}</span>
                                        {lesson.description && (
                                          <p className="mt-1 text-sm text-gray-600">{lesson.description}</p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">{formatDuration(lesson.duration)}</span>
                                        <button
                                          onClick={() => handleExecuteLesson(module._id || index, lesson._id)}
                                          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                          title="Execute lesson"
                                        >
                                          <Play className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TableRow({ icon, label, value }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-2 font-medium text-gray-900">
            {label}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {typeof value === 'string' || typeof value === 'number' ? (
          <span className="text-gray-700">{value || 'N/A'}</span>
        ) : (
          value
        )}
      </td>
    </tr>
  );
}