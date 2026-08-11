import { Platform } from 'react-native';
import { useAuthStore } from '../../app/stores/useAuthStore';
import * as Notifications from 'expo-notifications';

const LAZZOS_SERVICE_UUID = '1234abcd-1234-5678-1234-abcdef123456';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class BLEProximityService {
  private static instance: any = null; // Normally BleManager

  // Simple ephemeral token generator for anti-stalking
  private static generateEphemeralToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

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
      console.log('Ghost Mode is active, BLE scanning & advertising is disabled.');
      this.stopScanning();
      return;
    }

    // In a real app, this ephemeral token is broadcasted instead of the raw user ID
    // and the backend matches the token back to the user to prevent tracking.
    const ephemeralToken = this.generateEphemeralToken();
    console.log('Broadcasting Ephemeral Token:', ephemeralToken);

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

  static async notifyMatch(title: string, body: string) {
    if (Platform.OS === 'web') return;
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { data: 'goes here' },
      },
      trigger: null, // trigger immediately
    });
  }
}
