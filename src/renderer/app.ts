export {}

// Type declarations
declare global {
  interface Window {
    electronAPI: {
      getSettings: () => Promise<any>
      setSettings: (settings: any) => Promise<any>
      getInterfaces: () => Promise<any[]>
      startMonitor: () => Promise<boolean>
      stopMonitor: () => Promise<boolean>
      cancelAction: () => Promise<boolean>
      minimizeWindow: () => Promise<void>
      maximizeWindow: () => Promise<void>
      closeWindow: () => Promise<void>
      getLogs: () => Promise<any[]>
      clearLogs: () => Promise<any[]>
      onNetworkStats: (cb: (stats: any) => void) => () => void
      onMonitorStatus: (cb: (status: string) => void) => () => void
      onCountdownStart: (cb: (duration: number) => void) => () => void
      onCountdownTick: (cb: (remaining: number) => void) => () => void
      onCountdownCancel: (cb: () => void) => () => void
    }
  }
}

const api = window.electronAPI

// ===== i18n Localization Dictionaries =====
type Language = 'id' | 'en' | 'ja' | 'zh' | 'es' | 'ru' | 'de'
type SpeedUnit = 'MB/s' | 'Mbps'
type Theme = 'system' | 'dark' | 'light'

const i18n: Record<Language, Record<string, string>> = {
  id: {
    nav_dashboard: 'Dashboard',
    nav_settings: 'Pengaturan',
    nav_activity: 'Aktivitas',
    status_title: 'Status Monitor',
    status_idle: 'Standby',
    status_monitoring: 'Memantau',
    status_countdown: 'Countdown!',
    status_executing: 'Mengeksekusi...',
    card_download_label: 'KECEPATAN DOWNLOAD',
    card_upload_label: 'KECEPATAN UPLOAD',
    card_session_label: 'TOTAL DATA SESI',
    session_duration: 'Durasi',
    card_action_label: 'AKSI SELESAI',
    chart_title: 'Aktivitas Jaringan Realtime (60 Detik)',
    chart_ago_60: '60s lalu',
    chart_ago_30: '30s lalu',
    chart_now: 'Sekarang',
    cond_threshold: 'Batas Kecepatan',
    cond_confirm: 'Durasi Konfirmasi',
    cond_countdown: 'Waktu Mundur',
    btn_start_monitor: 'Mulai Pantau',
    btn_stop_monitor: 'Hentikan Pantau',
    dock_helper_idle: 'Tekan Mulai Pantau saat download berjalan',
    dock_helper_monitoring: 'Memantau kecepatan download secara realtime...',
    settings_title: 'Pengaturan Aplikasi',
    settings_subtitle: 'Konfigurasi ambang batas kecepatan, tindakan daya, dan preferensi sistem',
    sec_general: 'Preferensi Umum & Tampilan',
    opt_theme: 'Tema Tampilan (Theme)',
    opt_theme_desc: 'Pilih gaya tema visual aplikasi',
    opt_theme_system: 'Ikuti Sistem Windows (System Default)',
    opt_theme_dark: 'Normal Dark (Obsidian Gradient Glow)',
    opt_theme_light: 'White (Light Frosted Gradient)',
    opt_language: 'Bahasa Tampilan (Language)',
    opt_language_desc: 'Pilih bahasa untuk antarmuka pengguna',
    opt_unit: 'Satuan Kecepatan',
    opt_unit_desc: 'Tampilan kecepatan download/upload',
    opt_perf: 'Presisi & Efisiensi Daya (Resource Footprint)',
    opt_perf_desc: 'Atur frekuensi pemindaian jaringan & penghematan CPU/RAM',
    opt_perf_eco: 'Eco Saver (Interval 2.0s - Sangat Ringan CPU/RAM)',
    opt_perf_balanced: 'Seimbang / Balanced (Interval 1.0s - Rekomendasi)',
    opt_perf_high: 'Presisi Tinggi (Interval 0.5s - Kurva Sangat Halus)',
    opt_grace: 'Jeda Waktu Awal (Grace Period)',
    opt_grace_desc: 'Detik sebelum deteksi kecepatan aktif (waktu untuk mulai download)',
    sec_monitoring: 'Kriteria Pemantauan Download',
    opt_adapter: 'Kartu Jaringan (Network Adapter)',
    opt_adapter_desc: 'Pilih kartu jaringan yang ingin dipantau',
    opt_threshold: 'Ambang Batas Kecepatan Selesai',
    opt_threshold_desc: 'Jika kecepatan drop di bawah angka ini = download dianggap selesai',
    opt_confirm: 'Durasi Konfirmasi Selesai',
    opt_confirm_desc: 'Lama waktu kecepatan di bawah batas sebelum memicu countdown',
    opt_countdown: 'Durasi Waktu Mundur (Countdown)',
    opt_countdown_desc: 'Jeda waktu sebelum aksi dieksekusi (kesempatan untuk membatalkan)',
    sec_action: 'Tindakan Daya Otomatis',
    opt_action_select: 'Pilih aksi saat download selesai',
    act_shutdown: 'Shutdown',
    act_shutdown_desc: 'Matikan PC total',
    act_restart: 'Restart',
    act_restart_desc: 'Mulai ulang PC',
    act_sleep: 'Sleep',
    act_sleep_desc: 'Mode tidur hemat daya',
    act_hibernate: 'Hibernate',
    act_hibernate_desc: 'Simpan sesi ke disk',
    sec_system: 'Notifikasi & Integrasi Windows',
    opt_sound: 'Suara Alarm Countdown',
    opt_sound_desc: 'Bunyikan nada peringatan saat waktu mundur dimulai',
    opt_notif: 'Notifikasi Desktop Windows',
    opt_notif_desc: 'Tampilkan pop-up notifikasi desktop saat download kelar',
    opt_autostart: 'Jalankan Otomatis saat Windows Boot',
    opt_autostart_desc: 'Buka aplikasi otomatis ke System Tray saat login Windows',
    unit_sec: 'detik',
    log_title: 'Riwayat Aktivitas',
    log_subtitle: 'Catatan peristiwa pemantauan dan pemicu daya',
    btn_clear_log: 'Bersihkan',
    log_empty: 'Belum ada aktivitas tercatat',
    countdown_title: 'Download Selesai!',
    countdown_action_text_prefix: 'Sistem akan dieksekusi (',
    countdown_action_text_suffix: ') dalam',
    btn_cancel_countdown: 'Batalkan Eksekusi'
  },
  en: {
    nav_dashboard: 'Dashboard',
    nav_settings: 'Settings',
    nav_activity: 'Activity',
    status_title: 'Monitor Status',
    status_idle: 'Idle',
    status_monitoring: 'Monitoring',
    status_countdown: 'Countdown!',
    status_executing: 'Executing...',
    card_download_label: 'DOWNLOAD THROUGHPUT',
    card_upload_label: 'UPLOAD SPEED',
    card_session_label: 'SESSION DATA',
    session_duration: 'Duration',
    card_action_label: 'COMPLETION ACTION',
    chart_title: 'Realtime Network Activity (60 Seconds)',
    chart_ago_60: '60s ago',
    chart_ago_30: '30s ago',
    chart_now: 'Now',
    cond_threshold: 'Speed Threshold',
    cond_confirm: 'Confirm Duration',
    cond_countdown: 'Countdown',
    btn_start_monitor: 'Start Monitoring',
    btn_stop_monitor: 'Stop Monitoring',
    dock_helper_idle: 'Click Start Monitoring while download is in progress',
    dock_helper_monitoring: 'Active monitoring network throughput...',
    settings_title: 'Application Settings',
    settings_subtitle: 'Configure speed triggers, power actions, and system preferences',
    sec_general: 'General & Display Preferences',
    opt_theme: 'Interface Theme',
    opt_theme_desc: 'Choose visual interface appearance',
    opt_theme_system: 'Follow Windows System (Default)',
    opt_theme_dark: 'Normal Dark (Obsidian Gradient Glow)',
    opt_theme_light: 'White (Light Frosted Gradient)',
    opt_language: 'Display Language',
    opt_language_desc: 'Choose user interface language',
    opt_unit: 'Speed Unit',
    opt_unit_desc: 'Download/upload speed measurement display unit',
    opt_perf: 'Precision & Power Efficiency (Resource Footprint)',
    opt_perf_desc: 'Configure network polling interval & background CPU/RAM savings',
    opt_perf_eco: 'Eco Saver (2.0s Interval - Ultra Low CPU/RAM)',
    opt_perf_balanced: 'Balanced (1.0s Interval - Recommended)',
    opt_perf_high: 'High Precision (0.5s Interval - Smooth Curves)',
    opt_grace: 'Initial Grace Period',
    opt_grace_desc: 'Seconds before detection begins (time to start download)',
    sec_monitoring: 'Download Monitoring Criteria',
    opt_adapter: 'Network Adapter',
    opt_adapter_desc: 'Select which network interface to monitor',
    opt_threshold: 'Download Completion Threshold',
    opt_threshold_desc: 'Speed below this threshold marks download as finished',
    opt_confirm: 'Confirmation Duration',
    opt_confirm_desc: 'Seconds below threshold before triggering countdown',
    opt_countdown: 'Countdown Duration',
    opt_countdown_desc: 'Time before action executes (chance to cancel)',
    sec_action: 'Automatic Power Action',
    opt_action_select: 'Select power action when download finishes',
    act_shutdown: 'Shutdown',
    act_shutdown_desc: 'Power off PC completely',
    act_restart: 'Restart',
    act_restart_desc: 'Reboot system',
    act_sleep: 'Sleep',
    act_sleep_desc: 'Low power sleep mode',
    act_hibernate: 'Hibernate',
    act_hibernate_desc: 'Save session to disk',
    sec_system: 'Notifications & Windows Integration',
    opt_sound: 'Countdown Alert Chime',
    opt_sound_desc: 'Play chime audio when countdown timer begins',
    opt_notif: 'Windows Desktop Notifications',
    opt_notif_desc: 'Show native desktop toast when download completes',
    opt_autostart: 'Start with Windows',
    opt_autostart_desc: 'Launch minimized to system tray on Windows login',
    unit_sec: 'sec',
    log_title: 'Activity Log',
    log_subtitle: 'History of network monitor events and power actions',
    btn_clear_log: 'Clear',
    log_empty: 'No activity recorded yet',
    countdown_title: 'Download Complete!',
    countdown_action_text_prefix: 'System will ',
    countdown_action_text_suffix: ' in',
    btn_cancel_countdown: 'Cancel Action'
  },
  ja: {
    nav_dashboard: 'ダッシュボード',
    nav_settings: '設定',
    nav_activity: 'アクティビティ',
    status_title: '監視ステータス',
    status_idle: '待機中',
    status_monitoring: '監視中',
    status_countdown: 'カウントダウン!',
    status_executing: '実行中...',
    card_download_label: 'ダウンロード速度',
    card_upload_label: 'アップロード速度',
    card_session_label: 'セッション総転送量',
    session_duration: '経過時間',
    card_action_label: '完了時の動作',
    chart_title: 'リアルタイムネットワーク通信 (60秒)',
    chart_ago_60: '60秒前',
    chart_ago_30: '30秒前',
    chart_now: '現在',
    cond_threshold: 'しきい値速度',
    cond_confirm: '判定継続時間',
    cond_countdown: '猶予カウントダウン',
    btn_start_monitor: '監視を開始',
    btn_stop_monitor: '監視を停止',
    dock_helper_idle: 'ダウンロード開始後に「監視を開始」を押してください',
    dock_helper_monitoring: 'ネットワーク速度をリアルタイムで監視しています...',
    settings_title: 'アプリケーション設定',
    settings_subtitle: '速度しきい値、電源アクション、システム設定をカスタマイズ',
    sec_general: '一般 & 表示設定',
    opt_theme: 'テーマ (Theme)',
    opt_theme_desc: 'アプリの外観スタイルを選択',
    opt_theme_system: 'Windowsシステム設定に従う (Default)',
    opt_theme_dark: 'ダーク (Obsidian Gradient Glow)',
    opt_theme_light: 'ライト (Light Frosted Gradient)',
    opt_language: '表示言語 (Language)',
    opt_language_desc: 'UIの言語を選択',
    opt_unit: '速度単位',
    opt_unit_desc: '速度の表示単位 (MB/s または Mbps)',
    opt_perf: '精度と省電力 (Resource Footprint)',
    opt_perf_desc: 'ポーリング頻度とCPU/RAM消費量の調整',
    opt_perf_eco: 'エコセーバー (2.0秒間隔 - 超軽量)',
    opt_perf_balanced: 'バランス (1.0秒間隔 - 推奨)',
    opt_perf_high: '高精度 (0.5秒間隔 - 高解像度)',
    opt_grace: '開始時ウェイト (Grace Period)',
    opt_grace_desc: '監視開始から判定までの準備秒数',
    sec_monitoring: 'ダウンロード完了判定',
    opt_adapter: 'ネットワークアダプター',
    opt_adapter_desc: '監視対象のネットワークアダプターを選択',
    opt_threshold: '完了判定しきい値速度',
    opt_threshold_desc: '速度がこの値を下回ると完了とみなします',
    opt_confirm: '完了判定の維持時間',
    opt_confirm_desc: 'しきい値未満が続いた場合にカウントダウンへ移行',
    opt_countdown: 'カウントダウン秒数',
    opt_countdown_desc: '実行前のキャンセル猶予時間',
    sec_action: '完了時の自動電源アクション',
    opt_action_select: '完了時に実行する動作を選択',
    act_shutdown: 'シャットダウン',
    act_shutdown_desc: 'PCの電源を完全に切る',
    act_restart: '再起動',
    act_restart_desc: 'PCを再起動する',
    act_sleep: 'スリープ',
    act_sleep_desc: '省電力スリープモード',
    act_hibernate: '休止状態',
    act_hibernate_desc: 'セッションをディスクに保存',
    sec_system: '通知 & Windows統合',
    opt_sound: 'カウントダウン音',
    opt_sound_desc: 'カウントダウン開始時にアラーム音を再生',
    opt_notif: 'デスクトップ通知',
    opt_notif_desc: '完了時にWindowsトースト通知を表示',
    opt_autostart: 'Windows起動時に自動実行',
    opt_autostart_desc: 'PC起動時にタスクトレイに最小化して起動',
    unit_sec: '秒',
    log_title: 'アクティビティログ',
    log_subtitle: '監視イベントと電源アクションの履歴',
    btn_clear_log: '消去',
    log_empty: 'ログはまだありません',
    countdown_title: 'ダウンロードが完了しました!',
    countdown_action_text_prefix: 'まもなくシステムが (',
    countdown_action_text_suffix: ') されます：',
    btn_cancel_countdown: '実行をキャンセル'
  },
  zh: {
    nav_dashboard: '仪表盘',
    nav_settings: '设置',
    nav_activity: '活动日志',
    status_title: '监控状态',
    status_idle: '待机',
    status_monitoring: '监控中',
    status_countdown: '倒计时!',
    status_executing: '正在执行...',
    card_download_label: '下载速率',
    card_upload_label: '上传速率',
    card_session_label: '本次会话总流量',
    session_duration: '运行时间',
    card_action_label: '完成操作',
    chart_title: '实时网络流量活动 (60秒)',
    chart_ago_60: '60秒前',
    chart_ago_30: '30秒前',
    chart_now: '当前',
    cond_threshold: '速度阈值',
    cond_confirm: '确认持续时间',
    cond_countdown: '倒计时时长',
    btn_start_monitor: '开始监控',
    btn_stop_monitor: '停止监控',
    dock_helper_idle: '开始下载后请点击“开始监控”',
    dock_helper_monitoring: '正在实时监控网络下载速率...',
    settings_title: '应用设置',
    settings_subtitle: '配置速度阈值、电源操作及系统首选项',
    sec_general: '常规与外观首选项',
    opt_theme: '界面主题 (Theme)',
    opt_theme_desc: '选择应用程序视觉主题风格',
    opt_theme_system: '跟随Windows系统 (默认)',
    opt_theme_dark: '深色模式 (Obsidian Gradient Glow)',
    opt_theme_light: '浅色模式 (Light Frosted Gradient)',
    opt_language: '显示语言 (Language)',
    opt_language_desc: '选择用户界面语言',
    opt_unit: '速度单位',
    opt_unit_desc: '下载与上传速度的显示单位',
    opt_perf: '精度与节能模式 (Resource Footprint)',
    opt_perf_desc: '调整网络检测频率以降低CPU和内存占用',
    opt_perf_eco: '节能模式 (2.0秒间隔 - 极低CPU/内存)',
    opt_perf_balanced: '平衡模式 (1.0秒间隔 - 推荐)',
    opt_perf_high: '高精度模式 (0.5秒间隔 - 曲线极流畅)',
    opt_grace: '初始等待缓冲 (Grace Period)',
    opt_grace_desc: '开始检测前的准备时间(秒)',
    sec_monitoring: '下载完成判断准则',
    opt_adapter: '网卡接口 (Network Adapter)',
    opt_adapter_desc: '选择要监控的网络适配器',
    opt_threshold: '完成判定速度阈值',
    opt_threshold_desc: '速度低于该值时视为下载已完成',
    opt_confirm: '低速确认时长',
    opt_confirm_desc: '速度持续低于阈值多久后触发倒计时',
    opt_countdown: '执行倒计时时长',
    opt_countdown_desc: '操作执行前的取消缓冲时间',
    sec_action: '自动电源动作',
    opt_action_select: '下载完成后执行的动作',
    act_shutdown: '关机',
    act_shutdown_desc: '完全关闭计算机',
    act_restart: '重启',
    act_restart_desc: '重新启动系统',
    act_sleep: '睡眠',
    act_sleep_desc: '低功耗睡眠模式',
    act_hibernate: '休眠',
    act_hibernate_desc: '将当前会话保存至硬盘',
    sec_system: '通知与Windows集成',
    opt_sound: '倒计时提示音',
    opt_sound_desc: '倒计时开始时播放警报音',
    opt_notif: 'Windows桌面通知',
    opt_notif_desc: '下载完成时显示系统通知',
    opt_autostart: '开机自启动',
    opt_autostart_desc: '登录Windows时自动最小化启动至系统托盘',
    unit_sec: '秒',
    log_title: '活动日志',
    log_subtitle: '网络监控与电源操作历史记录',
    btn_clear_log: '清空日志',
    log_empty: '暂无活动记录',
    countdown_title: '下载已完成!',
    countdown_action_text_prefix: '系统即将执行 (',
    countdown_action_text_suffix: ')，剩余：',
    btn_cancel_countdown: '取消操作'
  },
  es: {
    nav_dashboard: 'Panel',
    nav_settings: 'Ajustes',
    nav_activity: 'Actividad',
    status_title: 'Estado de Monitoreo',
    status_idle: 'En espera',
    status_monitoring: 'Monitoreando',
    status_countdown: '¡Cuenta regresiva!',
    status_executing: 'Ejecutando...',
    card_download_label: 'VELOCIDAD DE DESCARGA',
    card_upload_label: 'VELOCIDAD DE SUBIDA',
    card_session_label: 'DATOS DE LA SESIÓN',
    session_duration: 'Duración',
    card_action_label: 'ACCIÓN AL COMPLETAR',
    chart_title: 'Actividad de Red en Tiempo Real (60 Segundos)',
    chart_ago_60: 'hace 60s',
    chart_ago_30: 'hace 30s',
    chart_now: 'Ahora',
    cond_threshold: 'Umbral de Velocidad',
    cond_confirm: 'Duración de Confirmación',
    cond_countdown: 'Cuenta Regresiva',
    btn_start_monitor: 'Iniciar Monitoreo',
    btn_stop_monitor: 'Detener Monitoreo',
    dock_helper_idle: 'Haz clic en Iniciar cuando la descarga esté en curso',
    dock_helper_monitoring: 'Monitoreando el tráfico de red en tiempo real...',
    settings_title: 'Ajustes de la Aplicación',
    settings_subtitle: 'Configura disparadores de velocidad, acciones de energía y preferencias',
    sec_general: 'Preferencias Generales y Visuales',
    opt_theme: 'Tema Visual',
    opt_theme_desc: 'Elige la apariencia visual de la aplicación',
    opt_theme_system: 'Seguir el Sistema Windows (Predeterminado)',
    opt_theme_dark: 'Oscuro (Obsidian Gradient Glow)',
    opt_theme_light: 'Claro (Light Frosted Gradient)',
    opt_language: 'Idioma (Language)',
    opt_language_desc: 'Selecciona el idioma de la interfaz',
    opt_unit: 'Unidad de Velocidad',
    opt_unit_desc: 'Unidad para medir la velocidad',
    opt_perf: 'Precisión y Eficiencia (Resource Footprint)',
    opt_perf_desc: 'Ajusta el intervalo de sondeo para ahorrar CPU/RAM',
    opt_perf_eco: 'Modo Eco (Intervalo 2.0s - Muy bajo CPU/RAM)',
    opt_perf_balanced: 'Equilibrado (Intervalo 1.0s - Recomendado)',
    opt_perf_high: 'Alta Precisión (Intervalo 0.5s - Gráfico ultra fluido)',
    opt_grace: 'Tiempo de Gracia Inicial',
    opt_grace_desc: 'Segundos antes de iniciar la detección de velocidad',
    sec_monitoring: 'Criterios de Monitoreo de Descarga',
    opt_adapter: 'Adaptador de Red',
    opt_adapter_desc: 'Selecciona la interfaz de red a monitorear',
    opt_threshold: 'Umbral de Finalización de Descarga',
    opt_threshold_desc: 'Velocidad por debajo de la cual se considera finalizada',
    opt_confirm: 'Duración de Confirmación',
    opt_confirm_desc: 'Segundos por debajo del umbral antes de la cuenta regresiva',
    opt_countdown: 'Duración de Cuenta Regresiva',
    opt_countdown_desc: 'Tiempo antes de ejecutar la acción (oportunidad de cancelar)',
    sec_action: 'Acción Automática de Energía',
    opt_action_select: 'Acción cuando finalice la descarga',
    act_shutdown: 'Apagar',
    act_shutdown_desc: 'Apagar el equipo completamente',
    act_restart: 'Reiniciar',
    act_restart_desc: 'Reiniciar el sistema',
    act_sleep: 'Suspender',
    act_sleep_desc: 'Modo de suspensión de bajo consumo',
    act_hibernate: 'Hibernar',
    act_hibernate_desc: 'Guardar sesión en el disco',
    sec_system: 'Notificaciones e Integración con Windows',
    opt_sound: 'Alarma Sonora de Cuenta Regresiva',
    opt_sound_desc: 'Reproducir sonido cuando comience la cuenta regresiva',
    opt_notif: 'Notificaciones de Escritorio',
    opt_notif_desc: 'Mostrar notificación cuando finalice la descarga',
    opt_autostart: 'Iniciar con Windows',
    opt_autostart_desc: 'Iniciar minimizado en la bandeja del sistema al arrancar',
    unit_sec: 'seg',
    log_title: 'Registro de Actividad',
    log_subtitle: 'Historial de eventos de red y acciones de energía',
    btn_clear_log: 'Limpiar',
    log_empty: 'Sin actividad registrada aún',
    countdown_title: '¡Descarga Completa!',
    countdown_action_text_prefix: 'El sistema se ejecutará (',
    countdown_action_text_suffix: ') en',
    btn_cancel_countdown: 'Cancelar Acción'
  },
  ru: {
    nav_dashboard: 'Панель',
    nav_settings: 'Настройки',
    nav_activity: 'Журнал',
    status_title: 'Статус мониторинга',
    status_idle: 'Ожидание',
    status_monitoring: 'Мониторинг',
    status_countdown: 'Отсчет!',
    status_executing: 'Выполнение...',
    card_download_label: 'СКОРОСТЬ СКАЧИВАНИЯ',
    card_upload_label: 'СКОРОСТЬ ОТДАЧИ',
    card_session_label: 'ТРАФИК СЕССИИ',
    session_duration: 'Время',
    card_action_label: 'ДЕЙСТВИЕ',
    chart_title: 'Сетевая активность в реальном времени (60 сек)',
    chart_ago_60: '60с назад',
    chart_ago_30: '30с назад',
    chart_now: 'Сейчас',
    cond_threshold: 'Порог скорости',
    cond_confirm: 'Время подтверждения',
    cond_countdown: 'Таймер отсчета',
    btn_start_monitor: 'Начать мониторинг',
    btn_stop_monitor: 'Остановить',
    dock_helper_idle: 'Нажмите Начать мониторинг во время скачивания',
    dock_helper_monitoring: 'Мониторинг скорости сети в реальном времени...',
    settings_title: 'Настройки приложения',
    settings_subtitle: 'Параметры скорости, действий питания и системы',
    sec_general: 'Общие настройки и оформление',
    opt_theme: 'Тема оформления',
    opt_theme_desc: 'Выберите внешний вид интерфейса',
    opt_theme_system: 'Как в Windows (По умолчанию)',
    opt_theme_dark: 'Темная (Obsidian Gradient Glow)',
    opt_theme_light: 'Светлая (Light Frosted Gradient)',
    opt_language: 'Язык интерфейса',
    opt_language_desc: 'Выберите язык',
    opt_unit: 'Единица скорости',
    opt_unit_desc: 'Единицы измерения скорости',
    opt_perf: 'Точность и энергосбережение',
    opt_perf_desc: 'Частота опроса сети и экономия CPU/RAM',
    opt_perf_eco: 'Эко-режим (2.0с - Минимум CPU/RAM)',
    opt_perf_balanced: 'Баланс (1.0с - Рекомендуется)',
    opt_perf_high: 'Высокая точность (0.5с - Плавный график)',
    opt_grace: 'Начальная задержка',
    opt_grace_desc: 'Секунды до включения проверки скорости',
    sec_monitoring: 'Критерии завершения скачивания',
    opt_adapter: 'Сетевой адаптер',
    opt_adapter_desc: 'Выберите интерфейс для мониторинга',
    opt_threshold: 'Порог завершения',
    opt_threshold_desc: 'Скорость ниже порога считается окончанием загрузки',
    opt_confirm: 'Время подтверждения',
    opt_confirm_desc: 'Секунды ниже порога до запуска таймера',
    opt_countdown: 'Длительность отсчета',
    opt_countdown_desc: 'Время на отмену действия',
    sec_action: 'Действие питания',
    opt_action_select: 'Действие по завершении скачивания',
    act_shutdown: 'Выключение',
    act_shutdown_desc: 'Полное выключение ПК',
    act_restart: 'Перезагрузка',
    act_restart_desc: 'Перезагрузка системы',
    act_sleep: 'Спящий режим',
    act_sleep_desc: 'Энергосберегающий сон',
    act_hibernate: 'Гибернация',
    act_hibernate_desc: 'Сохранение сеанса на диск',
    sec_system: 'Уведомления и интеграция',
    opt_sound: 'Звуковой сигнал',
    opt_sound_desc: 'Звуковое оповещение при старте отсчета',
    opt_notif: 'Уведомления Windows',
    opt_notif_desc: 'Всплывающие уведомления при завершении',
    opt_autostart: 'Автозапуск',
    opt_autostart_desc: 'Запуск в трей при входе в Windows',
    unit_sec: 'сек',
    log_title: 'Журнал активности',
    log_subtitle: 'История мониторинга и действий питания',
    btn_clear_log: 'Очистить',
    log_empty: 'Событий пока нет',
    countdown_title: 'Скачивание завершено!',
    countdown_action_text_prefix: 'Система выполнит (',
    countdown_action_text_suffix: ') через',
    btn_cancel_countdown: 'Отменить действие'
  },
  de: {
    nav_dashboard: 'Dashboard',
    nav_settings: 'Einstellungen',
    nav_activity: 'Aktivität',
    status_title: 'Überwachungsstatus',
    status_idle: 'Bereit',
    status_monitoring: 'Überwachend',
    status_countdown: 'Countdown!',
    status_executing: 'Wird ausgeführt...',
    card_download_label: 'DOWNLOAD-GESCHWINDIGKEIT',
    card_upload_label: 'UPLOAD-GESCHWINDIGKEIT',
    card_session_label: 'SITZUNGSDATEN',
    session_duration: 'Dauer',
    card_action_label: 'AKTION BEI ABSCHLUSS',
    chart_title: 'Echtzeit-Netzwerkaktivität (60 Sekunden)',
    chart_ago_60: 'vor 60s',
    chart_ago_30: 'vor 30s',
    chart_now: 'Jetzt',
    cond_threshold: 'Geschwindigkeitsschwelle',
    cond_confirm: 'Bestätigungsdauer',
    cond_countdown: 'Countdown-Dauer',
    btn_start_monitor: 'Überwachung starten',
    btn_stop_monitor: 'Überwachung stoppen',
    dock_helper_idle: 'Klicken Sie auf Start, wenn der Download läuft',
    dock_helper_monitoring: 'Netzwerkdurchsatz wird in Echtzeit überwacht...',
    settings_title: 'Programmeinstellungen',
    settings_subtitle: 'Schwellenwerte, Energieaktionen und Systemeinstellungen anpassen',
    sec_general: 'Allgemeine Einstellungen & Design',
    opt_theme: 'Farbschema (Theme)',
    opt_theme_desc: 'Visuelles Erscheinungsbild der Benutzeroberfläche',
    opt_theme_system: 'Windows-Systemstandard (Default)',
    opt_theme_dark: 'Dunkel (Obsidian Gradient Glow)',
    opt_theme_light: 'Hell (Light Frosted Gradient)',
    opt_language: 'Sprache (Language)',
    opt_language_desc: 'Sprache der Benutzeroberfläche wählen',
    opt_unit: 'Geschwindigkeitseinheit',
    opt_unit_desc: 'Einheit für Download- und Uploadrate',
    opt_perf: 'Präzision & Energiesparmodus',
    opt_perf_desc: 'Abfrageintervall & CPU/RAM-Einsparung im Hintergrund',
    opt_perf_eco: 'Eco-Sparer (2.0s Intervall - Sehr geringe CPU/RAM-Last)',
    opt_perf_balanced: 'Ausgewogen (1.0s Intervall - Empfohlen)',
    opt_perf_high: 'Hohe Präzision (0.5s Intervall - Sehr flüssig)',
    opt_grace: 'Verzögerung zum Start',
    opt_grace_desc: 'Puffersekunden vor Beginn der Erkennung',
    sec_monitoring: 'Download-Abschlusskriterien',
    opt_adapter: 'Netzwerkkarte (Adapter)',
    opt_adapter_desc: 'Zu überwachenden Netzwerkadapter auswählen',
    opt_threshold: 'Abschluss-Schwellenwert',
    opt_threshold_desc: 'Geschwindigkeit unter diesem Wert markiert Download als beendet',
    opt_confirm: 'Bestätigungsdauer',
    opt_confirm_desc: 'Sekunden unter dem Schwellenwert bis zum Countdown',
    opt_countdown: 'Countdown-Dauer',
    opt_countdown_desc: 'Pufferzeit vor Aktionsausführung (Abbruchmöglichkeit)',
    sec_action: 'Automatische Energieaktion',
    opt_action_select: 'Aktion nach Download-Abschluss',
    act_shutdown: 'Herunterfahren',
    act_shutdown_desc: 'PC vollständig ausschalten',
    act_restart: 'Neu starten',
    act_restart_desc: 'System neu starten',
    act_sleep: 'Energie sparen (Sleep)',
    act_sleep_desc: 'Energiesparmodus',
    act_hibernate: 'Ruhezustand',
    act_hibernate_desc: 'Sitzung auf Festplatte speichern',
    sec_system: 'Benachrichtigungen & Windows-Integration',
    opt_sound: 'Countdown-Signalton',
    opt_sound_desc: 'Hinweiston bei Countdown-Start abspielen',
    opt_notif: 'Windows-Desktopbenachrichtigungen',
    opt_notif_desc: 'Desktop-Hinweis bei Download-Ende anzeigen',
    opt_autostart: 'Mit Windows starten',
    opt_autostart_desc: 'Beim Systemstart minimiert im Infobereich starten',
    unit_sec: 'Sek',
    log_title: 'Aktivitätsprotokoll',
    log_subtitle: 'Verlauf der Netzwerkereignisse und Energieaktionen',
    btn_clear_log: 'Leeren',
    log_empty: 'Noch keine Aktivitäten protokolliert',
    countdown_title: 'Download abgeschlossen!',
    countdown_action_text_prefix: 'System führt (',
    countdown_action_text_suffix: ') aus in',
    btn_cancel_countdown: 'Aktion abbrechen'
  }
}

