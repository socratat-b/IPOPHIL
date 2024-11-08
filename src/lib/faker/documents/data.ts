// src\lib\faker\data\data.tsx
import { Icons } from "@/components/ui/icons"

export const classifications = [
    {
        value: "all",
        label: "All Classifications"
    },
    {
        value: "confidential",
        label: "Confidential",
    },
    {
        value: "marketing",
        label: "Marketing",
    },
    {
        value: "legal",
        label: "Legal",
    },
    {
        value: "hr",
        label: "HR",
    },
    {
        value: "financial",
        label: "Financial",
    },
    {
        value: "internal",
        label: "Internal",
    },
    {
        value: "external",
        label: "External",
    },
]

export const origin_offices = [
    {
        value: "all",
        label: "All Offices"
    },
    {
        value: "header_office",
        label: "Head Office",
    },
    {
        value: "branch_office",
        label: "Branch Office",
    },
    {
        value: "regional_office",
        label: "Regional Office",
    },
]

export const types = [
    {
        value: "all",
        label: "All Types"
    },
    {
        label: "report",
        value: "Report",
        icon: Icons.arrowDownIcon,
    },
    {
        label: "meeting",
        value: "Meeting",
        icon: Icons.arrowRightIcon,
    },
    {
        label: "document",
        value: "Document",
        icon: Icons.arrowUpIcon,
    },
    {
        label: "email",
        value: "Email",
        icon: Icons.arrowUpIcon,
    },
]

export const statuses = [
    {
        value: "all",
        label: "All Status"
    },
    {
        value: "for_dispatch",
        label: "For Dispatch",
        icon: Icons.infoCircledIcon,
    },
    {
        value: "incoming",
        label: "Incoming",
        icon: Icons.infoCircledIcon,
    },
    {
        value: "recieved",
        label: "Recieved",
        icon: Icons.radioReceiverIcon,
    },
    {
        value: "outgoing",
        label: "Outgoing",
        icon: Icons.circleIcon,
    },
    {
        value: "completed",
        label: "Completed",
        icon: Icons.stopwatchIcon,
    },
]