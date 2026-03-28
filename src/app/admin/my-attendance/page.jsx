'use client'
import React from 'react';
import AttendanceSystem from '@/components/AttendanceSystem';
import { useSession } from '@/context/SessionContext';

export default function AdminMyAttendancePage() {
  const { user } = useSession();

  if (!user) return null;

  return (
    <div className="p-6">
      <AttendanceSystem user={user} role="Admin" />
    </div>
  );
}
