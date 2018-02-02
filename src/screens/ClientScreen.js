import React from 'react'
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
  NetInfo,
} from 'react-native'
import { ListItem, Button, Touchable } from 'react-native-elements'

import RequestService from '../services/requestService'
import cacheService from '../services/cacheService'

export default class ClientScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      seats: [],
      reservedSeats: [],

      loadingSeats: false,
      isOnline: false,
    }
  }

  componentDidMount() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      this.setState({ isOnline: connectionInfo.type !== 'none' })
    })
    NetInfo.addEventListener('connectionChange', connectionInfo => {
      this.setState({ isOnline: connectionInfo.type !== 'none' })
    })
    this.toggleIndicator()
    this.refresh()
  }

  refresh = () => {
    RequestService.get('/seats')
      .then(res => {
        this.toggleIndicator()

        let seats = res.map(el => {
          let obj = Object.assign({}, el)
          obj.key = el.id
          return obj
        })

        this.setState(() => {
          return {
            seats: [...seats],
          }
        })
      })
      .catch(err => {
        this.toggleIndicator()
      })
  }

  gotoReservedSeats = () => {
    this.props.navigation.navigate('ReservedSeatsScreen')
  }

  reserveSeat = seat => {
    const seats = this.state.seats
    seats.find(s => s.id === seat.id).status = 'reserved'
    this.setState({ seats })
    RequestService.post('/reserve', { id: seat.id })
      .then(res => {
        this.toggleIndicator()
        cacheService.save(res)
      })
      .catch(err => {
        this.toggleIndicator()
      })
  }

  toggleIndicator = () => {
    this.setState(() => {
      return {
        loadingSeats: !this.state.loadingSeats,
      }
    })
  }

  render() {
    if (this.state.isOnline) {
      return (
        <View>
          <Button onPress={this.gotoReservedSeats} title="My Reserved Seats" />
          {/* <Button onPress={this.de} title="My Reserved Seats" /> */}
          <Text />
          <ActivityIndicator
            size="small"
            color="#00ff00"
            animating={this.state.loadingSeats}
          />
          <FlatList
            data={this.state.seats}
            extraData={this.state}
            renderItem={({ item, index }) => (
              <View>
                <Text>Name: {item.name}</Text>
                <Text>Type: {item.type}</Text>
                <Text>Status: {item.status}</Text>
                <Button
                  disabled={item.status !== 'available'}
                  onPress={() => {
                    this.reserveSeat(item)
                  }}
                  title="Reserve"
                />
                <Button
                  disabled={item.status !== 'reserved'}
                  onPress={() => {
                    this.reserveSeat(item)
                  }}
                  title="Refresh"
                />
                <Text />
              </View>
            )}
            keyExtractor={item => {
              item.id
            }}
          />
        </View>
      )
    } else {
      return (
        <View>
          <Text>You are offline</Text>
          <Button onPress={this.refresh} title="Refresh" />
        </View>
      )
    }
  }
}
