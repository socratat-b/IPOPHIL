// src\lib\dms\data.ts
/**
 * This status is just for extra.
 */
export const user_status = [
    {
        value: "active",
        label: "Active",
    },
    {
        value: "inactive",
        label: "Inactive",
    },
]

export const user_role = [
    {
        value: "admin",
        label: "Admin",
    },
    {
        value: "user",
        label: "User",
    }
];

export const log_action = [
    {
        value: "created",
        label: "Created",
    },
    {
        value: "released",
        label: "Released",
    },
    {
        value: "received",
        label: "Received",
    },
    {
        value: "completed",
        label: "Completed",
    },
    {
        value: "returned",
        label: "Returned",
    }
];

export const intransit_status = [
    {
        value: "incoming",
        label: "Incoming",
    },
    {
        value: "outgoing",
        label: "Outgoing",
    },
    {
        value: "process",
        label: "process",
    }
];

export const doc_status = [
    {
        value: "dispatch",
        label: "Dispatch",
    },
    {
        value: "intransit",
        label: "Intransit",
    },
    {
        value: "completed",
        label: "Completed",
    },
    {
        value: "canceled",
        label: "Canceled",
    }
];

export const doc_classification = [
    {
        value: "simple",
        label: "Simple",
    },
    {
        value: "complex",
        label: "Complex",
    },
    {
        value: "highly_technical",
        label: "Highly Technical",
    }
];

// mar-note: For Test ONLY
export const doc_type_samples = [
    {
        value: "memorandum",
        label: "Memorandum",
    },
    {
        value: "letter",
        label: "Letter",
    },
    {
        value: "resolution",
        label: "Resolution",
    },
    {
        value: "executive_order",
        label: "Executive Order",
    },
    {
        value: "circular",
        label: "Circular",
    },
    {
        value: "administrative_order",
        label: "Administrative Order",
    },
    {
        value: "department_order",
        label: "Department Order",
    },
    {
        value: "special_order",
        label: "Special Order",
    },
    {
        value: "office_order",
        label: "Office Order",
    },
    {
        value: "travel_order",
        label: "Travel Order",
    }
];
