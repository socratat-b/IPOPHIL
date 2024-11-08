"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doc_classification = exports.doc_type = exports.doc_status = exports.intransit_status = exports.log_action = exports.user_role = void 0;
// src\lib\faker\management\data.ts
exports.user_role = [
    {
        value: "admin",
        label: "Admin",
    },
    {
        value: "user",
        label: "User",
    }
];
exports.log_action = [
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
exports.intransit_status = [
    {
        value: "incoming",
        label: "Incoming",
    },
    {
        value: "outgoing",
        label: "Outgoing",
    }
];
exports.doc_status = [
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
exports.doc_type = [
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
exports.doc_classification = [
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
