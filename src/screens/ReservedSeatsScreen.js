import React from 'react'
import { Text, View, Button, FlatList, NetInfo } from 'react-native'
import { ListItem } from 'react-native-elements'

import RequestService from '../services/requestService'
import cacheService from '../services/cacheService'

export default class ReservedSeatsScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      seats: [],
      isOnline: false,
    }
  }
  componentWillMount() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      this.setState({ isOnline: connectionInfo.type !== 'none' })
    })
    NetInfo.addEventListener('connectionChange', connectionInfo => {
      this.setState({ isOnline: connectionInfo.type !== 'none' })
    })
    this.setState({
      seats: cacheService.findAll(),
    })
    console.log(this.state)
  }

  refreshSeat(seat) {
    RequestService.get('/refresh/' + seat.id)
      .then(res => {
        cacheService.update(res, () => {
          seat.status = res.status
        })
        this.setState({
          seats: cacheService.findAll(),
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  buySeat(seat) {
    RequestService.post('/buy', { id: seat.id })
      .then(res => {
        cacheService.update(res, () => {
          seat.status = res.status
        })
        this.setState({
          seats: cacheService.findAll(),
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  clearAll = () => {
    cacheService.deleteAll()
    this.setState({ seats: [] })
  }

  render() {
    return (
      <View>
        <Button onPress={this.clearAll} title="Clear" />
        <FlatList
          data={this.state.seats}
          extraData={this.state}
          renderItem={({ item }) => (
            <View>
              <Text>Name: {item.name}</Text>
              <Text>Type: {item.type}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Reserved at: {item.createdAt.toString()}</Text>
              <Button
                disabled={item.status !== 'reserved' || !this.state.isOnline}
                onPress={() => {
                  this.refreshSeat(item)
                }}
                title="Refresh"
              />
              <Button
                disabled={item.status !== 'confirmed' || !this.state.isOnline}
                onPress={() => {
                  this.buySeat(item)
                }}
                title="Buy"
              />
            </View>
          )}
        />
      </View>
    )
  }
}
