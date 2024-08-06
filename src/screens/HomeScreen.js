import {ImageBackground, ScrollView, Text, View} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const defaultW = wp('100%');
const defaultH = hp('22%');
const HomeScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      <ImageBackground
        resizeMode="contain"
        source={require('../assets/images/background.png')}
        style={{width: defaultW, height: '100%'}}>
        <Text>Home</Text>
      </ImageBackground>
      {/* <ScrollView></ScrollView> */}
    </View>
  );
};

export default HomeScreen;
