"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react'
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading } = useKindeBrowserClient();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth-callback?origin=dashboard');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className='w-full mt-24 flex justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
          <h3 className='font-semibold text-xl'>
            Logging into your account...
          </h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>;
    }

    if (!user) {
        return null; // or a loading indicator
    }

    return <Dashboard />;
}
