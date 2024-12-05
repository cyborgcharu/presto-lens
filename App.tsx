// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { SafeAreaView } from 'react-native';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView>
        {/* We'll add our BLE test component here */}
      </SafeAreaView>
    </Provider>
  );
};

export default App;