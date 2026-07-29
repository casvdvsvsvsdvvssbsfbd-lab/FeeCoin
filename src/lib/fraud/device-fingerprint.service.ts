// ============================================
// Device Fingerprinting Service
// Collect and store device information
// ============================================

import { supabase } from '../supabase/client';
import { useAnalytics } from '../analytics';

export interface DeviceFingerprint {
  id: string;
  userId: string;
  deviceId: string;
  telegramId?: number;
  browser: string;
  platform: string;
  timezone: string;
  language: string;
  screenResolution: string;
  cpu: string;
  memory: string;
  gpu: string;
  canvasFingerprint: string;
  webglFingerprint: string;
  audioFingerprint: string;
  fontFingerprint: string;
  batteryApi: any;
  networkInformation: any;
  userAgent: string;
  ipAddress?: string;
  isVpn: boolean;
  isProxy: boolean;
  isTor: boolean;
  isEmulator: boolean;
  isRooted: boolean;
  isJailbroken: boolean;
  createdAt: string;
  lastSeen: string;
}

export interface DeviceInfo {
  deviceId: string;
  browser: string;
  platform: string;
  timezone: string;
  language: string;
  screenResolution: string;
  cpu: string;
  memory: string;
  gpu: string;
  userAgent: string;
}

class DeviceFingerprintService {
  private analytics = useAnalytics();
  private deviceId: string | null = null;

  // Generate device fingerprint
  async generateFingerprint(userId?: string): Promise<DeviceFingerprint> {
    try {
      const deviceInfo = this.collectDeviceInfo();
      const canvasHash = await this.getCanvasFingerprint();
      const webglHash = await this.getWebGLFingerprint();
      const audioHash = await this.getAudioFingerprint();
      const fontHash = await this.getFontFingerprint();
      const networkInfo = this.getNetworkInformation();
      const batteryInfo = await this.getBatteryInfo();
      const vpnInfo = await this.detectVPN();
      const emulatorInfo = await this.detectEmulator();

      const fingerprint: DeviceFingerprint = {
        id: '',
        userId: userId || '',
        deviceId: deviceInfo.deviceId,
        browser: deviceInfo.browser,
        platform: deviceInfo.platform,
        timezone: deviceInfo.timezone,
        language: deviceInfo.language,
        screenResolution: deviceInfo.screenResolution,
        cpu: deviceInfo.cpu,
        memory: deviceInfo.memory,
        gpu: deviceInfo.gpu,
        canvasFingerprint: canvasHash,
        webglFingerprint: webglHash,
        audioFingerprint: audioHash,
        fontFingerprint: fontHash,
        batteryApi: batteryInfo,
        networkInformation: networkInfo,
        userAgent: deviceInfo.userAgent,
        isVpn: vpnInfo.isVpn,
        isProxy: vpnInfo.isProxy,
        isTor: vpnInfo.isTor,
        isEmulator: emulatorInfo.isEmulator,
        isRooted: emulatorInfo.isRooted,
        isJailbroken: emulatorInfo.isJailbroken,
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
      };

      // Store in database
      if (userId) {
        await this.storeFingerprint(fingerprint);
      }

      this.deviceId = deviceInfo.deviceId;
      return fingerprint;
    } catch (error) {
      console.error('Failed to generate fingerprint:', error);
      throw error;
    }
  }

  // Collect device information
  private collectDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let platform = 'Unknown';

    // Detect browser
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';

