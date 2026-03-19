import React from 'react'

const Container = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`}
    >
      {children}
    </div>
  )
}

export default Container