// ===== Web Audio Alert Synthesizer =====
class SoundPlayer {
  private audioCtx: AudioContext | null = null

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      this.audioCtx = new AudioCtx()
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
    return this.audioCtx
  }

  playChime(): void {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc2.type = 'triangle'

      osc1.frequency.setValueAtTime(587.33, now) // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15) // A5

      osc2.frequency.setValueAtTime(880, now + 0.15)
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35) // D6

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc2.start(now + 0.15)
      osc1.stop(now + 0.35)
      osc2.stop(now + 0.8)
    } catch (err) {
      console.warn('Audio playback error:', err)
    }
  }

  playTick(): void {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(987.77, now) // B5

      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.08)
    } catch (err) {
      // ignore
    }
  }
}

const soundPlayer = new SoundPlayer()

// ===== Application State =====
let isMonitoring = false
let currentLang: Language = 'en'
let currentUnit: SpeedUnit = 'MB/s'
let currentTheme: Theme = 'system'
let currentPage = 'dashboard'
let isWindowVisible = true
let peakDownloadMbps = 0
let countdownTotal = 30
let isSoundAlertEnabled = true
let currentRawStats = { downloadMbps: 0, uploadMbps: 0, interfaceName: '--' }
let currentSettingsCache: any = null

let sessionDownloadedBytes = 0
let sessionTimerSeconds = 0
let sessionTimerInterval: any = null

