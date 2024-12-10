// src/components/prompter/Controls.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ControlsProps {
  isPlaying: boolean;
  scrollSpeed: number;
  fontSize: number;
  onPlayPress: () => void;
  onSpeedChange: (change: number) => void;
  onFontSizeChange: (change: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  scrollSpeed,
  onPlayPress,
  onSpeedChange,
  onFontSizeChange,
}) => (
  <View style={styles.controls}>
    <View style={styles.topControls}>
      <TouchableOpacity 
        style={styles.playButton} 
        onPress={onPlayPress}
      >
        <Text style={styles.playButtonText}>
          {isPlaying ? '⏸' : '▶️'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.speedControls}>
        <TouchableOpacity 
          style={styles.speedButton}
          onPress={() => onSpeedChange(-0.5)}
        >
          <Text style={styles.buttonText}>🐢</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.speedButton}
          onPress={() => onSpeedChange(0.5)}
        >
          <Text style={styles.buttonText}>🐰</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <View style={styles.fontControls}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => onFontSizeChange(-2)}
      >
        <Text style={styles.buttonText}>A-</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => onFontSizeChange(2)}
      >
        <Text style={styles.buttonText}>A+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  controls: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 35,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playButtonText: {
    fontSize: 24,
  },
  speedControls: {
    flexDirection: 'row',
  },
  speedButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 25,
    marginLeft: 10,
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    width: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
});