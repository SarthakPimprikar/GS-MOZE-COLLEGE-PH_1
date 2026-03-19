// 'use client';

// import { useEffect, useState } from 'react';
// import { ChevronLeft, Clock, User, Calendar, BookOpen, Coffee, Search, Bell, MapPin } from 'lucide-react';
// import axios from 'axios';
// import { useSession } from '@/context/SessionContext';

// const daysOfWeek = [
//   'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
// ];

// export default function TimetablePage() {
//   const { user } = useSession();
//   const studentId = user?.id;

//   const [activeDay, setActiveDay] = useState('Monday');
//   const [timetableByDay, setTimetableByDay] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [searchTerm, setSearchTerm] = useState(''); // Replace with actual student ID

//   useEffect(() => {
//     const fetchTimetable = async () => {
//       try {
//         if (!studentId) return; 
//         const res = await axios.get(`/api/students/${studentId}/academics`);
//         const timetable = res.data.academic.years[0].divisions[0].timetable;

//         const groupedByDay = {};
//         for (let day of daysOfWeek) {
//           groupedByDay[day] = timetable
//             .filter((entry) => entry.day === day)
//             .map((entry) => ({
//               subject: entry.subject,
//               teacher: entry.teacherName,
//               time: `${entry.time.start} - ${entry.time.end}`,
//               duration: calculateDuration(entry.time.start, entry.time.end),
//               startTime: entry.time.start,
//               endTime: entry.time.end,
//             }));
//         }

//         setTimetableByDay(groupedByDay);
//         setLoading(false);
//       } catch (err) {
//         console.error('Failed to fetch timetable:', err);
//         setLoading(false);
//       }
//     };

//     fetchTimetable();
//   }, []);

