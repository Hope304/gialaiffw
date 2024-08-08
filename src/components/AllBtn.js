import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { shadowIOS } from "../contans/propsIOS";


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
  shadow,
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


const styles = StyleSheet.create({
  roundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#171717',
    ...shadowIOS,
  },
});