import { contextBridge, ipcRenderer } from 'electron'

const allowedStoreKeys = new Set(['menuItems', 'historyEntries', 'settings'] as const)

type AllowedStoreKey = 'menuItems' | 'historyEntries' | 'settings'

contextBridge.exposeInMainWorld('openspecBridge', {
  ping: async () => 'pong',
  store: {
    get: (key: AllowedStoreKey) => ipcRenderer.invoke('store-get', key),
    set: (key: AllowedStoreKey, value: any) => ipcRenderer.invoke('store-set', key, value),
    delete: (key: AllowedStoreKey) => ipcRenderer.invoke('store-delete', key),
    clear: () => ipcRenderer.invoke('store-clear')
  }
})
