'use client';

import { useEffect, useState } from 'react';
import { User, Edit, BookOpen, Settings, Lock, Loader2, MapPin, Users, Phone, PhoneCall, Shield, Save, X, Briefcase, GraduationCap as GradIcon, Calendar, IndianRupee, ArrowRight } from 'lucide-react';
import { useSession } from '@/context/SessionContext';

export default function StudentProfilePage() {
  const { user } = useSession();
  console.log(user)
  const studentId = user?.id;

  const [student, setStudent] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [subjects, setSubjects] = useState([]);

  // Loading states
  const [isLoadingStudent, setIsLoadingStudent] = useState(true);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  //---------------------------------------------------------------------------------

  const [address, setAddress] = useState(null);
  const [contact, setContact] = useState(null);
  const [family, setFamily] = useState(null);

  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingContact, setIsLoadingContact] = useState(false);
  const [isLoadingFamily, setIsLoadingFamily] = useState(false);
  //------------------------------------------------------------------------------------
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [isLoadingDrives, setIsLoadingDrives] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  //-------------------------------------------------------------------------------
  const fetchStudent = async () => {
    try {
      setIsLoadingStudent(true);
      const res = await fetch(`/api/students/${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch student data');
      const data = await res.json();
      setStudent(data);
    } catch (err) {
      console.error('[FETCH_STUDENT_ERROR]', err);
    } finally {
      setIsLoadingStudent(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchStudent();

  }, [user?.id]);

  //-----------------------------------------------------------------------
  useEffect(() => {
    if (!user?.id) return;

    const fetchSubjects = async () => {
      try {
        setIsLoadingSubjects(true);
        const res = await fetch(`/api/students/${user.id}/academics`);
        const data = await res.json();
        console.log("-------------------" + user)
        const subjectsArray =
          data.academic?.years?.[0]?.divisions?.[0]?.subjects || [];

        setSubjects(subjectsArray);
      } catch (err) {
        console.error('[FETCH_SUBJECTS_ERROR]', err);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [user?.id]);

  //-----------------------------------------------------------------------
  useEffect(() => {
    if (!user?.id) return;
    const id = user?.id;
    console.log(user.id)
    // if (!user?.admissionId) return;
    // const id = user?.admissionId;
    //console.log(user.admissionId)

    const fetchAdmissionDetails = async () => {
      try {
        const response = await fetch(`/api/students/${id}/admission`);
        //const response = await fetch(`/api/admission/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch admission details');
        }
        const data = await response.json();
        console.log('Fetched admission data:', data);
        setAdmission(data.admission);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionDetails();
  }, [user?.id]);

  useEffect(() => {
    if (activeTab === 'placements') {
      const fetchDrives = async () => {
        try {
          setIsLoadingDrives(true);
          const res = await fetch('/api/placement/drives');
          const data = await res.json();
          if (data.success) {
            // Filter only upcoming or registration open
            const filtered = data.data.filter(d => 
              d.status === 'Upcoming' || d.status === 'Registration Open'
            );
            setUpcomingDrives(filtered);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoadingDrives(false);
        }
      };
      fetchDrives();
    }
  }, [activeTab]);

  //----------------------------------------------------------------------

  const saveProfileChanges = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/students/${student._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });

      if (!res.ok) throw new Error('Failed to update student profile');

      const updatedData = await res.json();
      setStudent(updatedData.student);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('[UPDATE_PROFILE_ERROR]', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  //-------------------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setStudent((prev) => ({
        ...prev,
        address: {
          ...(prev.address || {}),
          [field]: value,
        },
      }));
    } else {
      setStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  //----------------------------------------------------------------------------------------

  // const id = student.admissionId;
  // const fetchAdmissionDetails = async () => {
  //   try {
  //     const response = await fetch(`/api/admission/${id}`);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch admission details');
  //     }
  //     const data = await response.json();
  //     setAdmissionData(data);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  if (loading) return <div>Loading admission details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!admission) return <div>No admission data found</div>;
  //---------------------------------------------------------------------------------------------------
  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-moze-primary" />
    </div>
  );

  // Skeleton components
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );

  const ProfileSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center animate-pulse">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
    </div>
  );

  // Show loading for initial data
  if (isLoadingStudent && !student.fullName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-moze-primary mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Profile</h2>
          <p className="text-gray-600">Please wait while we fetch your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-800">Student Profile</h1>

          {/* Edit/Save/Cancel buttons - allowed for student, staff, HOD, admin, but hidden on courses tab */}
          {['student', 'staff', 'hod', 'admin', 'superadmin'].includes(user?.role?.toLowerCase()) && activeTab !== 'courses' && (
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
                {['personal details', 'address', 'contact', 'family', 'courses', 'placements'].map((tab) => (
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
                    {tab === 'courses' && <BookOpen size={18} />}
                    {tab === 'placements' && <Briefcase size={18} />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {(activeTab === 'profile' || activeTab === 'personal details') && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif font-bold text-gray-800">Personal Information</h2>
                </div>

                {isLoadingStudent ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={`skeleton-${i}`} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                        <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="fullName"
                          value={student.fullName || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
                          placeholder="Enter full name"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {student.fullName || user.fullName || <span className="text-gray-400">Not provided</span>}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      {editMode ? (
                        <input
                          type="email"
                          name="email"
                          value={student.email || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
                          placeholder="Enter email address"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {student.email || user.email || <span className="text-gray-400">Not provided</span>}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                      {editMode ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={student.dateOfBirth ? student.dateOfBirth.split('T')[0] : ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {student.dateOfBirth ? (
                            formatDate(student.dateOfBirth)
                          ) : (
                            <span className="text-gray-400">Not provided</span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Gender</label>
                      {editMode ? (
                        <select
                          name="gender"
                          value={student.gender || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {student.gender || <span className="text-gray-400">Not provided</span>}
                        </p>
                      )}
                    </div>

                    {/* Religion */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Religion</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="religion"
                          value={student.religion || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
                          placeholder="Enter religion"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {student.religionAsPerLC || <span className="text-gray-400">Not provided</span>}
                        </p>
                      )}
                    </div>

                    {/* Caste */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Caste</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="casteAsPerLC"
                          value={student.casteAsPerLC || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
                          placeholder="Enter caste"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {student.casteAsPerLC || <span className="text-gray-400">Not provided</span>}
                        </p>
                      )}
                    </div>

                    {/* Nationality */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Nationality</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="nationality"
                          value={student.nationality || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
                          placeholder="Enter nationality"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {student.nationality || <span className="text-gray-400">Not provided</span>}
                        </p>
                      )}
                    </div>

                    {/* Domicile */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Domicile</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="domicile"
                          value={student.domicile || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
                          placeholder="Enter domicile"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {student.domicile || <span className="text-gray-400">Not provided</span>}
                        </p>
                      )}
                    </div>

                  </div>
                )}
              </div>
            )}

            {activeTab === 'address' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-maroon-50/30 to-maroon-50/50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-maroon-50 text-moze-primary rounded-lg">
                        <MapPin className="w-5 h-5 text-moze-primary" />
                      </div>
                      <h2 className="text-xl font-serif font-bold text-gray-800">Address Information</h2>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {isLoadingStudent ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-moze-primary"></div>
                    </div>
                  ) : student?.address ? (
                    <div className="space-y-6">
                      {/* Full Address Preview */}
                      <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-moze-primary">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Complete Address</h3>
                        <p className="text-gray-900 leading-relaxed">
                          {[
                            student.address.addressLine,
                            student.address.city,
                            student.address.state,
                            student.address.pincode,
                            student.address.country
                          ].filter(Boolean).join(', ')}
                        </p>
                      </div>

                      {/* Address Fields */}
                      <dl className="divide-y divide-gray-100">
                        {[
                          { label: 'Address Line', key: 'addressLine', value: student.address?.addressLine },
                          { label: 'City', key: 'city', value: student.address?.city },
                          { label: 'State', key: 'state', value: student.address?.state },
                          { label: 'Pincode', key: 'pincode', value: student.address?.pincode },
                          { label: 'Country', key: 'country', value: student.address?.country }
                        ].map(({ label, key, value }) => (
                          <div key={label} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1 min-w-0">
                              <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
                              {editMode ? (
                                <input
                                  type="text"
                                  name={`address.${key}`}
                                  value={value || ''}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
                                  placeholder={`Enter ${label.toLowerCase()}`}
                                />
                              ) : (
                                <dd className="text-gray-900 break-words">{value || '-'}</dd>
                              )}
                            </div>
                          </div>
                        ))}
                      </dl>

                      {/* Quick Actions */}

                    </div>
                  ) : (
                    <div className="text-center py-12">

                    </div>
                  )}
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
                  {isLoadingStudent ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Contact Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { label: 'Phone Number', key: 'mobileNumber', icon: Phone, color: 'blue' },
                          // { label: 'Alternate Phone', key: 'alternatePhone', icon: PhoneCall, color: 'purple' },
                          // { label: 'Emergency Contact', key: 'emergencyContact', icon: Shield, color: 'red' },
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
                                  key === 'mobileNumber' 
                                    ? /^[6-9]\d{10}$/
                                    : /^[6-9]\d{10}$/
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Family Details</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
    {editMode ? (
      <input
        type="text"
        name="motherName"
        value={student.motherName || admission?.motherName || ''}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
        placeholder="Enter mother's name"
        maxLength={50}
      />
    ) : (
      <p className="text-base text-gray-900">{student.motherName || admission?.motherName || 'N/A'}</p>
    )}
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Mobile Number</label>
    {editMode ? (
      <input
        type="tel"
        name="motherMobileNumber"
        value={student.motherMobileNumber || ''}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
        placeholder="Enter mother's mobile number"
        pattern={{
          value: /^[0-9]{10}$/,
          message: "Please enter exactly 10 digits (0-9 only)"
        }}
        maxLength={10}
        onInput={(e) => {
          // Only allow digits for phone fields
          const value = e.target.value.replace(/\D/g, '');
          e.target.value = value;
        }}
      />
    ) : (
      <p className="text-base text-gray-900">{student.motherMobileNumber || admission?.motherMobileNumber || 'N/A'}</p>
    )}
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Father/Guardian WhatsApp Number</label>
    {editMode ? (
      <input
        type="tel"
        name="fatherGuardianWhatsappNumber"
        value={student.fatherGuardianWhatsappNumber || ''}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
        placeholder="Enter father/guardian WhatsApp number"
        pattern={{
          value: /^[0-9]{10}$/,
          message: "Please enter exactly 10 digits (0-9 only)"
        }}
        maxLength={10}
        onInput={(e) => {
          // Only allow digits for phone fields
          const value = e.target.value.replace(/\D/g, '');
          e.target.value = value;
        }}
      />
    ) : (
      <p className="text-base text-gray-900">{student.fatherGuardianWhatsappNumber || admission?.fatherGuardianWhatsappNumber || 'N/A'}</p>
    )}
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Family Income</label>
    {editMode ? (
      <input
        type="number"
        name="familyIncome"
        value={student.familyIncome || ''}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary transition-colors"
        placeholder="Enter family income"
      />
    ) : (
      <p className="text-base text-gray-900">{student.familyIncome || admission?.familyIncome || 'N/A'}</p>
    )}
  </div>
</div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Current Courses</h2>

                  {isLoadingSubjects ? (
                    <div className="space-y-3">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : subjects.length > 0 ? (
                    <ul className="space-y-3">
                      {subjects.map((subject, idx) => (
                        <li
                          key={idx}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
                        >
                          <p className="text-gray-800 font-semibold">
                            {subject.name || 'Unnamed Subject'}
                          </p>
                          {subject.teacher && (
                            <p className="text-sm text-gray-600 mt-1">
                              Teacher: {subject.teacherName || 'Not Assigned'}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No subjects found for your department and year.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'placements' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-serif font-bold text-gray-800">Placement Opportunities</h2>
                      <p className="text-sm text-gray-500 mt-1">Explore upcoming recruitment drives and boost your career.</p>
                    </div>
                    <button 
                      onClick={() => window.location.href = '/student/placement/opportunities'}
                      className="text-sm font-bold text-moze-primary hover:underline flex items-center gap-1"
                    >
                      View All <ArrowRight size={14} />
                    </button>
                  </div>

                  {isLoadingDrives ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-8 h-8 animate-spin text-moze-primary" />
                    </div>
                  ) : upcomingDrives.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {upcomingDrives.slice(0, 4).map((drive) => (
                        <div key={drive._id} className="group bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-moze-primary hover:bg-white transition-all cursor-pointer" onClick={() => window.location.href = '/student/placement/opportunities'}>
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-1.5 shadow-sm">
                              {drive.companyId?.logoUrl ? (
                                <img src={drive.companyId.logoUrl} alt={drive.companyId.name} className="max-w-full max-h-full object-contain" />
                              ) : <Briefcase className="text-gray-400" size={20} />}
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${drive.status === 'Registration Open' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                              {drive.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 group-hover:text-moze-primary transition-colors">{drive.jobTitle}</h3>
                          <p className="text-xs text-gray-500 font-medium mb-3">{drive.companyId?.name}</p>
                          
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-emerald-600 font-bold">
                              <IndianRupee size={12} /> {drive.ctcPackage}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Calendar size={12} /> {new Date(drive.driveDate).toLocaleDateString('en-GB')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <Briefcase className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500 text-sm">No upcoming placement drives at the moment.</p>
                    </div>
                  )}

                  <div className="mt-8 p-4 bg-maroon-50/50 rounded-2xl border border-maroon-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Track your progress</p>
                      <p className="text-xs text-gray-600">Check the status of your submitted applications.</p>
                    </div>
                    <button 
                      onClick={() => window.location.href = '/student/placement/applications'}
                      className="bg-moze-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-maroon-800 transition"
                    >
                      Go to Tracker
                    </button>
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