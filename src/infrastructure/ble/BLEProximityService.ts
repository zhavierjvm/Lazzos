import { Platform } from 'react-native';
import { useAuthStore } from '../../app/stores/useAuthStore';

const LAZZOS_SERVICE_UUID = '1234abcd-1234-5678-1234-abcdef123456';

export class BLEProximityService {
  private static instance: any = null; // Normally BleManager

  static initialize() {
    if (Platform.OS === 'web') return;

    // Lazy import to avoid crashing web environments
    const { BleManager } = require('react-native-ble-plx');
    if (!this.instance) {
      this.instance = new BleManager();
    }
  }

  static startScanning(onDeviceFound: (device: any) => void) {
    const isGhostMode = useAuthStore.getState().userProfile?.isGhostMode;

    if (isGhostMode) {
      console.log('Ghost Mode is active, BLE scanning is disabled.');
      this.stopScanning();
      return;
    }

    if (Platform.OS === 'web' || !this.instance) {
      console.log('BLE Scanning mocked for web');
      return;
    }

    this.instance.startDeviceScan(
      [LAZZOS_SERVICE_UUID],
      { allowDuplicates: true },
      (error: any, device: any) => {
        if (error) {
          console.error(error);
          return;
        }
        onDeviceFound(device);
      }
    );
  }

  static stopScanning() {
    if (Platform.OS === 'web' || !this.instance) return;
    this.instance.stopDeviceScan();
  }

  static isDeviceInRange(rssi: number, targetRange: number): boolean {
    // Basic approximation: -65 to -75 is roughly 5 meters depending on environment
    // For 15m and 50m, the threshold goes lower (e.g. -85, -95)
    let threshold = -75;
    if (targetRange === 15) threshold = -85;
    if (targetRange === 50) threshold = -95;

    return rssi >= threshold;
  }
}
