export async function errorHandler(error: Error): Promise<number> {
    console.error(error);

    return 1;
}
