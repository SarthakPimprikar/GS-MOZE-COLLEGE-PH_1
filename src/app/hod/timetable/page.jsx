// "use client";
// import { useSession } from '@/context/SessionContext';
// import { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// // Component for draggable timetable items
// const DraggableTimetableItem = ({ data, dayIndex, timeIndex, moveItem, onDelete, getBreakColor }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: 'timetable-item',
//     item: { dayIndex, timeIndex, data },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div ref={drag} className={`cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'} relative`}>
//       {data.type === 'break' ? (
//         <div className={`text-center p-2 rounded-lg border ${getBreakColor(data.breakType)}`}>
//           <div className="font-semibold">{data.label}</div>
//           <div className="text-xs">Break</div>
//         </div>
//       ) : (
//         <div className="text-center p-2 border border-gray-200 rounded-lg bg-white">
//           <button
//             onClick={() => onDelete(dayIndex, timeIndex)}
//             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
//             title="Delete period"
//           >
//             ×
//           </button>
//           <div className="font-semibold text-indigo-700">{data.subject}</div>
//           <div className="text-sm text-gray-600">{data.professor}</div>
//           <div className="text-xs text-gray-500 mt-1">{data.room}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Component for droppable timetable cells
// const DroppableTimetableCell = ({ children, dayIndex, timeIndex, moveItem, onDelete, isEditMode }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: 'timetable-item',
//     drop: (item) => {
//       if (item.dayIndex !== dayIndex || item.timeIndex !== timeIndex) {
//         moveItem(item.dayIndex, item.timeIndex, dayIndex, timeIndex);
//       }
//     },
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   return (
//     <td ref={drop} className={`p-3 border border-gray-200 ${isOver ? 'bg-blue-50' : ''}`}>
//       {children}
//     </td>
//   );
// };

// const TimetablePage = () => {
//   const { user } = useSession();
//   // State for configuration
//   const [year, setYear] = useState('');
//   const [semester, setSemester] = useState('');
//   const [division, setDivision] = useState('');
//   const [periodTimes, setPeriodTimes] = useState([
//     { start: '09:00', end: '10:00' },
//     { start: '10:00', end: '11:00' },
//     { start: '11:00', end: '12:00' },
//     { start: '12:00', end: '13:00' },
//     { start: '14:00', end: '15:00' },
//     { start: '15:00', end: '16:00' },
//   ]);
//   const [breaks, setBreaks] = useState([
//     { type: 'lunch', start: '13:00', end: '14:00', duration: 60, label: 'Lunch Break' },
//   ]);

//   // State for academic data
//   const [academicData, setAcademicData] = useState(null);
//   const [availableYears, setAvailableYears] = useState([]);
//   const [availableSemesters, setAvailableSemesters] = useState([]);
//   const [availableDivisions, setAvailableDivisions] = useState([]);

//   // State for timetable
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [timetableData, setTimetableData] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // State for UI
//   const [showBreakModal, setShowBreakModal] = useState(false);
//   const [newBreak, setNewBreak] = useState({
//     type: 'short',
//     start: '',
//     end: '',
//     duration: 15,
//     label: '',
//   });
//   const [viewMode, setViewMode] = useState('config'); // 'config' or 'display'

//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const breakTypes = [
//     { id: 'short', name: 'Short Break', defaultDuration: 15 },
//     { id: 'long', name: 'Long Break', defaultDuration: 30 },
//     { id: 'lunch', name: 'Lunch Break', defaultDuration: 60 },
//     { id: 'custom', name: 'Custom Break', defaultDuration: 15 },
//   ];

//   // Fetch academic data on component mount
//   useEffect(() => {
//     if (!user?.id) return;

//     const fetchAcademicData = async () => {
//       try {
//         const response = await fetch(`/api/hod/${user.id}/academics`);
//         const data = await response.json();

//         if (data.academics && data.academics.length > 0) {
//           setAcademicData(data.academics[0]);
//           const years = data.academics[0].years.map((yearData) => yearData.year);
//           setAvailableYears(years);
//         }
//       } catch (error) {
//         console.error('Error fetching academic data:', error);
//       }
//     };

//     fetchAcademicData();
//   }, [user?.id]);

//   // Update available semesters when year changes
//   useEffect(() => {
//     if (academicData && year) {
//       const yearData = academicData.years.find((y) => y.year === year);
//       if (yearData) {
//         const semesters = yearData.semester ? [yearData.semester] : [];
//         setAvailableSemesters(semesters);
//       } else {
//         setAvailableSemesters([]);
//       }
//       setSemester('');
//       setDivision('');
//     }
//   }, [year, academicData]);

//   // Update available divisions when semester changes
//   useEffect(() => {
//     if (academicData && year && semester) {
//       const yearData = academicData.years.find((y) => y.year === year && y.semester === semester);
//       if (yearData && yearData.divisions) {
//         const divisions = yearData.divisions.map((d) => d.name);
//         setAvailableDivisions(divisions);
//       } else {
//         setAvailableDivisions([]);
//       }
//       setDivision('');
//     }
//   }, [semester, year, academicData]);

//   // Check if URL has parameters for direct display
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const urlParams = new URLSearchParams(window.location.search);
//       const yearParam = urlParams.get('year');
//       const semesterParam = urlParams.get('semester');
//       const divisionParam = urlParams.get('division');
//       const periodTimesParam = urlParams.get('periodTimes');
//       const breaksParam = urlParams.get('breaks');

//       if (yearParam && semesterParam && divisionParam) {
//         setYear(yearParam);
//         setSemester(semesterParam);
//         setDivision(divisionParam);

//         try {
//           if (periodTimesParam) {
//             const parsedPeriodTimes = JSON.parse(decodeURIComponent(periodTimesParam));
//             if (Array.isArray(parsedPeriodTimes)) {
//               setPeriodTimes(parsedPeriodTimes);
//             }
//           }
//           if (breaksParam) {
//             const parsedBreaks = JSON.parse(decodeURIComponent(breaksParam));
//             if (Array.isArray(parsedBreaks)) {
//               setBreaks(parsedBreaks);
//             }
//           }
//         } catch (error) {
//           console.error('Error parsing URL parameters:', error);
//         }

//         setViewMode('display');
//         generateTimetable();
//       }
//     }
//   }, []);

//   // Update break duration when start or end time changes
//   useEffect(() => {
//     if (newBreak.start && newBreak.end) {
//       const startTime = new Date(`2000-01-01T${newBreak.start}`);
//       const endTime = new Date(`2000-01-01T${newBreak.end}`);
//       const duration = (endTime - startTime) / (1000 * 60); // duration in minutes

//       if (duration > 0) {
//         setNewBreak((prev) => ({ ...prev, duration }));
//       }
//     }
//   }, [newBreak.start, newBreak.end]);

//   // Function to delete a period
//   const deletePeriod = (dayIndex, timeIndex) => {
//     if (!timetableData) return;

//     const newTimetableData = [...timetableData];

//     if (newTimetableData[dayIndex][timeIndex].type === 'break') {
//       return;
//     }

//     newTimetableData[dayIndex][timeIndex] = {
//       type: 'period',
//       subject: 'Free Period',
//       professor: '',
//       professorId: null,
//       room: '',
//     };

//     setTimetableData(newTimetableData);
//   };

//   // Function to move items in the timetable
//   const moveTimetableItem = (fromDay, fromTime, toDay, toTime) => {
//     if (!timetableData) return;

//     const newTimetableData = [...timetableData];

//     if (
//       newTimetableData[fromDay][fromTime].type === 'break' ||
//       newTimetableData[toDay][toTime].type === 'break'
//     ) {
//       return;
//     }

//     const temp = newTimetableData[fromDay][fromTime];
//     newTimetableData[fromDay][fromTime] = newTimetableData[toDay][toTime];
//     newTimetableData[toDay][toTime] = temp;

//     setTimetableData(newTimetableData);
//   };

//   const addPeriodTime = () => {
//     setPeriodTimes([...periodTimes, { start: '', end: '' }]);
//   };

//   const updatePeriodTime = (index, field, value) => {
//     const updatedTimes = [...periodTimes];
//     updatedTimes[index][field] = value;
//     setPeriodTimes(updatedTimes);
//   };

//   const removePeriodTime = (index) => {
//     if (periodTimes.length > 1) {
//       const updatedTimes = [...periodTimes];
//       updatedTimes.splice(index, 1);
//       setPeriodTimes(updatedTimes);
//     }
//   };

//   const addBreak = () => {
//     if (newBreak.start && newBreak.end && newBreak.duration > 0) {
//       const breakType = breakTypes.find((bt) => bt.id === newBreak.type);
//       const label = newBreak.label || breakType.name;

//       setBreaks([...breaks, { ...newBreak, label }]);
//       setNewBreak({
//         type: 'short',
//         start: '',
//         end: '',
//         duration: 15,
//         label: '',
//       });
//       setShowBreakModal(false);
//     }
//   };

//   const removeBreak = (index) => {
//     const updatedBreaks = [...breaks];
//     updatedBreaks.splice(index, 1);
//     setBreaks(updatedBreaks);
//   };

//   const generateTimeSlots = () => {
//     const allSlots = [];

//     periodTimes.forEach((period, index) => {
//       allSlots.push({
//         type: 'period',
//         start: period.start,
//         end: period.end,
//         label: `Period ${index + 1}`,
//         index,
//       });
//     });

//     breaks.forEach((breakItem, index) => {
//       allSlots.push({
//         type: 'break',
//         start: breakItem.start,
//         end: breakItem.end,
//         label: breakItem.label,
//         breakType: breakItem.type,
//         index,
//       });
//     });

//     return allSlots.sort((a, b) => {
//       const aTime = new Date(`2000-01-01T${a.start}`);
//       const bTime = new Date(`2000-01-01T${b.start}`);
//       return aTime - bTime;
//     });
//   };


// //   const fetchExistingTimetable = async () => {
// //   if (!user?.id || !year || !semester || !division) return;

// //   try {
// //     const response = await fetch(`/api/hod/${user.id}/timetable?year=${year}&semester=${semester}&division=${division}`);
// //     const data = await response.json();

// //     if (response.ok && data.timetable) {
// //       // Format the fetched timetable into the expected timetableData structure
// //       const timeSlots = generateTimeSlots();
// //       const formattedData = days.map(() =>
// //         timeSlots.map((slot) => ({
// //           type: slot.type === 'break' ? 'break' : 'period',
// //           subject: slot.type === 'break' ? slot.label : 'Free Period',
// //           professor: slot.type === 'break' ? '' : '',
// //           professorId: slot.type === 'break' ? null : null,
// //           breakType: slot.type === 'break' ? slot.breakType : undefined,
// //           room: '',
// //         }))
// //       );

// //       // Populate the timetable with fetched data
// //       data.timetable.forEach((period) => {
// //         const dayIndex = days.indexOf(period.day);
// //         const timeIndex = timeSlots.findIndex(
// //           (slot) => slot.start === period.time.start && slot.end === period.time.end
// //         );
// //         if (dayIndex !== -1 && timeIndex !== -1) {
// //           formattedData[dayIndex][timeIndex] = {
// //             type: 'period',
// //             subject: period.subject,
// //             professor: period.teacher ? period.teacher.fullName : 'Staff',
// //             professorId: period.teacher ? period.teacher._id : null,
// //             room: period.room || '',
// //           };
// //         }
// //       });

// //       setTimetableData(formattedData);
// //       setViewMode('display');
// //       return true; // Indicate that a timetable was found
// //     }
// //     return false; // No timetable found
// //   } catch (error) {
// //     console.error('Error fetching timetable:', error);
// //     return false;
// //   }
// // };


// const fetchExistingTimetable = async () => {
//   if (!user?.id || !year || !semester || !division) return false;

//   try {
//     setIsLoading(true);
//     const response = await fetch(
//       `/api/hod/${user.id}/timetable/get?year=${year}&semester=${semester}&division=${division}`
//     );
//     const data = await response.json();

//     if (response.ok && data.timetable) {
//       // Generate time slots based on periodTimes and breaks
//       const timeSlots = generateTimeSlots();

//       // Initialize timetable with empty periods and breaks
//       const formattedData = days.map(() =>
//         timeSlots.map((slot) => ({
//           type: slot.type === "break" ? "break" : "period",
//           subject: slot.type === "break" ? slot.label : "Free Period",
//           professor: slot.type === "break" ? "" : "",
//           professorId: slot.type === "break" ? null : null,
//           breakType: slot.type === "break" ? slot.breakType : undefined,
//           room: "",
//         }))
//       );

//       // Populate the timetable with fetched data
//       data.timetable.forEach((period) => {
//         const dayIndex = days.indexOf(period.day);
//         const timeIndex = timeSlots.findIndex(
//           (slot) =>
//             slot.start === period.time.start && slot.end === period.time.end
//         );
//         if (dayIndex !== -1 && timeIndex !== -1) {
//           formattedData[dayIndex][timeIndex] = {
//             type: "period",
//             subject: period.subject,
//             professor: period.teacher ? period.teacher.fullName : "Staff",
//             professorId: period.teacher ? period.teacher._id : null,
//             room: period.room || "",
//           };
//         }
//       });

//       setTimetableData(formattedData);
//       setViewMode("display");
//       setIsLoading(false);
//       return true; // Indicate that a timetable was found
//     }

//     setIsLoading(false);
//     return false; // No timetable found
//   } catch (error) {
//     console.error("Error fetching timetable:", error);
//     setIsLoading(false);
//     return false;
//   }
// };

// useEffect(() => {
//   if (!user?.id) return;

//   const fetchAcademicData = async () => {
//     try {
//       const response = await fetch(`/api/hod/${user.id}/academics`);
//       const data = await response.json();

//       if (data.academics && data.academics.length > 0) {
//         setAcademicData(data.academics[0]);
//         const years = data.academics[0].years.map((yearData) => yearData.year);
//         setAvailableYears(years);
//       }

//       // Check for URL parameters and fetch existing timetable
//       if (typeof window !== 'undefined') {
//         const urlParams = new URLSearchParams(window.location.search);
//         const yearParam = urlParams.get('year');
//         const semesterParam = urlParams.get('semester');
//         const divisionParam = urlParams.get('division');
//         const periodTimesParam = urlParams.get('periodTimes');
//         const breaksParam = urlParams.get('breaks');

//         if (yearParam && semesterParam && divisionParam) {
//           setYear(yearParam);
//           setSemester(semesterParam);
//           setDivision(divisionParam);

//           try {
//             if (periodTimesParam) {
//               const parsedPeriodTimes = JSON.parse(decodeURIComponent(periodTimesParam));
//               if (Array.isArray(parsedPeriodTimes)) {
//                 setPeriodTimes(parsedPeriodTimes);
//               }
//             }
//             if (breaksParam) {
//               const parsedBreaks = JSON.parse(decodeURIComponent(breaksParam));
//               if (Array.isArray(parsedBreaks)) {
//                 setBreaks(parsedBreaks);
//               }
//             }
//           } catch (error) {
//             console.error('Error parsing URL parameters:', error);
//           }

//           // Try to fetch existing timetable
//           const hasTimetable = await fetchExistingTimetable();
//           if (!hasTimetable) {
//             // If no timetable exists, generate a new one
//             generateTimetable();
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching academic data:', error);
//     }
//   };

//   fetchAcademicData();
// }, [user?.id]);

// useEffect(() => {
//   if (year && semester && division) {
//     const checkTimetable = async () => {
//       setIsLoading(true);
//       const hasTimetable = await fetchExistingTimetable();
//       if (!hasTimetable) {
//         setTimetableData(null); // Clear timetable data if none exists
//         setViewMode('config'); // Show configuration view to allow generation
//       }
//       setIsLoading(false);
//     };
//     checkTimetable();
//   }
// }, [year, semester, division]);

//   // const generateTimetable = async () => {
//   //   if (!year || !semester || !division || !academicData) {
//   //     alert('Please select year, semester, and division');
//   //     return;
//   //   }

//   //   setIsGenerating(true);
//   //   setIsLoading(true);

//   //   try {
//   //     const yearData = academicData.years.find((y) => y.year === year && y.semester === semester);
//   //     if (!yearData) {
//   //       throw new Error('No data found for selected year and semester');
//   //     }

//   //     const divisionData = yearData.divisions.find((d) => d.name === division);
//   //     if (!divisionData) {
//   //       throw new Error('No data found for selected division');
//   //     }

//   //     const subjects = divisionData.subjects || [];
//   //     const res = await fetch('/api/teachers');
//   //     const tech = await res.json();

//   //     if (!tech) {
//   //       throw new Error('No teacher data found');
//   //     }
//   //     const teachers = tech.filter((d) => d.department === user.department && d.role === 'teacher');

//   //     const timeSlots = generateTimeSlots();
//   //     const generatedData = days.map(() =>
//   //       timeSlots.map((slot) => ({
//   //         type: slot.type === 'break' ? 'break' : 'period',
//   //         subject: slot.type === 'break' ? slot.label : 'Free Period',
//   //         professor: slot.type === 'break' ? '' : '',
//   //         professorId: slot.type === 'break' ? null : null,
//   //         breakType: slot.type === 'break' ? slot.breakType : undefined,
//   //         room: '',
//   //       }))
//   //     );

//   //     const shuffledSubjects = [...subjects].sort(() => Math.random() - 0.5);
//   //     const periodsPerDay = timeSlots.filter((slot) => slot.type !== 'break').length;
//   //     const totalPeriods = periodsPerDay * days.length;
//   //     const periodsToAssign = Math.min(subjects.length * 4, totalPeriods);
//   //     let assignedPeriods = 0;

//   //     // Create a list of available periods
//   //     const availablePeriods = [];
//   //     days.forEach((_, dayIndex) => {
//   //       timeSlots.forEach((slot, timeIndex) => {
//   //         if (slot.type !== 'break') {
//   //           availablePeriods.push({ dayIndex, timeIndex });
//   //         }
//   //       });
//   //     });

//   //     // Shuffle available periods
//   //     for (let i = availablePeriods.length - 1; i > 0; i--) {
//   //       const j = Math.floor(Math.random() * (i + 1));
//   //       [availablePeriods[i], availablePeriods[j]] = [availablePeriods[j], availablePeriods[i]];
//   //     }

//   //     shuffledSubjects.forEach((subject) => {
//   //       let periodsAssignedForSubject = 0;
//   //       const maxPeriodsPerSubject = 4;

//   //       while (periodsAssignedForSubject < maxPeriodsPerSubject && availablePeriods.length > 0) {
//   //         const { dayIndex, timeIndex } = availablePeriods.shift();
//   //         const teacher = teachers.find((t) => t._id === subject.teacher);
//   //         const professorName = teacher ? teacher.fullName : 'Staff';

//   //         generatedData[dayIndex][timeIndex] = {
//   //           type: 'period',
//   //           subject: subject.name || 'Unnamed Subject',
//   //           professor: professorName,
//   //           professorId: subject.teacher,
//   //           room: '',
//   //         };

//   //         periodsAssignedForSubject++;
//   //         assignedPeriods++;
//   //       }
//   //     });

//   //     setTimetableData(generatedData);

//   //     if (typeof window !== 'undefined') {
//   //       const params = new URLSearchParams();
//   //       params.set('year', year);
//   //       params.set('semester', semester);
//   //       params.set('division', division);
//   //       params.set('periodTimes', encodeURIComponent(JSON.stringify(periodTimes)));
//   //       params.set('breaks', encodeURIComponent(JSON.stringify(breaks)));

//   //       window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error generating timetable:', error);
//   //     alert('Error generating timetable: ' + error.message);

//   //     const timeSlots = generateTimeSlots();
//   //     const emptyData = days.map(() =>
//   //       timeSlots.map((slot) =>
//   //         slot.type === 'break'
//   //           ? { type: 'break', label: slot.label, breakType: slot.breakType }
//   //           : { type: 'period', subject: 'Free Period', professor: '', professorId: null}
//   //       )
//   //     );
//   //     setTimetableData(emptyData);
//   //   } finally {
//   //     setIsGenerating(false);
//   //     setIsLoading(false);
//   //     setViewMode('display');
//   //   }
//   // };



//   const generateTimetable = async () => {
//   if (!year || !semester || !division || !academicData) {
//     alert('Please select year, semester, and division');
//     return;
//   }

//   setIsGenerating(true);
//   setIsLoading(true);

//   try {
//     // Check for existing timetable
//     const hasTimetable = await fetchExistingTimetable();
//     if (hasTimetable) {
//       setIsGenerating(false);
//       setIsLoading(false);
//       return; // Exit if timetable already exists
//     }

//     // Existing logic for generating a new timetable
//     const yearData = academicData.years.find((y) => y.year === year && y.semester === semester);
//     if (!yearData) {
//       throw new Error('No data found for selected year and semester');
//     }

//     const divisionData = yearData.divisions.find((d) => d.name === division);
//     if (!divisionData) {
//       throw new Error('No data found for selected division');
//     }

//     const subjects = divisionData.subjects || [];
//     const res = await fetch('/api/teachers');
//     const tech = await res.json();

//     if (!tech) {
//       throw new Error('No teacher data found');
//     }
//     const teachers = tech.filter((d) => d.department === user.department && d.role === 'teacher');

//     const timeSlots = generateTimeSlots();
//     const generatedData = days.map(() =>
//       timeSlots.map((slot) => ({
//         type: slot.type === 'break' ? 'break' : 'period',
//         subject: slot.type === 'break' ? slot.label : 'Free Period',
//         professor: slot.type === 'break' ? '' : '',
//         professorId: slot.type === 'break' ? null : null,
//         breakType: slot.type === 'break' ? slot.breakType : undefined,
//         room: '',
//       }))
//     );

//     const shuffledSubjects = [...subjects].sort(() => Math.random() - 0.5);
//     const periodsPerDay = timeSlots.filter((slot) => slot.type !== 'break').length;
//     const totalPeriods = periodsPerDay * days.length;
//     const periodsToAssign = Math.min(subjects.length * 4, totalPeriods);
//     let assignedPeriods = 0;

//     const availablePeriods = [];
//     days.forEach((_, dayIndex) => {
//       timeSlots.forEach((slot, timeIndex) => {
//         if (slot.type !== 'break') {
//           availablePeriods.push({ dayIndex, timeIndex });
//         }
//       });
//     });

//     for (let i = availablePeriods.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [availablePeriods[i], availablePeriods[j]] = [availablePeriods[j], availablePeriods[i]];
//     }

//     shuffledSubjects.forEach((subject) => {
//       let periodsAssignedForSubject = 0;
//       const maxPeriodsPerSubject = 4;

//       while (periodsAssignedForSubject < maxPeriodsPerSubject && availablePeriods.length > 0) {
//         const { dayIndex, timeIndex } = availablePeriods.shift();
//         const teacher = teachers.find((t) => t._id === subject.teacher);
//         const professorName = teacher ? teacher.fullName : 'Staff';

//         generatedData[dayIndex][timeIndex] = {
//           type: 'period',
//           subject: subject.name || 'Unnamed Subject',
//           professor: professorName,
//           professorId: subject.teacher,
//           room: '',
//         };

//         periodsAssignedForSubject++;
//         assignedPeriods++;
//       }
//     });

//     setTimetableData(generatedData);

//     if (typeof window !== 'undefined') {
//       const params = new URLSearchParams();
//       params.set('year', year);
//       params.set('semester', semester);
//       params.set('division', division);
//       params.set('periodTimes', encodeURIComponent(JSON.stringify(periodTimes)));
//       params.set('breaks', encodeURIComponent(JSON.stringify(breaks)));

//       window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
//     }
//   } catch (error) {
//     console.error('Error generating timetable:', error);
//     alert('Error generating timetable: ' + error.message);

//     const timeSlots = generateTimeSlots();
//     const emptyData = days.map(() =>
//       timeSlots.map((slot) =>
//         slot.type === 'break'
//           ? { type: 'break', label: slot.label, breakType: slot.breakType }
//           : { type: 'period', subject: 'Free Period', professor: '', professorId: null, room: '' }
//       )
//     );
//     setTimetableData(emptyData);
//   } finally {
//     setIsGenerating(false);
//     setIsLoading(false);
//     setViewMode('display');
//   }
// };
//   const saveTimetable = async () => {
//     if (!timetableData || !year || !semester || !division) {
//       alert('Please generate a timetable first');
//       return;
//     }

//     try {
//       const formattedTimetable = [];

//       days.forEach((day, dayIndex) => {
//         generateTimeSlots().forEach((slot, timeIndex) => {
//           const periodData = timetableData[dayIndex][timeIndex];

//           if (periodData.type === 'period' && periodData.subject !== 'Free Period') {
//             formattedTimetable.push({
//               day: day,
//               period: `Period ${timeIndex + 1}`,
//               subject: periodData.subject,
//               teacher: periodData.professorId,
//               time: {
//                 start: slot.start,
//                 end: slot.end,
//               },
//             });
//           }
//         });
//       });

//       const academicResponse = await fetch(`/api/hod/${user.id}/academics`);
//       const academicData = await academicResponse.json();

//       if (!academicData.academics || !academicData.academics.length) {
//         throw new Error('No academic data found');
//       }

//       const academicDoc = academicData.academics[0];
//       const academicId = academicDoc._id;

//       const response = await fetch(`/api/hod/${user.id}/timetable`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           academicId,
//           year,
//           semester,
//           division,
//           timetable: formattedTimetable,
//         }),
//       });

//       if (response.ok) {
//         alert('Timetable saved successfully!');
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to save timetable');
//       }
//     } catch (error) {
//       console.error('Error saving timetable:', error);
//       alert('Error saving timetable: ' + error.message);
//     }
//   };

//   const downloadTimetable = () => {
//     alert('Download functionality would be implemented here');
//   };

//   const printTimetable = () => {
//     window.print();
//   };

//   const getBreakColor = (breakType) => {
//     switch (breakType) {
//       case 'short':
//         return 'bg-blue-100 border-blue-200';
//       case 'long':
//         return 'bg-green-100 border-green-200';
//       case 'lunch':
//         return 'bg-yellow-100 border-yellow-200';
//       default:
//         return 'bg-gray-100 border-gray-200';
//     }
//   };

//   const editConfiguration = () => {
//     setViewMode('config');
//   };

//   const renderTimetable = () => (
//     <DndProvider backend={HTML5Backend}>
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr>
//               <th className="p-3 border border-gray-200 bg-gray-100"></th>
//               {days.map((day) => (
//                 <th key={day} className="p-3 border border-gray-200 bg-gray-100 font-medium">
//                   {day}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {timetableData &&
//               generateTimeSlots().map((slot, timeIndex) => (
//                 <tr key={timeIndex}>
//                   <td className="p-3 border border-gray-200 bg-gray-50 font-medium">
//                     {slot.start} - {slot.end}
//                     <div className="text-xs text-gray-500">{slot.label}</div>
//                   </td>
//                   {days.map((day, dayIndex) => {
//                     const data = timetableData[dayIndex][timeIndex];
//                     return (
//                       <DroppableTimetableCell
//                         key={day}
//                         dayIndex={dayIndex}
//                         timeIndex={timeIndex}
//                         moveItem={moveTimetableItem}
//                         onDelete={deletePeriod}
//                         isEditMode={isEditMode}
//                       >
//                         {isEditMode && data.type !== 'break' ? (
//                           <DraggableTimetableItem
//                             data={data}
//                             dayIndex={dayIndex}
//                             timeIndex={timeIndex}
//                             moveItem={moveTimetableItem}
//                             onDelete={deletePeriod}
//                             getBreakColor={getBreakColor}
//                           />
//                         ) : data.type === 'break' ? (
//                           <div className={`text-center p-2 rounded-lg border ${getBreakColor(data.breakType)}`}>
//                             <div className="font-semibold">{data.label}</div>
//                             <div className="text-xs">Break</div>
//                           </div>
//                         ) : data.subject === 'Free Period' ? (
//                           <div className="text-center p-2 text-gray-400 italic">Free Period</div>
//                         ) : (
//                           <div className="text-center">
//                             <div className="font-semibold text-indigo-700">{data.subject}</div>
//                             <div className="text-sm text-gray-600">{data.professor}</div>
//                             <div className="text-xs text-gray-500 mt-1">{data.room}</div>
//                           </div>
//                         )}
//                       </DroppableTimetableCell>
//                     );
//                   })}
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </DndProvider>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-6xl">
//         {viewMode === 'config' ? (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//               <div>
//                 <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
//                   Academic Year
//                 </label>
//                 <select
//                   id="year"
//                   value={year}
//                   onChange={(e) => setYear(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value="">Select Year</option>
//                   {availableYears.map((y) => (
//                     <option key={y} value={y}>{y}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
//                   Semester
//                 </label>
//                 <select
//                   id="semester"
//                   value={semester}
//                   onChange={(e) => setSemester(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   disabled={!year}
//                 >
//                   <option value="">Select Semester</option>
//                   {availableSemesters.map((s) => (
//                     <option key={s} value={s}>{s}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-2">
//                   Division
//                 </label>
//                 <select
//                   id="division"
//                   value={division}
//                   onChange={(e) => setDivision(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   disabled={!semester}
//                 >
//                   <option value="">Select Division</option>
//                   {availableDivisions.map((d) => (
//                     <option key={d} value={d}>Division {d}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Period Times</h3>
//                 <button
//                   onClick={addPeriodTime}
//                   className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
//                 >
//                   + Add Period
//                 </button>
//               </div>

//               <div className="space-y-3">
//                 {periodTimes.map((period, index) => (
//                   <div key={index} className="flex items-center space-x-3">
//                     <span className="w-20 text-gray-600">Period {index + 1}:</span>
//                     <input
//                       type="time"
//                       value={period.start}
//                       onChange={(e) => updatePeriodTime(index, 'start', e.target.value)}
//                       className="px-3 py-2 border border-gray-300 rounded-lg"
//                     />
//                     <span className="text-gray-500">to</span>
//                     <input
//                       type="time"
//                       value={period.end}
//                       onChange={(e) => updatePeriodTime(index, 'end', e.target.value)}
//                       className="px-3 py-2 border border-gray-300 rounded-lg"
//                     />
//                     <button
//                       onClick={() => removePeriodTime(index)}
//                       className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Breaks</h3>
//                 <button
//                   onClick={() => setShowBreakModal(true)}
//                   className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
//                 >
//                   + Add Break
//                 </button>
//               </div>

//               {breaks.length > 0 ? (
//                 <div className="space-y-3">
//                   {breaks.map((breakItem, index) => (
//                     <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <div>
//                         <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getBreakColor(breakItem.type)}`}>
//                           {breakItem.type}
//                         </span>
//                         <span className="ml-2 font-medium">{breakItem.label}</span>
//                         <span className="ml-4 text-gray-600">{breakItem.start} - {breakItem.end}</span>
//                         <span className="ml-4 text-gray-500">({breakItem.duration} mins)</span>
//                       </div>
//                       <button
//                         onClick={() => removeBreak(index)}
//                         className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-4">No breaks added yet</p>
//               )}
//             </div>

//             <div className="flex justify-center">
//               <button
//                 onClick={generateTimetable}
//                 disabled={isGenerating || !division}
//                 className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
//               >
//                 {isGenerating ? 'Generating...' : 'Generate Timetable'}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             {isLoading ? (
//               <div className="text-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                 <p className="mt-4 text-gray-600">Generating your timetable...</p>
//               </div>
//             ) : (
//               <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//                 <div className="flex justify-between items-center mb-6">
//                   <div>
//                     <button
//                       onClick={editConfiguration}
//                       className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-2 transition-colors"
//                     >
//                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                       </svg>
//                       Edit Configuration
//                     </button>
//                     <h2 className="text-2xl font-semibold text-gray-800">
//                       Timetable for Year {year} - {semester} - Division {division}
//                     </h2>
//                   </div>
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => setIsEditMode(!isEditMode)}
//                       className={`px-4 py-2 rounded-lg transition-colors ${
//                         isEditMode ? 'bg-green-600 text-white hover:bg-green-700' : 'text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
//                       }`}
//                     >
//                       {isEditMode ? 'Save Changes' : 'Edit Timetable'}
//                     </button>
//                     <button
//                       onClick={saveTimetable}
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                     >
//                       Save Timetable
//                     </button>
//                     <button
//                       onClick={downloadTimetable}
//                       className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
//                     >
//                       Download
//                     </button>
//                     <button
//                       onClick={printTimetable}
//                       className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                       Print
//                     </button>
//                   </div>
//                 </div>

