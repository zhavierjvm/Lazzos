import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import * as Location from 'expo-location';

export const useProximityPermissions = () => {
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      let isGranted = true;

      // Location Permissions for GPS and Android BLE
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') isGranted = false;

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== 'granted' ||
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== 'granted' ||
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE] !== 'granted'
        ) {
          isGranted = false;
        }
      }

      setHasPermissions(isGranted);
    };

    requestPermissions();
  }, []);

  return hasPermissions;
};
