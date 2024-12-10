// src/bluetooth/bluetoothUtils.ts

import { Platform } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';
import { BleError, BleManager, Device } from 'react-native-ble-plx';

// Initialize the BleManager
const bleManager = new BleManager();

// Request Bluetooth permissions
export async function requestBluetoothPermissions() {
  try {
    if (Platform.OS === 'android') {
      await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
    } else if (Platform.OS === 'ios') {
      await request(PERMISSIONS.IOS.BLUETOOTH);
    }
  } catch (error) {
    throw new Error('Failed to request Bluetooth permissions');
  }
}

// Scan for available Bluetooth devices
export function scanForDevices(): Promise<Device[]> {
    return new Promise<Device[]>((resolve, reject) => {
      let devices: Device[] = [];
      let isScanning = false;
  
      const handleScannerState = (error: BleError | null, scannedDevice: Device | null) => {
        if (error) {
          reject(error);
        } else if (scannedDevice) {
          devices.push(scannedDevice);
        } else {
          isScanning = false;
          resolve(devices);
        }
      };
  
      const startScan = () => {
        isScanning = true;
        bleManager.startDeviceScan(null, null, handleScannerState);
      };
  
      const stopScan = () => {
        if (isScanning) {
          bleManager.stopDeviceScan();
        }
      };
  
      startScan();
  
      // Stop scanning after 10 seconds
      const scanTimeoutId = setTimeout(stopScan, 10000);
  
      return () => {
        clearTimeout(scanTimeoutId);
        stopScan();
      };
    });
  }

// Connect to a Bluetooth device
export async function connectToDevice(deviceId: string): Promise<Device> {
  try {
    const device = await bleManager.connectToDevice(deviceId);
    await device.discoverAllServicesAndCharacteristics();
    return device;
  } catch (error) {
    throw new Error('Failed to connect to Bluetooth device');
  }
}

// Disconnect from a Bluetooth device
export async function disconnectFromDevice(device: Device) {
  try {
    await bleManager.cancelDeviceConnection(device.id);
  } catch (error) {
    throw new Error('Failed to disconnect from Bluetooth device');
  }
}