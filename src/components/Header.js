import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
import Dimension from '../contants/Dimension';
import Colors from '../contants/Colors';
import { fontDefault, imgDefault } from '../contants/Variable';


const Header = ({ title, navigation }) => {


  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Dimension.setHeight(1.6),
        paddingHorizontal: Dimension.setWidth(2),
        backgroundColor: 'rgba(152,200,251,0.4)',
        marginHorizontal: Dimension.setHeight(1.4),
        borderRadius: 20,
        marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
        height: Dimension.setHeight(7),
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={Images.back}
          style={{ width: 23, height: 23, ...imgDefault }}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '75%',
        }}>
        <Text
          style={{
            fontFamily: Fonts.RB_BOLD,
            fontSize: Dimension.fontSize(18),
            ...fontDefault,
          }}>
          {title}
        </Text>
      </View>
      <View style={{ width: 6 }} />
    </View>
  );
};

export default Header;
