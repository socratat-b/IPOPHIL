export interface StatusCounts {
    incoming: number;
    recieved: number;
    outgoing: number;
    forDispatch: number;
    completed: number;
}

export interface Stats {
    current: StatusCounts;
    percentageChanges: {
        incoming: number;
        recieved: number;
        outgoing: number;
        completed: number;
    };
}
