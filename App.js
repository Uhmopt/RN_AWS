/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {StatusBar, Alert} from 'react-native';

import {withAuthenticator} from 'aws-amplify-react-native';
import {YellowBox} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import AppNavigator from '@AppNavigators';
import createStore from '@AppRedux/createStore';
import {stylesheetConfig, axiosConfig} from '@AppConfig';
import {navigationService} from '@AppServices';
import axios from 'axios';
import appConfig from './app.json';
import reactotron from 'reactotron-react-native';

const {store, persistor} = createStore();
axiosConfig({});
stylesheetConfig();

console.disableYellowBox = true;

axios.interceptors.response.use(function (response) {
  console.log('App response', response);
  return response;
});
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senderId: appConfig.senderID,
    };
  }

  onRegister = (token) => {
    console.log(token);
    Alert.alert('Registered !', JSON.stringify(token));
    reactotron.log(token);
  };

  onNotification = (notif) => {
    reactotron.log(notif);
    Alert.alert(notif.title, notif.message);
  };

  setNavigatorRef = (navigatorRef) => {
    navigationService.setTopLevelNavigator(navigatorRef);
  };

  render() {
    YellowBox.ignoreWarnings([
      'Warning: Async Storage has been extracted from react-native core',
    ]);
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <StatusBar barStyle="light-content" />
          <AppNavigator uriPrefix="xsport://" ref={this.setNavigatorRef} />
        </PersistGate>
      </Provider>
    );
  }
}

const signUpConfig = {
  header: 'Create new Account!',
  hideAllDefaults: true,
  defaultCountryCode: '1',
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string',
    },
    {
      label: 'User name',
      key: 'username',
      required: true,
      displayOrder: 2,
      type: 'string',
    },
    {
      label: 'First Name',
      key: 'custom:firstname',
      required: true,
      displayOrder: 3,
      type: 'string',
    },
    {
      label: 'Last Name',
      key: 'custom:lastname',
      required: true,
      displayOrder: 4,
      type: 'string',
    },
    {
      label: 'Phone number',
      key: 'phone_number',
      required: false,
      displayOrder: 5,
      type: 'string',
    },
    {
      label: 'Location',
      key: 'custom:location',
      required: false,
      displayOrder: 6,
      type: 'string',
    },
    {
      label: 'Country',
      key: 'custom:country',
      required: false,
      displayOrder: 7,
      type: 'string',
    },
    {
      label: 'City',
      key: 'custom:city',
      required: false,
      displayOrder: 8,
      type: 'string',
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 9,
      type: 'password',
    },
  ],
};

export default withAuthenticator(App, {
  signUpConfig,
  includeGreetings: true,
});
