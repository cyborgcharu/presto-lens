// src/screens/TeleprompterScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const SAMPLE_TEXT = [
  'Welcome to PrestoLens!',
  'This is a sample script that you can use to test the teleprompter functionality.',
  'You can adjust the font size using the buttons below.',
  'The text will be scrollable, and soon we\'ll add auto-scroll functionality with speed controls.',
  // Added more text to make scrolling more noticeable
  'Try the auto-scroll feature!',
  'You can control the speed.',
  'Shake your device to play/pause.',
  'Perfect for presentations and speeches.',
];

const TeleprompterScreen = () => {
  const [fontSize, setFontSize] = useState(32);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const scrollViewRef = useRef(null);
  const scrollY = useRef(0);
  const animationRef = useRef(null);

  const increaseFontSize = () => setFontSize(prev => prev + 2);
  const decreaseFontSize = () => setFontSize(prev => Math.max(16, prev - 2));

  const scroll = () => {
    if (!scrollViewRef.current || !isPlaying) return;
    
    scrollY.current += scrollSpeed;
    scrollViewRef.current?.scrollTo({
      y: scrollY.current,
      animated: false,
    });
    
    animationRef.current = requestAnimationFrame(scroll);
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(scroll);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, scrollSpeed]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
          onScroll={(event) => {
            scrollY.current = event.nativeEvent.contentOffset.y;
          }}
        >
          {SAMPLE_TEXT.map((paragraph, index) => (
            <Text 
              key={index} 
              style={[
                styles.text, 
                { fontSize },
                index > 0 && styles.paragraph
              ]}
            >
              {paragraph}
            </Text>
          ))}
        </ScrollView>
        
        <View style={styles.controls}>
          <View style={styles.topControls}>
            <TouchableOpacity 
              style={styles.playButton} 
              onPress={togglePlay}
            >
              <Text style={styles.playButtonText}>
                {isPlaying ? '⏸' : '▶️'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.speedControls}>
              <TouchableOpacity 
                style={styles.speedButton}
                onPress={() => setScrollSpeed(prev => Math.max(0.5, prev - 0.5))}
              >
                <Text style={styles.buttonText}>🐢</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.speedButton}
                onPress={() => setScrollSpeed(prev => Math.min(3, prev + 0.5))}
              >
                <Text style={styles.buttonText}>🐰</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.fontControls}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={decreaseFontSize}
            >
              <Text style={styles.buttonText}>A-</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={increaseFontSize}
            >
              <Text style={styles.buttonText}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: width * 0.1,
    paddingTop: 100,
  },
  text: {
    color: '#fff',
    lineHeight: 50,
    textAlign: 'center',
  },
  paragraph: {
    marginTop: 40,
  },
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

export default TeleprompterScreen;