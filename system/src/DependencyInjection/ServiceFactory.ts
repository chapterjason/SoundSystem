export type ServiceFactory<T> = (...args: any[]) => Promise<T>;
