import { ServiceOptions } from "./ServiceOptions";

export const SERVICE_DEFAULTS: Omit<ServiceOptions, "name"> = {
    lazy: true,
    shared: true,
    private: true,
    tags: [],
    aliases: [],
};
