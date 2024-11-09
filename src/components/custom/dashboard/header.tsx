"use client"

import React, { useState, useEffect } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserHeaderNav } from '@/components/custom/dashboard/user-header-nav';

interface DashboardHeaderProps {
    breadcrumbs?: {
        href?: string;
        label: string;
        active?: boolean;
    }[];
}

export function DashboardHeader({ breadcrumbs = [] }: DashboardHeaderProps) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <header className="flex h-16 shrink-0 items-center px-4 justify-between">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
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
            </div>
            {/* Display current date and time only when on the client */}
            <div className="flex items-center space-x-4">
                {currentTime && (
                    <div className="hidden md:block text-sm">
                        {currentTime.toLocaleString()}
                    </div>
                )}
                {/* 
                    mar-note: to fix the theme change button
                    <ThemeChange /> 
                */}
                <UserHeaderNav />
            </div>
        </header>
    );
}
