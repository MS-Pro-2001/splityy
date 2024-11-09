/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { SheetProvider } from 'react-native-actions-sheet';
import './src/components/sheets.tsx';

const Main = () => (
  <PaperProvider>
    <AuthProvider>
      <SheetProvider>
        <App />
      </SheetProvider>
    </AuthProvider>
  </PaperProvider>
);

AppRegistry.registerComponent(appName, () => Main);
