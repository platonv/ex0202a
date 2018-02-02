import React from 'react'
import { StackNavigator } from 'react-navigation'
import { TabNavigator } from 'react-navigation'

import ClientScreen from '../screens/ClientScreen'
import TheaterScreen from '../screens/TheaterScreen'
import AdminScreen from '../screens/AdminScreen'
import ReservedSeatsScreen from '../screens/ReservedSeatsScreen'

export const Router = TabNavigator({
  ClientScreenNavigator: {
    screen: StackNavigator({
      ClientScreen: {
        screen: ClientScreen,
        navigationOptions: {
          title: 'Seats',
        },
      },
      ReservedSeatsScreen: {
        screen: ReservedSeatsScreen,
        navigationOptions: {
          title: 'Reserved Seats',
        },
      },
    }),
  },
  TheaterScreenNavigator: {
    screen: StackNavigator({
      TheaterScreen: {
        screen: TheaterScreen,
        navigationOptions: {
          title: 'Theater',
        },
      },
    }),
  },
  AdminScreenNavigator: {
    screen: StackNavigator({
      AdminScreen: {
        screen: AdminScreen,
        navigationOptions: {
          title: 'Admin',
        },
      },
    }),
  },
})
