import { TypeScriptBody} from "./TypeScriptBody";
import { OptionalBody } from "./OptionalBody";
import { YarnBody } from "./YarnBody";

export interface NpmPackageData extends Partial<OptionalBody>,
    Partial<TypeScriptBody>,
    Partial<YarnBody> {
    name: string;

    version: string;
}
