'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.verified) {
          router.push(`/verification-success?email=${encodeURIComponent(data.email)}`);
        } else {
          router.push('/verification-failed');
        }
      } catch (error) {
        router.push('/verification-failed');
      }
    };

    if (token) verifyToken();
    else router.push('/verification-failed');
  }, [token, router]);

  return <div className="verification-loading">Verifying your email...</div>;
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div className="verification-loading">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}