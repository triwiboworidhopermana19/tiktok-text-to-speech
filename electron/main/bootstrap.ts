import { App, BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions, shell } from 'electron'
import path from 'node:path'
import os from 'node:os'
import fs from 'fs'
import LicenseStorage from '../../lib/license-storage'
import LicenseChecker from '../../lib/license-checker'
import Queue from '../../lib/queue'
import TextToSpeech from '../../lib/text-to-speech'

const initLibrary = (args: { app: App }) => {
    const { app } = args
    const publicKey = app.isPackaged
        ? fs.readFileSync(path.join(process.resourcesPath, 'id_rsa.pub'), 'utf8')
        : fs.readFileSync(path.join(process.env.APP_ROOT, 'id_rsa.pub'), 'utf8')

    const licenseStorage = new LicenseStorage()
    const licenseChecker = new LicenseChecker(publicKey, licenseStorage)
    const queue = new Queue()
    const textToSpeech = new TextToSpeech()

    if (app.isPackaged) {
        textToSpeech.disableDebug()
    }

    return {
        licenseStorage,
        licenseChecker,
        queue,
        textToSpeech
    }
}

const initMenu = (args: {
    app: App,
    appIcon: string,
    preload: string,
    indexHtml: string,
    isMac: boolean,
    devServerUrl?: string | null
}) => {
    const {
        app,
        appIcon,
        preload,
        indexHtml,
        isMac,
        devServerUrl
    } = args

    const template = [
        // { role: 'appMenu' }
        ...(isMac
            ? [{
                label: app.name,
                submenu: [
                    { role: 'about' },
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideOthers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            }]
            : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac
                    ? [
                        { role: 'pasteAndMatchStyle' },
                        { role: 'delete' },
                        { role: 'selectAll' },
                        { type: 'separator' },
                        {
                            label: 'Speech',
                            submenu: [
                                { role: 'startSpeaking' },
                                { role: 'stopSpeaking' }
                            ]
                        }
                    ]
                    : [
                        { role: 'delete' },
                        { type: 'separator' },
                        { role: 'selectAll' }
                    ])
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac
                    ? [
                        { type: 'separator' },
                        { role: 'front' },
                        { type: 'separator' },
                        { role: 'window' }
                    ]
                    : [
                        { role: 'close' }
                    ])
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'About Tiktok Text to Speech',
                    click: async () => {
                        const childWindow = createWindow({
                            isMainWindow: false,
                            title: 'About Tiktok Text to Speech',
                            icon: appIcon,
                            preload,
                            indexHtml,
                            devServerUrl: devServerUrl
                        })

                        childWindow.removeMenu()

                        if (devServerUrl) {
                            childWindow.loadURL(`${devServerUrl}#about`)
                        } else {
                            childWindow.loadFile(indexHtml, { hash: 'about' })
                        }
                    }
                }
            ]
        }
    ]

    Menu.setApplicationMenu(Menu.buildFromTemplate(template as Array<MenuItem | MenuItemConstructorOptions>))
}

const createWindow = (args: {
    isMainWindow: boolean
    title: string
    icon: string
    preload: string
    indexHtml: string,
    devServerUrl?: string | null
}) => {
    const {
        isMainWindow,
        title,
        icon,
        preload,
        indexHtml,
        devServerUrl
    } = args

    const window = new BrowserWindow({
        title,
        icon,
        webPreferences: {
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // nodeIntegration: true,

            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            // contextIsolation: false,
        }
    })

    if (!isMainWindow) return window

    if (devServerUrl) { // #298
        window.loadURL(devServerUrl)
        // Open devTool if the app is not packaged
        window.webContents.openDevTools()
    } else window.loadFile(indexHtml)

    // Test actively push message to the Electron-Renderer
    window.webContents.on('did-finish-load', () => {
        window?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    window.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })

    // win.webContents.on('will-navigate', (event, url) => { }) #344

    return window
}

const setOSSpecification = (args: { app: App }) => {
    const { app } = args

    // Disable GPU Acceleration for Windows 7
    if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

    // Set application name for Windows 10+ notifications
    if (process.platform === 'win32') app.setAppUserModelId(app.getName())

    if (!app.requestSingleInstanceLock()) {
        app.quit()
        process.exit(0)
    }
}

export default {
    initLibrary,
    initMenu,
    createWindow,
    setOSSpecification
}