const downloadHistory: number[] = new Array(60).fill(0)
const uploadHistory: number[] = new Array(60).fill(0)

// ===== DOM Elements =====
const $ = (id: string) => document.getElementById(id)!
const downloadSpeedEl = $('download-speed')
const downloadUnitEl = $('download-unit')
const downloadConversionEl = $('download-conversion')
const downloadPeakLabelEl = $('download-peak-label')
const uploadSpeedEl = $('upload-speed')
const uploadUnitEl = $('upload-unit')
const uploadConversionEl = $('upload-conversion')
const sessionDownloadedValEl = $('session-downloaded-val')
const sessionTimerValEl = $('session-timer-val')
const interfaceNameEl = $('interface-name')
const confirmDurationEl = $('confirm-duration')
const countdownDisplayEl = $('countdown-display')
const thresholdDisplayEl = $('threshold-display')
const btnToggle = $('btn-toggle-monitor')
const btnToggleText = $('btn-toggle-text')
const dockHelperText = $('dock-helper-text')
const statusDot = $('status-dot')
const statusText = $('status-text')
const countdownOverlay = $('countdown-overlay')
const countdownTimer = $('countdown-timer')
const countdownProgressBar = $('countdown-progress-bar')
const countdownActionText = $('countdown-action-text')
const canvas = $('speed-chart') as HTMLCanvasElement

