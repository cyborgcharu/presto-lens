// src/screens/TeleprompterScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';

const TeleprompterScreen = ({ 
  text, 
  onClose 
}: { 
  text: string;
  onClose: () => void;
}) => {
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const startScrolling = () => {
    setIsScrolling(true);
    const scroll = () => {
      if (!isScrolling) return;
      scrollViewRef.current?.scrollTo({
        y: (scrollViewRef.current?.contentOffset?.y || 0) + scrollSpeed,
        animated: false
      });
      requestAnimationFrame(scroll);
    };
    requestAnimationFrame(scroll);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.controls}>
        <Button title={isScrolling ? "Pause" : "Start"} 
          onPress={() => {
            if (isScrolling) {
              setIsScrolling(false);
            } else {
              startScrolling();
            }
          }}
        />
        <Button title="Close" onPress={onClose} />
      </View>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.textContainer}
      >
        <Text style={styles.text}>{text}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  input: {
    flex: 1,
    padding: 20,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 48,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export { EditorScreen, TeleprompterScreen };