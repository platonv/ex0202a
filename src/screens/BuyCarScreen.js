import React from 'react'
import { View, FlatList, Text, Picker } from 'react-native'
import {
  ListItem,
  FormLabel,
  Button,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements'

import requestService from '../services/requestService'
import cacheService from '../services/cacheService'

export default class BuyCarScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      car: this.props.navigation.state.params,
      buying: false,
      key: this._getRandomKey(),
      quantity: 0,
    }
  }

  handleQuantityChange = event => {
    this.setState(() => {
      return {
        quantity: event,
      }
    })
  }

  handleSubmit = () => {
    this.setState({ buying: true })
    requestService
      .post('/buyCar', { id: this.state.car.id })
      .then(res => {
        cacheService.save({
          id: this.state.car.id,
          name: this.state.car.name,
          type: this.state.car.type,
        })
        this.props.navigation.navigate('BoughtCarsScreen')
      })
      .catch(err => {})
  }

  render() {
    return (
      <View>
        <FormLabel>Quantity</FormLabel>
        <FormInput
          keyboardType="numeric"
          onChangeText={this.handleQuantityChange}
        />
        <Button
          disabled={this.state.buying}
          onPress={this.handleSubmit}
          title="Buy"
        />
      </View>
    )
  }
  _getRandomKey() {
    return (
      Math.floor(new Date()) + Math.floor(Math.random() * 10000000).toString()
    )
  }
}
