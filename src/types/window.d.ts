export {};

declare global {
  interface Window {
    autoclicker: {
      setKey(key: string): Promise<any>;
      stop: () => Promise<any>;
    };
  }
}
