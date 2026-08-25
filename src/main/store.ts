import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { ActionType } from './power-actions'

export type Language = 'id' | 'en' | 'ja' | 'zh' | 'es' | 'ru' | 'de'

export interface AppSettings {
  thresholdMbps: number
  confirmDurationSec: number
  countdownSec: number
  actionType: ActionType
  selectedInterface: string
  audioAlert: boolean
  autoStart: boolean
  notifications: boolean
  speedUnit: 'MB/s' | 'Mbps'
  language: Language
  initialGracePeriodSec: number
  theme: 'system' | 'dark' | 'light'
  pollIntervalMs: number
}

export interface LogEntry {
  timestamp: number
  level: 'info' | 'warning' | 'danger' | 'success'
  message: string
}

interface StoreData {
  settings: AppSettings
  logs: LogEntry[]
}

const defaults: StoreData = {
  settings: {
    thresholdMbps: 5,
    confirmDurationSec: 10,
    countdownSec: 30,
    actionType: 'shutdown',
    selectedInterface: 'all',
    audioAlert: true,
    autoStart: false,
    notifications: true,
    speedUnit: 'MB/s',
    language: 'en',
    initialGracePeriodSec: 0,
    theme: 'system',
    pollIntervalMs: 1000
  },
  logs: []
}

export class SettingsStore {
  private static instance: SettingsStore
  private data: StoreData
  private filePath: string

  private constructor() {
    const userDataPath = app.getPath('userData')
    if (!existsSync(userDataPath)) {
      mkdirSync(userDataPath, { recursive: true })
    }
    this.filePath = join(userDataPath, 'settings.json')
    this.data = this.load()
  }

  static getInstance(): SettingsStore {
    if (!SettingsStore.instance) {
      SettingsStore.instance = new SettingsStore()
    }
    return SettingsStore.instance
  }

  private load(): StoreData {
    try {
      if (existsSync(this.filePath)) {
        const raw = readFileSync(this.filePath, 'utf-8')
        const parsed = JSON.parse(raw)
        return { ...defaults, ...parsed, settings: { ...defaults.settings, ...parsed.settings } }
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return { ...defaults }
  }

  private save(): void {
    try {
      writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8')
    } catch (e) {
      console.error('Failed to save settings:', e)
    }
  }

  getSettings(): AppSettings {
    return { ...this.data.settings }
  }

  updateSettings(partial: Partial<AppSettings>): void {
    this.data.settings = { ...this.data.settings, ...partial }
    this.save()
  }

  getLogs(): LogEntry[] {
    return [...this.data.logs]
  }

  addLog(level: LogEntry['level'], message: string): void {
    this.data.logs.unshift({
      timestamp: Date.now(),
      level,
      message
    })
    if (this.data.logs.length > 100) {
      this.data.logs.length = 100
    }
    this.save()
  }

  clearLogs(): void {
    this.data.logs = []
    this.save()
  }
}
