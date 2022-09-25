import React from 'react';
import AppNavigator from './AppNavigator';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import {store} from './redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </Provider>
  );
};

export default App;