// ===== Titlebar Window Controls =====
$('btn-close').addEventListener('click', () => api.closeWindow())
$('btn-minimize').addEventListener('click', () => api.minimizeWindow())
$('btn-maximize').addEventListener('click', () => api.maximizeWindow())

// ===== Navigation =====
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = (btn as HTMLElement).dataset.page!
    switchPage(page)
  })
})

function switchPage(page: string) {
  currentPage = page
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active')
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  $(`page-${page}`)?.classList.add('active')
  if (page === 'logs') loadLogs()
  if (page === 'dashboard' && isWindowVisible) {
    resizeChartCanvas()
  }
}

// Background & Resource Efficiency: Pause rendering when window is hidden
document.addEventListener('visibilitychange', () => {
  isWindowVisible = document.visibilityState === 'visible'
  if (isWindowVisible && currentPage === 'dashboard') {
    drawChart()
  }
})

// ===== Theme Management =====
function getEffectiveTheme(theme: Theme): 'dark' | 'light' {
  if (theme === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

function applyTheme(theme: Theme) {
  currentTheme = theme
  const effective = getEffectiveTheme(theme)
  document.documentElement.setAttribute('data-theme', effective)
  const themeSelect = $('setting-theme-select') as HTMLSelectElement
  if (themeSelect) themeSelect.value = theme
  drawChart()
}

// Dynamic Windows system theme listener
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'system') {
      applyTheme('system')
    }
  })
}