    // Detect platform
    if (ua.includes('Windows')) platform = 'Windows';
    else if (ua.includes('Mac')) platform = 'MacOS';
    else if (ua.includes('Linux')) platform = 'Linux';
    else if (ua.includes('Android')) platform = 'Android';
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) platform = 'iOS';

    // Generate device ID
    const deviceId = this.generateDeviceId();

    return {
      deviceId,
      browser,
      platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
      language: navigator.language || 'Unknown',
      screenResolution: `${screen.width}x${screen.height}`,
      cpu: this.getCPUInfo(),
      memory: this.getMemoryInfo(),
      gpu: this.getGPUInfo(),
      userAgent: ua,
    };
  }

  // Generate unique device ID
  private generateDeviceId(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency,
    ];

    const hash = components.join('|');
    return this.hashString(hash);
  }

  // Get canvas fingerprint
  private async getCanvasFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return '';

      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Fraud Detection', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Fraud Detection', 4, 17);

      return this.hashString(canvas.toDataURL());
    } catch (error) {
      return '';
    }
  }

  // Get WebGL fingerprint
  private async getWebGLFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return '';

      const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
      const vendor = debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';
      const renderer = debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';

      return this.hashString(`${vendor}|${renderer}`);
    } catch (error) {
      return '';
    }
  }

  // Get audio fingerprint
  private async getAudioFingerprint(): Promise<string> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gain = audioContext.createGain();
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      gain.gain.value = 0;
      oscillator.connect(analyser);
      analyser.connect(processor);
      processor.connect(audioContext.destination);
      oscillator.start();

      return this.hashString('audio_context_available');
    } catch (error) {
      return '';
    }
  }

  // Get font fingerprint
  private async getFontFingerprint(): Promise<string> {
    try {
      const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS'];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return '';

      const fontString = fonts.map(font => {
        ctx.font = `72px ${font}`;
        return ctx.measureText('abcdefghijklmnopqrstuvwxyz').width;
      }).join(',');

      return this.hashString(fontString);
    } catch (error) {
      return '';
    }
  }

  // Get network information
  private getNetworkInformation(): any {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (!connection) return null;

    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }

  // Get battery information
  private async getBatteryInfo(): Promise<any> {
    try {
      const battery = await (navigator as any).getBattery();
      return {
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      };
    } catch (error) {
      return null;
    }
  }

  // Detect VPN/Proxy/TOR
  private async detectVPN(): Promise<{ isVpn: boolean; isProxy: boolean; isTor: boolean }> {
    // Client-side detection (limited)
    // Server-side detection should be done via IP lookup
    return {
      isVpn: false,
      isProxy: false,
      isTor: false,
    };
  }

  // Detect emulator/root/jailbreak
  private detectEmulator(): Promise<{ isEmulator: boolean; isRooted: boolean; isJailbroken: boolean }> {
    return new Promise((resolve) => {
      const ua = navigator.userAgent;
      
      // Basic emulator detection
      const isEmulator = 
        ua.includes('Android') && 
        (ua.includes('Emulator') || ua.includes('VirtualBox') || ua.includes('VMware'));

      resolve({
        isEmulator,
        isRooted: false,
        isJailbroken: false,
      });
    });
  }

  // Get CPU info
  private getCPUInfo(): string {
    return (navigator as any).hardwareConcurrency ? `${(navigator as any).hardwareConcurrency} cores` : 'Unknown';
  }

  // Get memory info
  private getMemoryInfo(): string {
    const memory = (navigator as any).deviceMemory;
    return memory ? `${memory} GB` : 'Unknown';
  }

  // Get GPU info
  private getGPUInfo(): string {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return 'Unknown';

      const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return 'Unknown';

      return (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    } catch (error) {
      return 'Unknown';
    }
  }

  // Store fingerprint in database
  private async storeFingerprint(fingerprint: DeviceFingerprint): Promise<void> {
    try {
      await supabase.from('device_fingerprints').insert({
        user_id: fingerprint.userId,
        device_id: fingerprint.deviceId,
        telegram_id: fingerprint.telegramId,
        browser: fingerprint.browser,
        platform: fingerprint.platform,
        timezone: fingerprint.timezone,
        language: fingerprint.language,
        screen_resolution: fingerprint.screenResolution,
        cpu: fingerprint.cpu,
        memory: fingerprint.memory,
        gpu: fingerprint.gpu,
        canvas_fingerprint: fingerprint.canvasFingerprint,
        webgl_fingerprint: fingerprint.webglFingerprint,
        audio_fingerprint: fingerprint.audioFingerprint,
        font_fingerprint: fingerprint.fontFingerprint,
        battery_api: fingerprint.batteryApi,
        network_information: fingerprint.networkInformation,
        user_agent: fingerprint.userAgent,
        is_vpn: fingerprint.isVpn,
        is_proxy: fingerprint.isProxy,
        is_tor: fingerprint.isTor,
        is_emulator: fingerprint.isEmulator,
        is_rooted: fingerprint.isRooted,
        is_jailbroken: fingerprint.isJailbroken,
      });
    } catch (error) {
      console.error('Failed to store fingerprint:', error);
    }
  }

  // Get user's devices
  async getUserDevices(userId: string): Promise<DeviceFingerprint[]> {
    try {
      const { data, error } = await supabase
        .from('device_fingerprints')
        .select('*')
        .eq('user_id', userId)
        .order('last_seen', { ascending: false });

      if (error) throw error;

      return (data || []).map(d => ({
        id: d.id,
        userId: d.user_id,
        deviceId: d.device_id,
        telegramId: d.telegram_id,
        browser: d.browser,
        platform: d.platform,
        timezone: d.timezone,
        language: d.language,
        screenResolution: d.screen_resolution,
        cpu: d.cpu,
        memory: d.memory,
        gpu: d.gpu,
        canvasFingerprint: d.canvas_fingerprint,
        webglFingerprint: d.webgl_fingerprint,
        audioFingerprint: d.audio_fingerprint,
        fontFingerprint: d.font_fingerprint,
        batteryApi: d.battery_api,
        networkInformation: d.network_information,
        userAgent: d.user_agent,
        isVpn: d.is_vpn,
        isProxy: d.is_proxy,
        isTor: d.is_tor,
        isEmulator: d.is_emulator,
        isRooted: d.is_rooted,
        isJailbroken: d.is_jailbroken,
        createdAt: d.created_at,
        lastSeen: d.last_seen,
      }));
    } catch (error) {
      console.error('Failed to fetch user devices:', error);
      return [];
    }
  }

  // Hash string
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  // Get current device ID
  getDeviceId(): string | null {
    return this.deviceId;
  }
}

// Singleton instance
export const deviceFingerprintService = new DeviceFingerprintService();