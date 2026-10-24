declare module '@emailjs/nodejs' {
  export interface EmailJSResponseStatus {
    status: number;
    text: string;
  }

  export interface EmailJSOptions {
    publicKey?: string;
    privateKey?: string;
    limitRate?: {
      id: string;
      throttle: number;
    };
  }

  export function send(
    serviceID: string,
    templateID: string,
    templateParams?: Record<string, unknown>,
    options?: EmailJSOptions,
  ): Promise<EmailJSResponseStatus>;

  const emailjs: {
    send: typeof send;
  };

  export default emailjs;
}
