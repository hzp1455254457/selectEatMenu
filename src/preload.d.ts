export {}

declare global {
  interface Window {
    openspecBridge: {
      ping: () => Promise<string>
    }
  }
}

