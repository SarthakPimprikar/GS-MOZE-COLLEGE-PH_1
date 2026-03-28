'use client'
import React from 'react';
import LetterGenerationSystem from '@/components/LetterGenerationSystem';
import { useSession } from '@/context/SessionContext';

const StaffLetterGeneration = () => {
  const { user } = useSession();
  if (!user) return null;

  return (
    <div className="bg-[#F8F9FC] min-h-screen">
       <LetterGenerationSystem currentUser={user} />
    </div>
  );
};

export default StaffLetterGeneration;
