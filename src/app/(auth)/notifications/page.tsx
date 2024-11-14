'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/custom/dashboard/header';
import { formatTime } from '@/lib/controls';

type NotificationType = 'document' | 'system' | 'reminder' | 'action';
type NotificationStatus = 'read' | 'unread';
type NotificationPriority = 'high' | 'medium' | 'low';
type BadgeVariant = "destructive" | "secondary" | "default" | "outline";
type AvailableIcons = keyof typeof Icons;

interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    status: NotificationStatus;
    priority: NotificationPriority;
    icon: AvailableIcons;
}

const notifications: Notification[] = [
    {
        id: 1,
        type: 'document',
        title: 'New Document Received',
        message: 'Document #DOC-2024-001 has been received and requires your attention',
        timestamp: '2024-11-10T10:30:00',
        status: 'unread',
        priority: 'high',
        icon: 'fileText'
    }, {
        id: 2,
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 12:00 AM',
        timestamp: '2024-11-10T09:15:00',
        status: 'read',
        priority: 'medium',
        icon: 'warning'
    },
    {
        id: 3,
        type: 'action',
        title: 'Document Ready for Dispatch',
        message: 'Document #DOC-2024-003 is ready for dispatch. Please review and approve.',
        timestamp: '2024-11-09T16:45:00',
        status: 'unread',
        priority: 'high',
        icon: 'send'
    },
    {
        id: 4,
        type: 'reminder',
        title: 'Document Review Due',
        message: 'The review for Document #DOC-2024-002 is due in 2 days',
        timestamp: '2024-11-09T14:20:00',
        status: 'read',
        priority: 'medium',
        icon: 'calendarClock'
    },
    {
        id: 5,
        type: 'document',
        title: 'Document Completed',
        message: 'Document #DOC-2024-004 has been marked as completed',
        timestamp: '2024-11-09T11:10:00',
        status: 'read',
        priority: 'low',
        icon: 'badgeCheck'
    }

];

const NotificationItem = ({ notification }: { notification: Notification }) => {
    const getPriorityBadgeVariant = (priority: NotificationPriority): BadgeVariant => {
        switch (priority) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'secondary';
            case 'low':
                return 'default';
        }
    };

    const getNotificationIcon = () => {
        switch (notification.type) {
            case 'document':
                return <Icons.fileText className="h-4 w-4" />;
            case 'system':
                return <Icons.settings className="h-4 w-4" />;
            case 'reminder':
                return <Icons.calendarClock className="h-4 w-4" />;
            case 'action':
                return <Icons.bell className="h-4 w-4" />;
            default:
                return <Icons.bell className="h-4 w-4" />;
        }
    };

    return (
        <div className={`p-4 border-b last:border-b-0 ${notification.status === 'unread' ? 'bg-muted/50' : ''}`}>
            <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-muted">
                    {getNotificationIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-medium truncate">{notification.title}</p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTime(notification.timestamp)}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center gap-2">
                        <Badge variant={getPriorityBadgeVariant(notification.priority)}>
                            {notification.priority}
                        </Badge>
                        <Badge variant={notification.status === 'unread' ? 'default' : 'secondary'}>
                            {notification.status}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
};

function NotificationList({ notifications }: { notifications: Notification[] }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="pr-4">
                    <div className="space-y-1">
                        {notifications.map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

export default function NotificationsPage() {
    const filterNotifications = (tab: string) => {
        if (tab === 'all') return notifications;
        if (tab === 'unread') return notifications.filter(n => n.status === 'unread');
        return notifications.filter(n => n.type === tab);
    };

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard", active: false },
                    { label: "Notifications", href: "/dashboard/notifications", active: true },
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Tabs defaultValue="all" className="w-full">
                    <div className="flex items-center justify-between space-x-4 pb-3">
                        <TabsList className="bg-muted">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="unread">Unread</TabsTrigger>
                            <TabsTrigger value="document">Documents</TabsTrigger>
                            <TabsTrigger value="system">System</TabsTrigger>
                            <TabsTrigger value="reminder">Reminders</TabsTrigger>
                        </TabsList>
                        <Button variant="outline" size="sm">
                            <Icons.check className="mr-2 h-4 w-4" />
                            Mark all as read
                        </Button>
                    </div>

                    <TabsContent value="all">
                        <NotificationList notifications={filterNotifications('all')} />
                    </TabsContent>
                    <TabsContent value="unread">
                        <NotificationList notifications={filterNotifications('unread')} />
                    </TabsContent>
                    <TabsContent value="document">
                        <NotificationList notifications={filterNotifications('document')} />
                    </TabsContent>
                    <TabsContent value="system">
                        <NotificationList notifications={filterNotifications('system')} />
                    </TabsContent>
                    <TabsContent value="reminder">
                        <NotificationList notifications={filterNotifications('reminder')} />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}