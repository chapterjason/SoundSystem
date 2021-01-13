import { HasName } from "./HasName";
import { Address } from "./Address";

export type Person = (HasName & Partial<Address>) | string;
