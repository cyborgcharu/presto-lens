// App.tsx
import React from 'react';
import TeleprompterScreen from './src/screens/TeleprompterScreen';

function App(): JSX.Element {
  console.log('App starting...'); // Debug log to see if we reach here
  return <TeleprompterScreen />;
}

export default App;