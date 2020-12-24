export interface Report {
    id: string;

    request: number;

    order: string[];

    response: number;

    [name: string]: number | string | string[];

}
