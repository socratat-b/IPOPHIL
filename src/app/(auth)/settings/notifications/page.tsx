import type { Metadata } from 'next'

import { Separator } from '@/components/ui/separator'
import { NotificationsForm } from '@/components/custom/settings/notifications-form'

export const metadata: Metadata = {
    title: 'DMS | Notifications',
    description: 'User Notifications',
}

export default function Page() {
    return (
        <>
            <div className='space-y-6'>
                <div>
                    <h3 className='text-lg font-medium'>Notifications</h3>
                    <p className='text-sm text-muted-foreground'>
                        Configure how you receive notifications.
                    </p>
                </div>
                <Separator />
                <NotificationsForm />
            </div>
        </>
    )
}