import { app, BrowserWindow, ipcMain, nativeTheme, Notification } from 'electron'
import { join } from 'path'
import { NetworkMonitor } from './network-monitor'
import { ThresholdChecker } from './threshold-checker'
import { PowerActions } from './power-actions'
import { TrayManager } from './tray'
import { SettingsStore, AppSettings } from './store'

let mainWindow: BrowserWindow | null = null
let networkMonitor: NetworkMonitor | null = null
let thresholdChecker: ThresholdChecker | null = null
let trayManager: TrayManager | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 640,
    minWidth: 800,
    minHeight: 560,
    frame: false,
    transparent: false,
    backgroundColor: '#1a1a2e',
    titleBarStyle: 'hidden',
    resizable: true,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('close', (e) => {
    if (trayManager && !(app as any).isQuitting) {
      e.preventDefault()
      mainWindow?.hide()
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function setupIPC(): void {
  const store = SettingsStore.getInstance()

  // Settings
  ipcMain.handle('settings:get', () => {
    return store.getSettings()
  })

  ipcMain.handle('settings:set', (_event, settings: Partial<AppSettings>) => {
    store.updateSettings(settings)
    const s = store.getSettings()
    
    if (thresholdChecker) {
      thresholdChecker.updateConfig(s.thresholdMbps, s.confirmDurationSec)
    }

    if (networkMonitor) {
      if (settings.selectedInterface !== undefined) {
        networkMonitor.setInterface(settings.selectedInterface)
      }
      if (settings.pollIntervalMs !== undefined) {
        networkMonitor.setPollInterval(settings.pollIntervalMs)
      }
    }

    if (settings.autoStart !== undefined) {
      app.setLoginItemSettings({
        openAtLogin: settings.autoStart,
        openAsHidden: true
      })
    }

    return s
  })

  // Network Interfaces
  ipcMain.handle('network:interfaces', async () => {
    return await NetworkMonitor.getAvailableInterfaces()
  })

  // Monitor control
  ipcMain.handle('monitor:start', () => {
    if (thresholdChecker) {
      const s = store.getSettings()
      thresholdChecker.start(s.initialGracePeriodSec || 0)
      trayManager?.updateStatus('monitoring')
      mainWindow?.webContents.send('monitor:status', 'monitoring')
    }
    return true
  })

  ipcMain.handle('monitor:stop', () => {
    if (thresholdChecker) {
      thresholdChecker.stop()
      trayManager?.updateStatus('idle')
      mainWindow?.webContents.send('monitor:status', 'idle')
    }
    return true
  })

  // Action cancel
  ipcMain.handle('action:cancel', () => {
    if (thresholdChecker) {
      thresholdChecker.cancelCountdown()
      trayManager?.updateStatus('monitoring')
      mainWindow?.webContents.send('monitor:status', 'monitoring')
    }
    return true
  })

  // Window controls
  ipcMain.handle('window:minimize', () => {
    mainWindow?.minimize()
  })

  ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.handle('window:close', () => {
    mainWindow?.close()
  })

  // Activity log
  ipcMain.handle('log:get', () => {
    return store.getLogs()
  })

  ipcMain.handle('log:clear', () => {
    store.clearLogs()
    return []
  })
}

function setupMonitoring(): void {
  const store = SettingsStore.getInstance()
  const settings = store.getSettings()

  networkMonitor = new NetworkMonitor(settings.pollIntervalMs || 1000, settings.selectedInterface || 'all')
  thresholdChecker = new ThresholdChecker(
    settings.thresholdMbps,
    settings.confirmDurationSec
  )

  // Send network stats to renderer
  networkMonitor.on('stats', (stats) => {
    mainWindow?.webContents.send('network:stats', stats)
    thresholdChecker?.feed(stats.downloadMbps)
  })

  // Threshold events
  thresholdChecker.on('download-detected', () => {
    store.addLog('info', 'Active download detected (speed above threshold)')
    mainWindow?.webContents.send('monitor:status', 'monitoring')
  })

  thresholdChecker.on('threshold-reached', () => {
    const s = store.getSettings()
    store.addLog('warning', `Download appears complete. Starting ${s.countdownSec}s countdown...`)
    mainWindow?.webContents.send('monitor:status', 'countdown')
    mainWindow?.webContents.send('countdown:start', s.countdownSec)
    trayManager?.updateStatus('countdown')

    mainWindow?.show()
    mainWindow?.focus()

    if (s.notifications && Notification.isSupported()) {
      try {
        const notif = new Notification({
          title: 'Download Complete!',
          body: `System will ${s.actionType} in ${s.countdownSec} seconds. Click here to cancel.`,
          silent: !s.audioAlert
        })
        notif.on('click', () => {
          mainWindow?.show()
          mainWindow?.focus()
        })
        notif.show()
      } catch (err) {
        console.error('Failed to show notification:', err)
      }
    }

    // Start the countdown timer
    thresholdChecker?.startCountdown(s.countdownSec)
  })

  thresholdChecker.on('countdown-tick', (remaining: number) => {
    mainWindow?.webContents.send('countdown:tick', remaining)
  })

  thresholdChecker.on('countdown-complete', () => {
    const s = store.getSettings()
    store.addLog('danger', `Executing action: ${s.actionType}`)
    mainWindow?.webContents.send('monitor:status', 'executing')
    
    thresholdChecker?.stop()
    networkMonitor?.stop()
    trayManager?.updateStatus('idle')

    // Delay slightly to allow UI to update
    setTimeout(() => {
      PowerActions.execute(s.actionType)
    }, 2000)
  })

  thresholdChecker.on('countdown-cancelled', () => {
    store.addLog('info', 'Countdown cancelled by user')
    mainWindow?.webContents.send('monitor:status', 'monitoring')
    mainWindow?.webContents.send('countdown:cancel')
  })

  networkMonitor.start()
}

// App lifecycle
app.whenReady().then(() => {
  nativeTheme.themeSource = 'dark'
  
  createWindow()
  setupIPC()
  setupMonitoring()

  const store = SettingsStore.getInstance()
  const settings = store.getSettings()
  if (settings.autoStart) {
    app.setLoginItemSettings({
      openAtLogin: true,
      openAsHidden: true
    })
  }

  trayManager = new TrayManager(mainWindow!)
  trayManager.on('toggle-monitor', () => {
    if (thresholdChecker?.isRunning) {
      thresholdChecker.stop()
      trayManager?.updateStatus('idle')
      mainWindow?.webContents.send('monitor:status', 'idle')
    } else {
      thresholdChecker?.start()
      trayManager?.updateStatus('monitoring')
      mainWindow?.webContents.send('monitor:status', 'monitoring')
    }
  })

  trayManager.on('show-window', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })

  trayManager.on('quit', () => {
    (app as any).isQuitting = true
    networkMonitor?.stop()
    app.quit()
  })

  store.addLog('info', 'Application started')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    networkMonitor?.stop()
    app.quit()
  }
})

app.on('before-quit', () => {
  (app as any).isQuitting = true
  networkMonitor?.stop()
})