//                 {isEditMode && (
//                   <div className="mb-4 p-3 bg-blue-50 rounded-lg text-blue-700">
//                     <p className="text-sm">
//                       Drag and drop subjects to rearrange your timetable. Click the × button to delete a period (breaks cannot be deleted).
//                     </p>
//                   </div>
//                 )}

//                 {renderTimetable()}
//               </div>
//             )}
//           </>
//         )}

//         {showBreakModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
//               <h3 className="text-xl font-semibold mb-4">Add New Break</h3>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Break Type</label>
//                   <select
//                     value={newBreak.type}
//                     onChange={(e) => {
//                       const breakType = breakTypes.find((bt) => bt.id === e.target.value);
//                       setNewBreak({
//                         ...newBreak,
//                         type: e.target.value,
//                         duration: breakType.defaultDuration,
//                         label: breakType.name,
//                       });
//                     }}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   >
//                     {breakTypes.map((type) => (
//                       <option key={type.id} value={type.id}>{type.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//                   <input
//                     type="time"
//                     value={newBreak.start}
//                     onChange={(e) => setNewBreak({ ...newBreak, start: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//                   <input
//                     type="time"
//                     value={newBreak.end}
//                     onChange={(e) => setNewBreak({ ...newBreak, end: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes): {newBreak.duration}</label>
//                   <input
//                     type="range"
//                     min="5"
//                     max="120"
//                     step="5"
//                     value={newBreak.duration}
//                     onChange={(e) => setNewBreak({ ...newBreak, duration: parseInt(e.target.value) })}
//                     className="w-full"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Custom Label (optional)</label>
//                   <input
//                     type="text"
//                     value={newBreak.label}
//                     onChange={(e) => setNewBreak({ ...newBreak, label: e.target.value })}
//                     placeholder={breakTypes.find((bt) => bt.id === newBreak.type)?.name}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3 mt-6">
//                 <button onClick={() => setShowBreakModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
//                   Cancel
//                 </button>
//                 <button onClick={addBreak} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
//                   Add Break
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx global>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           .container,
//           .container * {
//             visibility: visible;
//           }
//           .container {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//           }
//           button {
//             display: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default TimetablePage;


