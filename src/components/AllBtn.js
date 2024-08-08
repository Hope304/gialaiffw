import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {shadowIOS} from '../contans/propsIOS';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
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
          transform: [{rotateZ: rotateZ || '0deg'}],
          width: w || 'auto',
          borderWidth: bdW || 0,
          borderColor: bdCl || 'transparent',
          borderRadius: bdRadius || 0,
        },
        shadow && {...StyleSheet.flatten(styles.shadow)},
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
        shadow && {...StyleSheet.flatten(styles.shadow)},
      ]}>
      <Text
        style={{
          fontSize: textSize || wp('3.6%'),
          // fontFamily: textFont || Fonts.SF_MEDIUM,
          color: textColor || Colors.WHITE,
          fontWeight: fw || 'normal',
        }}>
        {text || ''}
      </Text>
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
