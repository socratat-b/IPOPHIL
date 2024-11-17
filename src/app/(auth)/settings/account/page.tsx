// src\app\(auth)\settings\account\page.tsx
import { Metadata } from "next";
import { Suspense } from 'react';
import { Separator } from '@/components/ui/separator';
import { AccountForm } from "@/components/custom/settings/account-form";

export const metadata: Metadata = {
    title: 'DMS | Account Setting',
    description: 'User Notifications',
}

export default function AccountSettingsPage() {
    return (
        <div className='space-y-6'>
            <div>
                <h3 className='text-lg font-medium'>Account</h3>
                <p className='text-sm text-muted-foreground'>
                    Update your account settings. Set your preferred language and
                    timezone.
                </p>
            </div>
            <Separator />
            <Suspense fallback={<div>Loading...</div>}>
                <AccountForm />
            </Suspense>
        </div>
    );
}