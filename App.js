/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import { Router } from './src/config/router'
import { Platform, StyleSheet, Text, View } from 'react-native'

export default class App extends Component<{}> {
  render() {
    return <Router />
  }
}
