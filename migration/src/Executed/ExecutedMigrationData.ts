import { Direction } from "../Migration/Direction";

export interface ExecutedMigrationData {
    version: string;

    timestamp: number;

    duration: number;

    direction: Direction;
}
