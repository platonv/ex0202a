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

export default class TheaterScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      seats: [],
      boughtSeats: [],
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
    RequestService.get('/all')
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

  confirmSeat = seat => {
    const seats = this.state.seats
    seats.find(s => s.id === seat.id).status = 'confirmed'
    this.setState({ seats })
    this.toggleIndicator()
    RequestService.post('/confirm', { id: seat.id })
      .then(res => {
        this.toggleIndicator()
        cacheService.save(res)
        const seats = this.state.seats
        seats.find(s => s.id === seat.id).status = res.status
        this.setState({ seats })
      })
      .catch(err => {
        this.toggleIndicator()
      })
  }

  toggleIndicator = () => {
    this.setState(() => {
      return {
        indicatorVisible: !this.state.loadingSeats,
      }
    })
  }

  cleanAll = () => {
    this.toggleIndicator()
    RequestService.delete('/clean')
      .then(res => {})
      .catch(err => {
        this.toggleIndicator()
        this.setState({
          seats: this.state.seats.map(s => {
            let obj = Object.assign({}, el)
            obj.status = 'available'
            return obj
          }),
        })
      })
  }

  render() {
    if (this.state.isOnline) {
      return (
        <View>
          <Button onPress={this.cleanAll} title="Clean all" />
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
                  disabled={item.status !== 'reserved'}
                  onPress={() => {
                    this.confirmSeat(item)
                  }}
                  title="Confirm"
                />
                <Text />
              </View>
            )}
            keyExtractor={item => {
              item.id
            }}
          />
          <Text />
        </View>
      )
    } else {
      return <Text>You are offline</Text>
    }
  }
}
