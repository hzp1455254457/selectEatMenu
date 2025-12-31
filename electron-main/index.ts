import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Store from 'electron-store'

const store = new Store()

// Store IPC handlers
ipcMain.handle('store-get', (_event, key) => {
  const value = store.get(key)
  console.log(`[IPC] store-get ${key}:`, value)
  return value
})

ipcMain.handle('store-set', (_event, key, value) => {
  console.log(`[IPC] store-set ${key}:`, value)
  store.set(key, value)
})

ipcMain.handle('store-delete', (_event, key) => {
  store.delete(key)
})

ipcMain.handle('store-clear', () => {
  store.clear()
})

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
