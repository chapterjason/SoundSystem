import { HasEmail } from "./HasEmail";
import { HasUrl } from "./HasUrl";

export type Address = HasEmail | HasUrl | (HasUrl & HasEmail);
