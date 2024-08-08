import React, { useMemo, forwardRef, useState, useCallback } from 'react';
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
import { Checkbox, Text, } from 'native-base';
import { RoundBtn } from './AllBtn';
import Colors from '../contans/Colors';
import { rowAlignCenter } from '../contans/CssFE';

const height = Platform.OS === 'ios' ? '28%' : '33%';

const MapSetting = forwardRef((props, ref) => {
  const {
    data,
    objectDraw,
    objectPhoto,
    objectFile,
    objectWMS,
    onClose,
    onPickMapBase,
    onChangeMapStatus,
  } = props;
  const snapPoints = useMemo(() => [height], []);
  const [idxPicker, setIdxPicker] = useState(0);

  const handleClose = () => {
    ref.current?.close();

    onClose();
  };

  const renderMap = useCallback(
    ({ item, index }) => {
      return (
        <Pressable
          style={styles.mapBtnContainer}
          onPress={() => {
            setIdxPicker(index);
            onPickMapBase(item);
          }}>
          <View
            style={[
              styles.imgContainer,
              {
                borderColor:
                  idxPicker === index ? Colors.DEFAULT_GREEN : 'transparent',
              },
            ]}>
            <Image
              source={item.img}
              style={{
                width: 50,
                height: 50,
                borderRadius: 6,
              }}
            />
          </View>

          <Text style={styles.mapTitle}>{item.title}</Text>
        </Pressable>
      );
    },
    [idxPicker],
  );

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
          <View style={{ width: 14 }} />
          <Text style={styles.heading}>Thiết lập bản đồ</Text>
          <RoundBtn
            icon={require('../assets/images/close.png')}
            iconSize={14}
            iconColor={'red'}
            event={handleClose}
          />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Hiển thị</Text>
        </View>

        <View style={styles.contentObj}>
          <View style={styles.objContainer}>
            <Checkbox
              isChecked={objectDraw}
              colorScheme="blue"
              flexDirection={'row'}
              alignItems={'center'}
              borderWidth={1}
              borderRadius={4}
              p={1}
              onChange={e => {
                onChangeMapStatus(e, 0);
              }}>
              <Text style={styles.textObj}>Đối tượng khoanh vẽ</Text>
            </Checkbox>
          </View>
        </View>
        <View style={styles.contentObj}>
          <View style={styles.objContainer}>
            <Checkbox
              isChecked={objectFile}
              colorScheme="blue"
              flexDirection={'row'}
              alignItems={'center'}
              borderWidth={1}
              borderRadius={4}
              p={1}
              onChange={e => {
                onChangeMapStatus(e, 1);
              }}>
              <Text style={styles.textObj}>File bản đồ</Text>
            </Checkbox>
          </View>
          <View style={styles.objContainer}>
            <Checkbox
              isChecked={objectWMS}
              colorScheme="blue"
              flexDirection={'row'}
              alignItems={'center'}
              borderWidth={1}
              borderRadius={4}
              p={1}
              onChange={e => {
                onChangeMapStatus(e, 2);
              }}>
              <Text style={styles.textObj}>Bản đồ trực tuyến</Text>
            </Checkbox>
          </View>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Bản đồ nền</Text>
        </View>

        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderMap}
          contentContainerStyle={styles.flatlistBaseMap}
        />
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: hp('1%'),
  },

  sheetContainer: {
    marginHorizontal: 22,
    position: 'absolute',
    zIndex: 99,
  },

  heading: {
    // fontFamily: Fonts.SF_SEMIBOLD,
    fontSize: wp('4.4%'),
    color: Colors.GOOGLE_BLUE,
  },

  headerContainer: {
    marginLeft: 8,
    marginTop: 10,
  },

  headerText: {
    // fontFamily: Fonts.SF_MEDIUM,
    fontSize: wp('3.9%'),
    color: Colors.DEFAULT_GREEN,
  },

  contentObj: {
    ...rowAlignCenter,
    width: '100%',
    marginTop: hp('0.6%'),
  },

  objContainer: {
    width: '50%',
    paddingLeft: 16,
  },

  textObj: {
    // fontFamily: Fonts.SF_REGULAR,s
    fontSize: wp('3.6%'),
  },

  flatlistBaseMap: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
  },

  mapBtnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  imgContainer: {
    padding: 1,
    borderWidth: 1.6,
    borderRadius: 6,
  },

  mapTitle: {
    // fontFamily: Fonts.SF_REGULAR,
    fontSize: wp('3.3%'),
  },
});

export default MapSetting;
