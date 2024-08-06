import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const dataNavigator = [{name: 'Home', component: HomeScreen}];

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Home'}>
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