// "use client";
// import { useSession } from '@/context/SessionContext';
// import { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// // Component for draggable timetable items
// const DraggableTimetableItem = ({ data, dayIndex, timeIndex, moveItem, onDelete, getBreakColor }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: 'timetable-item',
//     item: { dayIndex, timeIndex, data },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div ref={drag} className={`cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'} relative`}>
//       {data.type === 'break' ? (
//         <div className={`text-center p-2 rounded-lg border ${getBreakColor(data.breakType)}`}>
//           <div className="font-semibold">{data.label}</div>
//           <div className="text-xs">Break</div>
//         </div>
//       ) : (
//         <div className="text-center p-2 border border-gray-200 rounded-lg bg-white">
//           <button
//             onClick={() => onDelete(dayIndex, timeIndex)}
//             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
//             title="Delete period"
//           >
//             ×
//           </button>
//           <div className="font-semibold text-indigo-700">{data.subject}</div>
//           <div className="text-sm text-gray-600">{data.professor}</div>
//           <div className="text-xs text-gray-500 mt-1">{data.room}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Component for droppable timetable cells
// const DroppableTimetableCell = ({ children, dayIndex, timeIndex, moveItem, onDelete, isEditMode }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: 'timetable-item',
//     drop: (item) => {
//       if (item.dayIndex !== dayIndex || item.timeIndex !== timeIndex) {
//         moveItem(item.dayIndex, item.timeIndex, dayIndex, timeIndex);
//       }
//     },
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   return (
//     <td ref={drop} className={`p-3 border border-gray-200 ${isOver ? 'bg-blue-50' : ''}`}>
//       {children}
//     </td>
//   );
// };

// const TimetablePage = () => {
//   const { user } = useSession();
//   // State for configuration
//   const [year, setYear] = useState('');
//   const [semester, setSemester] = useState('');
//   const [division, setDivision] = useState('');
//   const [periodTimes, setPeriodTimes] = useState([
//     { start: '09:00', end: '10:00' },
//     { start: '10:00', end: '11:00' },
//     { start: '11:00', end: '12:00' },
//     { start: '12:00', end: '13:00' },
//     { start: '14:00', end: '15:00' },
//     { start: '15:00', end: '16:00' },
//   ]);
//   const [breaks, setBreaks] = useState([
//     { type: 'lunch', start: '13:00', end: '14:00', duration: 60, label: 'Lunch Break' },
//   ]);

//   // State for academic data
//   const [academicData, setAcademicData] = useState(null);
//   const [availableYears, setAvailableYears] = useState([]);
//   const [availableSemesters, setAvailableSemesters] = useState([]);
//   const [availableDivisions, setAvailableDivisions] = useState([]);

//   // State for timetable
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [timetableData, setTimetableData] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // State for UI
//   const [showBreakModal, setShowBreakModal] = useState(false);
//   const [newBreak, setNewBreak] = useState({
//     type: 'short',
//     start: '',
//     end: '',
//     duration: 15,
//     label: '',
//   });
//   const [viewMode, setViewMode] = useState('config'); // 'config' or 'display'

//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const breakTypes = [
//     { id: 'short', name: 'Short Break', defaultDuration: 15 },
//     { id: 'long', name: 'Long Break', defaultDuration: 30 },
//     { id: 'lunch', name: 'Lunch Break', defaultDuration: 60 },
//     { id: 'custom', name: 'Custom Break', defaultDuration: 15 },
//   ];

//   // Fetch academic data on component mount
//   useEffect(() => {
//     if (!user?.id) return;

//     const fetchAcademicData = async () => {
//       try {
//         const response = await fetch(`/api/hod/${user.id}/academics`);
//         const data = await response.json();

//         if (data.academics && data.academics.length > 0) {
//           setAcademicData(data.academics[0]);
//           const years = data.academics[0].years.map((yearData) => yearData.year);
//           setAvailableYears(years);
//         }
//       } catch (error) {
//         console.error('Error fetching academic data:', error);
//       }
//     };

//     fetchAcademicData();
//   }, [user?.id]);

//   // Update available semesters when year changes
//   useEffect(() => {
//     if (academicData && year) {
//       const yearData = academicData.years.find((y) => y.year === year);
//       if (yearData) {
//         const semesters = yearData.semester ? [yearData.semester] : [];
//         setAvailableSemesters(semesters);
//       } else {
//         setAvailableSemesters([]);
//       }
//       setSemester('');
//       setDivision('');
//     }
//   }, [year, academicData]);

//   // Update available divisions when semester changes
//   useEffect(() => {
//     if (academicData && year && semester) {
//       const yearData = academicData.years.find((y) => y.year === year && y.semester === semester);
//       if (yearData && yearData.divisions) {
//         const divisions = yearData.divisions.map((d) => d.name);
//         setAvailableDivisions(divisions);
//       } else {
//         setAvailableDivisions([]);
//       }
//       setDivision('');
//     }
//   }, [semester, year, academicData]);

//   // Check for existing timetable when year, semester, and division are set
//   useEffect(() => {
//     if (!user?.id || !year || !semester || !division) return;

//     const checkTimetable = async () => {
//       setIsLoading(true);
//       const hasTimetable = await fetchExistingTimetable();
//       if (!hasTimetable) {
//         setTimetableData(null);
//         setViewMode('config');
//       }
//       setIsLoading(false);
//     };

//     checkTimetable();
//   }, [year, semester, division, user?.id]);

//   // Handle URL parameters for direct timetable display
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const urlParams = new URLSearchParams(window.location.search);
//       const yearParam = urlParams.get('year');
//       const semesterParam = urlParams.get('semester');
//       const divisionParam = urlParams.get('division');
//       const periodTimesParam = urlParams.get('periodTimes');
//       const breaksParam = urlParams.get('breaks');

//       if (yearParam && semesterParam && divisionParam) {
//         setYear(yearParam);
//         setSemester(semesterParam);
//         setDivision(divisionParam);

//         try {
//           if (periodTimesParam) {
//             const parsedPeriodTimes = JSON.parse(decodeURIComponent(periodTimesParam));
//             if (Array.isArray(parsedPeriodTimes)) {
//               setPeriodTimes(parsedPeriodTimes);
//             }
//           }
//           if (breaksParam) {
//             const parsedBreaks = JSON.parse(decodeURIComponent(breaksParam));
//             if (Array.isArray(parsedBreaks)) {
//               setBreaks(parsedBreaks);
//             }
//           }
//         } catch (error) {
//           console.error('Error parsing URL parameters:', error);
//         }
//       }
//     }
//   }, []);

//   // Update break duration when start or end time changes
//   useEffect(() => {
//     if (newBreak.start && newBreak.end) {
//       const startTime = new Date(`2000-01-01T${newBreak.start}`);
//       const endTime = new Date(`2000-01-01T${newBreak.end}`);
//       const duration = (endTime - startTime) / (1000 * 60); // duration in minutes

//       if (duration > 0) {
//         setNewBreak((prev) => ({ ...prev, duration }));
//       }
//     }
//   }, [newBreak.start, newBreak.end]);

//   // Function to delete a period
//   const deletePeriod = (dayIndex, timeIndex) => {
//     if (!timetableData) return;

//     const newTimetableData = [...timetableData];

//     if (newTimetableData[dayIndex][timeIndex].type === 'break') {
//       return;
//     }

//     newTimetableData[dayIndex][timeIndex] = {
//       type: 'period',
//       subject: 'Free Period',
//       professor: '',
//       professorId: null,
//       room: '',
//     };

//     setTimetableData(newTimetableData);
//   };

//   // Function to move items in the timetable
//   const moveTimetableItem = (fromDay, fromTime, toDay, toTime) => {
//     if (!timetableData) return;

//     const newTimetableData = [...timetableData];

//     if (
//       newTimetableData[fromDay][fromTime].type === 'break' ||
//       newTimetableData[toDay][toTime].type === 'break'
//     ) {
//       return;
//     }

//     const temp = newTimetableData[fromDay][fromTime];
//     newTimetableData[fromDay][fromTime] = newTimetableData[toDay][toTime];
//     newTimetableData[toDay][toTime] = temp;

//     setTimetableData(newTimetableData);
//   };

//   const addPeriodTime = () => {
//     setPeriodTimes([...periodTimes, { start: '', end: '' }]);
//   };

//   const updatePeriodTime = (index, field, value) => {
//     const updatedTimes = [...periodTimes];
//     updatedTimes[index][field] = value;
//     setPeriodTimes(updatedTimes);
//   };

//   const removePeriodTime = (index) => {
//     if (periodTimes.length > 1) {
//       const updatedTimes = [...periodTimes];
//       updatedTimes.splice(index, 1);
//       setPeriodTimes(updatedTimes);
//     }
//   };

//   const addBreak = () => {
//     if (newBreak.start && newBreak.end && newBreak.duration > 0) {
//       const breakType = breakTypes.find((bt) => bt.id === newBreak.type);
//       const label = newBreak.label || breakType.name;

//       setBreaks([...breaks, { ...newBreak, label }]);
//       setNewBreak({
//         type: 'short',
//         start: '',
//         end: '',
//         duration: 15,
//         label: '',
//       });
//       setShowBreakModal(false);
//     }
//   };

//   const removeBreak = (index) => {
//     const updatedBreaks = [...breaks];
//     updatedBreaks.splice(index, 1);
//     setBreaks(updatedBreaks);
//   };

//   const generateTimeSlots = () => {
//     const allSlots = [];

//     periodTimes.forEach((period, index) => {
//       allSlots.push({
//         type: 'period',
//         start: period.start,
//         end: period.end,
//         label: `Period ${index + 1}`,
//         index,
//       });
//     });

//     breaks.forEach((breakItem, index) => {
//       allSlots.push({
//         type: 'break',
//         start: breakItem.start,
//         end: breakItem.end,
//         label: breakItem.label,
//         breakType: breakItem.type,
//         index,
//       });
//     });

//     return allSlots.sort((a, b) => {
//       const aTime = new Date(`2000-01-01T${a.start}`);
//       const bTime = new Date(`2000-01-01T${b.start}`);
//       return aTime - bTime;
//     });
//   };

//   const fetchExistingTimetable = async () => {
//     if (!user?.id || !year || !semester || !division) return false;

//     try {
//       setIsLoading(true);
//       const response = await fetch(
//         `/api/hod/${user.id}/timetable/get?year=${year}&semester=${semester}&division=${division}`
//       );
//       const data = await response.json();

//       if (response.ok && data.timetable) {
//         const timeSlots = generateTimeSlots();
//         const formattedData = days.map(() =>
//           timeSlots.map((slot) => ({
//             type: slot.type === "break" ? "break" : "period",
//             subject: slot.type === "break" ? slot.label : "Free Period",
//             professor: slot.type === "break" ? "" : "",
//             professorId: slot.type === "break" ? null : null,
//             breakType: slot.type === "break" ? slot.breakType : undefined,
//             room: "",
//           }))
//         );

//         data.timetable.forEach((period) => {
//           const dayIndex = days.indexOf(period.day);
//           const timeIndex = timeSlots.findIndex(
//             (slot) =>
//               slot.start === period.time.start && slot.end === period.time.end
//           );
//           if (dayIndex !== -1 && timeIndex !== -1) {
//             formattedData[dayIndex][timeIndex] = {
//               type: "period",
//               subject: period.subject,
//               professor: period.teacher ? period.teacher.fullName : "Staff",
//               professorId: period.teacher ? period.teacher._id : null,
//               room: period.room || "",
//             };
//           }
//         });

//         setTimetableData(formattedData);
//         setViewMode("display");
//         setIsLoading(false);
//         return true;
//       }

//       setIsLoading(false);
//       return false;
//     } catch (error) {
//       console.error("Error fetching timetable:", error);
//       setIsLoading(false);
//       return false;
//     }
//   };

//   const generateTimetable = async () => {
//     if (!year || !semester || !division || !academicData) {
//       alert('Please select year, semester, and division');
//       return;
//     }

//     setIsGenerating(true);
//     setIsLoading(true);

//     try {
//       // Check for existing timetable
//       const hasTimetable = await fetchExistingTimetable();
//       if (hasTimetable) {
//         setIsGenerating(false);
//         setIsLoading(false);
//         return;
//       }

//       const yearData = academicData.years.find((y) => y.year === year && y.semester === semester);
//       if (!yearData) {
//         throw new Error('No data found for selected year and semester');
//       }

//       const divisionData = yearData.divisions.find((d) => d.name === division);
//       if (!divisionData) {
//         throw new Error('No data found for selected division');
//       }

//       const subjects = divisionData.subjects || [];
//       const res = await fetch('/api/teachers');
//       const tech = await res.json();

//       if (!tech) {
//         throw new Error('No teacher data found');
//       }
//       const teachers = tech.filter((d) => d.department === user.department && d.role === 'teacher');

//       const timeSlots = generateTimeSlots();
//       const generatedData = days.map(() =>
//         timeSlots.map((slot) => ({
//           type: slot.type === 'break' ? 'break' : 'period',
//           subject: slot.type === 'break' ? slot.label : 'Free Period',
//           professor: slot.type === 'break' ? '' : '',
//           professorId: slot.type === 'break' ? null : null,
//           breakType: slot.type === 'break' ? slot.breakType : undefined,
//           room: '',
//         }))
//       );

//       const shuffledSubjects = [...subjects].sort(() => Math.random() - 0.5);
//       const periodsPerDay = timeSlots.filter((slot) => slot.type !== 'break').length;
//       const totalPeriods = periodsPerDay * days.length;
//       const periodsToAssign = Math.min(subjects.length * 4, totalPeriods);
//       let assignedPeriods = 0;

//       const availablePeriods = [];
//       days.forEach((_, dayIndex) => {
//         timeSlots.forEach((slot, timeIndex) => {
//           if (slot.type !== 'break') {
//             availablePeriods.push({ dayIndex, timeIndex });
//           }
//         });
//       });

//       for (let i = availablePeriods.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [availablePeriods[i], availablePeriods[j]] = [availablePeriods[j], availablePeriods[i]];
//       }

//       shuffledSubjects.forEach((subject) => {
//         let periodsAssignedForSubject = 0;
//         const maxPeriodsPerSubject = 4;

//         while (periodsAssignedForSubject < maxPeriodsPerSubject && availablePeriods.length > 0) {
//           const { dayIndex, timeIndex } = availablePeriods.shift();
//           const teacher = teachers.find((t) => t._id === subject.teacher);
//           const professorName = teacher ? teacher.fullName : 'Staff';

//           generatedData[dayIndex][timeIndex] = {
//             type: 'period',
//             subject: subject.name || 'Unnamed Subject',
//             professor: professorName,
//             professorId: subject.teacher,
//             room: '',
//           };

//           periodsAssignedForSubject++;
//           assignedPeriods++;
//         }
//       });

//       setTimetableData(generatedData);

//       if (typeof window !== 'undefined') {
//         const params = new URLSearchParams();
//         params.set('year', year);
//         params.set('semester', semester);
//         params.set('division', division);
//         params.set('periodTimes', encodeURIComponent(JSON.stringify(periodTimes)));
//         params.set('breaks', encodeURIComponent(JSON.stringify(breaks)));

//         window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
//       }
//     } catch (error) {
//       console.error('Error generating timetable:', error);
//       alert('Error generating timetable: ' + error.message);

//       const timeSlots = generateTimeSlots();
//       const emptyData = days.map(() =>
//         timeSlots.map((slot) =>
//           slot.type === 'break'
//             ? { type: 'break', label: slot.label, breakType: slot.breakType }
//             : { type: 'period', subject: 'Free Period', professor: '', professorId: null, room: '' }
//         )
//       );
//       setTimetableData(emptyData);
//     } finally {
//       setIsGenerating(false);
//       setIsLoading(false);
//       setViewMode('display');
//     }
//   };

//   const saveTimetable = async () => {
//     if (!timetableData || !year || !semester || !division) {
//       alert('Please generate a timetable first');
//       return;
//     }

//     try {
//       const formattedTimetable = [];

//       days.forEach((day, dayIndex) => {
//         generateTimeSlots().forEach((slot, timeIndex) => {
//           const periodData = timetableData[dayIndex][timeIndex];

//           if (periodData.type === 'period' && periodData.subject !== 'Free Period') {
//             formattedTimetable.push({
//               day: day,
//               period: `Period ${timeIndex + 1}`,
//               subject: periodData.subject,
//               teacher: periodData.professorId,
//               time: {
//                 start: slot.start,
//                 end: slot.end,
//               },
//             });
//           }
//         });
//       });

//       const academicResponse = await fetch(`/api/hod/${user.id}/academics`);
//       const academicData = await academicResponse.json();

//       if (!academicData.academics || !academicData.academics.length) {
//         throw new Error('No academic data found');
//       }

//       const academicDoc = academicData.academics[0];
//       const academicId = academicDoc._id;

//       const response = await fetch(`/api/hod/${user.id}/timetable`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           academicId,
//           year,
//           semester,
//           division,
//           timetable: formattedTimetable,
//         }),
//       });

//       if (response.ok) {
//         alert('Timetable saved successfully!');
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to save timetable');
//       }
//     } catch (error) {
//       console.error('Error saving timetable:', error);
//       alert('Error saving timetable: ' + error.message);
//     }
//   };

//   const downloadTimetable = () => {
//     alert('Download functionality would be implemented here');
//   };

//   const printTimetable = () => {
//     window.print();
//   };

//   const getBreakColor = (breakType) => {
//     switch (breakType) {
//       case 'short':
//         return 'bg-blue-100 border-blue-200';
//       case 'long':
//         return 'bg-green-100 border-green-200';
//       case 'lunch':
//         return 'bg-yellow-100 border-yellow-200';
//       default:
//         return 'bg-gray-100 border-gray-200';
//     }
//   };

//   const editConfiguration = () => {
//     setViewMode('config');
//   };

//   const renderTimetable = () => (
//     <DndProvider backend={HTML5Backend}>
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr>
//               <th className="p-3 border border-gray-200 bg-gray-100"></th>
//               {days.map((day) => (
//                 <th key={day} className="p-3 border border-gray-200 bg-gray-100 font-medium">
//                   {day}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {timetableData &&
//               generateTimeSlots().map((slot, timeIndex) => (
//                 <tr key={timeIndex}>
//                   <td className="p-3 border border-gray-200 bg-gray-50 font-medium">
//                     {slot.start} - {slot.end}
//                     <div className="text-xs text-gray-500">{slot.label}</div>
//                   </td>
//                   {days.map((day, dayIndex) => {
//                     const data = timetableData[dayIndex][timeIndex];
//                     return (
//                       <DroppableTimetableCell
//                         key={day}
//                         dayIndex={dayIndex}
//                         timeIndex={timeIndex}
//                         moveItem={moveTimetableItem}
//                         onDelete={deletePeriod}
//                         isEditMode={isEditMode}
//                       >
//                         {isEditMode && data.type !== 'break' ? (
//                           <DraggableTimetableItem
//                             data={data}
//                             dayIndex={dayIndex}
//                             timeIndex={timeIndex}
//                             moveItem={moveTimetableItem}
//                             onDelete={deletePeriod}
//                             getBreakColor={getBreakColor}
//                           />
//                         ) : data.type === 'break' ? (
//                           <div className={`text-center p-2 rounded-lg border ${getBreakColor(data.breakType)}`}>
//                             <div className="font-semibold">{data.label}</div>
//                             <div className="text-xs">Break</div>
//                           </div>
//                         ) : data.subject === 'Free Period' ? (
//                           <div className="text-center p-2 text-gray-400 italic">Free Period</div>
//                         ) : (
//                           <div className="text-center">
//                             <div className="font-semibold text-indigo-700">{data.subject}</div>
//                             <div className="text-sm text-gray-600">{data.professor}</div>
//                             <div className="text-xs text-gray-500 mt-1">{data.room}</div>
//                           </div>
//                         )}
//                       </DroppableTimetableCell>
//                     );
//                   })}
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </DndProvider>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-6xl">
//         {viewMode === 'config' ? (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//               <div>
//                 <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
//                   Academic Year
//                 </label>
//                 <select
//                   id="year"
//                   value={year}
//                   onChange={(e) => setYear(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value="">Select Year</option>
//                   {availableYears.map((y) => (
//                     <option key={y} value={y}>{y}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
//                   Semester
//                 </label>
//                 <select
//                   id="semester"
//                   value={semester}
//                   onChange={(e) => setSemester(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   disabled={!year}
//                 >
//                   <option value="">Select Semester</option>
//                   {availableSemesters.map((s) => (
//                     <option key={s} value={s}>{s}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-2">
//                   Division
//                 </label>
//                 <select
//                   id="division"
//                   value={division}
//                   onChange={(e) => setDivision(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   disabled={!semester}
//                 >
//                   <option value="">Select Division</option>
//                   {availableDivisions.map((d) => (
//                     <option key={d} value={d}>Division {d}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Period Times</h3>
//                 <button
//                   onClick={addPeriodTime}
//                   className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
//                 >
//                   + Add Period
//                 </button>
//               </div>

//               <div className="space-y-3">
//                 {periodTimes.map((period, index) => (
//                   <div key={index} className="flex items-center space-x-3">
//                     <span className="w-20 text-gray-600">Period {index + 1}:</span>
//                     <input
//                       type="time"
//                       value={period.start}
//                       onChange={(e) => updatePeriodTime(index, 'start', e.target.value)}
//                       className="px-3 py-2 border border-gray-300 rounded-lg"
//                     />
//                     <span className="text-gray-500">to</span>
//                     <input
//                       type="time"
//                       value={period.end}
//                       onChange={(e) => updatePeriodTime(index, 'end', e.target.value)}
//                       className="px-3 py-2 border border-gray-300 rounded-lg"
//                     />
//                     <button
//                       onClick={() => removePeriodTime(index)}
//                       className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Breaks</h3>
//                 <button
//                   onClick={() => setShowBreakModal(true)}
//                   className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
//                 >
//                   + Add Break
//                 </button>
//               </div>

//               {breaks.length > 0 ? (
//                 <div className="space-y-3">
//                   {breaks.map((breakItem, index) => (
//                     <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <div>
//                         <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getBreakColor(breakItem.type)}`}>
//                           {breakItem.type}
//                         </span>
//                         <span className="ml-2 font-medium">{breakItem.label}</span>
//                         <span className="ml-4 text-gray-600">{breakItem.start} - {breakItem.end}</span>
//                         <span className="ml-4 text-gray-500">({breakItem.duration} mins)</span>
//                       </div>
//                       <button
//                         onClick={() => removeBreak(index)}
//                         className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-4">No breaks added yet</p>
//               )}
//             </div>

//             <div className="flex justify-center">
//               <button
//                 onClick={generateTimetable}
//                 disabled={isGenerating || !division}
//                 className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
//               >
//                 {isGenerating ? 'Generating...' : 'Generate Timetable'}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             {isLoading ? (
//               <div className="text-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                 <p className="mt-4 text-gray-600">Loading timetable...</p>
//               </div>
//             ) : (
//               <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//                 <div className="flex justify-between items-center mb-6">
//                   <div>
//                     <button
//                       onClick={editConfiguration}
//                       className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-2 transition-colors"
//                     >
//                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                       </svg>
//                       Edit Configuration
//                     </button>
//                     <h2 className="text-2xl font-semibold text-gray-800">
//                       Timetable for Year {year} - {semester} - Division {division}
//                     </h2>
//                   </div>
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => setIsEditMode(!isEditMode)}
//                       className={`px-4 py-2 rounded-lg transition-colors ${
//                         isEditMode ? 'bg-green-600 text-white hover:bg-green-700' : 'text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
//                       }`}
//                     >
//                       {isEditMode ? 'Save Changes' : 'Edit Timetable'}
//                     </button>
//                     <button
//                       onClick={saveTimetable}
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                     >
//                       Save Timetable
//                     </button>
//                     <button
//                       onClick={downloadTimetable}
//                       className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
//                     >
//                       Download
//                     </button>
//                     <button
//                       onClick={printTimetable}
//                       className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                       Print
//                     </button>
//                   </div>
//                 </div>

