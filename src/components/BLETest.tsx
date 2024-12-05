// src/components/BLETest.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { bleService } from '../services/BLEManager';
import { Device } from 'react-native-ble-plx';

const BLETest = () => {
  const dispatch = useAppDispatch();
  const [devices, setDevices] = useState<Device[]>([]);
  const isScanning = useAppSelector(state => state.ble.isScanning);

  const handleStartScan = () => {
    // Clear previous devices
    setDevices([]);
    
    bleService.startScan((device) => {
      setDevices(prev => {
        // Check if device already exists
        if (prev.findIndex(d => d.id === device.id) === -1) {
          return [...prev, device];
        }
        return prev;
      });
    });
  };

  const handleStopScan = () => {
    bleService.stopScan();
  };

  const handleConnect = async (device: Device) => {
    try {
      const connectedDevice = await bleService.connectToDevice(device);
      console.log('Connected to device:', connectedDevice.name);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Test</Text>
      
      <Button
        title={isScanning ? "Stop Scan" : "Start Scan"}
        onPress={isScanning ? handleStopScan : handleStartScan}
      />

      <View style={styles.deviceList}>
        <Text style={styles.subtitle}>Found Devices:</Text>
        {devices.map((device) => (
          <View key={device.id} style={styles.deviceItem}>
            <Text>Name: {device.name || 'Unknown'}</Text>
            <Text>ID: {device.id}</Text>
            <Button
              title="Connect"
              onPress={() => handleConnect(device)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  deviceList: {
    marginTop: 20,
  },
  deviceItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default BLETest;