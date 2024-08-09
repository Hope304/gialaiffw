import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { shadowIOS } from '../contants/propsIOS';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Colors from '../contants/Colors';
import Images from '../contants/Images';
import Fonts from '../contants/Fonts';
export const RoundBtn = ({
  event,
  icon,
  iconSize,
  iconColor,
  btnColor,
  mLeft,
  mRight,
  mTop,
  mBottom,
  pd,
  rotateZ,
  disabled,
  bdRadius,
  w,
  bdW,
  bdCl,
  shadow = true,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled || false}
      onPress={event}
      style={[
        styles.roundContainer,
        {
          backgroundColor: btnColor || 'transparent',
          marginLeft: mLeft || 0,
          marginRight: mRight || 0,
          marginTop: mTop || 0,
          marginBottom: mBottom || 0,
          padding: pd || 0,
          transform: [{ rotateZ: rotateZ || '0deg' }],
          width: w || 'auto',
          borderWidth: bdW || 0,
          borderColor: bdCl || 'transparent',
          borderRadius: bdRadius || 0,
        },
        shadow && { ...StyleSheet.flatten(styles.shadow) },
      ]}>
      <Image
        source={icon}
        style={{
          width: iconSize || 22,
          height: iconSize || 22,

          tintColor: iconColor,
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export const TextBtn = ({
  event,
  text,
  textSize,
  textFont,
  textColor,
  btnColor,
  mLeft,
  mRight,
  mTop,
  mBottom,
  bdRadius,
  w,
  pd,
  disabled,
  bdW,
  bdCl,
  fw,
  als,
  shadow = true,
}) => {
  return (
    <TouchableOpacity
      onPress={event}
      disabled={disabled || false}
      style={[
        styles.roundContainer,
        {
          backgroundColor: btnColor || 'transparent',
          borderRadius: bdRadius || 12,
          marginLeft: mLeft || 0,
          marginRight: mRight || 0,
          marginTop: mTop || 0,
          marginBottom: mBottom || 0,
          width: w || 'auto',
          padding: pd || 0,
          borderWidth: bdW || 0,
          borderColor: bdCl || 'transparent',
          alignSelf: als || 'auto',
        },
        shadow && { ...StyleSheet.flatten(styles.shadow) },
      ]}>
      <Text
        style={{
          fontSize: textSize || wp('3.6%'),
          fontFamily: textFont || Fonts.RB_MEDIUM,
          color: textColor || Colors.WHITE,
          fontWeight: fw || 'normal',
        }}>
        {text || ''}
      </Text>
    </TouchableOpacity>
  );
};
export const BackBtn2 = ({
  event,
  iconColor,
  iconSize,
  mLeft,
  mRight,
  mTop,
  mBottom,
  pd,
  w,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={event}
      style={[
        styles.roundContainer,
        {
          backgroundColor: iconColor || Colors.DEFAULT_GREEN,
          marginLeft: mLeft || 0,
          marginRight: mRight || 0,
          marginTop: mTop || 0,
          marginBottom: mBottom || 0,
          padding: pd || 10,
          width: w || 'auto',
          height: w || 'auto',
          borderRadius: 50,
        },
      ]}>
      <Image
        source={icon ? icon : Images.back}
        style={{
          width: iconSize || 24,
          height: iconSize || 24,
          tintColor: '#ffffff',
        }}
      />
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  roundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    elevation: 4,
    shadowColor: '#171717',
    ...shadowIOS,
  },
});
