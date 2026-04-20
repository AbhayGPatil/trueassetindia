'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page - this route is disabled
    router.replace('/');
  }, [router]);

  return null;
}
