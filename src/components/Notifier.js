import {Notifier, Easing} from 'react-native-notifier';
import React from 'react';
import {View, StyleSheet, Image, Text, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {rowAlignCenter} from '../contants/CssFE';
import Colors from '../contants/Colors';
import Fonts from '../contants/Fonts';

const stateColor = {
  warning: '#ffa454',
  success: '#4cef48',
  error: '#ff5733',
};

const NotifierCustom = props => {
  const {title, description, img, state} = props;
  const {top} = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {paddingTop: top * 1.2, backgroundColor: stateColor[state]},
      ]}>
      <Image source={img} style={{width: 45, height: 45, marginRight: 6}} />
      <View style={{flex: 1}}>
        <Text style={styles.headerText}>{title}</Text>
        <Text style={styles.bodyText}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orange',
    ...rowAlignCenter,
    paddingHorizontal: 12,
  },

  headerText: {
    color: Colors.WHITE,
    fontFamily: Fonts.SF_SEMIBOLD,
    fontSize: 17,
  },

  bodyText: {
    color: Colors.WHITE,
    fontFamily: Fonts.SF_REGULAR,
    fontSize: 15,
    marginVertical: Platform.OS === 'ios' ? 6 : 0,
  },
});

const closeNotifier = () => {
  Notifier.clearQueue(true);
};

const warningNotifier = ({title, description, img, state}, duration) => {
  Notifier.showNotification({
    duration: duration || 0,
    showAnimationDuration: 666,
    showEasing: Easing.ease,
    Component: () => (
      <NotifierCustom
        title={title}
        description={description}
        img={img}
        state={state}
      />
    ),
    hideOnPress: true,
  });
};

export {closeNotifier, warningNotifier};
