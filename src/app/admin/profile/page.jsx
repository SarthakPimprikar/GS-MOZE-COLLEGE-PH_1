// // app/admin/profile/page.jsx
// 'use client';

// import {
//   UserCircle,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   Shield,
//   Lock,
//   Edit,
//   Save,
//   X,
//   Key,
//   Bell,
//   ChevronRight,
//   Check,
//   Upload
// } from 'lucide-react';
// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function ProfilePage() {
//   const [editMode, setEditMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [avatarPreview, setAvatarPreview] = useState(null);

//   const [profileData, setProfileData] = useState({
//     name: 'Dr. Sarah Johnson',
//     email: 's.johnson@university.edu',
//     phone: '+1 (555) 123-4567',
//     address: '123 University Ave, Campus City, CC 12345',
//     position: 'Administrative Director',
//     department: 'Computer Science',
//     joinDate: 'March 15, 2018',
//     avatar: '/images/avatar-admin.jpg',
//     notifications: {
//       email: true,
//       system: true,
//       updates: true,
//       app: true
//     }
//   });

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleNotificationToggle = (type) => {
//     setProfileData(prev => ({
//       ...prev,
//       notifications: {
//         ...prev.notifications,
//         [type]: !prev.notifications[type]
//       }
//     }));
//   };

//   const handleSaveProfile = () => {
//     // Save logic would go here
//     if (avatarPreview) {
//       setProfileData(prev => ({
//         ...prev,
//         avatar: avatarPreview
//       }));
//       setAvatarPreview(null);
//     }
//     setEditMode(false);
//   };

//   const handlePasswordSubmit = (e) => {
//     e.preventDefault();
//     // Password change logic would go here
//     setPasswordForm({
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: ''
//     });
//   };

//   const tabVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
//     exit: { opacity: 0, y: -10 }
//   };

//   return (
//     <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
//       <div className="px-8 py-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
//             <p className="text-gray-500 mt-1">
//               {activeTab === 'profile' && 'Manage your personal information'}
//               {activeTab === 'security' && 'Configure account security settings'}
//               {activeTab === 'notifications' && 'Customize notification preferences'}
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             {editMode && activeTab === 'profile' && (
//               <>
//                 <button
//                   onClick={() => setEditMode(false)}
//                   className="flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
//                 >
//                   <X className="w-5 h-5 mr-2" />
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveProfile}
//                   className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
//                 >
//                   <Save className="w-5 h-5 mr-2" />
//                   Save Changes
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex mt-8 border-b border-gray-200">
//           <button
//             onClick={() => setActiveTab('profile')}
//             className={`px-4 py-3 font-medium text-sm flex items-center border-b-2 ${activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
//           >
//             <UserCircle className="w-5 h-5 mr-2" />
//             Profile
//           </button>
//           <button
//             onClick={() => setActiveTab('security')}
//             className={`px-4 py-3 font-medium text-sm flex items-center border-b-2 ${activeTab === 'security' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
//           >
//             <Shield className="w-5 h-5 mr-2" />
//             Security
//           </button>
//           <button
//             onClick={() => setActiveTab('notifications')}
//             className={`px-4 py-3 font-medium text-sm flex items-center border-b-2 ${activeTab === 'notifications' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
//           >
//             <Bell className="w-5 h-5 mr-2" />
//             Notifications
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto px-8 pb-8">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeTab}
//             variants={tabVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
//           >
//             {activeTab === 'profile' && (
//               <div className="divide-y divide-gray-100">
//                 {/* Profile Header */}
//                 <div className="px-8 py-6">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center">
//                       <div className="relative">
//                         <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 overflow-hidden">
//                           <img
//                             src={avatarPreview || profileData.avatar}
//                             alt="Profile"
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         {editMode && (
//                           <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-all">
//                             <input
//                               type="file"
//                               className="hidden"
//                               accept="image/*"
//                               onChange={handleAvatarChange}
//                             />
//                             <Upload className="w-5 h-5 text-indigo-600" />
//                           </label>
//                         )}
//                       </div>
//                       <div className="ml-6">
//                         {editMode ? (
//                           <input
//                             type="text"
//                             name="name"
//                             value={profileData.name}
//                             onChange={handleInputChange}
//                             className="text-2xl font-bold bg-gray-50 rounded-lg px-4 py-2 w-full max-w-md border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
//                           />
//                         ) : (
//                           <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
//                         )}
//                         <p className="text-indigo-600 mt-1">{profileData.position}</p>
//                         <p className="text-gray-500 text-sm mt-2">
//                           <Calendar className="inline w-4 h-4 mr-1" />
//                           Member since {profileData.joinDate}
//                         </p>
//                       </div>
//                     </div>
//                     {!editMode && (
//                       <button
//                         onClick={() => setEditMode(true)}
//                         className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
//                       >
//                         <Edit className="w-5 h-5 mr-2" />
//                         Edit Profile
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Profile Details */}
//                 <div className="px-8 py-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div className="space-y-6">
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
//                           Contact Information
//                         </h3>
//                         <div className="space-y-4">
//                           <div>
//                             <label className="block text-xs font-medium text-gray-400 mb-1">
//                               Email Address
//                             </label>
//                             {editMode ? (
//                               <input
//                                 type="email"
//                                 name="email"
//                                 value={profileData.email}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-gray-50"
//                               />
//                             ) : (
//                               <div className="flex items-center">
//                                 <Mail className="w-5 h-5 text-gray-400 mr-2" />
//                                 <span className="text-gray-700">{profileData.email}</span>
//                               </div>
//                             )}
//                           </div>

//                           <div>
//                             <label className="block text-xs font-medium text-gray-400 mb-1">
//                               Phone Number
//                             </label>
//                             {editMode ? (
//                               <input
//                                 type="tel"
//                                 name="phone"
//                                 value={profileData.phone}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-gray-50"
//                               />
//                             ) : (
//                               <div className="flex items-center">
//                                 <Phone className="w-5 h-5 text-gray-400 mr-2" />
//                                 <span className="text-gray-700">{profileData.phone}</span>
//                               </div>
//                             )}
//                           </div>

//                           <div>
//                             <label className="block text-xs font-medium text-gray-400 mb-1">
//                               Address
//                             </label>
//                             {editMode ? (
//                               <textarea
//                                 name="address"
//                                 value={profileData.address}
//                                 onChange={handleInputChange}
//                                 rows={3}
//                                 className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-gray-50"
//                               />
//                             ) : (
//                               <div className="flex items-start">
//                                 <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
//                                 <span className="text-gray-700">{profileData.address}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-6">
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
//                           Professional Information
//                         </h3>
//                         <div className="space-y-4">
//                           <div>
//                             <label className="block text-xs font-medium text-gray-400 mb-1">
//                               Position
//                             </label>
//                             {editMode ? (
//                               <input
//                                 type="text"
//                                 name="position"
//                                 value={profileData.position}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-gray-50"
//                               />
//                             ) : (
//                               <div className="text-gray-700">{profileData.position}</div>
//                             )}
//                           </div>

//                           <div>
//                             <label className="block text-xs font-medium text-gray-400 mb-1">
//                               Department
//                             </label>
//                             {editMode ? (
//                               <input
//                                 type="text"
//                                 name="department"
//                                 value={profileData.department}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-gray-50"
//                               />
//                             ) : (
//                               <div className="text-gray-700">{profileData.department}</div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'security' && (
//               <div className="divide-y divide-gray-100">
//                 <div className="px-8 py-6">
//                   <h2 className="text-xl font-bold text-gray-900">Account Security</h2>
//                   <p className="text-gray-500 mt-1">Manage your password and authentication settings</p>
//                 </div>

//                 <div className="px-8 py-6">
//                   <form onSubmit={handlePasswordSubmit} className="space-y-6">
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//                         <Key className="w-5 h-5 mr-2 text-indigo-600" />
//                         Change Password
//                       </h3>
//                       <div className="space-y-4">
//                         <div>
//                           <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                             Current Password
//                           </label>
//                           <input
//                             type="password"
//                             id="currentPassword"
//                             name="currentPassword"
//                             value={passwordForm.currentPassword}
//                             onChange={handlePasswordChange}
//                             className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
//                             required
//                           />
//                         </div>

//                         <div>
//                           <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                             New Password
//                           </label>
//                           <input
//                             type="password"
//                             id="newPassword"
//                             name="newPassword"
//                             value={passwordForm.newPassword}
//                             onChange={handlePasswordChange}
//                             className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
//                             required
//                           />
//                         </div>

//                         <div>
//                           <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                             Confirm New Password
//                           </label>
//                           <input
//                             type="password"
//                             id="confirmPassword"
//                             name="confirmPassword"
//                             value={passwordForm.confirmPassword}
//                             onChange={handlePasswordChange}
//                             className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
//                             required
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex justify-end">
//                       <button
//                         type="submit"
//                         className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center"
//                       >
//                         <Save className="w-5 h-5 mr-2" />
//                         Update Password
//                       </button>
//                     </div>
//                   </form>
//                 </div>

//                 <div className="px-8 py-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900 flex items-center">
//                         <Lock className="w-5 h-5 mr-2 text-indigo-600" />
//                         Two-Factor Authentication
//                       </h3>
//                       <p className="text-gray-500 mt-1">Add an extra layer of security to your account</p>
//                     </div>
//                     <button
//                       type="button"
//                       className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
//                     >
//                       Enable 2FA
//                       <ChevronRight className="w-5 h-5 ml-2" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'notifications' && (
//               <div className="divide-y divide-gray-100">
//                 <div className="px-8 py-6">
//                   <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
//                   <p className="text-gray-500 mt-1">Customize how you receive notifications</p>
//                 </div>

//                 <div className="px-8 py-6">
//                   <div className="space-y-8">
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//                         <Mail className="w-5 h-5 mr-2 text-indigo-600" />
//                         Email Notifications
//                       </h3>
//                       <div className="space-y-4">
//                         {[
//                           { 
//                             id: 'email', 
//                             label: 'Account notifications', 
//                             description: 'Important updates about your account',
//                             checked: profileData.notifications.email
//                           },
//                           { 
//                             id: 'system', 
//                             label: 'System alerts', 
//                             description: 'Important system-wide notifications',
//                             checked: profileData.notifications.system
//                           },
//                           { 
//                             id: 'updates', 
//                             label: 'Updates & newsletters', 
//                             description: 'Receive product updates and announcements',
//                             checked: profileData.notifications.updates
//                           }
//                         ].map((item) => (
//                           <div key={item.id} className="flex items-center justify-between">
//                             <div>
//                               <p className="text-sm font-medium text-gray-700">{item.label}</p>
//                               <p className="text-sm text-gray-500">{item.description}</p>
//                             </div>
//                             <button
//                               type="button"
//                               onClick={() => handleNotificationToggle(item.id)}
//                               className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${item.checked ? 'bg-indigo-600' : 'bg-gray-200'}`}
//                             >
//                               <span
//                                 className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.checked ? 'translate-x-5' : 'translate-x-0'}`}
//                               />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//                         <Bell className="w-5 h-5 mr-2 text-indigo-600" />
//                         In-App Notifications
//                       </h3>
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm font-medium text-gray-700">Enable in-app notifications</p>
//                           <p className="text-sm text-gray-500">Show notifications within the application</p>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => handleNotificationToggle('app')}
//                           className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${profileData.notifications.app ? 'bg-indigo-600' : 'bg-gray-200'}`}
//                         >
//                           <span
//                             className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${profileData.notifications.app ? 'translate-x-5' : 'translate-x-0'}`}
//                           />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

import { MapPin, Mail, Phone, Calendar, Edit, Settings, Camera, Star, Award, TrendingUp } from "lucide-react"

export default function ProfilePage() {
  // Mock user data - in a real app, this would come from your database/API
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "January 2023",
    bio: "Full-stack developer passionate about creating amazing user experiences. Love working with React, Node.js, and modern web technologies.",
    avatar: "/professional-headshot.png",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS"],
    stats: {
      projects: 24,
      followers: 1.2,
      following: 456,
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-br from-rose-50 via-white to-pink-50 border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-radial from-rose-100/30 via-transparent to-transparent"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            <div className="relative group">
              <div className="h-32 w-32 lg:h-40 lg:w-40 rounded-full overflow-hidden bg-white shadow-2xl ring-4 ring-rose-100 transition-all duration-300 group-hover:ring-rose-200">
                <img
                  src={user.avatar || "/placeholder.svg?height=160&width=160"}
                  alt={user.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-rose-600 text-white shadow-lg flex items-center justify-center hover:bg-rose-700 transition-all duration-200 hover:scale-105">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">{user.name}</h1>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">{user.bio}</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-rose-600 text-white rounded-xl font-medium shadow-lg hover:bg-rose-700 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </button>
                  <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200 hover:bg-white/90 transition-all duration-200">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{user.stats.projects}</div>
                  <div className="text-sm text-gray-500 font-medium">Projects</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200 hover:bg-white/90 transition-all duration-200">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{user.stats.followers}k</div>
                  <div className="text-sm text-gray-500 font-medium">Followers</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200 hover:bg-white/90 transition-all duration-200">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{user.stats.following}</div>
                  <div className="text-sm text-gray-500 font-medium">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-rose-600" />
                  Contact Information
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <Mail className="h-5 w-5 text-rose-600" />
                  <span className="text-gray-900 font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <Phone className="h-5 w-5 text-rose-600" />
                  <span className="text-gray-900 font-medium">{user.phone}</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <MapPin className="h-5 w-5 text-rose-600" />
                  <span className="text-gray-900 font-medium">{user.location}</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <Calendar className="h-5 w-5 text-rose-600" />
                  <span className="text-gray-900 font-medium">Joined {user.joinDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-pink-600" />
                  Skills & Expertise
                </h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-3">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-gray-900 font-medium rounded-full border border-rose-200 hover:border-rose-300 transition-all duration-200 hover:scale-105"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Settings */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-pink-600" />
                  Recent Activity
                </h3>
                <p className="text-gray-600 mt-1">Your latest actions and updates</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/30 border border-blue-200 hover:border-blue-300 transition-all duration-200">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mt-2 shadow-sm"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Updated profile picture</p>
                      <p className="text-sm text-gray-600 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100/30 border border-green-200 hover:border-green-300 transition-all duration-200">
                    <div className="h-3 w-3 rounded-full bg-green-500 mt-2 shadow-sm"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Completed React project</p>
                      <p className="text-sm text-gray-600 mt-1">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100/30 border border-orange-200 hover:border-orange-300 transition-all duration-200">
                    <div className="h-3 w-3 rounded-full bg-orange-500 mt-2 shadow-sm"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Added new skill: TypeScript</p>
                      <p className="text-sm text-gray-600 mt-1">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-rose-600" />
                  Account Settings
                </h3>
                <p className="text-gray-600 mt-1">Manage your account preferences</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                  <div>
                    <p className="font-semibold text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600 mt-1">Receive updates via email</p>
                  </div>
                  <button className="px-5 py-2 bg-pink-600 text-white rounded-lg font-medium shadow-sm hover:bg-pink-700 transition-all duration-200 hover:shadow-md">
                    Configure
                  </button>
                </div>
                <div className="border-t border-gray-200"></div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                  <div>
                    <p className="font-semibold text-gray-900">Privacy Settings</p>
                    <p className="text-sm text-gray-600 mt-1">Control who can see your profile</p>
                  </div>
                  <button className="px-5 py-2 bg-pink-600 text-white rounded-lg font-medium shadow-sm hover:bg-pink-700 transition-all duration-200 hover:shadow-md">
                    Manage
                  </button>
                </div>
                <div className="border-t border-gray-200"></div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                  <div>
                    <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600 mt-1">Add an extra layer of security</p>
                  </div>
                  <button className="px-5 py-2 bg-pink-600 text-white rounded-lg font-medium shadow-sm hover:bg-pink-700 transition-all duration-200 hover:shadow-md">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
