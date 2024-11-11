"use client"

import React, { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeChange } from '../theme/theme-change';
import { Calendar } from 'lucide-react';

interface DashboardHeaderProps {
    userName?: string;
}

export function DashboardHeader({ userName = "John Doe" }: DashboardHeaderProps) {
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
        <header className="flex h-14 items-center border-b bg-background px-6">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
                <span className="text-muted-foreground">
                    {getGreeting()}
                </span>
                <span className="font-medium">
                    {userName} ✨
                </span>
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