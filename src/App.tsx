// src/App.tsx
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { EditorScreen, TeleprompterScreen } from './screens';

const App = () => {
  const [presentingText, setPresentingText] = useState<string | null>(null);

  return (
    <Provider store={store}>
      {presentingText === null ? (
        <EditorScreen onStartPresenting={(text) => setPresentingText(text)} />
      ) : (
        <TeleprompterScreen 
          text={presentingText}
          onClose={() => setPresentingText(null)}
        />
      )}
    </Provider>
  );
};

export default App;