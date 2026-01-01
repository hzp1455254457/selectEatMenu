import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Store from 'electron-store'

const store = new Store()

const allowedStoreKeys = new Set(['menuItems', 'historyEntries', 'settings'] as const)

const isAllowedStoreKey = (key: unknown): key is 'menuItems' | 'historyEntries' | 'settings' => {
  return typeof key === 'string' && allowedStoreKeys.has(key as any)
}

const isTrustedSender = (senderUrl: string) => {
  try {
    const url = new URL(senderUrl)
    const devServerUrl = process.env.VITE_DEV_SERVER_URL
    if (devServerUrl) {
      const devOrigin = new URL(devServerUrl).origin
      return url.origin === devOrigin
    }

    if (url.protocol !== 'file:') return false
    return url.pathname.toLowerCase().includes('/dist/')
  } catch {
    return false
  }
}

// Store IPC handlers (restricted)
ipcMain.handle('store-get', (event, key) => {
  if (!isTrustedSender(event.senderFrame?.url ?? event.sender.getURL())) throw new Error('Untrusted sender')
  if (!isAllowedStoreKey(key)) throw new Error('Invalid key')
  return store.get(key)
})

ipcMain.handle('store-set', (event, key, value) => {
  if (!isTrustedSender(event.senderFrame?.url ?? event.sender.getURL())) throw new Error('Untrusted sender')
  if (!isAllowedStoreKey(key)) throw new Error('Invalid key')
  store.set(key, value)
})

ipcMain.handle('store-delete', (event, key) => {
  if (!isTrustedSender(event.senderFrame?.url ?? event.sender.getURL())) throw new Error('Untrusted sender')
  if (!isAllowedStoreKey(key)) throw new Error('Invalid key')
  store.delete(key)
})

ipcMain.handle('store-clear', (event) => {
  if (!isTrustedSender(event.senderFrame?.url ?? event.sender.getURL())) throw new Error('Untrusted sender')
  store.clear()
})

const isAllowedNavigation = (navigationUrl: string) => {
  try {
    const url = new URL(navigationUrl)
    const devServerUrl = process.env.VITE_DEV_SERVER_URL
    if (devServerUrl) {
      const devOrigin = new URL(devServerUrl).origin
      return url.origin === devOrigin
    }

    if (url.protocol !== 'file:') return false
    return url.pathname.toLowerCase().includes('/dist/')
  } catch {
    return false
  }
}

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 720,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: fileURLToPath(new URL('./index.cjs', import.meta.url))
    }
  })

  win.setMenuBarVisibility(false)

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  win.webContents.on('will-navigate', (event, url) => {
    if (!isAllowedNavigation(url)) event.preventDefault()
  })

  // Open DevTools in production for debugging (Temporary)
  // win.webContents.openDevTools()

  const devServerUrl = process.env.VITE_DEV_SERVER_URL
  if (devServerUrl) {
    await win.loadURL(devServerUrl)
    return
  }

  // Use absolute path for production to avoid relative path issues
  // app.getAppPath() returns the path to the app.asar file in production
  await win.loadFile(path.join(app.getAppPath(), 'dist/index.html'))
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
