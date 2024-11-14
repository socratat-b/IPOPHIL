import type { Metadata } from 'next'

import { Separator } from '@/components/ui/separator'
import { AccountForm } from '@/components/custom/settings/account-form'

export const metadata: Metadata = {
    title: 'DMS | Notifications',
    description: 'User Notifications',
}

export default function Page() {
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
            <AccountForm />
        </div>
    )
}