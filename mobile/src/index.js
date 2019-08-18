/**
 * Tindev
 * App criado na Omnistack 8.0 da Rocketseat
 * @format
 * @flow
 */

import React from 'react';
import { YellowBox } from 'react-native';
import Routes from './routes';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket',
]);

export default function App() {
  return (
    <Routes />
  );
}

