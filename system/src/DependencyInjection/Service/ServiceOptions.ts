export interface ServiceOptions {
    name: string;

    lazy: boolean;

    shared: boolean;

    private: boolean;

    tags: string[];

    aliases: string[];
}
