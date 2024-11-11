"use client"

import React, { useState, useEffect } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeChange } from '../theme/theme-change';
import { Calendar } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from '@/components/ui/separator';

interface DashboardHeaderProps {
    userName?: string;
    breadcrumbs?: {
        href?: string;
        label: string;
        active?: boolean;
    }[];
}

export function DashboardHeader({ userName = "John Doe", breadcrumbs = [] }: DashboardHeaderProps) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(date);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const getGreeting = () => {
        const hour = currentTime?.getHours() || 0;
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    return (
        <header className="flex h-16 shrink-0 items-center px-4 justify-between border-b bg-background">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                {breadcrumbs.length > 0 ? (
                    <>
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <React.Fragment key={index}>
                                        {index < breadcrumbs.length - 1 ? (
                                            <>
                                                <BreadcrumbItem className="hidden md:block">
                                                    <BreadcrumbLink href={breadcrumb.href || '#'}>
                                                        {breadcrumb.label}
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator className="hidden md:block" />
                                            </>
                                        ) : (
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        )}
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">
                            {getGreeting()}
                        </span>
                        <span className="font-medium">
                            {userName} ✨
                        </span>
                    </div>
                )}
            </div>

            <div className="ml-auto flex items-center gap-4">
                {currentTime && (
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(currentTime)}</span>
                        <span className="tabular-nums">{formatTime(currentTime)}</span>
                    </div>
                )}
                <ThemeChange />
            </div>
        </header>
    );
}
