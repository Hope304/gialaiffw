import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ListFireLevel from '../screens/ListFireLevel';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const dataNavigator = [
    {name: 'Home', component: HomeScreen},
    {name: 'ListFireLevel', component: ListFireLevel},
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
