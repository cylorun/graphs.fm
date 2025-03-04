export function reportError(message: string, error?: Error): void {
    console.error(message);
    error ? console.error(error?.stack) : null;
}