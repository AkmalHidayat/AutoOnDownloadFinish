import { exec } from 'child_process'

export type ActionType = 'shutdown' | 'restart' | 'sleep' | 'hibernate'

export class PowerActions {
  private static readonly commands: Record<ActionType, string> = {
    shutdown: 'shutdown /s /t 0 /f',
    restart: 'shutdown /r /t 0 /f',
    hibernate: 'shutdown /h',
    sleep: 'powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Application]::SetSuspendState([System.Windows.Forms.PowerState]::Suspend, $false, $false)"'
  }

  static execute(action: ActionType): void {
    const command = this.commands[action]
    if (!command) {
      console.error(`Unknown action: ${action}`)
      return
    }

    console.log(`Executing power action: ${action} -> ${command}`)

    exec(command, (error) => {
      if (error) {
        console.error(`Power action failed: ${error.message}`)
      }
    })
  }

  static getAvailableActions(): { value: ActionType; label: string }[] {
    return [
      { value: 'shutdown', label: 'Shutdown' },
      { value: 'restart', label: 'Restart' },
      { value: 'sleep', label: 'Sleep' },
      { value: 'hibernate', label: 'Hibernate' }
    ]
  }
}