//                 {isEditMode && (
//                   <div className="mb-4 p-3 bg-blue-50 rounded-lg text-blue-700">
//                     <p className="text-sm">
//                       Drag and drop subjects to rearrange your timetable. Click the × button to delete a period (breaks cannot be deleted).
//                     </p>
//                   </div>
//                 )}

//                 {renderTimetable()}
//               </div>
//             )}
//           </>
//         )}

//         {showBreakModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
//               <h3 className="text-xl font-semibold mb-4">Add New Break</h3>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Break Type</label>
//                   <select
//                     value={newBreak.type}
//                     onChange={(e) => {
//                       const breakType = breakTypes.find((bt) => bt.id === e.target.value);
//                       setNewBreak({
//                         ...newBreak,
//                         type: e.target.value,
//                         duration: breakType.defaultDuration,
//                         label: breakType.name,
//                       });
//                     }}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   >
//                     {breakTypes.map((type) => (
//                       <option key={type.id} value={type.id}>{type.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//                   <input
//                     type="time"
//                     value={newBreak.start}
//                     onChange={(e) => setNewBreak({ ...newBreak, start: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//                   <input
//                     type="time"
//                     value={newBreak.end}
//                     onChange={(e) => setNewBreak({ ...newBreak, end: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes): {newBreak.duration}</label>
//                   <input
//                     type="range"
//                     min="5"
//                     max="120"
//                     step="5"
//                     value={newBreak.duration}
//                     onChange={(e) => setNewBreak({ ...newBreak, duration: parseInt(e.target.value) })}
//                     className="w-full"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Custom Label (optional)</label>
//                   <input
//                     type="text"
//                     value={newBreak.label}
//                     onChange={(e) => setNewBreak({ ...newBreak, label: e.target.value })}
//                     placeholder={breakTypes.find((bt) => bt.id === newBreak.type)?.name}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3 mt-6">
//                 <button onClick={() => setShowBreakModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
//                   Cancel
//                 </button>
//                 <button onClick={addBreak} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
//                   Add Break
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx global>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           .container,
//           .container * {
//             visibility: visible;
//           }
//           .container {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//           }
//           button {
//             display: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default TimetablePage;


