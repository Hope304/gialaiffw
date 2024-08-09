import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { RoundBtn } from '../components/AllBtn';
import Images from '../contants/Images';
import Colors from '../contants/Colors';

const DeleteAnimation = ({ toggleVal, event }) => {
  const btnAnimationStyle = useAnimatedStyle(() => {
    const bottom = interpolate(
      toggleVal.value,
      [false, true],
      [-44, 44],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      toggleVal.value,
      [false, true],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: withSpring(opacity, { duration: 357 }),
      bottom: withTiming(bottom, { duration: 246 }),
    };
  });

  return (
    <Animated.View style={[styles.btnContainer, btnAnimationStyle]}>
      <RoundBtn
        icon={Images.remove}
        event={event}
        iconSize={36}
        iconColor={Colors.SECONDARY_RED}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 40,
    paddingHorizontal: 30,
    paddingVertical: 6,
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default DeleteAnimation;