$('setting-theme-select')?.addEventListener('change', async (e) => {
  const newTheme = (e.target as HTMLSelectElement).value as Theme
  applyTheme(newTheme)
  await saveSettings({ theme: newTheme })
})

// ===== i18n & Language Switcher =====
function applyLanguage(lang: Language) {
  currentLang = lang
  const dict = i18n[lang]

  // Update text for all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')!
    if (dict[key]) {
      el.textContent = dict[key]
    }
  })

  // Update action buttons tooltips
  $('dash-act-shutdown')?.setAttribute('title', `${dict.act_shutdown} - ${dict.act_shutdown_desc}`)
  $('dash-act-restart')?.setAttribute('title', `${dict.act_restart} - ${dict.act_restart_desc}`)
  $('dash-act-sleep')?.setAttribute('title', `${dict.act_sleep} - ${dict.act_sleep_desc}`)
  $('dash-act-hibernate')?.setAttribute('title', `${dict.act_hibernate} - ${dict.act_hibernate_desc}`)

  const langSelect = $('setting-lang-select') as HTMLSelectElement
  if (langSelect) langSelect.value = lang

  // Re-render dynamic elements
  if (currentSettingsCache) {
    updateDashboardInfo(currentSettingsCache)
  }
  updateMonitorUI(isMonitoring)
  renderSpeedStats()
}

