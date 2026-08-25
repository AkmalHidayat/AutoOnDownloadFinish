import { EventEmitter } from 'events'
import si from 'systeminformation'

export interface NetworkStats {
  downloadMbps: number
  uploadMbps: number
  downloadBytes: number
  uploadBytes: number
  interfaceName: string
  timestamp: number
}

export interface NetworkInterfaceInfo {
  id: string
  name: string
  type: string
  ip4: string
  operstate: string
}

export class NetworkMonitor extends EventEmitter {
  private intervalId: ReturnType<typeof setInterval> | null = null
  private pollIntervalMs: number
  private isFirstCall: boolean = true
  private selectedInterface: string = 'all'

  constructor(pollIntervalMs: number = 1000, selectedInterface: string = 'all') {
    super()
    this.pollIntervalMs = pollIntervalMs
    this.selectedInterface = selectedInterface
  }

  setInterface(interfaceName: string): void {
    this.selectedInterface = interfaceName
  }

  setPollInterval(intervalMs: number): void {
    const validInterval = Math.max(500, intervalMs)
    if (this.pollIntervalMs === validInterval) return
    this.pollIntervalMs = validInterval
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = setInterval(() => {
        this.pollStats()
      }, this.pollIntervalMs)
    }
  }

  static async getAvailableInterfaces(): Promise<NetworkInterfaceInfo[]> {
    try {
      const ifaces = await si.networkInterfaces()
      const list: NetworkInterfaceInfo[] = [
        {
          id: 'all',
          name: 'All Physical Adapters (Auto Filter)',
          type: 'aggregated',
          ip4: '',
          operstate: 'up'
        }
      ]

      if (Array.isArray(ifaces)) {
        for (const iface of ifaces) {
          if (iface.iface === 'lo' || iface.iface.toLowerCase().includes('loopback')) continue
          list.push({
            id: iface.iface,
            name: iface.ifaceName || iface.iface,
            type: iface.type || 'unknown',
            ip4: iface.ip4 || '',
            operstate: iface.operstate || 'unknown'
          })
        }
      }
      return list
    } catch (e) {
      console.error('Failed to get network interfaces:', e)
      return [{ id: 'all', name: 'All Physical Adapters', type: 'aggregated', ip4: '', operstate: 'up' }]
    }
  }

  private isVirtualInterface(name: string): boolean {
    const lower = name.toLowerCase()
    return (
      lower.includes('loopback') ||
      lower === 'lo' ||
      lower.includes('vethernet') ||
      lower.includes('wsl') ||
      lower.includes('hyper-v') ||
      lower.includes('tailscale') ||
      lower.includes('wireguard') ||
      lower.includes('tun') ||
      lower.includes('tap') ||
      lower.includes('vmware') ||
      lower.includes('virtualbox') ||
      lower.includes('docker') ||
      lower.includes('bluetooth') ||
      lower.includes('teredo') ||
      lower.includes('isatap')
    )
  }

  start(): void {
    if (this.intervalId) return

    this.isFirstCall = true

    // Initial call to establish baseline
    this.pollStats()

    this.intervalId = setInterval(() => {
      this.pollStats()
    }, this.pollIntervalMs)
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  private async pollStats(): Promise<void> {
    try {
      const netStats = await si.networkStats()
      
      if (this.isFirstCall) {
        this.isFirstCall = false
        return // First call returns null values, skip it
      }

      let totalRxSec = 0
      let totalTxSec = 0
      let totalRxBytes = 0
      let totalTxBytes = 0
      let primaryInterface = this.selectedInterface === 'all' ? 'All Adapters' : this.selectedInterface
      let highestRx = -1

      for (const iface of netStats) {
        // Skip loopback and down interfaces
        if (iface.iface === 'lo' || iface.iface === 'Loopback Pseudo-Interface 1') continue
        if (iface.operstate !== 'up' && iface.operstate !== 'unknown') continue

        // If a specific interface is chosen
        if (this.selectedInterface !== 'all') {
          if (iface.iface === this.selectedInterface || (iface as any).ifaceName === this.selectedInterface) {
            totalRxSec = iface.rx_sec ?? 0
            totalTxSec = iface.tx_sec ?? 0
            totalRxBytes = iface.rx_bytes ?? 0
            totalTxBytes = iface.tx_bytes ?? 0
            primaryInterface = iface.iface
            break
          }
          continue
        }

        // If 'all', skip virtual/VPN adapters to prevent double-counting traffic
        if (this.isVirtualInterface(iface.iface)) {
          continue
        }

        const rx = iface.rx_sec ?? 0
        totalRxSec += rx
        totalTxSec += iface.tx_sec ?? 0
        totalRxBytes += iface.rx_bytes ?? 0
        totalTxBytes += iface.tx_bytes ?? 0

        // Identify the adapter with the most active download traffic
        if (rx > highestRx && rx > 0) {
          highestRx = rx
          primaryInterface = iface.iface
        }
      }

      // Fallback: If 'all' was selected and all physical had 0 rx or were filtered, check if any interface had traffic
      if (this.selectedInterface === 'all' && totalRxSec === 0 && totalTxSec === 0) {
        for (const iface of netStats) {
          if (iface.iface === 'lo' || iface.iface === 'Loopback Pseudo-Interface 1') continue
          const rx = iface.rx_sec ?? 0
          const tx = iface.tx_sec ?? 0
          if (rx > 0 || tx > 0) {
            totalRxSec += rx
            totalTxSec += tx
            totalRxBytes += iface.rx_bytes ?? 0
            totalTxBytes += iface.tx_bytes ?? 0
            if (rx > highestRx) {
              highestRx = rx
              primaryInterface = iface.iface
            }
          }
        }
      }

      const stats: NetworkStats = {
        downloadMbps: (totalRxSec * 8) / (1024 * 1024), // Convert bytes/sec to Mbps
        uploadMbps: (totalTxSec * 8) / (1024 * 1024),
        downloadBytes: totalRxBytes,
        uploadBytes: totalTxBytes,
        interfaceName: primaryInterface,
        timestamp: Date.now()
      }

      this.emit('stats', stats)
    } catch (error) {
      console.error('Network monitoring error:', error)
    }
  }

  get isActive(): boolean {
    return this.intervalId !== null
  }
}
