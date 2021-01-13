import { Dictionary } from "./TypeScriptBody";

export interface YarnBody {
    flat: boolean;

    peerDependenciesMeta: Record<string, { optional: boolean }>;

    resolutions: Dictionary;

    workspaces: string[];
}
