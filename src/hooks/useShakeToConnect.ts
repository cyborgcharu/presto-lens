// src/hooks/useShakeToConnect.ts
import { useEffect, useState } from 'react';
import { Device } from 'react-native-ble-plx';
import RNShake from 'react-native-shake';
import BluetoothUtils from '../bluetooth/BluetoothUtils';

// Update the interface to match Device's properties exactly
type GlassesDevice = Device & {
  name: string | null;
  localName: string | null;
};

const isGlassesDevice = (device: Device): boolean => {
  const deviceName = device.name?.toLowerCase() || '';
  const localName = device.localName?.toLowerCase() || '';
  
  return deviceName.includes('glasses') || 
         deviceName.includes('display') ||
         localName.includes('glasses');
};

export const useShakeToConnect = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleShake = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      setError(null);

      const bluetoothUtils = await BluetoothUtils;
      
      // Check permissions
      const hasPermissions = await bluetoothUtils.requestPermissions();
      if (!hasPermissions) {
        setError('Bluetooth permissions required');
        return;
      }

      let foundDevice = false;

      await bluetoothUtils.scanForDevices({
        timeoutMs: 3000,
        onDeviceFound: async (device: Device) => {
          if (isGlassesDevice(device)) {
            foundDevice = true;
            try {
              const connected = await bluetoothUtils.connectToDevice(device.id);
              setConnectedDevice(connected);
            } catch (connectionError) {
              console.error('Connection failed:', connectionError);
              setError('Failed to connect to device');
            }
          }
        }
      });

      if (!foundDevice) {
        setError('No glasses found nearby. Try shaking again closer to your glasses.');
      }

    } catch (error) {
      console.error('Scan failed:', error);
      setError('Failed to scan. Please make sure your glasses are turned on.');
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      handleShake();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    isConnecting,
    connectedDevice,
    error,
    clearError: () => setError(null)
  };
};

export type { GlassesDevice };