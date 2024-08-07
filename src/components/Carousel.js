import React from "react";
import { View } from "native-base";
import { useCallback, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet } from "react-native";
import Carousel from 'react-native-snap-carousel';
import FastImage from "react-native-fast-image";

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
const DOT_SIZE = 8;

const Pagination = React.memo(({ dotsLength, activeDotIndex }) => (
  <View style={styles.paginationContainer}>
    {Array.from({ length: dotsLength }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.dotStyle,
          index === activeDotIndex && {
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
          },
        ]}
      />
    ))}
  </View>
));
const Slide = ({ data, stylesContain }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isCarousel = useRef(null);
  const renderItem = useCallback(
    ({ item }) => (
      <View shadow={5} borderRadius={20} overflow="hidden" marginBottom={4} >
        <FastImage
          source={item}
          style={{ width: '100%', height: 200 }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    ),
    [],
  );
  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  return (
    <View style={[stylesContain, styles.container]}>
      <Carousel
        ref={isCarousel}
        data={data}
        renderItem={renderItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={index => handleSnapToItem(index)}
        autoplay
        loop
        pagingEnabled
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeIndex}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  paginationContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dotStyle: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});

export default Slide;