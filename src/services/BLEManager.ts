// src/services/BLEManager.ts
import { BleManager, Device, State } from 'react-native-ble-plx';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BLEState {
  isScanning: boolean;
  connectedDevice: Device | null;
  status: State;
  error: string | null;
}

const initialState: BLEState = {
  isScanning: false,
  connectedDevice: null,
  status: State.Unknown,
  error: null,
};

const bleSlice = createSlice({
  name: 'ble',
  initialState,
  reducers: {
    setScanning: (state, action: PayloadAction<boolean>) => {
      state.isScanning = action.payload;
    },
    setConnectedDevice: (state, action: PayloadAction<Device | null>) => {
      state.connectedDevice = action.payload;
    },
    setStatus: (state, action: PayloadAction<State>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setScanning, setConnectedDevice, setStatus, setError } = bleSlice.actions;
export const bleReducer = bleSlice.reducer;

class BLEService {
  private manager: BleManager;
  private static instance: BLEService;

  private constructor() {
    this.manager = new BleManager();
  }

  public static getInstance(): BLEService {
    if (!BLEService.instance) {
      BLEService.instance = new BLEService();
    }
    return BLEService.instance;
  }

  public async startScan(onDeviceFound: (device: Device) => void) {
    try {
      this.manager.startDeviceScan(
        null,
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error('Scan error:', error);
            return;
          }
          if (device && device.name?.includes('PrestoLens')) {
            onDeviceFound(device);
          }
        }
      );
    } catch (error) {
      console.error('Start scan error:', error);
    }
  }

  public async stopScan() {
    this.manager.stopDeviceScan();
  }

  public async connectToDevice(device: Device) {
    try {
      const connectedDevice = await device.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();
      return connectedDevice;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  public async writeData(
    device: Device,
    serviceUUID: string,
    characteristicUUID: string,
    data: string
  ) {
    try {
      await device.writeCharacteristicWithResponse(
        serviceUUID,
        characteristicUUID,
        btoa(data)
      );
    } catch (error) {
      console.error('Write error:', error);
      throw error;
    }
  }

  public async readData(
    device: Device,
    serviceUUID: string,
    characteristicUUID: string
  ) {
    try {
      const characteristic = await device.readCharacteristicForService(
        serviceUUID,
        characteristicUUID
      );
      return characteristic.value ? atob(characteristic.value) : null;
    } catch (error) {
      console.error('Read error:', error);
      throw error;
    }
  }

  public monitorCharacteristic(
    device: Device,
    serviceUUID: string,
    characteristicUUID: string,
    onData: (data: string | null) => void
  ) {
    return device.monitorCharacteristicForService(
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.error('Monitor error:', error);
          return;
        }
        if (characteristic?.value) {
          onData(atob(characteristic.value));
        }
      }
    );
  }
}

export const bleService = BLEService.getInstance();