"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Calendar,
  FileText,
  Plus,
  Download,
  Search,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Users,
  Clipboard,
  Save,
  X,
  ChevronLeft,
  UserPlus,
  Clock
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';

const AcademicManagement = () => {
  const { user } = useSession();

  // State management
  const [activeTab, setActiveTab] = useState('courses');
  const [academics, setAcademics] = useState([]);
  const [selectedAcademic, setSelectedAcademic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [department, setDepartment] = useState('');

  // Modal states
  const [showYearModal, setShowYearModal] = useState(false);
  const [showDivisionModal, setShowDivisionModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);

  // Editing indices
  const [editingYear, setEditingYear] = useState(null);
  const [editingDivision, setEditingDivision] = useState(null);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [editingExam, setEditingExam] = useState(null);

  // Form states
  const [newYear, setNewYear] = useState({
    year: '',
    semester: '',
    divisions: []
  });
  const [newDivision, setNewDivision] = useState({
    name: '',
    students: [],
    subjects: [],
    timetable: [],
    exams: []
  });
  const [newSubject, setNewSubject] = useState({ name: '', teacher: '' });
  const [newTimetable, setNewTimetable] = useState({
    day: '',
    period: '',
    subject: '',
    teacher: '',
    time: { start: '', end: '' }
  });
  const [newExam, setNewExam] = useState({
    type: '',
    subject: '',
    totalMarks: '',
    date: '',
    duration: ''
  });

  // Days and periods for timetable
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = Array.from({ length: 8 }, (_, i) => `Period ${i + 1}`);
  const examTypes = ['Unit Test', 'Mid Term', 'Final Exam', 'Quiz', 'Practical'];
  const semesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

  // Fix for input focus issue
  useEffect(() => {
    const handleInputFocus = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        e.target.focus();
      }
    };

    document.addEventListener('mousedown', handleInputFocus);
    return () => {
      document.removeEventListener('mousedown', handleInputFocus);
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (user) {
      fetchAcademicData();
    }
  }, [user]);

  // API Functions
  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/hod/${user.id}`);
      console.log("Hod Details = ", response)
      if (!response.ok) {
        throw new Error('Failed to fetch academic data');
      }


      const data = await response.json();
      console.log(data)
      setAcademics(data.academics || []);
      setTeachers(data.teachers || []);
      setDepartment(data.department || '');

      if (data.academics && data.academics.length > 0) {
        setSelectedAcademic(data.academics[0]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching academic data:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveAcademicChanges = async (selectedAcademicData) => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (selectedAcademicData._id === 'default') {
        // Create new academic
        response = await fetch(`/api/hod/${user.id}/academics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            department: selectedAcademicData.department,
            years: selectedAcademicData.years
          })
        });
      } else {
        // Update existing academic
        response = await fetch(`/api/hod/${user.id}/academics`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            academicId: selectedAcademicData._id,
            years: selectedAcademicData.years
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save academic data');
      }

      const data = await response.json();

      if (selectedAcademicData._id === 'default') {
        // For new academic, add to the list
        setAcademics([...academics, data.academic]);
        setSelectedAcademic(data.academic);
      } else {
        // For existing academic, update the specific academic
        setAcademics(academics.map(academic =>
          academic._id === selectedAcademic._id ? data.academic : academic
        ));
        setSelectedAcademic(data.academic);
      }
      fetchAcademicData()
    } catch (err) {
      setError(err.message);
      console.error('Error saving academic data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addYear = async () => {
    try {
      if (!newYear.year.trim() || !newYear.semester.trim()) {
        setError('Please select both year and semester');
        return;
      }

      const updatedAcademic = {
        ...selectedAcademic,
        years: [...selectedAcademic.years, newYear]
      };

      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }

      setShowYearModal(false);
      setNewYear({ year: '', semester: '', divisions: [] });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding year:', err);
    }
  };
  //   const addYear = async () => {
  //     try {
  //       if (!newYear.year.trim()) {
  //         setError('Please select a year');
  //         return;
  //       }

  //       const updatedAcademic = {
  //         ...selectedAcademic,
  //         years: [...selectedAcademic.years, newYear]
  //       };

  //       setSelectedAcademic(updatedAcademic);

  //       if (selectedAcademic._id !== 'default') {
  //         await saveAcademicChanges(updatedAcademic);
  //       }

  //       setShowYearModal(false);
  //       setNewYear({ year: '', divisions: [] });
  //       setError(null);
  //     } catch (err) {
  //       setError(err.message);
  //       console.error('Error adding year:', err);
  //     }
  //   };

  const addDivision = async () => {
    try {
      if (!newDivision.name.trim()) {
        setError('Please enter a division name');
        return;
      }

      const updatedAcademic = { ...selectedAcademic };
      if (!updatedAcademic.years[editingYear].divisions) {
        updatedAcademic.years[editingYear].divisions = [];
      }
      updatedAcademic.years[editingYear].divisions.push(newDivision);

      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }

      setShowDivisionModal(false);
      setNewDivision({ name: '', students: [], subjects: [], timetable: [], exams: [] });
      setError(null);
      setEditingYear(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding division:', err);
    }
  };

  const addSubject = async () => {
    try {
      if (!newSubject.name.trim() || !newSubject.teacher) {
        setError('Please fill in all subject details');
        return;
      }

      const updatedAcademic = { ...selectedAcademic };
      updatedAcademic.years[editingYear].divisions[editingDivision].subjects.push(newSubject);

      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }

      setShowSubjectModal(false);
      setNewSubject({ name: '', teacher: '' });
      setError(null);
      setEditingYear(null);
      setEditingDivision(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding subject:', err);
    }
  };

  const addTimetable = async () => {
    try {
      if (!newTimetable.day || !newTimetable.period || !newTimetable.subject || !newTimetable.teacher || !newTimetable.time.start || !newTimetable.time.end) {
        setError('Please fill in all timetable details');
        return;
      }

      const updatedAcademic = { ...selectedAcademic };

      if (editingTimetable !== null) {
        // Update existing timetable
        updatedAcademic.years[editingYear].divisions[editingDivision].timetable[editingTimetable] = newTimetable;
      } else {
        // Add new timetable
        updatedAcademic.years[editingYear].divisions[editingDivision].timetable.push(newTimetable);
      }

      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }

      setShowTimetableModal(false);
      setNewTimetable({
        day: '',
        period: '',
        subject: '',
        teacher: '',
        time: { start: '', end: '' }
      });
      setError(null);
      setEditingYear(null);
      setEditingDivision(null);
      setEditingTimetable(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding timetable:', err);
    }
  };

  const addExam = async () => {
    try {
      if (!newExam.type || !newExam.subject || !newExam.totalMarks || !newExam.date || !newExam.duration) {
        setError('Please fill in all exam details');
        return;
      }

      const updatedAcademic = { ...selectedAcademic };

      if (editingExam !== null) {
        // Update existing exam
        updatedAcademic.years[editingYear].divisions[editingDivision].exams[editingExam] = newExam;
      } else {
        // Add new exam
        updatedAcademic.years[editingYear].divisions[editingDivision].exams.push(newExam);
      }

      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }

      setShowExamModal(false);
      setNewExam({
        type: '',
        subject: '',
        totalMarks: '',
        date: '',
        duration: ''
      });
      setError(null);
      setEditingYear(null);
      setEditingDivision(null);
      setEditingExam(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding exam:', err);
    }
  };

  const deleteYear = async (yearIndex) => {
    try {
      const updatedAcademic = { ...selectedAcademic };
      updatedAcademic.years.splice(yearIndex, 1);

      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting year:', err);
    }
  };

  const deleteDivision = async (yearIndex, divisionIndex) => {
    try {
      const updatedAcademic = { ...selectedAcademic };
      updatedAcademic.years[yearIndex].divisions.splice(divisionIndex, 1);

      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting division:', err);
    }
  };

  const deleteSubject = async (yearIndex, divisionIndex, subjectIndex) => {
    try {
      const updatedAcademic = { ...selectedAcademic };
      updatedAcademic.years[yearIndex].divisions[divisionIndex].subjects.splice(subjectIndex, 1);

      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting subject:', err);
    }
  };

  const deleteTimetable = async (yearIndex, divisionIndex, timetableIndex) => {
    try {
      const updatedAcademic = { ...selectedAcademic };
      updatedAcademic.years[yearIndex].divisions[divisionIndex].timetable.splice(timetableIndex, 1);

      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting timetable:', err);
    }
  };

  const deleteExam = async (yearIndex, divisionIndex, examIndex) => {
    try {
      const updatedAcademic = { ...selectedAcademic };
      updatedAcademic.years[yearIndex].divisions[divisionIndex].exams.splice(examIndex, 1);

      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting exam:', err);
    }
  };

  // ... (keep all other CRUD functions the same, they don't need modification)
  //   const YearModal = () => (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  //       <div className="bg-white rounded-lg p-6 w-full max-w-md">
  //         <div className="flex justify-between items-center mb-4">
  //           <h3 className="text-lg font-semibold">Add New Year</h3>
  //           <button onClick={() => setShowYearModal(false)}>
  //             <X className="w-5 h-5" />
  //           </button>
  //         </div>

  //         {error && (
  //           <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
  //             {error}
  //           </div>
  //         )}

  //         <div className="space-y-4">
  //           <div>
  //             <label className="block text-sm font-medium mb-1">Year</label>
  //             <select
  //               value={newYear.year}
  //               onChange={(e) => setNewYear({...newYear, year: e.target.value})}
  //               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //             >
  //               <option value="">Select Year</option>
  //               <option value="1st">1st Year</option>
  //               <option value="2nd">2nd Year</option>
  //               <option value="3rd">3rd Year</option>
  //               <option value="4th">4th Year</option>
  //             </select>
  //           </div>

  //           <div className="flex gap-2">
  //             <button
  //               onClick={addYear}
  //               className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
  //             >
  //               Add Year
  //             </button>
  //             <button
  //               onClick={() => {
  //                 setShowYearModal(false);
  //                 setError(null);
  //               }}
  //               className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
  //             >
  //               Cancel
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );

  const DivisionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Division</h3>
          <button onClick={() => setShowDivisionModal(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Division Name</label>
            <input
              type="text"
              value={newDivision.name}
              onChange={(e) => setNewDivision({ ...newDivision, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., A, B, C"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={addDivision}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Add Division
            </button>
            <button
              onClick={() => {
                setShowDivisionModal(false);
                setError(null);
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SubjectModal = React.memo(({
    isOpen,
    onClose,
    onSave,
    teachers,
    initialData,
    error
  }) => {
    const [formData, setFormData] = useState(initialData || {
      name: '',
      teacher: ''
    });

    const inputRef = useRef(null);

    useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name.trim() || !formData.teacher) {
        onSave(null, 'Please fill in all subject details');
        return;
      }
      onSave(formData);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {initialData ? 'Edit Subject' : 'Add New Subject'}
            </h3>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject Name</label>
              <input
                ref={inputRef}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Programming Fundamentals"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject Code</label>
              <input
                ref={inputRef}
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. SUS234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Assign Teacher</label>
              <select
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {initialData ? 'Update Subject' : 'Add Subject'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  });

  const TimetableModal = () => {
    const currentYear = selectedAcademic?.years[editingYear];
    const currentDivision = currentYear?.divisions[editingDivision];
    const currentSubjects = currentDivision?.subjects || [];
    const [timeError, setTimeError] = useState(null);

    // Validate time slots
    const validateTimeSlot = () => {
      if (!newTimetable.day || !newTimetable.period || !newTimetable.subject || !newTimetable.teacher) {
        setError('Please fill in all required fields');
        return false;
      }

      if (!newTimetable.time.start || !newTimetable.time.end) {
        setError('Please set both start and end times');
        return false;
      }

      // Check if start time is before end time
      if (newTimetable.time.start >= newTimetable.time.end) {
        setTimeError('End time must be after start time');
        return false;
      }

      // Check for overlapping time slots for the same day
      const existingSlots = currentDivision.timetable || [];
      const newStart = newTimetable.time.start;
      const newEnd = newTimetable.time.end;

      for (let i = 0; i < existingSlots.length; i++) {
        if (editingTimetable !== null && i === editingTimetable) continue;

        if (existingSlots[i].day === newTimetable.day) {
          const existingStart = existingSlots[i].time.start;
          const existingEnd = existingSlots[i].time.end;

          if ((newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)) {
            setTimeError(`Time conflict with ${existingSlots[i].period} (${existingStart}-${existingEnd})`);
            return false;
          }
        }
      }

      setTimeError(null);
      setError(null);
      return true;
    };

    const handleAddOrUpdateTimetable = async () => {
      if (!validateTimeSlot()) return;

      try {
        const updatedAcademic = { ...selectedAcademic };

        if (editingTimetable !== null) {
          // Update existing timetable slot
          updatedAcademic.years[editingYear].divisions[editingDivision].timetable[editingTimetable] = newTimetable;
        } else {
          // Add new timetable slot
          if (!updatedAcademic.years[editingYear].divisions[editingDivision].timetable) {
            updatedAcademic.years[editingYear].divisions[editingDivision].timetable = [];
          }
          updatedAcademic.years[editingYear].divisions[editingDivision].timetable.push(newTimetable);
        }

        setSelectedAcademic(updatedAcademic);

        if (selectedAcademic._id !== 'default') {
          await saveAcademicChanges(updatedAcademic);
        }

        setShowTimetableModal(false);
        setNewTimetable({
          day: '',
          period: '',
          subject: '',
          teacher: '',
          time: { start: '', end: '' }
        });
        setError(null);
        setTimeError(null);
        setEditingTimetable(null);
      } catch (err) {
        setError(err.message);
        console.error('Error saving timetable:', err);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                {editingTimetable !== null ? 'Edit Timetable Slot' : 'Add New Timetable Slot'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {currentYear?.year} Year • {currentYear?.semester} • Division {currentDivision?.name}
              </p>
            </div>
            <button
              onClick={() => {
                setShowTimetableModal(false);
                setEditingTimetable(null);
                setError(null);
                setTimeError(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {(error || timeError) && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error || timeError}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Day*</label>
                <select
                  value={newTimetable.day}
                  onChange={(e) => setNewTimetable({ ...newTimetable, day: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Day</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Period*</label>
                <select
                  value={newTimetable.period}
                  onChange={(e) => setNewTimetable({ ...newTimetable, period: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Period</option>
                  {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject*</label>
              <select
                value={newTimetable.subject}
                onChange={(e) => {
                  const selectedSubject = currentSubjects.find(s => s.name === e.target.value);
                  setNewTimetable({
                    ...newTimetable,
                    subject: e.target.value,
                    teacher: selectedSubject?.teacher || ''
                  });
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Subject</option>
                {currentSubjects.map(subject => (
                  <option key={subject.name} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Teacher*</label>
              <select
                value={newTimetable.teacher}
                onChange={(e) => setNewTimetable({ ...newTimetable, teacher: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!newTimetable.subject}
              >
                <option value="">Select Teacher</option>
                {newTimetable.subject ? (
                  teachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>{teacher.fullName}</option>
                  ))
                ) : (
                  <option value="" disabled>Select a subject first</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time*</label>
                <input
                  type="time"
                  value={newTimetable.time.start}
                  onChange={(e) => setNewTimetable({
                    ...newTimetable,
                    time: { ...newTimetable.time, start: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time*</label>
                <input
                  type="time"
                  value={newTimetable.time.end}
                  onChange={(e) => setNewTimetable({
                    ...newTimetable,
                    time: { ...newTimetable.time, end: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleAddOrUpdateTimetable}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {editingTimetable !== null ? 'Update Slot' : 'Add Slot'}
              </button>
              <button
                onClick={() => {
                  setShowTimetableModal(false);
                  setEditingTimetable(null);
                  setError(null);
                  setTimeError(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ExamModal = () => {
    const currentYear = selectedAcademic?.years[editingYear];
    const currentDivision = currentYear?.divisions[editingDivision];
    const currentSubjects = currentDivision?.subjects || [];
    const [dateError, setDateError] = useState(null);

    // Validate exam data
    const validateExam = () => {
      if (!newExam.type || !newExam.subject || !newExam.totalMarks || !newExam.date || !newExam.duration) {
        setError('Please fill in all required fields');
        return false;
      }

      // Validate total marks is a positive number
      if (isNaN(newExam.totalMarks)) {
        setError('Total marks must be a number');
        return false;
      }

      if (Number(newExam.totalMarks) <= 0) {
        setError('Total marks must be greater than 0');
        return false;
      }

      // Validate date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const examDate = new Date(newExam.date);

      if (examDate < today) {
        setDateError('Exam date cannot be in the past');
        return false;
      }

      // Check for duplicate exams (same type, subject and date)
      const existingExams = currentDivision.exams || [];
      for (let i = 0; i < existingExams.length; i++) {
        if (editingExam !== null && i === editingExam) continue;

        if (
          existingExams[i].type === newExam.type &&
          existingExams[i].subject === newExam.subject &&
          existingExams[i].date === newExam.date &&
          existingExams[i].duration === newExam.duration
        ) {
          setError('An exam of this type for this subject already exists on this date');
          return false;
        }
      }

      setDateError(null);
      setError(null);
      return true;
    };

    const handleAddOrUpdateExam = async () => {
      if (!validateExam()) return;

      try {
        const updatedAcademic = { ...selectedAcademic };

        if (editingExam !== null) {
          // Update existing exam
          updatedAcademic.years[editingYear].divisions[editingDivision].exams[editingExam] = newExam;
        } else {
          // Add new exam
          if (!updatedAcademic.years[editingYear].divisions[editingDivision].exams) {
            updatedAcademic.years[editingYear].divisions[editingDivision].exams = [];
          }
          updatedAcademic.years[editingYear].divisions[editingDivision].exams.push(newExam);
        }

        setSelectedAcademic(updatedAcademic);

        if (selectedAcademic._id !== 'default') {
          await saveAcademicChanges(updatedAcademic);
        }

        setShowExamModal(false);
        setNewExam({
          type: '',
          subject: '',
          totalMarks: '',
          date: '',
          duration:''
        });
        setError(null);
        setDateError(null);
        setEditingExam(null);
      } catch (err) {
        setError(err.message);
        console.error('Error saving exam:', err);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                {editingExam !== null ? 'Edit Exam' : 'Schedule New Exam'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {currentYear?.year} Year • {currentYear?.semester} • Division {currentDivision?.name}
              </p>
            </div>
            <button
              onClick={() => {
                setShowExamModal(false);
                setEditingExam(null);
                setError(null);
                setDateError(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {(error || dateError) && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error || dateError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Exam Type*</label>
              <select
                value={newExam.type}
                onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Exam Type</option>
                {examTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject*</label>
              <select
                value={newExam.subject}
                onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Subject</option>
                {currentSubjects.map(subject => (
                  <option key={subject.name} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Total Marks*</label>
              <input
                type="number"
                min="1"
                value={newExam.totalMarks}
                onChange={(e) => setNewExam({ ...newExam, totalMarks: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exam Date*</label>
              <input
                type="date"
                value={newExam.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration*</label>
              <input
                type="number"
                min="1"
                value={newExam.duration}
                onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g 30 min"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleAddOrUpdateExam}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {editingExam !== null ? 'Update Exam' : 'Schedule Exam'}
              </button>
              <button
                onClick={() => {
                  setShowExamModal(false);
                  setEditingExam(null);
                  setError(null);
                  setDateError(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal Components
  const YearModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Year</h3>
          <button onClick={() => setShowYearModal(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <select
              value={newYear.year}
              onChange={(e) => setNewYear({ ...newYear, year: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <select
              value={newYear.semester}
              onChange={(e) => setNewYear({ ...newYear, semester: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Semester</option>
              {semesters.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addYear}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Add Year
            </button>
            <button
              onClick={() => {
                setShowYearModal(false);
                setError(null);
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ... (keep other modal components the same)
  console.log("selected - ", selectedAcademic)
  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Course Structure</h3>
              <button
                onClick={() => setShowYearModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Year
              </button>
            </div>

            {selectedAcademic?.years?.map((year, yearIndex) => (
              <div key={yearIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                  <div>
                    <h4 className="font-medium text-gray-900">{year.year} Year</h4>
                    <p className="text-sm text-gray-600">{year.semester}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingYear(yearIndex);
                        setShowDivisionModal(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      <Plus className="w-3 h-3" />
                      Add Division
                    </button>

                    {/*<button
                      onClick={() => {
                        setEditingYear(yearIndex);
                        setNewYear(selectedAcademic.years[yearIndex]); // Prefill modal
                        setShowYearModal(true);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Edit Year"
                    >
                      <Edit className="w-4 h-4" />
                    </button> */}

                    <button
                      onClick={() => deleteYear(yearIndex)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {year.divisions?.map((division, divisionIndex) => (
                    <div key={divisionIndex} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-800">Division {division.name}</h5>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingYear(yearIndex);
                              setEditingDivision(divisionIndex);
                              setShowSubjectModal(true);
                            }}
                            className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            <Plus className="w-3 h-3" />
                            Add Subject
                          </button>

                          {/* <button
                            onClick={() => {
                              setEditingYear(yearIndex);
                              setEditingDivision(divisionIndex);
                              setNewDivision(division); // prefill form
                              setShowDivisionModal(true);
                            }}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit Division"
                          >
                            <Edit className="w-3 h-3" />
                          </button> */}

                          <button
                            onClick={() => deleteDivision(yearIndex, divisionIndex)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {division.subjects?.map((subject, subjectIndex) => (
                          <div key={subjectIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{subject.name}</p>
                              <p className="text-xs text-gray-600">
                                Teacher: {teachers.find(t => t._id === subject.teacher)?.fullName || 'Not assigned'}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setEditingYear(yearIndex);
                                  setEditingDivision(divisionIndex);
                                  setNewSubject(subject);
                                  setShowSubjectModal(true);
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteSubject(yearIndex, divisionIndex, subjectIndex)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      // In the timetable tab content
      case 'timetable':
        return (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-black">Timetable Management</h3>
              </div>
            </div>

            {/* Group by Year/Semester/Division */}
            {selectedAcademic?.years?.map((year, yearIndex) => (
              <div key={yearIndex} className="mb-8">
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <h4 className="font-medium">
                    {year.year} Year - {year.semester}
                  </h4>
                </div>

                {year.divisions?.map((division, divIndex) => (
                  <div key={divIndex} className="p-4 border-b">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Division {division.name}</h5>
                      <button
                        onClick={() => {
                          setEditingYear(yearIndex);
                          setEditingDivision(divIndex);
                          setNewTimetable({
                            day: '',
                            period: '',
                            subject: '',
                            teacher: '',
                            time: { start: '', end: '' }
                          });
                          setEditingTimetable(null);
                          setShowTimetableModal(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        <Plus className="w-3 h-3" />
                        Add Schedule
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {division.timetable?.map((slot, slotIndex) => (
                            <tr key={slotIndex} className="hover:bg-gray-50">
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{slot.day}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{slot.period}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{slot.subject}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {teachers.find(t => t._id === slot.teacher)?.fullName || 'Not assigned'}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {slot.time.start} - {slot.time.end}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingYear(yearIndex);
                                      setEditingDivision(divIndex);
                                      setEditingTimetable(slotIndex);
                                      setNewTimetable(slot);
                                      setShowTimetableModal(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteTimetable(yearIndex, divIndex, slotIndex)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {division.timetable?.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No timetable entries for this division
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );

      case 'exams':
        return (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-black">Exam Schedule</h3>
                {selectedAcademic?.years?.length > 0 && (
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    onClick={() => {
                      // Find first year and division with subjects
                      let defaultYearIndex = 0;
                      let defaultDivisionIndex = 0;
                      let found = false;

                      for (let y = 0; y < selectedAcademic.years.length; y++) {
                        const year = selectedAcademic.years[y];
                        for (let d = 0; d < year.divisions.length; d++) {
                          if (year.divisions[d].subjects?.length > 0) {
                            defaultYearIndex = y;
                            defaultDivisionIndex = d;
                            found = true;
                            break;
                          }
                        }
                        if (found) break;
                      }

                      setEditingYear(defaultYearIndex);
                      setEditingDivision(defaultDivisionIndex);
                      setNewExam({
                        type: '',
                        subject: '',
                        totalMarks: '',
                        date: '',
                        duration:''
                      });
                      setEditingExam(null);
                      setShowExamModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Schedule Exam
                  </button>
                )}
              </div>
            </div>
            <div className="p-4">
              {selectedAcademic?.years?.map((year, yearIndex) => (
                <div key={yearIndex} className="mb-8">
                  <div className="px-4 py-3 bg-gray-50 border-b">
                    <h4 className="font-medium">
                      {year.year} Year - {year.semester}
                    </h4>
                  </div>

                  {year.divisions?.map((division, divIndex) => (
                    <div key={divIndex} className="p-4 border-b">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium">Division {division.name}</h5>
                        <button
                          onClick={() => {
                            setEditingYear(yearIndex);
                            setEditingDivision(divIndex);
                            setNewExam({
                              type: '',
                              subject: '',
                              totalMarks: '',
                              date: '',
                              duration:''
                            });
                            setEditingExam(null);
                            setShowExamModal(true);
                          }}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          <Plus className="w-3 h-3" />
                          Add Exam
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Exam Type</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Marks</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {division.exams?.map((exam, examIndex) => (
                              <tr key={examIndex} className="hover:bg-gray-50">
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{exam.type}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{exam.subject}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{exam.totalMarks}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{exam.duration}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  {new Date(exam.date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingYear(yearIndex);
                                        setEditingDivision(divIndex);
                                        setNewExam({
                                          type: exam.type,
                                          subject: exam.subject,
                                          totalMarks: exam.totalMarks,
                                          date: exam.date.split('T')[0] ,// Format date for input
                                          duration: exam.duration
                                        });
                                        setEditingExam(examIndex);
                                        setShowExamModal(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteExam(yearIndex, divIndex, examIndex)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {(!division.exams || division.exams.length === 0) && (
                        <div className="text-center py-4 text-gray-500">
                          No exams scheduled for this division
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {selectedAcademic?.years?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No exam data available. Add academic years and divisions first.
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && selectedAcademic && (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Course Structure
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('timetable')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'timetable' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  {/* <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Timetable
                  </div> */}
                </button>
                <button
                  onClick={() => setActiveTab('exams')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'exams' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Exams
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {renderTabContent()}

            {/* Save Button for New Academic */}
            {selectedAcademic._id === 'default' && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => saveAcademicChanges(selectedAcademic)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Academic Structure
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !selectedAcademic && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <BookOpen className="w-full h-full" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No academic selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select an existing academic or create a new one to get started.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSelectedAcademic({
                    _id: 'default',
                    department: department,
                    years: []
                  });
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Academic
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showYearModal && <YearModal />}
      {showDivisionModal && <DivisionModal />}
      {/* {showSubjectModal && (
        <SubjectModal
          isOpen={showSubjectModal}
          onClose={() => {
            setShowSubjectModal(false);
            setError(null);
            setNewSubject({ name: '', teacher: '' });
          }}
          onSave={(data, err) => {
            if (err) {
              setError(err);
              return;
            }
            setNewSubject(data);
            addSubject();
          }}
          teachers={teachers}
          initialData={newSubject}
          error={error}
        />
      )} */}

      {showSubjectModal && (
        <SubjectModal
          isOpen={showSubjectModal}
          onClose={() => {
            setShowSubjectModal(false);
            setError(null);
            setNewSubject({ name: '', teacher: '' });
          }}
          onSave={(data, err) => {
            if (err) {
              setError(err);
              return;
            }

            const updatedAcademic = { ...selectedAcademic };
            const subjects = updatedAcademic.years[editingYear].divisions[editingDivision].subjects;

            // If subject exists (editing), update it
            const subjectIndex = subjects.findIndex(sub => sub.name === newSubject.name);

            if (subjectIndex !== -1) {
              subjects[subjectIndex] = data;
            } else {
              // Else, add new subject
              subjects.push(data);
            }

            setSelectedAcademic(updatedAcademic);

            if (selectedAcademic._id !== 'default') {
              saveAcademicChanges(updatedAcademic);
            }

            // Reset modal state
            setShowSubjectModal(false);
            setNewSubject({ name: '', teacher: '' });
            setEditingYear(null);
            setEditingDivision(null);
            setError(null);
          }}
          teachers={teachers}
          initialData={newSubject}
          error={error}
        />
      )}
      {showTimetableModal && <TimetableModal />}
      {showExamModal && <ExamModal />}
    </div>
  );
};

export default AcademicManagement;