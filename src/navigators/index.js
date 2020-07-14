import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {
  SplashScreen,
  MainScreen,
  EditScreen,
  ViewScreen,
  FilterScreen,
  ExportScreen,
  CategoryScreen,
  ProfileScreen,
} from '@AppContainers';

const MainStackNavigator = createStackNavigator(
  {
    MainScreen: MainScreen,
    ViewScreen: ViewScreen,
    EditScreen: EditScreen,
    FilterScreen: FilterScreen,
    ExportScreen: {screen: ExportScreen},
    CategoryScreen: CategoryScreen,
    ProfileScreen: ProfileScreen,
  },
  {
    headerMode: 'screen',
    initialRouteName: 'MainScreen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f9f9f9',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    },
  },
);

export default createAppContainer(
  createSwitchNavigator({
    Splash: {screen: SplashScreen},
    Main: {screen: MainStackNavigator, path: ''},
  }),
);
