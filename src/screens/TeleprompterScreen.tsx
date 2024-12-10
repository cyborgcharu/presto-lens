// src/screens/TeleprompterScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { ScriptView } from '../components/prompter/ScriptView';
import { Controls } from '../components/prompter/Controls';
import { useScriptScroll } from '../hooks/useScriptScroll';

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
  
  const { scrollViewRef, updateScrollPosition } = useScriptScroll(isPlaying, scrollSpeed);

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