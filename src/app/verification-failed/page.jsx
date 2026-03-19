"use client"
import React from 'react';
import { AlertCircle, Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import Router from 'next/router';
import { useRouter } from 'next/navigation';
 
export default function EmailVerificationFailed() {
    const router = useRouter()
  const handleGoBack = () => {
    router.push("/")
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
 
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Verification Failed
          </h1>
 
          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            We couldn't verify your email address. The verification link may have expired or is invalid.
          </p>
 
          {/* Action Buttons */}
          <div className="space-y-4">
 
            {/* Go Back Button */}
            <button
              onClick={handleGoBack}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </button>
          </div>
        </div>
 
        {/* Help Section */}
        <div className="mt-6 bg-indigo-50 rounded-xl p-6 border border-indigo-200">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-indigo-900 font-medium mb-1">
                Still having trouble?
              </h3>
              <p className="text-indigo-700 text-sm leading-relaxed">
                Check your spam folder or contact our support team for assistance.
              </p>
            </div>
          </div>
        </div>
 
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Need help? Contact us at{' '}
            <a
              href="mailto:support@example.com"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}