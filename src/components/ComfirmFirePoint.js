import React, {useMemo, forwardRef, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Checkbox, Text} from 'native-base';
import {RoundBtn} from './AllBtn';
import Colors from '../contants/Colors';
import {rowAlignCenter} from '../contants/CssFE';

const height = Platform.OS === 'ios' ? '28%' : '33%';

const ComfirmFirePoint = forwardRef((props, ref) => {
  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      bottomInset={9}
      detached={true}
      style={styles.sheetContainer}
      handleComponent={null}>
      <View style={styles.contentContainer}>
        <View
          style={[
            rowAlignCenter,
            {
              justifyContent: 'space-between',
              width: '90%',
              alignSelf: 'center',
            },
          ]}>
          <View style={{width: 14}} />
          <Text style={styles.heading}>Thiết lập bản đồ</Text>
          <RoundBtn
            icon={require('../assets/images/close.png')}
            iconSize={14}
            iconColor={'red'}
            event={handleClose}
          />
        </View>
      </View>
    </BottomSheet>
  );
});

export default ComfirmFirePoint;
