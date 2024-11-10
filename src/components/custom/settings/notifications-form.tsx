"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription, Form } from "@/components/ui/form"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

const notificationsFormSchema = z.object({
    notification_type: z.enum(["all", "document", "system", "reminder"], {
        required_error: "You need to select a notification type.",
    }),
    priority_preferences: z.object({
        high: z.boolean().default(true),
        medium: z.boolean().default(true),
        low: z.boolean().default(true),
    }),
    email_preferences: z.object({
        document_notifications: z.boolean().default(true),
        system_notifications: z.boolean().default(true),
        reminder_notifications: z.boolean().default(true),
    }),
    mobile_preferences: z.boolean().default(false),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

const defaultValues: Partial<NotificationsFormValues> = {
    notification_type: "all",
    priority_preferences: {
        high: true,
        medium: true,
        low: true,
    },
    email_preferences: {
        document_notifications: true,
        system_notifications: true,
        reminder_notifications: true,
    },
    mobile_preferences: false,
}

export function NotificationsForm() {
    const form = useForm<NotificationsFormValues>({
        resolver: zodResolver(notificationsFormSchema),
        defaultValues,
    })

    function onSubmit(data: NotificationsFormValues) {
        toast("Notification preferences updated:", {
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="notification_type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Show notifications for...</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="all" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            All notifications
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="document" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Document notifications only
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="system" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            System notifications only
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="reminder" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Reminder notifications only
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    <h3 className="mb-4 text-lg font-medium">Priority Preferences</h3>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="priority_preferences.high"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            High Priority
                                        </FormLabel>
                                        <FormDescription>
                                            Receive notifications for high priority items
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priority_preferences.medium"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Medium Priority
                                        </FormLabel>
                                        <FormDescription>
                                            Receive notifications for medium priority items
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priority_preferences.low"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Low Priority
                                        </FormLabel>
                                        <FormDescription>
                                            Receive notifications for low priority items
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email_preferences.document_notifications"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Document Notifications
                                        </FormLabel>
                                        <FormDescription>
                                            Receive emails about new documents and document updates
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email_preferences.system_notifications"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            System Notifications
                                        </FormLabel>
                                        <FormDescription>
                                            Receive emails about system updates and maintenance
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email_preferences.reminder_notifications"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Reminder Notifications
                                        </FormLabel>
                                        <FormDescription>
                                            Receive emails about reminders and upcoming tasks
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="mobile_preferences"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Enable mobile notifications
                                </FormLabel>
                                <FormDescription>
                                    You can customize your mobile notification settings in the{" "}
                                    <Link href="/settings/mobile">mobile settings</Link> page.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit">Update notifications</Button>
            </form>
        </Form>
    )
}