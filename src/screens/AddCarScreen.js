import React from 'react'
import { View, FlatList, Text, Picker } from 'react-native'
import {
  ListItem,
  FormLabel,
  Button,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements'

export default class AddCarScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      key: this._getRandomKey(),
      name: '',
      type: '',
      quantity: '',
      status: '',
    }
  }
  handleNameChange = event => {
    this.setState(() => {
      return {
        name: event,
      }
    })
  }
  handleTypeChange = event => {
    this.setState(() => {
      return {
        type: event,
      }
    })
  }
  handleQuantityChange = event => {
    this.setState(() => {
      return {
        quantity: event,
      }
    })
  }
  handleStatusChange = event => {
    this.setState(() => {
      return {
        status: event,
      }
    })
  }
  handleSubmit = () => {
    this.props.navigation.goBack()
    this.props.navigation.state.params.createCar(this.state)
  }
  render() {
    return (
      <View>
        <FormLabel>Name</FormLabel>
        <FormInput onChangeText={this.handleNameChange} />
        <FormLabel>Type</FormLabel>
        <FormInput onChangeText={this.handleTypeChange} />
        <FormLabel>Quantity</FormLabel>
        <FormInput onChangeText={this.handleQuantityChange} />
        <FormLabel>Status</FormLabel>
        <FormInput onChangeText={this.handleStatusChange} />
        <Button large onPress={this.handleSubmit} title="Create Car" />
      </View>
    )
  }
  _getRandomKey() {
    return (
      Math.floor(new Date()) + Math.floor(Math.random() * 10000000).toString()
    )
  }
}
