import { ServiceFactory } from "./ServiceFactory";
import { Class } from "utility-types";

export type ClassOrFactory<T = unknown> = Class<T> | ServiceFactory<T>;
