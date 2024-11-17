// src\app\(auth)\settings\appearance\page.tsx
import { Metadata } from "next";
import { Suspense } from 'react';
import { Separator } from '@/components/ui/separator';
import { AppearanceForm } from "@/components/custom/settings/appearance-form";

export const metadata: Metadata = {
    title: 'DMS | Appearance Settings',
    description: 'User Notifications',
}

export default function AppearanceSettingsPage() {
    return (
        <div className='space-y-6'>
            <div>
                <h3 className='text-lg font-medium'>Appearance</h3>
                <p className='text-sm text-muted-foreground'>
                    Customize the appearance of the app. Automatically switch between day
                    and night themes.
                </p>
            </div>
            <Separator />
            <Suspense fallback={<div>Loading...</div>}>
                <AppearanceForm />
            </Suspense>
        </div>
    );
}