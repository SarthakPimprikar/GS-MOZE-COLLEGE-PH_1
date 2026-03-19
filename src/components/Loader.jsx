import React from 'react';

const Loader = ({ size = 'medium', text = 'Loading...', className = '', center = false }) => {
  const sizes = {
    small: { book: 60, page: 52, height: 70 },
    medium: { book: 80, page: 70, height: 90 },
    large: { book: 120, page: 105, height: 135 }
  };

  // Increased animation durations
  const ANIMATION_DURATION = '3.5s'; // Increased from 2.5s
  const FADE_IN_DURATION = '6s'; // Increased from 1.5s
  const PULSE_DURATION = '8s'; // Increased from 2s

  const currentSize = sizes[size];

  return (
    <div className={`book-loader ${center ? 'centered' : ''} ${className}`}>
      <div className="book">
        <div className="book-spine"></div>
        
        {[...Array(3)].map((_, index) => (
          <div key={index} className={`page page-${index + 1}`}>
            <div className="page-content">
              <div className="page-line"></div>
              <div className="page-line"></div>
              <div className="page-line"></div>
            </div>
          </div>
        ))}
        
        <div className="page page-back"></div>
      </div>
      
      {/* {text && <div className="loading-text">{text}</div>} */}

      <style jsx>{`
        .book-loader {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .book-loader.centered {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
        }

        .book {
          position: relative;
          width: ${currentSize.book}px;
          height: ${currentSize.height}px;
          perspective: 400px;
          transform-style: preserve-3d;
        }

        .book-spine {
          position: absolute;
          left: 50%;
          top: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(to right, #8B4513, #D2691E);
          transform: translateX(-50%) rotateY(-90deg);
          border-radius: 0 2px 2px 0;
          box-shadow: 0 0 8px rgba(0,0,0,0.2);
        }

        .page {
          position: absolute;
          width: ${currentSize.page}px;
          height: ${currentSize.height - 10}px;
          background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
          border-radius: 3px;
          box-shadow: 
            0 2px 8px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.8);
          transform-origin: left center;
          transform-style: preserve-3d;
          border: 1px solid #e0e0e0;
          left: 4px;
          top: 5px;
        }

        .page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.03) 2%, transparent 4%),
            repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.02) 9px);
          border-radius: 3px;
          pointer-events: none;
        }

        .page-content {
          padding: 12px 8px;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .page-line {
          height: 2px;
          background: linear-gradient(90deg, #007bff, #0056b3);
          border-radius: 1px;
          opacity: 0.6;
        }

        .page-line:nth-child(1) { 
          width: 80%; 
          animation: fadeInLine ${FADE_IN_DURATION} ease-in-out infinite; 
        }
        .page-line:nth-child(2) { 
          width: 65%; 
          animation: fadeInLine ${FADE_IN_DURATION} ease-in-out 0.3s infinite; 
        }
        .page-line:nth-child(3) { 
          width: 85%; 
          animation: fadeInLine ${FADE_IN_DURATION} ease-in-out 0.6s infinite; 
        }

        @keyframes fadeInLine {
          0%, 100% { opacity: 0.3; transform: scaleX(0.9); }
          50% { opacity: 0.7; transform: scaleX(1); }
        }

        .page-1 {
          z-index: 4;
          animation: flipPage1 ${ANIMATION_DURATION} ease-in-out infinite;
        }

        .page-2 {
          z-index: 3;
          animation: flipPage2 ${ANIMATION_DURATION} ease-in-out infinite;
        }

        .page-3 {
          z-index: 2;
          animation: flipPage3 ${ANIMATION_DURATION} ease-in-out infinite;
        }

        .page-back {
          z-index: 1;
          background: #f5f5f5;
        }

        @keyframes flipPage1 {
          0%, 15% { transform: rotateY(0deg); }
          25%, 40% { transform: rotateY(-180deg); }
          70%, 100% { transform: rotateY(0deg); }
        }

        @keyframes flipPage2 {
          10%, 25% { transform: rotateY(0deg); }
          35%, 50% { transform: rotateY(-180deg); }
          60%, 85% { transform: rotateY(0deg); }
        }

        @keyframes flipPage3 {
          20%, 35% { transform: rotateY(0deg); }
          45%, 60% { transform: rotateY(-180deg); }
          50%, 75% { transform: rotateY(0deg); }
        }

        .loading-text {
          color: #666;
          font-size: ${size === 'small' ? '12px' : size === 'medium' ? '14px' : '16px'};
          font-weight: 500;
          text-align: center;
          animation: pulse ${PULSE_DURATION} ease-in-out infinite;
          font-family: system-ui, -apple-system, sans-serif;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Loader;