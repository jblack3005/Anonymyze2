import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Editor } from './screens/editor';
import { Home } from './screens/home';

const Stack = createNativeStackNavigator();

export default class App extends Component {
  render() {
    return (
      <Editor />
    );
  }
}