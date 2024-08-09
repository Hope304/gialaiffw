import React, {cloneElement} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const space = 12;
const position = {
  top: 'column-reverse',
  bottom: 'column',
  right: 'row',
  left: 'row-reverse',
};

const StaggerCustom = ({mainIcon, iconData, mb, placement}) => {
  const toggleVal = useSharedValue(false);
  const handleToggleStagger = () => {
    toggleVal.value = !toggleVal.value;
  };

  const RenderIcon = ({item, index}) => {
    const iconAnimated = useAnimatedStyle(() => {
      const scale = interpolate(
        toggleVal.value,
        [false, true],
        [0, 1],
        Extrapolation.CLAMP,
      );

      const opacity = interpolate(
        toggleVal.value,
        [false, true],
        [0, 1],
        Extrapolation.CLAMP,
      );

      return {
        transform: [{scale: withSpring(scale, {duration: (index + 1) * 222})}],
        opacity: withSpring(opacity, {duration: index * 666}),
      };
    });

    const func = cloneElement(item).props.event;

    return (
      <Animated.View
        style={[
          iconAnimated,
          styles.itemContainer,
          {
            marginLeft: placement == 'right' ? space : 0,
            marginRight: placement == 'left' ? space : 0,
            marginBottom: placement == 'top' ? space : 0,
            marginTop: placement == 'bottom' ? space : 0,
          },
        ]}>
        {cloneElement(item, {event: () => func(index)})}
      </Animated.View>
    );
  };

  return (
    <View
      style={[
        styles.btnContainer,
        {marginBottom: mb || 0, flexDirection: position[placement]},
      ]}>
      {cloneElement(mainIcon, {event: handleToggleStagger})}
      <FlatList
        contentContainerStyle={[
          styles.flatlistContainer,
          {flexDirection: position[placement]},
        ]}
        data={iconData}
        renderItem={({item, index}) => <RenderIcon item={item} index={index} />}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    alignItems: 'center',
  },

  flatlistContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
});

export default StaggerCustom;
