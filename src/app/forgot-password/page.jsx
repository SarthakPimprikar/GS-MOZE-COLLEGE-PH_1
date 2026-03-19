// "use client"
// import React, { useState } from 'react';
// import { Mail, ArrowLeft, Check, AlertCircle } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// const ForgotPasswordPage = () => {
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [error, setError] = useState('');

//   const router = useRouter()
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError('Please enter a valid email address');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Simulate API call - replace with your actual API endpoint
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       // Here you would make your actual API call:
//       // const response = await fetch('/api/auth/forgot-password', {
//       //   method: 'POST',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify({ email })
//       // });

//       setIsSuccess(true);
//     } catch (err) {
//       setError('Something went wrong. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleBackToLogin = () => {
//      router.push('/login')
//     console.log('Navigate back to login');
//   };

//   if (isSuccess) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Check className="w-8 h-8 text-green-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
//             <p className="text-gray-600 mb-6">
//               We've sent a password reset link to <strong>{email}</strong>
//             </p>
//             <div className="space-y-4">
//               <p className="text-sm text-gray-500">
//                 Didn't receive the email? Check your spam folder or try again.
//               </p>
//               <button
//                 onClick={() => {
//                   setIsSuccess(false);
//                   setEmail('');
//                 }}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 Send Again
//               </button>
//               <button
//                 onClick={handleBackToLogin}
//                 className="w-full text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back to Login
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Mail className="w-8 h-8 text-blue-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
//           <p className="text-gray-600">
//             Enter your email address and we'll send you a link to reset your password.
//           </p>
//         </div>

//         {/* Form */}
//         <div className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Mail className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//                 placeholder="Enter your email address"
//               />
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
//               <AlertCircle className="w-4 h-4" />
//               {error}
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
//           >
//             {isLoading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Sending...
//               </>
//             ) : (
//               'Send Reset Link'
//             )}
//           </button>
//         </div>

//         {/* Back to Login */}
//         <div className="mt-6 text-center">
//           <button
//             onClick={handleBackToLogin}
//             className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;
// "use client";
// import React, { useState } from "react";
// import { Mail, ArrowLeft, Check, AlertCircle } from "lucide-react";
// import { useRouter } from "next/navigation";

// const ForgotPasswordPage = ({
//   initialEmail = "",
//   appName = "Our App",
//   primaryColor = "blue",
//   logo = null,
//   onBackToLogin,
//   onSuccess,
//   onSubmit,
//   showBackButton = true,
//   successMessage,
//   customValidation,
// }) => {
//   const [email, setEmail] = useState(initialEmail);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [error, setError] = useState("");

//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError("Please enter a valid email address");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch("/api/auth/forgot-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to send reset link");
//       }

//       setIsSuccess(true);
//       if (onSuccess) onSuccess(email);
//     } catch (err) {
//       setError(err.message || "Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleBackToLogin = () => {
//     if (onBackToLogin) {
//       onBackToLogin();
//     } else {
//       router.push("/login");
//     }
//   };

//   // Generate dynamic color classes
//   const bgGradient = `from-${primaryColor}-50 to-${primaryColor}-100`;
//   const iconBg = `${primaryColor}-100`;
//   const iconColor = `${primaryColor}-600`;
//   const buttonBg = `${primaryColor}-600`;
//   const buttonHover = `${primaryColor}-700`;
//   const textColor = `${primaryColor}-600`;
//   const textHover = `${primaryColor}-700`;
//   const focusRing = `focus:ring-${primaryColor}-500`;

//   if (isSuccess) {
//     return (
//       <div
//         className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center p-4`}
//       >
//         <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Check className="w-8 h-8 text-green-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">
//               Check Your Email
//             </h2>

//             {successMessage || (
//               <p className="text-gray-600 mb-6">
//                 We've sent a password reset link to <strong>{email}</strong>
//               </p>
//             )}

//             <div className="space-y-4">
//               <p className="text-sm text-gray-500">
//                 Didn't receive the email? Check your spam folder or try again.
//               </p>
//               <button
//                 onClick={() => {
//                   setIsSuccess(false);
//                   setEmail("");
//                 }}
//                 className={`w-full bg-${buttonBg} text-white py-3 px-4 rounded-lg hover:bg-${buttonHover} transition-colors font-medium`}
//               >
//                 Send Again
//               </button>
//               {showBackButton && (
//                 <button
//                   onClick={handleBackToLogin}
//                   className={`w-full text-${textColor} py-3 px-4 rounded-lg hover:bg-${primaryColor}-50 transition-colors font-medium flex items-center justify-center gap-2`}
//                 >
//                   <ArrowLeft className="w-4 h-4" />
//                   Back to Login
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center p-4`}
//     >
//       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           {logo || (
//             <div
//               className={`w-16 h-16 bg-${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
//             >
//               <Mail className={`w-8 h-8 text-${iconColor}`} />
//             </div>
//           )}
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">
//             Forgot Password?
//           </h1>
//           <p className="text-gray-600">
//             Enter your email address and {appName} will send you a link to reset
//             your password.
//           </p>
//         </div>

//         {/* Form */}
//         <div className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Email Address
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Mail className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
//                 className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg ${focusRing} focus:border-transparent transition-colors`}
//                 placeholder="Enter your email address"
//               />
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
//               <AlertCircle className="w-4 h-4" />
//               {error}
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={isLoading || !email}
//             className={`w-full bg-${buttonBg} text-white py-3 px-4 rounded-lg hover:bg-${buttonHover} disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2`}
//           >
//             {isLoading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Sending...
//               </>
//             ) : (
//               "Send Reset Link"
//             )}
//           </button>
//         </div>

//         {/* Back to Login */}
//         {showBackButton && (
//           <div className="mt-6 text-center">
//             <button
//               onClick={handleBackToLogin}
//               className={`text-${textColor} hover:text-${textHover} font-medium flex items-center justify-center gap-2 mx-auto transition-colors`}
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Login
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const {user}=useSession()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">
            Enter your email to receive a reset link
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}