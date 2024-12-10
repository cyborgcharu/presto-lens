// src/components/prompter/Controls.tsx
import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform 
} from 'react-native';

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
  <View style={styles.container}>
    <View style={styles.speedIndicator}>
      <Text style={styles.speedText}>
        Speed: {scrollSpeed.toFixed(1)}x
      </Text>
    </View>
    <View style={styles.controlsPanel}>
      <View style={styles.topControls}>
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={onPlayPress}
          activeOpacity={0.7}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? '⏸' : '▶️'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.speedControls}>
          <TouchableOpacity 
            style={styles.speedButton}
            onPress={() => onSpeedChange(-0.5)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>🐢</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.speedButton}
            onPress={() => onSpeedChange(0.5)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>🐰</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.fontControls}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => onFontSizeChange(-2)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>A-</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => onFontSizeChange(2)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>A+</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 50 : 20,
  },
  controlsPanel: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  playButtonText: {
    fontSize: 24,
  },
  speedControls: {
    flexDirection: 'row',
    gap: 10,
  },
  speedButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 25,
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 12,
    width: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  speedIndicator: {
    position: 'absolute',
    right: 28,
    bottom: Platform.OS === 'ios' ? 140 : 110,
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  speedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Controls;
