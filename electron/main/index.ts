import { app, BrowserWindow, ipcMain, systemPreferences } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { username } from 'username'
import bootstrap from './bootstrap'
import AudioLocale from '../../lib/audio-locale'
import { WebcastPushConnection } from 'tiktok-live-connector'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Initialize environment variables.
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

const IS_MAC = process.platform === 'darwin'
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Initialize library
const lib = bootstrap.initLibrary({ app })

// Deconstruct lib variable.
const {
  licenseStorage,
  licenseChecker,
  queue,
  textToSpeech
} = lib

// Initialize window menus.
bootstrap.initMenu({
  app,
  appIcon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
  preload,
  indexHtml,
  isMac: IS_MAC,
  devServerUrl: VITE_DEV_SERVER_URL
})

// Initialize browser window variable.
let mainWindow: BrowserWindow

app.whenReady().then(() => {
  mainWindow = bootstrap.createWindow({
    isMainWindow: true,
    title: 'Tiktok Text to Speech',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    preload,
    indexHtml
  })
})

app.on('window-all-closed', () => {
  mainWindow = null

  if (IS_MAC) app.quit()
})

app.on('second-instance', () => {
  if (!mainWindow) {
    return
  }

  if (mainWindow.isMinimized()) mainWindow.restore()

  mainWindow.focus()
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    mainWindow = bootstrap.createWindow({
      isMainWindow: true,
      title: 'Tiktok Text to Speech',
      icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
      preload,
      indexHtml
    })
  }
})

ipcMain.handle('app:version', async (_, args) => {
  return app.getVersion()
})

ipcMain.handle('app:user', async (_, args) => {
  return app.getPath('home')
})

ipcMain.handle('check:license', async (_, args) => {
  const license = await licenseStorage.getLicense();

  if (!license) {
    return false;
  }

  return await licenseChecker.isValid(license);
});

ipcMain.handle('submit:license', async (_, args) => {
  if (!args?.license || args.license.length === 0) {
    return [null, "Kode aktivasi wajib diisi"]
  }

  const { license } = args

  const isValidLicense = await licenseChecker.isValid(license)

  if (!isValidLicense) {
    return [null, "Kode aktivasi tidak valid"]
  }

  await licenseStorage.saveLicense(license)

  return [null, null]
});

ipcMain.handle('submit:username', async (_, args) => {
  if (!args?.username || args.username.length === 0) {
    return [null, "Username wajib diisi"]
  }

  const { username } = args

  const connection = new WebcastPushConnection(username)

  try {
    const state = await connection.connect()

    connection.on('chat', async (data) => {
      if(data.comment) {
        queue.enqueue(async () => {
          return textToSpeech
            .createAudioFromText(data.uniqueId, data.comment, AudioLocale.ID)
            .then(textToSpeech.play)
        })
      }
    })

    queue.process()

    return [state, null]
  } catch (error) {
    console.error(error);
    
    if (error.message.includes('(user_not_found)')) {
      return [null, "Akun tidak dapat ditemukan"]
    }

    if (error.message.includes('LIVE has ended')) {
      return [null, "LIVE telah berakhir"]
    }

    return [null, "Gagal terkoneksi."]
  }
})