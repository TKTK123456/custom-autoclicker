import { RateLimitInfo } from "../shared/sharedTypes.ts";

export {};

declare global {
  interface Window {
    autoclicker: {
      setKey(key: string): Promise<any>;
      stop: () => Promise<any>;
      onRateLimitInfo: (callback: (data: RateLimitInfo) => void) => void;
    };
  }
}
