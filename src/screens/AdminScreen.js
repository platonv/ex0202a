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

export default class AdminScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      seats: [],
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
  }

  getConfirmed = () => {
    RequestService.get('/confirmed')
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

  getPurchased = () => {
    RequestService.get('/taken')
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

  toggleIndicator = () => {
    this.setState(() => {
      return {
        indicatorVisible: !this.state.loadingSeats,
      }
    })
  }

  zapAll = () => {
    this.toggleIndicator()
    RequestService.delete('/zap')
      .then(res => {
        this.toggleIndicator()
        this.setState({ seats: [] })
      })
      .catch(err => {
        this.toggleIndicator()
      })
  }

  render() {
    if (this.state.isOnline) {
      return (
        <View>
          <Button onPress={this.getConfirmed} title="List confirmed" />
          <Button onPress={this.getPurchased} title="List purchased" />
          <Button onPress={this.zapAll} title="Delete all" />
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
      return <Text>You are offline</Text>
    }
  }
}
