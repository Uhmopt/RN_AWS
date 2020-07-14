/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {SideMenu, Input, Button, PickLocation, HeaderBar} from '@AppComponents';
import {Images, Icons, Colors} from '@AppTheme';
import ImagePicker from 'react-native-image-crop-picker';
import {Avatar} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {NavigationActions} from 'react-navigation';
import reactotron from 'reactotron-react-native';
import styles from './styles';
import {authActions} from '@AppRedux/actions';
import {connect} from 'react-redux';
import {Auth} from 'aws-amplify';
import {Notification} from "react-native-in-app-message";

export class ProfileScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Profile',
      headerRight: (
        <TouchableOpacity
          activityOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={{paddingRight: 20}}>
          <Image source={Icons.goarrow} />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity
          activityOpacity={0.8}
          onPress={() => {}}
          style={{paddingLeft: 20}}>
          <Text style={{color: '#02d0e3', fontSize: 16}}>Edit</Text>
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      imageSource: null,
      location: props.user.user.city + ' ,' + props.user.user.country,
      username: props.user.user.username,
      firstName: props.user.user.firstname,
      lastName: props.user.user.lastname,
      email: props.user.user.email,
      phone_number: props.user.user.phone_number,
      country: props.user.user.country,
      city: props.user.user.city,
      oldpassword: '',
      newpassword: '',
    };
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    this.getUsersProfile();
  }

  getUsersProfile = async () => {
    const {loading} = this.props;
    if (loading) {
      return;
    }
    const user = await Auth.currentAuthenticatedUser();
    this.setState({
      username: user.username,
      firstName: user.attributes['custom:firstname'],
      lastName: user.attributes['custom:lastname'],
      email: user.attributes.email,
      phone_number: user.attributes.phone_number,
      location: user.attributes['custom:location'],
      country: user.attributes['custom:country'],
      city: user.attributes['custom:city'],
    });
  };

  goBack = () => {
    this.props.navigation.dispatch(NavigationActions.back());
  };
  onOldPasswordChange = (value) => {
    this.setState({oldpassword: value});
  };
  onNewPasswordChange = (value) => {
    this.setState({newpassword: value});
  };
  onPhoneChange = (value) => {
    this.setState({phone_number: value});
  };
  onUsernameChange = (value) => {
    this.setState({username: value});
  };

  onFirstNameChange = (value) => {
    console.log(value);
    this.setState({firstName: value});
  };

  onLastNameChange = (value) => {
    this.setState({lastName: value});
  };
  handleSubmit = async () => {
    const {loading, dispatch} = this.props;
    if (loading) {
      return;
    }
    const {
      firstName,
      lastName,
      country,
      city,
      location,
      phone_number,
    } = this.state;
    const user = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(user, {
      'custom:firstname': firstName,
      'custom:lastname': lastName,
      'custom:location': location,
      'custom:country': country,
      'custom:city': city,
      phone_number: phone_number,
    });
    Notification.show();
    console.log(user);
  };
  PasswordSubmit = async () => {
    const {oldpassword, newpassword} = this.state;
    await Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(user, oldpassword, newpassword);
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
    Notification.show();
  };
  usernameTaken = () => {
    // use as error check before api integration
    const {username} = this.state;
    return username && username.length < 7;
  };

  pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then((image) => {
        reactotron.log(image.sourceURL);
        this.setState({imageSource: image});
      })
      .catch((err) => {
        reactotron.log(err);
      });
  };

  getAvatar = () => {
    const {imageSource} = this.state;
    if (imageSource) {
      // return { uri: imageSource.sourceURL };
      return {uri: `data:${imageSource.mime};base64,${imageSource.data}`};
    } else {
      return Images.user;
    }
  };

  getLocation = (location) => {
    let datas = location.split(',');
    let country = datas.pop().trim();
    let city = datas.join(',').trim();

    this.setState({location, city, country});
  };

  getLocationText() {
    const {location} = this.state;
    const locText = typeof location === 'string' ? location : '';
    if (locText.length > 20) {
      return locText.slice(0, 19) + '...';
    }
    return locText;
  }

  render() {
    const title = 'Profile';
    const usernameTaken = this.usernameTaken();

    const {firstName, lastName, email, phone_number, username} = this.state;
    const {error} = this.props;

    return (
      <SafeAreaView style={styles.container}>
        {/* <HeaderBar
          // {...headerProps}
          onMenuPress={this.onOpen}
          menuIcon={this.state.isOpen ? Icons.arrowRight : Icons.menu}
        /> */}
        {/* <SideMenu title={title}> */}
        <ScrollView style={styles.content}>
          <View style={styles.avatarContainer}>
            <Avatar
              source={this.getAvatar()}
              rounded
              size="large"
              onPress={this.pickImage}
              size={hp('35%') - 120}
              containerStyle={styles.avatar}
            />
            <Image source={Icons.userEdit} style={styles.avatarIcon} />
          </View>

          <View style={styles.inputContainer}>
            <View style={{marginLeft: 20, marginRight: 20, marginBottom: 20}}>
              <View style={{flex: 1, marginBottom: 10}}>
                <Text
                  style={{
                    color: '#98989b',
                    marginBottom: 1,
                    marginTop: 20,
                  }}>
                  First Name
                </Text>
                <Input
                  style={{
                    border: 0,
                    paddingLeft: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginBottom: 0,
                    height: 30,
                    borderColor: '#f7f7f7',
                  }}
                  placeholder="First Name"
                  onChangeText={this.onFirstNameChange}
                  value={firstName}
                />
              </View>
              <View style={styles.line} />
              <View style={{flex: 1, marginBottom: 10}}>
                <Text
                  style={{
                    color: '#98989b',
                    marginBottom: 1,
                    marginTop: 10,
                  }}>
                  Surname
                </Text>
                <Input
                  style={{
                    border: 0,
                    paddingLeft: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginBottom: 0,
                    height: 30,
                    borderColor: '#f7f7f7',
                  }}
                  placeholder="last Namer"
                  onChangeText={this.onLastNameChange}
                  value={lastName}
                />
              </View>
              <View style={styles.line} />
              <View style={{flex: 1, marginBottom: 10}}>
                <Text
                  style={{
                    color: '#98989b',
                    marginBottom: 1,
                    marginTop: 10,
                  }}>
                  User Mame
                </Text>
                <Text style={{color: '#000', fontSize: 14, marginTop: 5}}>
                  {username}
                </Text>
              </View>
              <View style={styles.line} />
              <View style={{flex: 1, marginBottom: 10}}>
                <Text
                  style={{
                    color: '#98989b',
                    marginBottom: 1,
                    marginTop: 10,
                  }}>
                  Email
                </Text>
                <Text style={{color: '#000', fontSize: 14, marginTop: 5}}>
                  {email}
                </Text>
              </View>
              <View style={styles.line} />
              <View style={{flex: 1, marginBottom: 10}}>
                <Text
                  style={{
                    color: '#98989b',
                    marginBottom: 1,
                    marginTop: 10,
                  }}>
                  Phone Number
                </Text>
                <Input
                  style={{
                    border: 0,
                    paddingLeft: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginBottom: 0,
                    height: 30,
                    borderColor: '#f7f7f7',
                  }}
                  placeholder="Phone Number"
                  onChangeText={this.onPhoneChange}
                  value={phone_number}
                />
              </View>
              <View style={styles.line} />
              <View
                style={{
                  marginTop: 50,
                  marginBottom: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#808080'}} onPress={this.openTerms}>
                  Privacy Policy | Terms & Conditions
                </Text>
              </View>

              <TouchableOpacity
                activityOpacity={0.8}
                // style={styles.userBoard}
                onPress={() => {}}>
                <View style={{flex: 1, height: 40}}>
                  <Text
                    style={{
                      color: '#000',
                      marginBottom: 1,
                      marginTop: 10,
                    }}>
                    Help & Support
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.line} />
              {error && <Text style={styles.error}>{error}</Text>}
              <Button
                title="Update"
                style={{...styles.button, width: 200}}
                textStyle={styles.buttonText}
                onPress={this.handleSubmit}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={{marginLeft: 20, marginRight: 20, marginBottom: 20}}>
              <View style={{flex: 1, marginBottom: 0}}>
                <Text
                  style={{
                    color: '#98989b',
                    marginBottom: 1,
                    marginTop: 10,
                  }}>
                  Current Password
                </Text>
                <Input
                  style={{
                    border: 0,
                    paddingLeft: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginBottom: 0,
                    height: 30,
                    borderColor: '#f7f7f7',
                  }}
                  placeholder="Old Password"
                  secureTextEntry
                  onChangeText={this.onOldPasswordChange}
                  textContentType="password"
                />
              </View>
              <View style={styles.line} />
              <View style={{flex: 1, marginBottom: 0}}>
                <Text
                  style={{
                    color: '#98989b',
                    marginBottom: 1,
                    marginTop: 10,
                  }}>
                  New Password
                </Text>
                <Input
                  style={{
                    border: 0,
                    paddingLeft: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginBottom: 0,
                    height: 30,
                    borderColor: '#f7f7f7',
                  }}
                  placeholder="New Password"
                  secureTextEntry
                  onChangeText={this.onNewPasswordChange}
                  textContentType="password"
                />
              </View>
              <View style={styles.line} />
              <Button
                title="Change Password"
                style={{...styles.button, width: 200}}
                textStyle={styles.buttonText}
                onPress={this.PasswordSubmit}
              />
            </View>
          </View>
        </ScrollView>
        {/* </SideMenu> */}
        <PickLocation
          ref={(ref) => (this.locRef = ref)}
          getLocation={this.getLocation}
        />
        {this.props.loading && (
          <View style={styles.overlay}>
            <ActivityIndicator />
          </View>
        )}
        <Notification text={'Update Success'} onPress={Notification.hide} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({auth}) => ({
  loading: auth.loading,
  error: auth.updateProfileError,
  // user: auth.user
  user: {
    user: {
      location: 'Australia',
      username: 'Dimce',
      firstName: 'John',
      lastName: 'Mic',
      email: 'lisovetskyi.b.v@gmail.com',
      phone_number: '+384521354',
      country: 'Australia',
      city: 'Australia',
    },
  },
});

export default connect(mapStateToProps)(ProfileScreen);
