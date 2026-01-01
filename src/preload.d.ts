export {}

declare global {
  type AllowedStoreKey = 'menuItems' | 'historyEntries' | 'settings'

  interface Window {
    openspecBridge: {
      ping: () => Promise<string>
      store: {
        get: (key: AllowedStoreKey) => Promise<any>
        set: (key: AllowedStoreKey, value: any) => Promise<void>
        delete: (key: AllowedStoreKey) => Promise<void>
        clear: () => Promise<void>
      }
    }
  }
}
