import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { Editor } from './screens/editor';
import { Home } from './screens/home';

export default class App extends Component {
  render() {
    return (
      <Home />
    );
  }
}