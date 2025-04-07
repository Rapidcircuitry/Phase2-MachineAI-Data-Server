import { checkDeviceStatus } from '../helpers/app.helpers.js';

// Check device status every 10 seconds
const MONITOR_INTERVAL = 10000;

export class DeviceMonitorService {
  static #monitorInterval = null;

  static startMonitoring() {
    if (!this.#monitorInterval) {
      this.#monitorInterval = setInterval(checkDeviceStatus, MONITOR_INTERVAL);
      console.log('Device status monitoring started');
    }
  }

  static stopMonitoring() {
    if (this.#monitorInterval) {
      clearInterval(this.#monitorInterval);
      this.#monitorInterval = null;
      console.log('Device status monitoring stopped');
    }
  }
} 