$('setting-lang-select')?.addEventListener('change', (e) => {
  setLanguage((e.target as HTMLSelectElement).value as Language)
})

async function setLanguage(lang: Language) {
  applyLanguage(lang)
  await saveSettings({ language: lang })
}

// ===== Speed Unit Switcher =====
function applySpeedUnit(unit: SpeedUnit) {
  currentUnit = unit

  const unitSelect = $('setting-unit-select') as HTMLSelectElement
  if (unitSelect) unitSelect.value = unit

  // Update unit badges in Settings
  const settingUnitEl = $('setting-threshold-unit')
  if (settingUnitEl) settingUnitEl.textContent = unit

  // Adapt threshold slider min/max/step according to unit
  const thSlider = $('setting-threshold') as HTMLInputElement
  const thNum = $('setting-threshold-value') as HTMLInputElement
  if (currentSettingsCache && thSlider && thNum) {
    const rawMbps = currentSettingsCache.thresholdMbps || 5
    if (unit === 'MB/s') {
      thSlider.min = '0.05'
      thSlider.max = '25'
      thSlider.step = '0.05'
      thNum.min = '0.05'
      thNum.max = '25'
      thNum.step = '0.05'
      const valMB = (rawMbps / 8).toFixed(2)
      thSlider.value = thNum.value = valMB
    } else {
      thSlider.min = '0.5'
      thSlider.max = '200'
      thSlider.step = '0.5'
      thNum.min = '0.5'
      thNum.max = '200'
      thNum.step = '0.5'
      thSlider.value = thNum.value = rawMbps.toFixed(1)
    }
    updateDashboardInfo(currentSettingsCache)
  }

  renderSpeedStats()
  drawChart()
}

$('setting-unit-select')?.addEventListener('change', (e) => {
  setSpeedUnit((e.target as HTMLSelectElement).value as SpeedUnit)
})

async function setSpeedUnit(unit: SpeedUnit) {
  applySpeedUnit(unit)
  await saveSettings({ speedUnit: unit })
}

// ===== Monitor Toggle =====
btnToggle.addEventListener('click', async () => {
  if (isMonitoring) {
    await api.stopMonitor()
  } else {
    await api.startMonitor()
  }
})

function updateMonitorUI(monitoring: boolean) {
  isMonitoring = monitoring
  const dict = i18n[currentLang]
  const svg = btnToggle.querySelector('svg')!

  if (monitoring) {
    btnToggleText.textContent = dict.btn_stop_monitor
    svg.innerHTML = '<rect x="3" y="3" width="10" height="10" rx="1" fill="currentColor"/>'
    btnToggle.classList.add('active-monitoring')
    dockHelperText.textContent = dict.dock_helper_monitoring
  } else {
    btnToggleText.textContent = dict.btn_start_monitor
    svg.innerHTML = '<polygon points="4,2 14,8 4,14" fill="currentColor"/>'
    btnToggle.classList.remove('active-monitoring')
    dockHelperText.textContent = dict.dock_helper_idle
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function formatDuration(totalSec: number): string {
  const h = Math.floor(totalSec / 3600).toString().padStart(2, '0')
  const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0')
  const s = (totalSec % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

// ===== Network Stats Display & Formatting =====
function renderSpeedStats() {
  const { downloadMbps, uploadMbps, interfaceName } = currentRawStats
  if (downloadMbps > peakDownloadMbps) {
    peakDownloadMbps = downloadMbps
  }

  if (currentUnit === 'MB/s') {
    const dlMBs = downloadMbps / 8
    const ulMBs = uploadMbps / 8
    const peakMBs = peakDownloadMbps / 8

    downloadSpeedEl.textContent = dlMBs.toFixed(2)
    downloadUnitEl.textContent = 'MB/s'
    downloadConversionEl.textContent = `≈ ${downloadMbps.toFixed(2)} Mbps`
    downloadPeakLabelEl.textContent = `Peak: ${peakMBs.toFixed(2)} MB/s`

    uploadSpeedEl.textContent = ulMBs.toFixed(2)
    uploadUnitEl.textContent = 'MB/s'
    uploadConversionEl.textContent = `≈ ${uploadMbps.toFixed(2)} Mbps`
  } else {
    downloadSpeedEl.textContent = downloadMbps.toFixed(2)
    downloadUnitEl.textContent = 'Mbps'
    downloadConversionEl.textContent = `≈ ${(downloadMbps / 8).toFixed(2)} MB/s`
    downloadPeakLabelEl.textContent = `Peak: ${peakDownloadMbps.toFixed(2)} Mbps`

    uploadSpeedEl.textContent = uploadMbps.toFixed(2)
    uploadUnitEl.textContent = 'Mbps'
    uploadConversionEl.textContent = `≈ ${(uploadMbps / 8).toFixed(2)} MB/s`
  }

  if (sessionDownloadedValEl) {
    sessionDownloadedValEl.textContent = formatBytes(sessionDownloadedBytes)
  }
  if (sessionTimerValEl) {
    const dict = i18n[currentLang]
    sessionTimerValEl.textContent = `${dict.session_duration || 'Durasi'}: ${formatDuration(sessionTimerSeconds)}`
  }

  interfaceNameEl.textContent = interfaceName || (currentLang === 'id' ? 'Semua Adapter' : 'All Adapters')
}

api.onNetworkStats((stats: any) => {
  const dl = stats.downloadMbps ?? 0
  const ul = stats.uploadMbps ?? 0
  currentRawStats = {
    downloadMbps: dl,
    uploadMbps: ul,
    interfaceName: stats.interfaceName || '--'
  }

  if (isMonitoring && dl > 0) {
    // 1 Mbps = 125,000 bytes per second
    sessionDownloadedBytes += (dl * 1000 * 1000) / 8
  }

  downloadHistory.push(dl)
  uploadHistory.push(ul)
  if (downloadHistory.length > 60) downloadHistory.shift()
  if (uploadHistory.length > 60) uploadHistory.shift()

  renderSpeedStats()
  // Resource & Battery Efficiency: Only render canvas when on dashboard and window is visible
  if (currentPage === 'dashboard' && isWindowVisible) {
    drawChart()
  }
})

// ===== Monitor Status =====
api.onMonitorStatus((status: string) => {
  statusDot.className = 'status-dot'
  const dict = i18n[currentLang]

  if (status === 'monitoring') {
    statusDot.classList.add('monitoring')
    statusText.textContent = dict.status_monitoring
    updateMonitorUI(true)

    if (!sessionTimerInterval) {
      sessionTimerInterval = setInterval(() => {
        if (isMonitoring) {
          sessionTimerSeconds++
          if (sessionTimerValEl) {
            sessionTimerValEl.textContent = `${dict.session_duration || 'Durasi'}: ${formatDuration(sessionTimerSeconds)}`
          }
        }
      }, 1000)
    }
  } else if (status === 'countdown') {
    statusDot.classList.add('countdown')
    statusText.textContent = dict.status_countdown
  } else if (status === 'executing') {
    statusText.textContent = dict.status_executing
  } else {
    statusText.textContent = dict.status_idle
    updateMonitorUI(false)

    if (sessionTimerInterval) {
      clearInterval(sessionTimerInterval)
      sessionTimerInterval = null
    }
  }
})

// ===== Countdown & Alerts =====
api.onCountdownStart((duration: number) => {
  countdownTotal = duration
  countdownOverlay.classList.add('active')
  countdownTimer.textContent = String(duration)
  countdownProgressBar.style.width = '100%'

  if (isSoundAlertEnabled) {
    soundPlayer.playChime()
  }
})

api.onCountdownTick((remaining: number) => {
  countdownTimer.textContent = String(remaining)
  const pct = (remaining / countdownTotal) * 100
  countdownProgressBar.style.width = `${pct}%`

  if (isSoundAlertEnabled && remaining <= 5 && remaining > 0) {
    soundPlayer.playTick()
  }
})

api.onCountdownCancel(() => {
  countdownOverlay.classList.remove('active')
})

$('btn-cancel-countdown').addEventListener('click', async () => {
  await api.cancelAction()
  countdownOverlay.classList.remove('active')
})

// ===== Settings Handling =====
function syncSlider(sliderId: string, numberId: string, onSave: () => void) {
  const slider = $(sliderId) as HTMLInputElement
  const num = $(numberId) as HTMLInputElement
  if (!slider || !num) return
  slider.addEventListener('input', () => { num.value = slider.value; onSave() })
  num.addEventListener('change', () => { slider.value = num.value; onSave() })
}

syncSlider('setting-threshold', 'setting-threshold-value', () => saveThresholdSettings())
syncSlider('setting-confirm', 'setting-confirm-value', () => saveSettings())
syncSlider('setting-countdown', 'setting-countdown-value', () => saveSettings())
syncSlider('setting-grace', 'setting-grace-value', () => saveSettings())

$('setting-interface')?.addEventListener('change', () => saveSettings())
$('setting-perf-select')?.addEventListener('change', async (e) => {
  const ms = parseInt((e.target as HTMLSelectElement).value) || 1000
  await saveSettings({ pollIntervalMs: ms })
})
$('setting-sound')?.addEventListener('change', () => {
  isSoundAlertEnabled = ($('setting-sound') as HTMLInputElement).checked
  saveSettings()
})
$('setting-notifications')?.addEventListener('change', () => saveSettings())
$('setting-autostart')?.addEventListener('change', () => saveSettings())

// Synchronize Action Selection across Dashboard and Settings
function setActiveAction(action: string) {
  // Update dashboard buttons
  document.querySelectorAll('.dash-action-btn').forEach(btn => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset.action === action)
  })
  // Update settings buttons
  document.querySelectorAll('.action-bento-btn').forEach(btn => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset.action === action)
  })
}

