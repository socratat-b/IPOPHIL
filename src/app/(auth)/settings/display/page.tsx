import { Metadata } from "next"
import { Separator } from '@/components/ui/separator'
import { SidebarDisplayForm } from '@/components/custom/settings/display-form'

export const metadata: Metadata = {
    title: 'DMS | Display Setting',
    description: 'User Notifications',
}

export default function DisplaySettingsPage() {
    return (
        <div className='space-y-6'>
            <div>
                <h3 className='text-lg font-medium'>Display</h3>
                <p className='text-sm text-muted-foreground'>
                    Turn items on or off to control what&aposs displayed in the app.
                </p>
            </div>
            <Separator />
            <SidebarDisplayForm />
        </div>
    )
}