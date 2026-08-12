export {};

declare global {
  interface Window {
    autoclicker: {
      toggle(): Promise<unknown>;
    };
  }
}