// Dashboard 4-action grid clicks
document.querySelectorAll('.dash-action-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = (btn as HTMLElement).dataset.action || 'shutdown'
    setActiveAction(action)
    saveSettings({ actionType: action })
  })
})

// Settings 4-action grid clicks
document.querySelectorAll('.action-bento-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = (btn as HTMLElement).dataset.action || 'shutdown'
    setActiveAction(action)
    saveSettings({ actionType: action })
  })
})

function saveThresholdSettings() {
  const rawInputVal = parseFloat(($('setting-threshold') as HTMLInputElement).value)
  const thresholdMbps = currentUnit === 'MB/s' ? rawInputVal * 8 : rawInputVal
  saveSettings({ thresholdMbps })
}

async function saveSettings(override: any = {}) {
  const activeAction = document.querySelector('.dash-action-btn.active') as HTMLElement
  const rawInputVal = parseFloat(($('setting-threshold') as HTMLInputElement)?.value || '0.6')
  const calculatedMbps = currentUnit === 'MB/s' ? rawInputVal * 8 : rawInputVal
  const perfSelect = $('setting-perf-select') as HTMLSelectElement
  const pollIntervalMs = perfSelect ? (parseInt(perfSelect.value) || 1000) : 1000

  const baseSettings = {
    thresholdMbps: calculatedMbps,
    confirmDurationSec: parseInt(($('setting-confirm') as HTMLInputElement)?.value) || 10,
    countdownSec: parseInt(($('setting-countdown') as HTMLInputElement)?.value) || 30,
    initialGracePeriodSec: parseInt(($('setting-grace') as HTMLInputElement)?.value) || 0,
    actionType: activeAction?.dataset.action || 'shutdown',
    selectedInterface: ($('setting-interface') as HTMLSelectElement)?.value || 'all',
    audioAlert: ($('setting-sound') as HTMLInputElement)?.checked ?? true,
    notifications: ($('setting-notifications') as HTMLInputElement)?.checked ?? true,
    autoStart: ($('setting-autostart') as HTMLInputElement)?.checked ?? false,
    speedUnit: currentUnit,
    language: currentLang,
    theme: currentTheme,
    pollIntervalMs: pollIntervalMs,
    ...override
  }

  const updated = await api.setSettings(baseSettings)
  currentSettingsCache = updated
  updateDashboardInfo(updated)
}

async function loadInterfaces() {
  try {
    const ifaces = await api.getInterfaces()
    const select = $('setting-interface') as HTMLSelectElement
    if (!select) return
    const currentVal = select.value || 'all'
    select.innerHTML = ''

    const defaultOpt = document.createElement('option')
    defaultOpt.value = 'all'
    defaultOpt.textContent = currentLang === 'id' ? 'Semua Adapter Fisik (Auto Filter)' : 'All Physical Adapters (Auto Filter)'
    select.appendChild(defaultOpt)

    if (Array.isArray(ifaces)) {
      ifaces.forEach((iface: any) => {
        const opt = document.createElement('option')
        opt.value = iface.id
        opt.textContent = iface.ip4 ? `${iface.name} (${iface.ip4})` : iface.name
        if (iface.id === currentVal) opt.selected = true
        select.appendChild(opt)
      })
    }
  } catch (err) {
    console.error('Failed to load interfaces:', err)
  }
}

