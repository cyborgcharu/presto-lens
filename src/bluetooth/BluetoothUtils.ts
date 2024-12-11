// src/bluetooth/BluetoothUtils.ts
import { Platform } from 'react-native';
import { request, check, PERMISSIONS, RESULTS, PermissionStatus } from 'react-native-permissions';
import { BleError, BleManager, Device, State } from 'react-native-ble-plx';

interface ScanOptions {
  timeoutMs?: number;
  serviceUUIDs?: string[] | null;
  onDeviceFound?: (device: Device) => void;
}

interface BluetoothState {
  isScanning: boolean;
  connectedDevices: Map<string, Device>;
}

class BluetoothUtils {
  private static instance: BluetoothUtils;
  private bleManager: BleManager;
  private state: BluetoothState = {
    isScanning: false,
    connectedDevices: new Map(),
  };

  private constructor() {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      throw new Error('Unsupported platform');
    }
    this.bleManager = new BleManager({
      restoreStateIdentifier: 'prestolens-bluetooth',
      restoreStateFunction: (bleRestoredState) => {
        if (bleRestoredState == null) {
          console.log('No bluetooth state to restore');
        } else {
          console.log('Restored bluetooth state:', bleRestoredState);
        }
      },
    });
  }

  private async initialize(): Promise<void> {
    try {
      const state = await this.bleManager.state();
      if (state === State.PoweredOff) {
        throw new Error('Bluetooth is powered off');
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Failed to initialize BLE:', error);
      throw error;
    }
  }

  static async getInstance(): Promise<BluetoothUtils> {
    if (!BluetoothUtils.instance) {
      BluetoothUtils.instance = new BluetoothUtils();
      await BluetoothUtils.instance.initialize();
    }
    return BluetoothUtils.instance;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const permissions = [
          PERMISSIONS.IOS.BLUETOOTH
        ];

        const results = await Promise.all(
          permissions.map(permission => check(permission))
        );

        if (results.some(result => result === RESULTS.DENIED)) {
          const requestResults = await Promise.all(
            permissions.map(permission => request(permission))
          );
          return requestResults.every(result => result === RESULTS.GRANTED);
        }

        return results.every(result => result === RESULTS.GRANTED);
      }

      if (Platform.OS === 'android') {
        const permissions = [
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ];

        const results = await Promise.all(
          permissions.map(permission => check(permission))
        );

        if (results.some(result => result === RESULTS.DENIED)) {
          const requestResults = await Promise.all(
            permissions.map(permission => request(permission))
          );
          return requestResults.every(result => result === RESULTS.GRANTED);
        }

        return results.every(result => result === RESULTS.GRANTED);
      }

      return false;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async checkBluetoothState(): Promise<State> {
    return await this.bleManager.state();
  }

  async scanForDevices(options: ScanOptions = {}): Promise<Device[]> {
    if (this.state.isScanning) {
      throw new Error('Already scanning for devices');
    }

    const {
      timeoutMs = 10000,
      serviceUUIDs = null,
      onDeviceFound,
    } = options;

    return new Promise<Device[]>((resolve, reject) => {
      const devices: Device[] = [];
      let timeoutId: NodeJS.Timeout;

      const handleScan = (error: BleError | null, device: Device | null) => {
        if (error) {
          this.stopScan();
          reject(error);
          return;
        }

        if (device && !devices.find(d => d.id === device.id)) {
          devices.push(device);
          onDeviceFound?.(device);
        }
      };

      const stopScanAndResolve = () => {
        this.stopScan();
        resolve(devices);
      };

      try {
        this.state.isScanning = true;
        this.bleManager.startDeviceScan(serviceUUIDs, null, handleScan);
        timeoutId = setTimeout(stopScanAndResolve, timeoutMs);
      } catch (error) {
        this.state.isScanning = false;
        reject(error);
      }

      return () => {
        clearTimeout(timeoutId);
        this.stopScan();
      };
    });
  }

  private stopScan(): void {
    if (this.state.isScanning) {
      this.bleManager.stopDeviceScan();
      this.state.isScanning = false;
    }
  }

  async connectToDevice(deviceId: string): Promise<Device> {
    try {
      const device = await this.bleManager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      this.state.connectedDevices.set(deviceId, device);
  
      // Use the built-in event handler
      device.onDisconnected(() => {
        this.state.connectedDevices.delete(deviceId);
      });
  
      return device;
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  }

  async disconnectDevice(deviceId: string): Promise<void> {
    const device = this.state.connectedDevices.get(deviceId);
    if (!device) {
      throw new Error('Device not connected');
    }

    try {
      await this.bleManager.cancelDeviceConnection(deviceId);
      this.state.connectedDevices.delete(deviceId);
    } catch (error) {
      console.error('Disconnection failed:', error);
      throw error;
    }
  }

  async writeToDevice(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
    data: string
  ): Promise<void> {
    const device = this.state.connectedDevices.get(deviceId);
    if (!device) {
      throw new Error('Device not connected');
    }

    try {
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(data).toString('base64')
      );
    } catch (error) {
      console.error('Write failed:', error);
      throw error;
    }
  }

  getConnectedDevices(): Device[] {
    return Array.from(this.state.connectedDevices.values());
  }

  isDeviceConnected(deviceId: string): boolean {
    return this.state.connectedDevices.has(deviceId);
  }

  isScanning(): boolean {
    return this.state.isScanning;
  }

  dispose(): void {
    this.stopScan();
    this.state.connectedDevices.forEach((device, id) => {
      this.disconnectDevice(id).catch(console.error);
    });
    this.bleManager.destroy();
  }
}

export default BluetoothUtils.getInstance();