//   // Update current time every minute
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const calculateDuration = (start, end) => {
//     const [sh, sm] = start.split(':').map(Number);
//     const [eh, em] = end.split(':').map(Number);
//     return ((eh * 60 + em) - (sh * 60 + sm)) + ' Min';
//   };

//   const getClassStatus = (startTime, endTime) => {
//     const now = currentTime;
//     const [startHour, startMin] = startTime.split(':').map(Number);
//     const [endHour, endMin] = endTime.split(':').map(Number);

//     const currentHour = now.getHours();
//     const currentMin = now.getMinutes();

//     const startTotal = startHour * 60 + startMin;
//     const endTotal = endHour * 60 + endMin;
//     const currentTotal = currentHour * 60 + currentMin;

//     if (currentTotal < startTotal) return 'upcoming';
//     if (currentTotal > endTotal) return 'completed';
//     return 'ongoing';
//   };

//   const getNextClass = () => {
//     const todayClasses = timetableByDay[activeDay] || [];
//     const now = currentTime;
//     const currentTotal = now.getHours() * 60 + now.getMinutes();

//     for (const cls of todayClasses) {
//       const [startHour, startMin] = cls.startTime.split(':').map(Number);
//       const startTotal = startHour * 60 + startMin;

//       if (currentTotal < startTotal) {
//         return cls;
//       }
//     }
//     return null;
//   };

//   const filteredTimetableData = (timetableByDay[activeDay] || []).filter(item =>
//     item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (item.teacher && item.teacher.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const nextClass = getNextClass();
//   const todayClassCount = timetableByDay[activeDay]?.length || 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* Header */}


//       <div className="max-w-4xl mx-auto px-4 py-6">
//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-gradient-to-br from-maroon-50/30 to-blue-100 rounded-xl shadow-sm p-4 border-0">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-moze-primary font-medium">Today's Classes</p>
//                 <p className="text-2xl font-serif font-bold text-blue-800">{todayClassCount}</p>
//               </div>
//               <div className="p-3 bg-moze-primary rounded-xl">
//                 <BookOpen className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-4 border-0">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-green-600 font-medium">Next Class</p>
//                 <p className="text-sm font-semibold text-green-800 truncate">
//                   {nextClass ? nextClass.subject : 'No more classes'}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-500 rounded-xl">
//                 <Clock className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm p-4 border-0">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-orange-600 font-medium">Time Until Next</p>
//                 <p className="text-sm font-semibold text-orange-800">
//                   {nextClass ? nextClass.time.split(' - ')[0] : '--:--'}
//                 </p>
//               </div>
//               <div className="p-3 bg-orange-500 rounded-xl">
//                 <Bell className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-sm p-4 mb-6 border-0">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search subjects or teachers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 backdrop-blur-sm"
//             />
//           </div>
//         </div>

//         {/* Day Tabs */}
//         <div className="bg-gradient-to-r from-indigo-50 to-gray-100 rounded-xl shadow-sm mb-6 border-0">
//           <div className="flex overflow-x-auto">
//             {daysOfWeek.map((day, index) => (
//               <button
//                 key={day}
//                 onClick={() => setActiveDay(day)}
//                 className={`px-6 py-4 text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 relative font-medium
//                   ${day === activeDay
//                     ? 'text-indigo-800 bg-white/95 backdrop-blur-sm shadow-sm'
//                     : 'text-moze-primary hover:text-indigo-800 hover:bg-white/60'
//                   }
//                   ${index === 0 ? 'rounded-l-xl' : ''}
//                   ${index === daysOfWeek.length - 1 ? 'rounded-r-xl' : ''}
//                 `}
//               >
//                 {day}
//                 {day === activeDay && (
//                   <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"></div>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Timetable Content */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//           {loading ? (
//             <div className="p-8 text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
//               <p className="text-gray-500">Loading timetable...</p>
//             </div>
//           ) : filteredTimetableData.length > 0 ? (
//             <div className="divide-y divide-gray-100">
//               {filteredTimetableData.map((item, idx) => {
//                 const status = getClassStatus(item.startTime, item.endTime);
//                 const isBreak = item.subject.toLowerCase().includes('break');

//                 return (
//                   <div
//                     key={idx}
//                     className={`p-6 hover:bg-gray-50 transition-colors duration-200 
//                       ${status === 'ongoing' ? 'bg-gradient-to-r from-maroon-50/30/80 to-blue-100/80 border-l-4 border-blue-400' : ''}
//                       ${status === 'completed' ? 'opacity-60 bg-gradient-to-r from-gray-50/80 to-gray-100/80' : ''}
//                       ${status === 'upcoming' && !isBreak ? 'bg-gradient-to-r from-green-50/80 to-green-100/80' : ''}
//                       ${isBreak ? 'bg-gradient-to-r from-orange-50/80 to-orange-100/80' : ''}
//                     `}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <div className={`p-2 rounded-lg ${isBreak ? 'bg-orange-400' :
//                               status === 'ongoing' ? 'bg-blue-400' :
//                                 status === 'completed' ? 'bg-gray-400' : 'bg-green-400'
//                             }`}>
//                             {isBreak ? (
//                               <Coffee className="w-5 h-5 text-white" />
//                             ) : (
//                               <BookOpen className="w-5 h-5 text-white" />
//                             )}
//                           </div>
//                           <div>
//                             <h3 className="text-lg font-semibold text-gray-800">{item.subject}</h3>
//                             {status === 'ongoing' && (
//                               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-maroon-50 text-moze-primary/80 text-blue-700">
//                                 <div className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></div>
//                                 Live Now
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-4 text-sm text-gray-600 ml-14">
//                           <div className="flex items-center gap-1">
//                             <User className="w-4 h-4" />
//                             <span>{item.teacher || 'Teacher Not Assigned'}</span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="text-right">
//                         <div className={`text-sm font-semibold mb-1 ${status === 'ongoing' ? 'text-moze-primary' :
//                             status === 'completed' ? 'text-gray-400' : 'text-red-400'
//                           }`}>
//                           {item.time}
//                         </div>
//                         <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${isBreak ? 'bg-gradient-to-r from-orange-100/80 to-orange-200/80 text-orange-700' :
//                             status === 'ongoing' ? 'bg-gradient-to-r from-blue-100/80 to-blue-200/80 text-blue-700' :
//                               status === 'completed' ? 'bg-gradient-to-r from-gray-100/80 to-gray-200/80 text-gray-500' :
//                                 'bg-gradient-to-r from-green-100/80 to-green-200/80 text-green-700'
//                           }`}>
//                           {item.duration}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="p-8 text-center">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Calendar className="w-8 h-8 text-gray-400" />
//               </div>
//               <p className="text-gray-500 mb-2">
//                 {searchTerm ? 'No matching classes found' : 'No classes scheduled'}
//               </p>
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm('')}
//                   className="text-violet-600 hover:text-violet-700 text-sm font-medium"
//                 >
//                   Clear search
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, Clock, User, Calendar, BookOpen, Coffee, Search, Bell, MapPin } from 'lucide-react';
import axios from 'axios';
import { useSession } from '@/context/SessionContext';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export default function TimetablePage() {
  const { user } = useSession();
  const studentId = user?.id;

  const [activeDay, setActiveDay] = useState('Monday');
  const [timetableByDay, setTimetableByDay] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        if (!studentId) return; 
        const res = await axios.get(`/api/students/${studentId}/academics`);
        const timetable = res.data.academic.years[0].divisions[0].timetable;

        const groupedByDay = {};
        for (let day of daysOfWeek) {
          groupedByDay[day] = timetable
            .filter((entry) => entry.day === day)
            .map((entry) => ({
              subject: entry.subject,
              teacher: entry.teacherName,
              time: `${entry.time.start} - ${entry.time.end}`,
              duration: calculateDuration(entry.time.start, entry.time.end),
              startTime: entry.time.start,
              endTime: entry.time.end,
            }));
        }

        setTimetableByDay(groupedByDay);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch timetable:', err);
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const calculateDuration = (start, end) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return ((eh * 60 + em) - (sh * 60 + sm)) + ' Min';
  };

  // Get current day name
  const getCurrentDayName = () => {
    const today = new Date();
    const dayIndex = today.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[dayIndex];
  };

  // Check if the active day is today
  const isActiveDay = () => {
    return activeDay === getCurrentDayName();
  };

  const getClassStatus = (startTime, endTime) => {
    // Only apply live status logic if the active day is today
    if (!isActiveDay()) {
      return 'neutral'; // Default state for non-today days
    }

    const now = currentTime;
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;
    const currentTotal = currentHour * 60 + currentMin;

    if (currentTotal < startTotal) return 'upcoming';
    if (currentTotal > endTotal) return 'completed';
    return 'ongoing';
  };

  const getNextClass = () => {
    // Only show next class if today is the active day
    if (!isActiveDay()) {
      return null;
    }

    const todayClasses = timetableByDay[activeDay] || [];
    const now = currentTime;
    const currentTotal = now.getHours() * 60 + now.getMinutes();

    for (const cls of todayClasses) {
      const [startHour, startMin] = cls.startTime.split(':').map(Number);
      const startTotal = startHour * 60 + startMin;

      if (currentTotal < startTotal) {
        return cls;
      }
    }
    return null;
  };

  const filteredTimetableData = (timetableByDay[activeDay] || []).filter(item =>
    item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.teacher && item.teacher.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const nextClass = getNextClass();
  const todayClassCount = timetableByDay[activeDay]?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-maroon-50/30 to-blue-100 rounded-xl shadow-sm p-4 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-moze-primary font-medium">
                  {isActiveDay() ? "Today's Classes" : `${activeDay}'s Classes`}
                </p>
                <p className="text-2xl font-serif font-bold text-blue-800">{todayClassCount}</p>
              </div>
              <div className="p-3 bg-moze-primary rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-4 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">
                  {isActiveDay() ? "Next Class" : "No Live Data"}
                </p>
                <p className="text-sm font-semibold text-green-800 truncate">
                  {nextClass ? nextClass.subject : isActiveDay() ? 'No more classes' : 'Select today'}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm p-4 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">
                  {isActiveDay() ? "Time Until Next" : "No Live Data"}
                </p>
                <p className="text-sm font-semibold text-orange-800">
                  {nextClass ? nextClass.time.split(' - ')[0] : '--:--'}
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-xl">
                <Bell className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-sm p-4 mb-6 border-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search subjects or teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Day Tabs */}
        <div className="bg-gradient-to-r from-indigo-50 to-gray-100 rounded-xl shadow-sm mb-6 border-0">
          <div className="flex overflow-x-auto">
            {daysOfWeek.map((day, index) => {
              const isToday = day === getCurrentDayName();
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-6 py-4 text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 relative font-medium
                    ${day === activeDay
                      ? 'text-indigo-800 bg-white/95 backdrop-blur-sm shadow-sm'
                      : 'text-moze-primary hover:text-indigo-800 hover:bg-white/60'
                    }
                    ${index === 0 ? 'rounded-l-xl' : ''}
                    ${index === daysOfWeek.length - 1 ? 'rounded-r-xl' : ''}
                  `}
                >
                  {day}
                  {isToday && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                  {day === activeDay && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timetable Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading timetable...</p>
            </div>
          ) : filteredTimetableData.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredTimetableData.map((item, idx) => {
                const status = getClassStatus(item.startTime, item.endTime);
                const isBreak = item.subject.toLowerCase().includes('break');
                const isToday = isActiveDay();

                return (
                  <div
                    key={idx}
                    className={`p-6 hover:bg-gray-50 transition-colors duration-200 
                      ${isToday && status === 'ongoing' ? 'bg-gradient-to-r from-maroon-50/30/80 to-blue-100/80 border-l-4 border-blue-400' : ''}
                      ${isToday && status === 'completed' ? 'opacity-60 bg-gradient-to-r from-gray-50/80 to-gray-100/80' : ''}
                      ${isToday && status === 'upcoming' && !isBreak ? 'bg-gradient-to-r from-green-50/80 to-green-100/80' : ''}
                      ${isBreak ? 'bg-gradient-to-r from-orange-50/80 to-orange-100/80' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${
                            isBreak ? 'bg-orange-400' :
                            isToday && status === 'ongoing' ? 'bg-blue-400' :
                            isToday && status === 'completed' ? 'bg-gray-400' : 
                            isToday && status === 'upcoming' ? 'bg-green-400' : 'bg-slate-400'
                          }`}>
                            {isBreak ? (
                              <Coffee className="w-5 h-5 text-white" />
                            ) : (
                              <BookOpen className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{item.subject}</h3>
                            {isToday && status === 'ongoing' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-maroon-50 text-moze-primary/80 text-blue-700">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></div>
                                Live Now
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 ml-14">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{item.teacher || 'Teacher Not Assigned'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-sm font-semibold mb-1 ${
                          isToday && status === 'ongoing' ? 'text-moze-primary' :
                          isToday && status === 'completed' ? 'text-gray-400' : 
                          isToday && status === 'upcoming' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {item.time}
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          isBreak ? 'bg-gradient-to-r from-orange-100/80 to-orange-200/80 text-orange-700' :
                          isToday && status === 'ongoing' ? 'bg-gradient-to-r from-blue-100/80 to-blue-200/80 text-blue-700' :
                          isToday && status === 'completed' ? 'bg-gradient-to-r from-gray-100/80 to-gray-200/80 text-gray-500' :
                          isToday && status === 'upcoming' ? 'bg-gradient-to-r from-green-100/80 to-green-200/80 text-green-700' :
                          'bg-gradient-to-r from-slate-100/80 to-slate-200/80 text-slate-600'
                        }`}>
                          {item.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">
                {searchTerm ? 'No matching classes found' : 'No classes scheduled'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}