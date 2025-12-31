import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('openspecBridge', {
  ping: async () => 'pong',
  store: {
    get: (key: string) => ipcRenderer.invoke('store-get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('store-set', key, value),
    delete: (key: string) => ipcRenderer.invoke('store-delete', key),
    clear: () => ipcRenderer.invoke('store-clear')
  }
})

