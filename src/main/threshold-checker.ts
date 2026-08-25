import { EventEmitter } from 'events'

export type MonitorStatus = 'idle' | 'monitoring' | 'countdown' | 'executing'

export class ThresholdChecker extends EventEmitter {
  private thresholdMbps: number
  private confirmDurationSec: number
  private belowThresholdCount: number = 0
  private hasSeenHighSpeed: boolean = false
  private _isRunning: boolean = false
  private countdownTimer: ReturnType<typeof setInterval> | null = null
  private countdownRemaining: number = 0
  private _status: MonitorStatus = 'idle'
  private gracePeriodRemaining: number = 0

  constructor(thresholdMbps: number = 5, confirmDurationSec: number = 10) {
    super()
    this.thresholdMbps = thresholdMbps
    this.confirmDurationSec = confirmDurationSec
  }

  start(gracePeriodSec: number = 0): void {
    this._isRunning = true
    this._status = 'monitoring'
    this.belowThresholdCount = 0
    this.hasSeenHighSpeed = false
    this.gracePeriodRemaining = gracePeriodSec
  }

  stop(): void {
    this._isRunning = false
    this._status = 'idle'
    this.belowThresholdCount = 0
    this.hasSeenHighSpeed = false
    this.gracePeriodRemaining = 0
    this.cancelCountdown()
  }

  updateConfig(thresholdMbps: number, confirmDurationSec: number): void {
    this.thresholdMbps = thresholdMbps
    this.confirmDurationSec = confirmDurationSec
  }

  feed(currentSpeedMbps: number): void {
    if (!this._isRunning) return
    if (this._status === 'countdown' || this._status === 'executing') return

    if (this.gracePeriodRemaining > 0) {
      this.gracePeriodRemaining--
      if (currentSpeedMbps >= this.thresholdMbps) {
        this.hasSeenHighSpeed = true
        this.gracePeriodRemaining = 0
      }
      return
    }

    // First, we need to detect that a download is actually happening
    if (currentSpeedMbps >= this.thresholdMbps) {
      this.hasSeenHighSpeed = true
      this.belowThresholdCount = 0
    } else if (this.hasSeenHighSpeed) {
      // Speed dropped below threshold after being above
      this.belowThresholdCount++

      if (this.belowThresholdCount >= this.confirmDurationSec) {
        // Download appears complete
        this._status = 'countdown'
        this.emit('threshold-reached')
      }
    }
  }

  startCountdown(durationSec: number): void {
    this.cancelCountdown()
    this.countdownRemaining = durationSec
    this._status = 'countdown'

    this.countdownTimer = setInterval(() => {
      this.countdownRemaining--
      this.emit('countdown-tick', this.countdownRemaining)

      if (this.countdownRemaining <= 0) {
        this.cancelCountdown()
        this._status = 'executing'
        this.emit('countdown-complete')
      }
    }, 1000)
  }

  cancelCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
      this.countdownTimer = null
    }
    if (this._status === 'countdown') {
      this._status = 'monitoring'
      this.belowThresholdCount = 0
      this.hasSeenHighSpeed = false
      this.emit('countdown-cancelled')
    }
  }

  get isRunning(): boolean {
    return this._isRunning
  }

  get status(): MonitorStatus {
    return this._status
  }
}
