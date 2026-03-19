import React from 'react'

const Avatar = ({ name, size = "md", className = "" }) => {
     const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };
  
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className={`${sizes[size]} bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold ${className}`}>
      {initials}
    </div>
  )
}

export default Avatar