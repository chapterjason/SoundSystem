import { Dictionary} from "./TypeScriptBody";
import { UrlRef } from "./UrlRef";
import { Directories } from "./Directories";
import { Address } from "./Address";
import { Person } from "./Person";
import { Respository } from "./Respository";
import { License } from "./License";
import { Browser } from "./Browser";

export interface OptionalBody {
    author: Person;

    bin: Dictionary;

    browser: string | Browser;

    bugs: string | Address;

    bundledDependencies: string[];

    collective: string | UrlRef;

    config: Record<string, unknown>;

    contributors: Person[];

    cpu: string[];

    dependencies: Dictionary;

    description: string;

    devDependencies: Dictionary;

    directories: Partial<Directories>;

    engines: Dictionary;

    /** @deprecated since npm 3.0.0 */
    engineStrict: boolean;

    files: string[];

    funding: string | UrlRef;

    homepage: string;

    keywords: string[];

    license: string | License;

    /** @deprecated was never official */
    licenses: License[];

    main: string;

    man: string | string[];

    optionalDependencies: Dictionary;

    os: string[];

    peerDependencies: Dictionary;

    /** @deprecated */
    preferGlobal: boolean;

    private: boolean;

    publishConfig: Dictionary;

    repository: Respository | string;

    scripts: Dictionary;
}
