import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
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
      preload: fileURLToPath(new URL('./index.mjs', import.meta.url))
    }
  })

  win.setMenuBarVisibility(false)

  const devServerUrl = process.env.VITE_DEV_SERVER_URL
  if (devServerUrl) {
    await win.loadURL(devServerUrl)
    return
  }

  await win.loadFile(fileURLToPath(new URL('../dist/index.html', import.meta.url)))
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
