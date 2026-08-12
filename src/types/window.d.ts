export {};

declare global {
    interface Window {
        autoclicker: {
            run(): Promise<unknown>;
        };
    }
}