// Este archivo se creo porque TypeScript no estaba reconociendo correctamente los tipos del paquete. Entonces aparecían errores relacionados con el módulo y con emailjs.send().

// Su funcion es ayudar a TypeScript a entender emailjs

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
