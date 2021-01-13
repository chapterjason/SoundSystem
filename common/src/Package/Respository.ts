export interface Respository {
    directory?: string;

    type: "git" | "svn";

    url: string;
}
