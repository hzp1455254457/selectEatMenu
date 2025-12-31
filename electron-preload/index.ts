import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('openspecBridge', {
  ping: async () => 'pong'
})

