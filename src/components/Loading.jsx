import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingComponent = ({ 
  message = "Loading...", 
  subMessage = "Please wait while we process your request",
  size = "default" // "small", "default", "large"
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'max-w-xs',
          icon: 'w-16 h-16',
          spinner: 'w-8 h-8',
          title: 'text-lg',
          padding: 'p-6'
        };
      case 'large':
        return {
          container: 'max-w-lg',
          icon: 'w-32 h-32',
          spinner: 'w-16 h-16',
          title: 'text-3xl',
          padding: 'p-10'
        };
      default:
        return {
          container: 'max-w-md',
          icon: 'w-24 h-24',
          spinner: 'w-12 h-12',
          title: 'text-2xl',
          padding: 'p-8'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className={`${sizeClasses.container} w-full text-center`}>
        {/* Animated Icon */}
        <div className={`mx-auto ${sizeClasses.icon} bg-blue-50 rounded-full flex items-center justify-center mb-8 relative`}>
          <Loader2 className={`${sizeClasses.spinner} text-blue-500 animate-spin`} />
          
          {/* Pulse Animation Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse"></div>
        </div>

        {/* Main Content */}
        <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${sizeClasses.padding}`}>
          {/* Title */}
          <h1 className={`${sizeClasses.title} font-semibold text-gray-900 mb-3`}>
            {message}
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {subMessage}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          This may take a few moments
        </p>
      </div>
    </div>
  );
};

// Example usage with different variations
const LoadingExamples = () => {
  return (
    <div className="space-y-8">
      {/* Default Loading */}
      <LoadingComponent />
      
      {/* Custom Message */}
      <LoadingComponent 
        message="Authenticating..." 
        subMessage="Verifying your credentials securely"
      />
      
      {/* Small Size */}
      <LoadingComponent 
        size="small"
        message="Saving..."
        subMessage="Your changes are being saved"
      />
      
      {/* Large Size */}
      <LoadingComponent 
        size="large"
        message="Processing Payment"
        subMessage="Please do not close this window while we process your transaction"
      />
    </div>
  );
};

export default LoadingComponent;