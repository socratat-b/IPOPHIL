// src\app\(auth)\settings\notifications\page.tsx
import { Metadata } from "next";
import { Suspense } from 'react';
import { Separator } from '@/components/ui/separator';
import { NotificationsForm } from "@/components/custom/settings/notifications-form";

export const metadata: Metadata = {
    title: 'DMS | Notifications Settings',
    description: 'User Notifications',
}

export default function NotificationSettingsPage() {
    return (
        <div className='space-y-6'>
            <div>
                <h3 className='text-lg font-medium'>Notifications</h3>
                <p className='text-sm text-muted-foreground'>
                    Configure how you receive notifications.
                </p>
            </div>
            <Separator />
            <Suspense fallback={<div>Loading...</div>}>
                <NotificationsForm />
            </Suspense>
        </div>
    );
}