// src/bluetooth/bluetoothUtils.ts
import { Platform, NativeEventEmitter, NativeModule } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';
import { BleError, BleManager, Device } from 'react-native-ble-plx';

// Create BleManager instance safely
let bleManager: BleManager | null = null;
try {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    bleManager = new BleManager();
  }
} catch (error) {
  console.warn('Failed to initialize BleManager:', error);
}

// Request Bluetooth permissions
export async function requestBluetoothPermissions() {
  if (!bleManager) {
    console.warn('Bluetooth not initialized');
    return;
  }

  try {
    if (Platform.OS === 'android') {
      await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
    } else if (Platform.OS === 'ios') {
      await request(PERMISSIONS.IOS.BLUETOOTH);
    }
  } catch (error) {
    console.error('Failed to request Bluetooth permissions:', error);
    throw new Error('Failed to request Bluetooth permissions');
  }
}

// Scan for available Bluetooth devices
export function scanForDevices(): Promise<Device[]> {
  if (!bleManager) {
    console.warn('Bluetooth not initialized');
    return Promise.resolve([]);
  }

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
      bleManager!.startDeviceScan(null, null, handleScannerState);
    };

    const stopScan = () => {
      if (isScanning && bleManager) {
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
  if (!bleManager) {
    throw new Error('Bluetooth not initialized');
  }

  try {
    const device = await bleManager.connectToDevice(deviceId);
    await device.discoverAllServicesAndCharacteristics();
    return device;
  } catch (error) {
    console.error('Failed to connect to Bluetooth device:', error);
    throw new Error('Failed to connect to Bluetooth device');
  }
}

// Disconnect from a Bluetooth device
export async function disconnectFromDevice(device: Device) {
  if (!bleManager) {
    console.warn('Bluetooth not initialized');
    return;
  }

  try {
    await bleManager.cancelDeviceConnection(device.id);
  } catch (error) {
    console.error('Failed to disconnect from Bluetooth device:', error);
    throw new Error('Failed to disconnect from Bluetooth device');
  }
}

// Export for checking if Bluetooth is available
export function isBluetoothAvailable(): boolean {
  return bleManager !== null;
}