// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { SafeAreaView } from 'react-native';
import BLETest from './src/components/BLETest';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
        <BLETest />
      </SafeAreaView>
    </Provider>
  );
};

export default App;