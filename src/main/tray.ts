import { Tray, Menu, nativeImage, BrowserWindow, app } from 'electron'
import { EventEmitter } from 'events'
import { join } from 'path'

type TrayStatus = 'idle' | 'monitoring' | 'countdown'

export class TrayManager extends EventEmitter {
  private tray: Tray | null = null
  private mainWindow: BrowserWindow
  private currentStatus: TrayStatus = 'idle'

  constructor(mainWindow: BrowserWindow) {
    super()
    this.mainWindow = mainWindow
    this.createTray()
  }

  private createTray(): void {
    // Create a simple 16x16 tray icon programmatically
    const icon = nativeImage.createEmpty()
    
    // We'll use a small canvas to draw the icon
    const size = 16
    const canvas = Buffer.alloc(size * size * 4)
    
    // Draw a simple circle icon (RGBA)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - size / 2
        const dy = y - size / 2
        const dist = Math.sqrt(dx * dx + dy * dy)
        const idx = (y * size + x) * 4
        
        if (dist < 6) {
          // Inner circle - accent color
          canvas[idx] = 99     // R
          canvas[idx + 1] = 102 // G
          canvas[idx + 2] = 241 // B
          canvas[idx + 3] = 255 // A
        } else if (dist < 7) {
          // Border
          canvas[idx] = 139    // R
          canvas[idx + 1] = 92  // G
          canvas[idx + 2] = 246 // B
          canvas[idx + 3] = 200 // A
        } else {
          // Transparent
          canvas[idx] = 0
          canvas[idx + 1] = 0
          canvas[idx + 2] = 0
          canvas[idx + 3] = 0
        }
      }
    }

    const trayIcon = nativeImage.createFromBuffer(canvas, { width: size, height: size })
    
    this.tray = new Tray(trayIcon)
    this.tray.setToolTip('AutoOnDownloadFinish - Idle')
    this.updateContextMenu()

    this.tray.on('double-click', () => {
      this.emit('show-window')
    })
  }

  updateStatus(status: TrayStatus): void {
    this.currentStatus = status
    const statusLabels: Record<TrayStatus, string> = {
      idle: 'Idle',
      monitoring: 'Monitoring...',
      countdown: 'Countdown Active!'
    }
    this.tray?.setToolTip(`AutoOnDownloadFinish - ${statusLabels[status]}`)
    this.updateContextMenu()
  }

  private updateContextMenu(): void {
    const isMonitoring = this.currentStatus === 'monitoring' || this.currentStatus === 'countdown'
    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Window',
        click: () => this.emit('show-window')
      },
      { type: 'separator' },
      {
        label: isMonitoring ? 'Stop Monitoring' : 'Start Monitoring',
        click: () => this.emit('toggle-monitor')
      },
      { type: 'separator' },
      {
        label: `Status: ${this.currentStatus.charAt(0).toUpperCase() + this.currentStatus.slice(1)}`,
        enabled: false
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => this.emit('quit')
      }
    ])

    this.tray?.setContextMenu(contextMenu)
  }

  destroy(): void {
    this.tray?.destroy()
    this.tray = null
  }
}
