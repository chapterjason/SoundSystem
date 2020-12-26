export interface Report {
    id: string;

    time: number;

    timestamp: Date;

    points: {
        name: string;
        time: number;
    }[];
}
