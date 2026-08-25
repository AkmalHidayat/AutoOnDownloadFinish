import { contextBridge, ipcRenderer } from 'electron'

export interface ElectronAPI {
  // Settings
  getSettings: () => Promise<any>
  setSettings: (settings: any) => Promise<any>

  // Network Interfaces
  getInterfaces: () => Promise<any[]>

  // Monitor
  startMonitor: () => Promise<boolean>
  stopMonitor: () => Promise<boolean>
  cancelAction: () => Promise<boolean>

  // Window
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>

  // Logs
  getLogs: () => Promise<any[]>
  clearLogs: () => Promise<any[]>

  // Events (renderer listens)
  onNetworkStats: (callback: (stats: any) => void) => () => void
  onMonitorStatus: (callback: (status: string) => void) => () => void
  onCountdownStart: (callback: (duration: number) => void) => () => void
  onCountdownTick: (callback: (remaining: number) => void) => () => void
  onCountdownCancel: (callback: () => void) => () => void
}

const api: ElectronAPI = {
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSettings: (settings) => ipcRenderer.invoke('settings:set', settings),

  getInterfaces: () => ipcRenderer.invoke('network:interfaces'),

  startMonitor: () => ipcRenderer.invoke('monitor:start'),
  stopMonitor: () => ipcRenderer.invoke('monitor:stop'),
  cancelAction: () => ipcRenderer.invoke('action:cancel'),

  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),

  getLogs: () => ipcRenderer.invoke('log:get'),
  clearLogs: () => ipcRenderer.invoke('log:clear'),

  onNetworkStats: (callback) => {
    const handler = (_event: any, stats: any) => callback(stats)
    ipcRenderer.on('network:stats', handler)
    return () => ipcRenderer.removeListener('network:stats', handler)
  },

  onMonitorStatus: (callback) => {
    const handler = (_event: any, status: string) => callback(status)
    ipcRenderer.on('monitor:status', handler)
    return () => ipcRenderer.removeListener('monitor:status', handler)
  },

  onCountdownStart: (callback) => {
    const handler = (_event: any, duration: number) => callback(duration)
    ipcRenderer.on('countdown:start', handler)
    return () => ipcRenderer.removeListener('countdown:start', handler)
  },

  onCountdownTick: (callback) => {
    const handler = (_event: any, remaining: number) => callback(remaining)
    ipcRenderer.on('countdown:tick', handler)
    return () => ipcRenderer.removeListener('countdown:tick', handler)
  },

  onCountdownCancel: (callback) => {
    const handler = () => callback()
    ipcRenderer.on('countdown:cancel', handler)
    return () => ipcRenderer.removeListener('countdown:cancel', handler)
  }
}

contextBridge.exposeInMainWorld('electronAPI', api)
