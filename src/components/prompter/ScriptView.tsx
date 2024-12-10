// src/components/prompter/ScriptView.tsx
import React from 'react';
import { ScrollView, Text, StyleSheet, Dimensions } from 'react-native';

interface ScriptViewProps {
  content: string[];
  fontSize: number;
  scrollViewRef: React.RefObject<ScrollView>;
  onScroll: (event: any) => void;
}

export const ScriptView: React.FC<ScriptViewProps> = ({
  content,
  fontSize,
  scrollViewRef,
  onScroll,
}) => {
  const { width } = Dimensions.get('window');
  
  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={[styles.scrollContent, { padding: width * 0.1 }]}
      scrollEventThrottle={16}
      onScroll={onScroll}
    >
      {content.map((paragraph, index) => (
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
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
});