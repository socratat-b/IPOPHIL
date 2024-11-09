// src/lib/faker/management/data.ts

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
        value: "received",
        label: "Received",
    },
    {
        value: "completed",
        label: "Completed",
    },
    {
        value: "canceled",
        label: "Canceled",
    },
    {
        value: "archived",
        label: "Archived",
    }
];

export const doc_type = [
    {
        value: "memo",
        label: "Memo",
    },
    {
        value: "letter",
        label: "Letter",
    },
    {
        value: "report",
        label: "Report",
    },
    {
        value: "resolution",
        label: "Resolution",
    },
    {
        value: "contract",
        label: "Contract",
    },
    {
        value: "request",
        label: "Request",
    },
    {
        value: "proposal",
        label: "Proposal",
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