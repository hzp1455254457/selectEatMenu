import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 720,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: fileURLToPath(new URL('./index.mjs', import.meta.url))
    }
  })

  const devServerUrl = process.env.VITE_DEV_SERVER_URL
  if (devServerUrl) {
    await win.loadURL(devServerUrl)
    return
  }

  await win.loadFile(fileURLToPath(new URL('../dist/index.html', import.meta.url)))
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