"use client";
import { useSession } from '@/context/SessionContext';
import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Component for draggable timetable items
const DraggableTimetableItem = ({ data, dayIndex, timeIndex, moveItem, onDelete, getBreakColor }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'timetable-item',
    item: { dayIndex, timeIndex, data },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className={`cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'} relative`}>
      {data.type === 'break' ? (
        <div className={`text-center p-2 rounded-lg border ${getBreakColor(data.breakType)}`}>
          <div className="font-semibold">{data.label}</div>
          <div className="text-xs">Break</div>
        </div>
      ) : (
        <div className="text-center p-2 border border-gray-200 rounded-lg bg-white">
          <button
            onClick={() => onDelete(dayIndex, timeIndex)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
            title="Delete period"
          >
            ×
          </button>
          <div className="font-semibold text-indigo-700">{data.subject}</div>
          <div className="text-sm text-gray-600">{data.professor}</div>
          <div className="text-xs text-gray-500 mt-1">{data.room}</div>
        </div>
      )}
    </div>
  );
};

// Component for droppable timetable cells
const DroppableTimetableCell = ({ children, dayIndex, timeIndex, moveItem, onDelete, isEditMode }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'timetable-item',
    drop: (item) => {
      if (item.dayIndex !== dayIndex || item.timeIndex !== timeIndex) {
        moveItem(item.dayIndex, item.timeIndex, dayIndex, timeIndex);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <td ref={drop} className={`p-3 border border-gray-200 ${isOver ? 'bg-blue-50' : ''}`}>
      {children}
    </td>
  );
};

const TimetablePage = () => {
  const { user } = useSession();
  // State for configuration
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [division, setDivision] = useState('');
  const [periodTimes, setPeriodTimes] = useState([
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
  ]);
  const [breaks, setBreaks] = useState([
    { type: 'lunch', start: '13:00', end: '14:00', duration: 60, label: 'Lunch Break' },
  ]);

  // State for academic data
  const [academicData, setAcademicData] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableDivisions, setAvailableDivisions] = useState([]);

  // State for timetable
  const [isEditMode, setIsEditMode] = useState(false);
  const [timetableData, setTimetableData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timetableExists, setTimetableExists] = useState(false);

  // State for UI
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [newBreak, setNewBreak] = useState({
    type: 'short',
    start: '',
    end: '',
    duration: 15,
    label: '',
  });
  const [viewMode, setViewMode] = useState('config'); // 'config' or 'display'

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const breakTypes = [
    { id: 'short', name: 'Short Break', defaultDuration: 15 },
    { id: 'long', name: 'Long Break', defaultDuration: 30 },
    { id: 'lunch', name: 'Lunch Break', defaultDuration: 60 },
    { id: 'custom', name: 'Custom Break', defaultDuration: 15 },
  ];

  // Fetch academic data on component mount
  useEffect(() => {
    if (!user?.id) return;

    const fetchAcademicData = async () => {
      try {
        const response = await fetch(`/api/hod/${user.id}/academics`);
        const data = await response.json();

        if (data.academics && data.academics.length > 0) {
          setAcademicData(data.academics[0]);
          const years = data.academics[0].years.map((yearData) => yearData.year);
          setAvailableYears(years);
        }
      } catch (error) {
        console.error('Error fetching academic data:', error);
      }
    };

    fetchAcademicData();
  }, [user?.id]);

  // Update available semesters when year changes
  useEffect(() => {
    if (academicData && year) {
      const yearData = academicData.years.find((y) => y.year === year);
      if (yearData) {
        const semesters = yearData.semester ? [yearData.semester] : [];
        setAvailableSemesters(semesters);
      } else {
        setAvailableSemesters([]);
      }
      setSemester('');
      setDivision('');
      setTimetableExists(false);
    }
  }, [year, academicData]);

  // Update available divisions when semester changes
  useEffect(() => {
    if (academicData && year && semester) {
      const yearData = academicData.years.find((y) => y.year === year && y.semester === semester);
      if (yearData && yearData.divisions) {
        const divisions = yearData.divisions.map((d) => d.name);
        setAvailableDivisions(divisions);
      } else {
        setAvailableDivisions([]);
      }
      setDivision('');
      setTimetableExists(false);
    }
  }, [semester, year, academicData]);

  // Check for existing timetable when division is selected
  useEffect(() => {
    if (!user?.id || !year || !semester || !division) return;

    const checkTimetable = async () => {
      const hasTimetable = await fetchExistingTimetable();
      if (!hasTimetable) {
        setTimetableExists(false);
      } else {
        setTimetableExists(true);
      }
    };

    checkTimetable();
  }, [year, semester, division, user?.id]);

  // Handle URL parameters for direct timetable access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const yearParam = urlParams.get('year');
      const semesterParam = urlParams.get('semester');
      const divisionParam = urlParams.get('division');
      const periodTimesParam = urlParams.get('periodTimes');
      const breaksParam = urlParams.get('breaks');

      if (yearParam && semesterParam && divisionParam) {
        setYear(yearParam);
        setSemester(semesterParam);
        setDivision(divisionParam);

        try {
          if (periodTimesParam) {
            const parsedPeriodTimes = JSON.parse(decodeURIComponent(periodTimesParam));
            if (Array.isArray(parsedPeriodTimes)) {
              setPeriodTimes(parsedPeriodTimes);
            }
          }
          if (breaksParam) {
            const parsedBreaks = JSON.parse(decodeURIComponent(breaksParam));
            if (Array.isArray(parsedBreaks)) {
              setBreaks(parsedBreaks);
            }
          }
        } catch (error) {
          console.error('Error parsing URL parameters:', error);
        }
      }
    }
  }, []);

  // Update break duration when start or end time changes
  useEffect(() => {
    if (newBreak.start && newBreak.end) {
      const startTime = new Date(`2000-01-01T${newBreak.start}`);
      const endTime = new Date(`2000-01-01T${newBreak.end}`);
      const duration = (endTime - startTime) / (1000 * 60); // duration in minutes

      if (duration > 0) {
        setNewBreak((prev) => ({ ...prev, duration }));
      }
    }
  }, [newBreak.start, newBreak.end]);

  // Function to fetch existing timetable
  const fetchExistingTimetable = async () => {
    if (!user?.id || !year || !semester || !division) return false;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/hod/${user.id}/timetable?year=${year}&semester=${semester}&division=${division}`
      );
      const data = await response.json();

      if (response.ok) {
        if (data.timetable && data.timetable.length === 0) {
          // Empty timetable - show message to generate one
          setTimetableData(null);
          setViewMode('config');
          setIsLoading(false);
          return false;
        }

        if (data.timetable) {
          const timeSlots = generateTimeSlots();
          const formattedData = days.map(() => (
            timeSlots.map((slot) => ({
            type: slot.type === "break" ? "break" : "period",
            subject: slot.type === "break" ? slot.label : "Free Period",
            professor: slot.type === "break" ? "" : "",
            professorId: slot.type === "break" ? null : null,
            breakType: slot.type === "break" ? slot.breakType : undefined,
            room: "",
          }))
          ));

        data.timetable.forEach((period) => {
          const dayIndex = days.indexOf(period.day);
          const timeIndex = timeSlots.findIndex(
            (slot) => slot.start === period.time.start && slot.end === period.time.end
          );
          if (dayIndex !== -1 && timeIndex !== -1) {
            formattedData[dayIndex][timeIndex] = {
              type: "period",
              subject: period.subject,
              professor: period.teacher ? period.teacher.fullName : "Staff",
              professorId: period.teacher ? period.teacher._id : null,
              room: period.room || "",
            };
          }
        });

        setTimetableData(formattedData);
        setViewMode("display");
        setIsLoading(false);
        return true;
        }
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Error fetching timetable:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Function to generate new timetable
  const generateTimetable = async () => {
    if (!year || !semester || !division || !academicData) {
      alert('Please select year, semester, and division');
      return;
    }

    setIsGenerating(true);
    setIsLoading(true);

    try {
      const yearData = academicData.years.find((y) => y.year === year && y.semester === semester);
      if (!yearData) {
        throw new Error('No data found for selected year and semester');
      }

      const divisionData = yearData.divisions.find((d) => d.name === division);
      if (!divisionData) {
        throw new Error('No data found for selected division');
      }

      const subjects = divisionData.subjects || [];
      const res = await fetch('/api/teachers');
      const tech = await res.json();

      if (!tech) {
        throw new Error('No teacher data found');
      }
      const teachers = tech.filter((d) => d.department === user.department && d.role === 'teacher');

      const timeSlots = generateTimeSlots();
      const generatedData = days.map(() =>
        timeSlots.map((slot) => ({
          type: slot.type === 'break' ? 'break' : 'period',
          subject: slot.type === 'break' ? slot.label : 'Free Period',
          professor: slot.type === 'break' ? '' : '',
          professorId: slot.type === 'break' ? null : null,
          breakType: slot.type === 'break' ? slot.breakType : undefined,
          room: '',
        }))
      );

      const shuffledSubjects = [...subjects].sort(() => Math.random() - 0.5);
      const periodsPerDay = timeSlots.filter((slot) => slot.type !== 'break').length;
      const totalPeriods = periodsPerDay * days.length;
      const periodsToAssign = Math.min(subjects.length * 4, totalPeriods);
      let assignedPeriods = 0;

      const availablePeriods = [];
      days.forEach((_, dayIndex) => {
        timeSlots.forEach((slot, timeIndex) => {
          if (slot.type !== 'break') {
            availablePeriods.push({ dayIndex, timeIndex });
          }
        });
      });

      for (let i = availablePeriods.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availablePeriods[i], availablePeriods[j]] = [availablePeriods[j], availablePeriods[i]];
      }

      shuffledSubjects.forEach((subject) => {
        let periodsAssignedForSubject = 0;
        const maxPeriodsPerSubject = 4;

        while (periodsAssignedForSubject < maxPeriodsPerSubject && availablePeriods.length > 0) {
          const { dayIndex, timeIndex } = availablePeriods.shift();
          const teacher = teachers.find((t) => t._id === subject.teacher);
          const professorName = teacher ? teacher.fullName : 'Staff';

          generatedData[dayIndex][timeIndex] = {
            type: 'period',
            subject: subject.name || 'Unnamed Subject',
            professor: professorName,
            professorId: subject.teacher,
            room: '',
          };

          periodsAssignedForSubject++;
          assignedPeriods++;
        }
      });

      setTimetableData(generatedData);
      setViewMode('display');

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams();
        params.set('year', year);
        params.set('semester', semester);
        params.set('division', division);
        params.set('periodTimes', encodeURIComponent(JSON.stringify(periodTimes)));
        params.set('breaks', encodeURIComponent(JSON.stringify(breaks)));

        window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
      }
    } catch (error) {
      console.error('Error generating timetable:', error);
      alert('Error generating timetable: ' + error.message);

      const timeSlots = generateTimeSlots();
      const emptyData = days.map(() =>
        timeSlots.map((slot) =>
          slot.type === 'break'
            ? { type: 'break', label: slot.label, breakType: slot.breakType }
            : { type: 'period', subject: 'Free Period', professor: '', professorId: null, room: '' }
        )
      );
      setTimetableData(emptyData);
      setViewMode('display');
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  // Function to delete a period
  const deletePeriod = (dayIndex, timeIndex) => {
    if (!timetableData) return;

    const newTimetableData = [...timetableData];

    if (newTimetableData[dayIndex][timeIndex].type === 'break') {
      return;
    }

    newTimetableData[dayIndex][timeIndex] = {
      type: 'period',
      subject: 'Free Period',
      professor: '',
      professorId: null,
      room: '',
    };

    setTimetableData(newTimetableData);
  };

  // Function to move items in the timetable
  const moveTimetableItem = (fromDay, fromTime, toDay, toTime) => {
    if (!timetableData) return;

    const newTimetableData = [...timetableData];

    if (
      newTimetableData[fromDay][fromTime].type === 'break' ||
      newTimetableData[toDay][toTime].type === 'break'
    ) {
      return;
    }

    const temp = newTimetableData[fromDay][fromTime];
    newTimetableData[fromDay][fromTime] = newTimetableData[toDay][toTime];
    newTimetableData[toDay][toTime] = temp;

    setTimetableData(newTimetableData);
  };

  const addPeriodTime = () => {
    setPeriodTimes([...periodTimes, { start: '', end: '' }]);
  };

  const updatePeriodTime = (index, field, value) => {
    const updatedTimes = [...periodTimes];
    updatedTimes[index][field] = value;
    setPeriodTimes(updatedTimes);
  };

  const removePeriodTime = (index) => {
    if (periodTimes.length > 1) {
      const updatedTimes = [...periodTimes];
      updatedTimes.splice(index, 1);
      setPeriodTimes(updatedTimes);
    }
  };

  const addBreak = () => {
    if (newBreak.start && newBreak.end && newBreak.duration > 0) {
      const breakType = breakTypes.find((bt) => bt.id === newBreak.type);
      const label = newBreak.label || breakType.name;

      setBreaks([...breaks, { ...newBreak, label }]);
      setNewBreak({
        type: 'short',
        start: '',
        end: '',
        duration: 15,
        label: '',
      });
      setShowBreakModal(false);
    }
  };

  const removeBreak = (index) => {
    const updatedBreaks = [...breaks];
    updatedBreaks.splice(index, 1);
    setBreaks(updatedBreaks);
  };

  const generateTimeSlots = () => {
    const allSlots = [];

    periodTimes.forEach((period, index) => {
      allSlots.push({
        type: 'period',
        start: period.start,
        end: period.end,
        label: `Period ${index + 1}`,
        index,
      });
    });

    breaks.forEach((breakItem, index) => {
      allSlots.push({
        type: 'break',
        start: breakItem.start,
        end: breakItem.end,
        label: breakItem.label,
        breakType: breakItem.type,
        index,
      });
    });

    return allSlots.sort((a, b) => {
      const aTime = new Date(`2000-01-01T${a.start}`);
      const bTime = new Date(`2000-01-01T${b.start}`);
      return aTime - bTime;
    });
  };

  const saveTimetable = async () => {
    if (!timetableData || !year || !semester || !division) {
      alert('Please generate or view a timetable first');
      return;
    }

    try {
      const formattedTimetable = [];

      days.forEach((day, dayIndex) => {
        generateTimeSlots().forEach((slot, timeIndex) => {
          const periodData = timetableData[dayIndex][timeIndex];

          if (periodData.type === 'period' && periodData.subject !== 'Free Period') {
            formattedTimetable.push({
              day: day,
              period: `Period ${timeIndex + 1}`,
              subject: periodData.subject,
              teacher: periodData.professorId,
              time: {
                start: slot.start,
                end: slot.end,
              },
            });
          }
        });
      });

      const academicResponse = await fetch(`/api/hod/${user.id}/academics`);
      const academicData = await academicResponse.json();

      if (!academicData.academics || !academicData.academics.length) {
        throw new Error('No academic data found');
      }

      const academicDoc = academicData.academics[0];
      const academicId = academicDoc._id;

      const response = await fetch(`/api/hod/${user.id}/timetable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          academicId,
          year,
          semester,
          division,
          timetable: formattedTimetable,
        }),
      });

      if (response.ok) {
        alert('Timetable saved successfully!');
        setTimetableExists(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save timetable');
      }
    } catch (error) {
      console.error('Error saving timetable:', error);
      alert('Error saving timetable: ' + error.message);
    }
  };

  // const downloadTimetable = () => {
  //   alert('Download functionality would be implemented here');
  // };

  const printTimetable = () => {
    window.print();
  };

  const getBreakColor = (breakType) => {
    switch (breakType) {
      case 'short':
        return 'bg-blue-100 border-blue-200';
      case 'long':
        return 'bg-green-100 border-green-200';
      case 'lunch':
        return 'bg-yellow-100 border-yellow-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const editConfiguration = () => {
    setViewMode('config');
  };

  const viewTimetable = async () => {
    await fetchExistingTimetable();
  };

  const renderTimetable = () => (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 border border-gray-200 bg-gray-100"></th>
              {days.map((day) => (
                <th key={day} className="p-3 border border-gray-200 bg-gray-100 font-medium">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetableData &&
              generateTimeSlots().map((slot, timeIndex) => (
                <tr key={timeIndex}>
                  <td className="p-3 border border-gray-200 bg-gray-50 font-medium">
                    {slot.start} - {slot.end}
                    <div className="text-xs text-gray-500">{slot.label}</div>
                  </td>
                  {days.map((day, dayIndex) => {
                    const data = timetableData[dayIndex][timeIndex];
                    return (
                      <DroppableTimetableCell
                        key={day}
                        dayIndex={dayIndex}
                        timeIndex={timeIndex}
                        moveItem={moveTimetableItem}
                        onDelete={deletePeriod}
                        isEditMode={isEditMode}
                      >
                        {isEditMode && data.type !== 'break' ? (
                          <DraggableTimetableItem
                            data={data}
                            dayIndex={dayIndex}
                            timeIndex={timeIndex}
                            moveItem={moveTimetableItem}
                            onDelete={deletePeriod}
                            getBreakColor={getBreakColor}
                          />
                        ) : data.type === 'break' ? (
                          <div className={`text-center p-2 rounded-lg border ${getBreakColor(data.breakType)}`}>
                            <div className="font-semibold">{data.label}</div>
                            <div className="text-xs">Break</div>
                          </div>
                        ) : data.subject === 'Free Period' ? (
                          <div className="text-center p-2 text-gray-400 italic">Free Period</div>
                        ) : (
                          <div className="text-center">
                            <div className="font-semibold text-indigo-700">{data.subject}</div>
                            <div className="text-sm text-gray-600">{data.professor}</div>
                            <div className="text-xs text-gray-500 mt-1">{data.room}</div>
                          </div>
                        )}
                      </DroppableTimetableCell>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </DndProvider>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {viewMode === 'config' ? (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Year</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!year}
                >
                  <option value="">Select Semester</option>
                  {availableSemesters.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-2">
                  Division
                </label>
                <select
                  id="division"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!semester}
                >
                  <option value="">Select Division</option>
                  {availableDivisions.map((d) => (
                    <option key={d} value={d}>Division {d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Period Times</h3>
                <button
                  onClick={addPeriodTime}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
                >
                  + Add Period
                </button>
              </div>

              <div className="space-y-3">
                {periodTimes.map((period, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="w-20 text-gray-600">Period {index + 1}:</span>
                    <input
                      type="time"
                      value={period.start}
                      onChange={(e) => updatePeriodTime(index, 'start', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={period.end}
                      onChange={(e) => updatePeriodTime(index, 'end', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => removePeriodTime(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Breaks</h3>
                <button
                  onClick={() => setShowBreakModal(true)}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
                >
                  + Add Break
                </button>
              </div>

              {breaks.length > 0 ? (
                <div className="space-y-3">
                  {breaks.map((breakItem, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getBreakColor(breakItem.type)}`}>
                          {breakItem.type}
                        </span>
                        <span className="ml-2 font-medium">{breakItem.label}</span>
                        <span className="ml-4 text-gray-600">{breakItem.start} - {breakItem.end}</span>
                        <span className="ml-4 text-gray-500">({breakItem.duration} mins)</span>
                      </div>
                      <button
                        onClick={() => removeBreak(index)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No breaks added yet</p>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              {timetableExists ? (
                <button
                  onClick={viewTimetable}
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'View Timetable'}
                </button>
              ) : (
                <button
                  onClick={generateTimetable}
                  disabled={isGenerating || !division}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate Timetable'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading timetable...</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <button
                      onClick={editConfiguration}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-2 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Edit Configuration
                    </button>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Timetable for Year {year} - {semester} - Division {division}
                    </h2>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsEditMode(!isEditMode)}
                      className={`px-4 py-2 rounded-lg transition-colors ${isEditMode ? 'bg-green-600 text-white hover:bg-green-700' : 'text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                        }`}
                    >
                      {isEditMode ? 'Save Changes' : 'Edit Timetable'}
                    </button>
                    <button
                      onClick={saveTimetable}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save Timetable
                    </button>
                    {/* <button
                      onClick={downloadTimetable}
                      className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      Download
                    </button> */}
                    <button
                      onClick={printTimetable}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Print
                    </button>
                  </div>
                </div>

                {isEditMode && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg text-blue-700">
                    <p className="text-sm">
                      Drag and drop subjects to rearrange your timetable. Click the × button to delete a period (breaks cannot be deleted).
                    </p>
                  </div>
                )}

                {renderTimetable()}
              </div>
            )}
          </>
        )}

        {showBreakModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add New Break</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Break Type</label>
                  <select
                    value={newBreak.type}
                    onChange={(e) => {
                      const breakType = breakTypes.find((bt) => bt.id === e.target.value);
                      setNewBreak({
                        ...newBreak,
                        type: e.target.value,
                        duration: breakType.defaultDuration,
                        label: breakType.name,
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {breakTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newBreak.start}
                    onChange={(e) => setNewBreak({ ...newBreak, start: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newBreak.end}
                    onChange={(e) => setNewBreak({ ...newBreak, end: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes): {newBreak.duration}</label>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={newBreak.duration}
                    onChange={(e) => setNewBreak({ ...newBreak, duration: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Label (optional)</label>
                  <input
                    type="text"
                    value={newBreak.label}
                    onChange={(e) => setNewBreak({ ...newBreak, label: e.target.value })}
                    placeholder={breakTypes.find((bt) => bt.id === newBreak.type)?.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setShowBreakModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button onClick={addBreak} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Add Break
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .container,
          .container * {
            visibility: visible;
          }
          .container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TimetablePage;
