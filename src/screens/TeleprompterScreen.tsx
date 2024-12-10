// src/screens/TeleprompterScreen.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Device } from 'react-native-ble-plx';

import { ScriptView } from '../components/prompter/ScriptView';
import { Controls } from '../components/prompter/Controls';
import { useScriptScroll } from '../hooks/useScriptScroll';

import {
  requestBluetoothPermissions,
  scanForDevices,
  connectToDevice,
  disconnectFromDevice,
} from '../bluetooth/BluetoothUtils';

const SAMPLE_TEXT = [
  'Welcome to PrestoLens!',
  'This is a sample script that you can use to test the teleprompter functionality.',
  'You can adjust the font size using the buttons below.',
  'The text will be scrollable, and soon we\'ll add auto-scroll functionality with speed controls.',
  'Try the auto-scroll feature!',
  'You can control the speed.',
  'Shake your device to play/pause.',
  'Perfect for presentations and speeches.',
];

const TeleprompterScreen: React.FC = () => {
  const [fontSize, setFontSize] = useState(32);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [bluetoothDevices, setBluetoothDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  const { scrollViewRef, updateScrollPosition } = useScriptScroll(isPlaying, scrollSpeed);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        await requestBluetoothPermissions();
        await scanForBluetoothDevices();
      } catch (error) {
        console.error('Error requesting Bluetooth permissions:', error);
      }
    };
    requestPermissions();
  }, []);

  const scanForBluetoothDevices = async () => {
    try {
      const devices = await scanForDevices();
      setBluetoothDevices(devices);
    } catch (error) {
      console.error('Error scanning for Bluetooth devices:', error);
    }
  };

  const connectToBluetoothDevice = async (device: Device) => {
    try {
      const connectedDevice = await connectToDevice(device.id);
      setConnectedDevice(connectedDevice);
    } catch (error) {
      console.error('Error connecting to Bluetooth device:', error);
    }
  };

  const disconnectFromBluetoothDevice = async () => {
    try {
      if (connectedDevice) {
        await disconnectFromDevice(connectedDevice);
        setConnectedDevice(null);
      }
    } catch (error) {
      console.error('Error disconnecting from Bluetooth device:', error);
    }
  };

  const handleSpeedChange = (change: number) => {
    setScrollSpeed(prev => Math.max(0.5, Math.min(3, prev + change)));
  };

  const handleFontSizeChange = (change: number) => {
    setFontSize(prev => Math.max(16, prev + change));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScriptView
          content={SAMPLE_TEXT}
          fontSize={fontSize}
          scrollViewRef={scrollViewRef}
          onScroll={(event) => {
            updateScrollPosition(event.nativeEvent.contentOffset.y);
          }}
        />
        <Controls
          isPlaying={isPlaying}
          scrollSpeed={scrollSpeed}
          fontSize={fontSize}
          onPlayPress={() => setIsPlaying(!isPlaying)}
          onSpeedChange={handleSpeedChange}
          onFontSizeChange={handleFontSizeChange}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default TeleprompterScreen;