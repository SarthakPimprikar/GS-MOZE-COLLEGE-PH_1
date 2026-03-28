import React from 'react';
import { Shield, ArrowLeft, Home, Mail } from 'lucide-react';

const UnauthorizedPage = () => {
  const handleGoBack = () => {
    window.location.href = '/login';
  };

  const handleGoHome = () => {
     window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
          <Shield className="w-12 h-12 text-red-500" />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Error Code */}
          <div className="text-6xl font-bold text-gray-300 mb-2">401</div>
          
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Unauthorized Access
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sorry, you don't have permission to access this page. Please check your credentials or contact your administrator.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              Go to Home
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">
              Need help? Contact support
            </p>
            <a
              href="mailto:support@example.com"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              <Mail className="w-4 h-4" />
              support@example.com
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          If you believe this is an error, please contact your system administrator
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;