declare module 'alpinejs' {
  const Alpine: {
    start(): void;
    data(name: string, callback: () => any): void;
  };
  export default Alpine;
}

declare global {
  interface Window {
    Alpine: any;
  }
}

export {};
