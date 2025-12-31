export {}

declare global {
  interface Window {
    openspecBridge: {
      ping: () => Promise<string>
      store: {
        get: (key: string) => Promise<any>
        set: (key: string, value: any) => Promise<void>
        delete: (key: string) => Promise<void>
        clear: () => Promise<void>
      }
    }
  }
}

