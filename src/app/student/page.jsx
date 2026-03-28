'use client';

import { useEffect, useState } from 'react';
import { User, Edit, Settings, Lock, Loader2, MapPin, Users, Phone, PhoneCall, Save, X, ArrowRight, GraduationCap as GradIcon } from 'lucide-react';
import { useSession } from '@/context/SessionContext';

export default function StudentProfilePage() {
  const { user } = useSession();
  const studentId = user?.id;

  const [student, setStudent] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('personal details');

  // Loading states
  const [isSaving, setIsSaving] = useState(false);

  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stepper — labels match the admission lifecycle
  const steps = [
    { label: 'Enquiry', id: 'enquiry' },
    { label: 'Converted', id: 'converted' },
    { label: 'Fill Basic Info', id: 'basic' },
    { label: 'Fill High School Info', id: 'highschool' },
    { label: 'Submit', id: 'submit' }
  ];

  // Real-time: reads student state so it advances as user types
  const getActiveStep = () => {
    const data = student;
    const status = admission?.status;

    // Step 6 = verified / selected / enrolled (Completion)
    if (status === 'verified' || status === 'selected' || status === 'enrolled') return 6;

    // Step 5 = submitted (inProcess)
    if (status === 'inProcess') return 5;

    // Step 4 = high school info filled
    if (data.highSchool?.schoolName?.trim() || data.highSchool?.board?.trim()) return 4;

    // Step 3 = basic info filled (first + last name or student number)
    if (data.firstName?.trim() || data.lastName?.trim() || data.studentNumber?.trim()) return 3;

    // Step 2 = account exists (converted from enquiry)
    if (admission) return 2;

    // Step 1 = enquiry submitted
    return 1;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    // Admission data is fetched in the following effect
  }, [user?.id]);

  //-----------------------------------------------------------------------
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchAdmissionDetails = async () => {
      try {
        setLoading(true);
        // Prioritize admissionId from session if available
        const idToFetch = user.admissionId || user.id;
        const endpoint = user.admissionId 
          ? `/api/admission/${user.admissionId}` 
          : `/api/students/${user.id}/admission`;
          
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch admission details');
        }
        const data = await response.json();
        
        // Handle different response structures from both endpoints
        const admissionData = data.admission || data.data;
        console.log('Fetched admission data:', admissionData);
        setAdmission(admissionData);
        setStudent(admissionData); // Map admission data to student state for editing
      } catch (err) {
        console.error("Admission fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionDetails();
  }, [user?.id, user?.admissionId]);

  //----------------------------------------------------------------------

  const saveProfileChanges = async () => {
    try {
      setIsSaving(true);
      const targetId = admission?._id || user.admissionId;
      if (!targetId) throw new Error("No admission ID found");

      const res = await fetch(`/api/admission/${targetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const result = await res.json();
      setAdmission(result.data);
      setStudent(result.data);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('[UPDATE_PROFILE_ERROR]', error);
      alert('Error updating profile: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Real-time progress: reads from `student` state so it updates as user types,
  // not just after saving. student is seeded from admission on load and stays in sync.
  const calculateProgress = () => {
    const data = student; // student updates live via handleInputChange
    if (!data && !admission) return 0;

    let completed = 0;
    const total = 10;

    // ── Basic Info (4 pts) ─────────────────────────────────
    if (data.firstName?.trim())        completed++;
    if (data.lastName?.trim())         completed++;
    if (data.studentNumber?.trim())    completed++;
    if (data.year)                     completed++; // Swapped dateOfBirth for year

    // ── Contact (1 pt) ────────────────────────────────────
    if (data.studentWhatsappNumber?.trim()) completed++;

    // ── High School (2 pts) ───────────────────────────────
    if (data.highSchool?.schoolName?.trim()) completed++;
    if (data.highSchool?.board?.trim())      completed++;

    // ── Address (2 pts) ───────────────────────────────────
    if (data.presentAddress?.addressLine1?.trim() || data.presentAddress?.city?.trim()) completed++;
    if (data.permanentAddress?.addressLine1?.trim() || data.permanentAddress?.city?.trim()) completed++;

    // ── Family / Emergency (1 pt) ─────────────────────────
    if (data.motherName?.trim() || data.emergencyContact?.firstName?.trim()) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleSendForVerification = async () => {
    try {
      setIsSaving(true);
      const targetId = admission?._id || user.admissionId;
      
      const res = await fetch(`/api/admission/${targetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'inProcess' }),
      });

      if (!res.ok) throw new Error('Failed to submit for verification');

      const result = await res.json();
      setAdmission(result.data);
      alert('Application submitted for verification successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  //-------------------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const sectors = name.split('.');
      if (sectors.length === 2) {
        setStudent((prev) => ({
          ...prev,
          [sectors[0]]: {
            ...(prev[sectors[0]] || {}),
            [sectors[1]]: value,
          },
        }));
      }
    } else {
      setStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  //----------------------------------------------------------------------------------------

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-moze-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Loading admissions portal...</h2>
      </div>
    </div>
  );

  const progress = calculateProgress();
  const currentStep = getActiveStep();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admissions Portal</h1>
            <p className="text-gray-500">Welcome, {student.firstName || user.fullName}</p>
          </div>
          <div className="flex items-center gap-3">
           {editMode ? (
             <button onClick={saveProfileChanges} className="px-6 py-2 bg-moze-primary text-white font-bold rounded-xl shadow-lg">Save Profile</button>
           ) : (
             <button onClick={() => setEditMode(true)} className="px-6 py-2 bg-moze-primary text-white font-bold rounded-xl shadow-lg">Update Information</button>
           )}
          </div>
        </div>
      {/* Upper Navigation/Header Placeholder if needed */}

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-10">
        {/* New Stepper UI */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-gray-100">
           <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center flex-1 relative">
                  {/* Line connector */}
                  {index < steps.length - 1 && (
                    <div className={`absolute top-5 left-1/2 w-full h-1 z-0 ${index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  )}
                  {/* Step Circle */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                    index + 1 < currentStep ? 'bg-green-500 text-white' : 
                    index + 1 === currentStep ? 'bg-moze-primary text-white scale-110 shadow-lg' : 
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1 < currentStep ? '✓' : index + 1}
                  </div>
                  <span className={`text-[10px] md:text-sm font-bold mt-3 text-center transition-colors ${
                    index + 1 <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
           </div>

           {/* Congrats Message - Visible for Verified, Selected or Enrolled */}
           {(admission?.status === 'verified' || admission?.status === 'selected' || admission?.status === 'enrolled') && (
             <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom duration-700 mt-6 shadow-sm">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg rotate-3">
                  <GradIcon size={32} />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-serif font-bold text-green-800 mb-1">Congratulations! 🎉</h3>
                  <p className="text-green-700 text-lg font-medium leading-relaxed">
                    Welcome to <span className="font-bold underline">GS Moze College</span>, you have been selected and your admission process is now complete!
                  </p>
                </div>
             </div>
           )}
        </div>
        {/* Progress Tracker Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Admission Progress</span>
                <span className="text-sm font-bold text-moze-primary">{progress}% Complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div 
                  className="bg-moze-primary h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {progress === 100 && admission.status === 'pending' && (
                <button
                  onClick={handleSendForVerification}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  Confirm & Submit
                </button>
              )}
              
              {/* Status Badge Removed at user request */}
            </div>
          </div>
          
          {progress < 100 && (
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              Please complete all sections (Personal, Address, Contact, Family) to enable verification.
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-800">Student Profile</h1>

          {/* Edit/Save/Cancel buttons - allowed for authorized roles */}
          {['student', 'staff', 'hod', 'admin', 'superadmin'].includes(user?.role?.toLowerCase()) && (
            <div className="flex items-center gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={saveProfileChanges}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-moze-primary text-white rounded-lg hover:bg-maroon-800 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-moze-primary text-white rounded-lg hover:bg-maroon-800 transition-colors"
                >
                  <Edit size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-maroon-50 text-moze-primary flex items-center justify-center">
                <User size={40} className="text-moze-primary" />
              </div>
              <h2 className="text-xl font-serif font-bold text-gray-800">{student.fullName || user.fullName || 'Loading...'}</h2>
              <p className="text-gray-600">{student.email || user.email}</p>
              <p className="text-sm text-gray-500 mt-1">Student ID: {student?.studentId}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-1">
                {['personal details', 'address', 'contact', 'family'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition-colors ${activeTab === tab
                      ? 'bg-maroon-50/50 text-moze-primary'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {tab === 'personal details' && <User size={18} />}
                    {tab === 'address' && <MapPin size={18} />}
                    {tab === 'contact' && <Phone size={18} />}
                    {tab === 'family' && <Users size={18} />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {(activeTab === 'personal details') && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <ArrowRight size={16} className="text-gray-400 rotate-90" />
                  </div>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Full Name Section */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Full Name</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {['firstName', 'middleName', 'lastName'].map((field) => (
                        <div key={field}>
                          {editMode ? (
                            <input
                              type="text"
                              name={field}
                              value={student[field] || ''}
                              onChange={handleInputChange}
                              placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
                              className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl focus:border-moze-primary transition-all outline-none"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-900 font-medium h-[52px] flex items-center">
                              {student[field] || '-'}
                            </div>
                          )}
                          <span className="text-[10px] text-gray-400 uppercase font-bold mt-1 block ml-2">
                            {field.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Student Number & Degree */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Student Number</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="studentNumber"
                          value={student.studentNumber || ''}
                          onChange={handleInputChange}
                          placeholder="e.g. 11183021"
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl focus:border-moze-primary outline-none"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold">{student.studentNumber || '-'}</p>
                      )}
                      <span className="text-[10px] text-gray-400 mt-1 block ml-2">Unique Identification Number</span>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Year Level</label>
                      {editMode ? (
                        <select
                          name="year"
                          value={student.year || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl focus:border-moze-primary outline-none"
                        >
                          <option value="">Please Select</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                        </select>
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold">{student.year || '-'}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Degree Program</label>
                      <p className="px-4 py-3 bg-blue-50 text-blue-800 border border-blue-100 rounded-2xl font-bold">
                        {student.branch || admission?.branch || '-'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address</label>
                      <p className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-600">{student.email || '-'}</p>
                    </div>
                  </div>

                  {/* Phone & Provider */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Phone Number</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="studentWhatsappNumber"
                          value={student.studentWhatsappNumber || ''}
                          onChange={handleInputChange}
                          placeholder="(000) 000-0000"
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl focus:border-moze-primary outline-none"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold">{student.studentWhatsappNumber || '-'}</p>
                      )}
                    </div>
                  </div>

                  {/* High School Section */}
                  <div className="pt-8 border-t-2 border-gray-50">
                    <label className="block text-lg font-serif font-bold text-moze-primary mb-6">High School Information</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">School name</label>
                        {editMode ? (
                          <input
                            type="text"
                            name="highSchool.schoolName"
                            value={student.highSchool?.schoolName || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl outline-none"
                          />
                        ) : (
                          <p className="font-bold">{student.highSchool?.schoolName || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Board</label>
                        {editMode ? (
                          <input
                            type="text"
                            name="highSchool.board"
                            value={student.highSchool?.board || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl outline-none"
                          />
                        ) : (
                          <p className="font-bold">{student.highSchool?.board || '-'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="space-y-10">
                {/* Present Address */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-8 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Present Address</h2>
                  </div>
                  <div className="p-8 space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Street Address</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="presentAddress.addressLine1"
                          value={student.presentAddress?.addressLine1 || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl outline-none"
                        />
                      ) : (
                        <p className="font-bold">{student.presentAddress?.addressLine1 || '-'}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">City</label>
                        {editMode ? (
                          <input
                            type="text"
                            name="presentAddress.city"
                            value={student.presentAddress?.city || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl outline-none"
                          />
                        ) : (
                          <p className="font-bold">{student.presentAddress?.city || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">State</label>
                        {editMode ? (
                          <input
                            type="text"
                            name="presentAddress.state"
                            value={student.presentAddress?.state || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl outline-none"
                          />
                        ) : (
                          <p className="font-bold">{student.presentAddress?.state || '-'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Permanent Address</h2>
                    {editMode && (
                      <button 
                        onClick={() => setStudent(prev => ({ ...prev, permanentAddress: { ...prev.presentAddress } }))}
                        className="text-xs font-bold text-moze-primary"
                      >
                        COPY FROM PRESENT
                      </button>
                    )}
                  </div>
                  <div className="p-8 space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Street Address</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="permanentAddress.addressLine1"
                          value={student.permanentAddress?.addressLine1 || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl outline-none"
                        />
                      ) : (
                        <p className="font-bold">{student.permanentAddress?.addressLine1 || '-'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r bg-white px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-xl font-serif font-bold text-gray-800">Contact Details</h2>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Contact Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { label: 'WhatsApp Number', key: 'studentWhatsappNumber', icon: Phone, color: 'blue' },
                        ].map(({ label, key, icon: Icon, color }) => (
                          <div key={key} className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                              <Icon className={`w-4 h-4 text-${color}-600`} />
                              <span>{label}</span>
                            </label>

                            {editMode ? (
                              <input
                                type="tel"
                                name={key}
                                value={student[key] || ''}
                                onChange={handleInputChange}
                                placeholder={`Enter ${label.toLowerCase()}`}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                pattern={
                                  key === 'studentWhatsappNumber' 
                                    ? /^[6-9]\d{9}$/
                                    : /^[6-9]\d{9}$/
                                }
                                maxLength={10}
                                onInput={(e) => {
                                  // Only allow numbers for phone fields
                                  const value = e.target.value.replace(/\D/g, '');
                                  e.target.value = value;
                                }}
                              />
                            ) : (
                              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex-1">
                                  <p className="text-gray-900 font-medium">{student[key] || '-'}</p>
                                </div>

                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'family' && (
              <div className="space-y-10">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-8">Family Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Mother's name</label>
                       {editMode ? (
                         <input
                           type="text"
                           name="motherName"
                           value={student.motherName || ''}
                           onChange={handleInputChange}
                           className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl outline-none"
                         />
                       ) : <p className="font-bold">{student.motherName || '-'}</p>}
                     </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-8">Emergency Contact</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">First Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="emergencyContact.firstName"
                          value={student.emergencyContact?.firstName || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl outline-none"
                        />
                      ) : <p className="font-bold">{student.emergencyContact?.firstName || '-'}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Relationship</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="emergencyContact.relationship"
                          value={student.emergencyContact?.relationship || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl outline-none"
                        />
                      ) : <p className="font-bold">{student.emergencyContact?.relationship || '-'}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Account Settings</h2>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock size={20} className="text-gray-600" />
                    <h3 className="font-medium text-gray-800">Change Password</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Update your account password</p>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}