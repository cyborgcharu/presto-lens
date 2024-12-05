// src/screens/EditorScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, SafeAreaView } from 'react-native';

const EditorScreen = ({ onStartPresenting }: { onStartPresenting: (text: string) => void }) => {
  const [text, setText] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Enter your speech here..."
        value={text}
        onChangeText={setText}
      />
      <Button 
        title="Start Presenting" 
        onPress={() => onStartPresenting(text)}
      />
    </SafeAreaView>
  );
};
