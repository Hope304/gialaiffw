import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ListFireLevel from '../screens/ListFireLevel';
import CommuneListFireLevel from '../screens/CommuneListFireLevel';
import Contributor from '../screens/Contributor';
import MapScreen from '../screens/Map';
import ListFirePoint from '../screens/ListFirePoint';
import DetailInfoCommune from '../screens/DetailInfoCommune';
import DetailFirePoint from '../screens/DetailFirePoint';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const dataNavigator = [
    {name: 'Home', component: HomeScreen},
    {name: 'ListFireLevel', component: ListFireLevel},
    {name: 'CommuneListFireLevel', component: CommuneListFireLevel},
    {name: 'DetailFirePoint', component: DetailFirePoint},
    {name: 'DetailInfoCommune', component: DetailInfoCommune},
    {name: 'Contributor', component: Contributor},
    {name: 'MapScreen', component: MapScreen},
    {name: 'ListFirePoint', component: ListFirePoint},
  ];

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Home'}
        screenOptions={{headerShown: false}}>
        {dataNavigator.map(item => {
          return (
            <Stack.Screen
              key={item.name}
              name={item.name}
              component={item.component}
            />
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
