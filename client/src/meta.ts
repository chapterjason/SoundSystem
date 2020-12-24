import { ProcessEnvironment } from "@mscs/environment";
import { Client } from "./Client";

export const ENVIRONMENT = new ProcessEnvironment();

export const client = new Client();
