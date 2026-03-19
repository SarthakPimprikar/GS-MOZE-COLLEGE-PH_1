'use client'

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle2 } from 'lucide-react';

function VerificationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600 animate-pulse"/>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Verified Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your email <span className="font-medium text-indigo-600">{email}</span> has been verified.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700">
              You may now return to your original device to complete the form.
            </p>
            <p className="text-sm text-gray-700 mt-1">
              The form should automatically update to show your email is verified.
            </p>
          </div>
          
          <a
            href="/"
            className="inline-block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-center"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function VerificationSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading verification status...</div>
      </div>
    }>
      <VerificationContent />
    </Suspense>
  );
}