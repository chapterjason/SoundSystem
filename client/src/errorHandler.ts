export async function errorHandler(error: Error): Promise<number> {
    console.log(error);

    return 1;
}