async function loadSettings() {
  const settings = await api.getSettings()
  currentSettingsCache = settings

  currentLang = (settings.language as Language) || 'en'
  currentUnit = (settings.speedUnit as SpeedUnit) || 'MB/s'
  currentTheme = (settings.theme as Theme) || 'system'

  applyTheme(currentTheme)
  applyLanguage(currentLang)
  applySpeedUnit(currentUnit)

  const cfSlider = $('setting-confirm') as HTMLInputElement
  const cfNum = $('setting-confirm-value') as HTMLInputElement
  const cdSlider = $('setting-countdown') as HTMLInputElement
  const cdNum = $('setting-countdown-value') as HTMLInputElement
  const grSlider = $('setting-grace') as HTMLInputElement
  const grNum = $('setting-grace-value') as HTMLInputElement
  const soundCheck = $('setting-sound') as HTMLInputElement
  const notifCheck = $('setting-notifications') as HTMLInputElement
  const autostartCheck = $('setting-autostart') as HTMLInputElement

  if (cfSlider && cfNum) cfSlider.value = cfNum.value = String(settings.confirmDurationSec ?? 10)
  if (cdSlider && cdNum) cdSlider.value = cdNum.value = String(settings.countdownSec ?? 30)
  if (grSlider && grNum) grSlider.value = grNum.value = String(settings.initialGracePeriodSec ?? 0)

  if (soundCheck) {
    soundCheck.checked = settings.audioAlert ?? true
    isSoundAlertEnabled = soundCheck.checked
  }

  if (notifCheck) notifCheck.checked = settings.notifications ?? true
  if (autostartCheck) autostartCheck.checked = settings.autoStart ?? false

  const perfSelect = $('setting-perf-select') as HTMLSelectElement
  if (perfSelect && settings.pollIntervalMs) {
    perfSelect.value = String(settings.pollIntervalMs)
  }

  await loadInterfaces()
  const select = $('setting-interface') as HTMLSelectElement
  if (select && settings.selectedInterface) {
    select.value = settings.selectedInterface
  }

  setActiveAction(settings.actionType || 'shutdown')
  updateDashboardInfo(settings)
}

function updateDashboardInfo(s: any) {
  const dict = i18n[currentLang]
  const actionType = s.actionType || 'shutdown'
  const actionCapitalized = actionType.charAt(0).toUpperCase() + actionType.slice(1)

  // Ensure 4-buttons on dashboard and settings reflect current action
  setActiveAction(actionType)

  // Display threshold formatted in selected unit
  const mbps = s.thresholdMbps ?? 5
  if (currentUnit === 'MB/s') {
    const mbVal = (mbps / 8).toFixed(2)
    thresholdDisplayEl.textContent = `< ${mbVal} MB/s`
  } else {
    thresholdDisplayEl.textContent = `< ${mbps.toFixed(1)} Mbps`
  }

  const secUnit = dict.unit_sec
  confirmDurationEl.textContent = `${s.confirmDurationSec || 10} ${secUnit}`
  if (countdownDisplayEl) countdownDisplayEl.textContent = `${s.countdownSec || 30} ${secUnit}`
  countdownActionText.textContent = `${dict.countdown_action_text_prefix}${actionCapitalized}${dict.countdown_action_text_suffix}`
}

// ===== Activity Log =====
async function loadLogs() {
  const logs = await api.getLogs()
  const container = $('log-list')
  const dict = i18n[currentLang]

  if (!logs || logs.length === 0) {
    container.innerHTML = `<div class="log-empty"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><path d="M14 20H26M14 15H22M14 25H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/></svg><p>${dict.log_empty}</p></div>`
    return
  }
  container.innerHTML = logs.map((log: any) => {
    const d = new Date(log.timestamp)
    const time = d.toLocaleTimeString(currentLang === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const date = d.toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric' })
    return `<div class="log-entry"><div class="log-dot ${log.level}"></div><div class="log-content"><div class="log-message">${log.message}</div><div class="log-time">${date} ${time}</div></div></div>`
  }).join('')
}

$('btn-clear-logs')?.addEventListener('click', async () => {
  await api.clearLogs()
  loadLogs()
})

// ===== Speed Chart (Optimized Canvas Renderer) =====
let chartLogicalWidth = 700
let chartLogicalHeight = 200

function resizeChartCanvas() {
  const dpr = window.devicePixelRatio || 1
  const parent = canvas.parentElement || canvas
  const rect = parent.getBoundingClientRect()
  if (rect.width > 0) {
    const h = rect.height > 0 ? rect.height : 190
    chartLogicalWidth = rect.width
    chartLogicalHeight = h
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(h * dpr)
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }
    drawChart()
  }
}

const resizeObserver = new ResizeObserver(() => {
  resizeChartCanvas()
})
if (canvas.parentElement) {
  resizeObserver.observe(canvas.parentElement)
}

function drawChart() {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = chartLogicalWidth
  const h = chartLogicalHeight
  const padding = { top: 12, right: 12, bottom: 12, left: 12 }
  const chartW = w - padding.left - padding.right
  const chartH = h - padding.top - padding.bottom

  ctx.clearRect(0, 0, w, h)

  // Convert histories to current unit for graphing scale
  const unitFactor = currentUnit === 'MB/s' ? 1 / 8 : 1
  const dlGraph = downloadHistory.map(v => v * unitFactor)
  const ulGraph = uploadHistory.map(v => v * unitFactor)

  // Scale max
  const allVals = [...dlGraph, ...ulGraph]
  const maxVal = Math.max(currentUnit === 'MB/s' ? 0.5 : 4, ...allVals) * 1.2

  // Subtle grid lines with theme awareness
  const effectiveTheme = getEffectiveTheme(currentTheme)
  const isLight = effectiveTheme === 'light'
  ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.04)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(w - padding.right, y)
    ctx.stroke()
  }

  function drawCurve(data: number[], color: string, gradColor: string) {
    if (!ctx) return
    const step = chartW / (data.length - 1)

    // Gradient fill under curve
    const grad = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom)
    grad.addColorStop(0, gradColor)
    grad.addColorStop(1, 'transparent')

    ctx.beginPath()
    ctx.moveTo(padding.left, h - padding.bottom)
    for (let i = 0; i < data.length; i++) {
      const x = padding.left + i * step
      const y = padding.top + chartH - (data[i] / maxVal) * chartH
      if (i === 0) ctx.lineTo(x, y)
      else {
        const prevX = padding.left + (i - 1) * step
        const prevY = padding.top + chartH - (data[i - 1] / maxVal) * chartH
        const cpx = (prevX + x) / 2
        ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y)
      }
    }
    ctx.lineTo(padding.left + (data.length - 1) * step, h - padding.bottom)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    // Outer glow stroke
    ctx.beginPath()
    for (let i = 0; i < data.length; i++) {
      const x = padding.left + i * step
      const y = padding.top + chartH - (data[i] / maxVal) * chartH
      if (i === 0) ctx.moveTo(x, y)
      else {
        const prevX = padding.left + (i - 1) * step
        const prevY = padding.top + chartH - (data[i - 1] / maxVal) * chartH
        const cpx = (prevX + x) / 2
        ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y)
      }
    }
    ctx.strokeStyle = color
    ctx.lineWidth = 2.5
    ctx.stroke()
  }

  if (isLight) {
    drawCurve(ulGraph, '#d97706', 'rgba(217, 119, 6, 0.12)')
    drawCurve(dlGraph, '#0284c7', 'rgba(2, 132, 199, 0.16)')
  } else {
    drawCurve(ulGraph, '#f59e0b', 'rgba(245, 158, 11, 0.12)')
    drawCurve(dlGraph, '#06b6d4', 'rgba(6, 182, 212, 0.18)')
  }
}

// ===== Application Initialization =====
async function init() {
  resizeChartCanvas()
  await loadSettings()
  await loadLogs()
  drawChart()
}

init()


