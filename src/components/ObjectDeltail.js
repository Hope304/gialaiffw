import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import FullScreenImg from '../../../components/FullScreenImg';
import FastImage from 'react-native-fast-image';
// import ConfirmActions from './ConfirmActions';
// import F4Camera from '../../../components/Camera';
import RNFS from 'react-native-fs';
// import { useCameraPermission } from 'react-native-vision-camera';
// import { ToastAlert, ToastSuccess } from '../../../components/Toast';
import Dimension from '../contans/Dimension';
import { fontDefault } from '../contans/Variable';
import Colors from '../contans/Colors';
import { Button, Heading, Image, Pressable } from 'native-base';
import { shadowIOS } from '../contans/propsIOS';
import ConfirmActions from './ConfirmActions';
import { RoundBtn, TextBtn } from './AllBtn';
import { color } from 'native-base/lib/typescript/theme/styled-system';

const mainColor = '#a9edaa';
const textCl = '#ffffff';
// const textCl = '#00000';
const imgWidth = Dimensions.get('window').width / 2.7;
const path =
  Platform.OS == 'android'
    ? RNFS.DownloadDirectoryPath
    : RNFS.DocumentDirectoryPath;

const ObjectDetail = forwardRef((props, ref) => {
  const {
    projection,
    objectInfo,
    onSave,
    onClose,
    onRemove,
    onChangeBottom,
  } = props;
  const properties = objectInfo?.properties;
  const geometry = objectInfo?.geometry;
  const name = properties?.name;
  const type = properties?.type;
  const info = properties?.info;
  const note = properties?.note;
  const timeCreate = properties?.timeCreate;
  const dateCreate = properties?.dateCreate;
  const area = properties?.area;
  const distance = properties?.distance;
  const coor = properties?.coor;
  const photos = properties?.photos;
  const geoType = geometry?.type;
  const snapPoints = useMemo(() => ['95%'], []);
  const [objName, setObjName] = useState(name);
  const [objType, setObjType] = useState(type);
  const [objInfo, setObjInfo] = useState(info);
  const [objNote, setObjNote] = useState(note);
  const [imgPicker, setImgPicker] = useState(null);
  const [toggleImgPicker, setToggleImgPicker] = useState(false);
  const removeObjRef = useRef(null);
  const [objPicker, setObjPicker] = useState(null);
  const [allPhotos, setAllPhotos] = useState(photos);
  const [toggleCam, setToggleCam] = useState(false);
  // const { hasPermission, requestPermission } = useCameraPermission();

  const handleSave = () => {
    const fieldFilter =
      geoType == 'Point' ? { 'marker-color': mainColor } : { stroke: mainColor };
    const newObj = {
      ...objectInfo,
      properties: {
        ...properties,
        ...fieldFilter,
        name: objName,
        type: objType,
        info: objInfo,
        note: objNote,
        photos: allPhotos,
      },
    };
    onSave(newObj);

    setTimeout(() => {
      handleClose();
    });
  };

  const handleClose = () => {
    setObjName('');
    setObjType('');
    setObjInfo('');
    setObjNote('');
    onClose();
  };

  // const handleOpenCamera = async () => {
  //   const res = await requestPermission();

  //   if (res) {
  //     setToggleCam(true);
  //   }
  // };

  // const handleSaveImg = async img => {
  //   try {
  //     const destination = `${path}/${id}`;

  //     const fileName = img.slice(-10);
  //     const fullPath = destination + '/photos/' + fileName;
  //     await RNFS.copyFile(img, fullPath);

  //     setAllPhotos([...allPhotos, fullPath]);
  //   } catch (error) {
  //     console.log('Có lỗi đã xảy ra!');
  //   } finally {
  //     console.log('Đã lưu', 'top', 1234);
  //   }
  // };

  const handlePickImg = fullImg => {
    setImgPicker([{ uri: fullImg }]);

    setToggleImgPicker(true);
  };

  const handleOpenRemove = () => {
    setObjPicker({ prjName: geoType, id: properties?.id });

    setTimeout(() => {
      removeObjRef.current?.collapse();
    });
  };

  const handleCancelRemove = () => {
    setObjPicker(null);
  };

  const handleRemove = () => {
    onRemove(objPicker.id);
    setTimeout(() => {
      onClose();
    });
  };

  const albumRender = useCallback(
    ({ item }) => {
      const fullImg = `file://${item}`;

      return (
        <TouchableOpacity
          style={styles.imgContainer}
          onPress={() => {
            handlePickImg(fullImg);
          }}>
          <FastImage
            source={{ uri: fullImg }}
            style={styles.img}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    },
    [allPhotos],
  );

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      handleComponent={null}
      onChange={onChangeBottom}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.5}
          enableTouchThrough={true}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      android_keyboardInputMode="adjustResize">
      <View style={styles.containerHeader}>
        <RoundBtn
          icon={require('../assets/images/close.png')}
          iconColor={Colors.DEFAULT_BLACK}
          pd={10}
          iconSize={14}
          event={handleClose}
        />
        <Heading style={styles.headerBottomText}>Thông tin đối tượng</Heading>
        <TextBtn
          text={'Lưu'}
          textSize={wp('4%')}
          textColor={
            objName != '' || objType != '' || objInfo != '' || objNote != ''
              ? textCl
              : Colors.INACTIVE_GREY
          }
          disabled={
            objName != '' || objType != '' || objInfo != '' || objNote != ''
              ? false
              : true
          }
          // textFont={Fonts.SF_MEDIUM}
          event={handleSave}
        />
      </View>

      <BottomSheetScrollView
        style={styles.scrollViewBottom}
        showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView
          enableAutomaticScroll={true}
          enableResetScrollToCoords={true}
          enableOnAndroid={true}
          contentContainerStyle={styles.containerKeyborad}>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Tên đối tượng</Text>
            <BottomSheetTextInput
              style={styles.inputText}
              placeholder={'Nhập tên đối tượng'}
              placeholderTextColor={Colors.INACTIVE_GREY}
              value={objName}
              onChangeText={e => setObjName(e)}
            />
          </View>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Loại đối tượng</Text>
            <BottomSheetTextInput
              style={styles.inputText}
              placeholder={'Nhập loại đối tượng'}
              placeholderTextColor={Colors.INACTIVE_GREY}
              value={objType}
              onChangeText={e => setObjType(e)}
            />
          </View>
          <View style={styles.containerEachLine}>
            <Text style={styles.title} color="#ffffff">Thông tin đối tượng</Text>
            <BottomSheetTextInput
              style={styles.inputText}
              placeholder={'Nhập thông tin đối tượng'}
              placeholderTextColor={Colors.INACTIVE_GREY}
              value={objInfo}
              onChangeText={e => setObjInfo(e)}
            />
          </View>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Ghi chú</Text>
            <BottomSheetTextInput
              style={styles.inputText}
              placeholder={'Nhập ghi chú'}
              placeholderTextColor={Colors.INACTIVE_GREY}
              value={objNote}
              onChangeText={e => setObjNote(e)}
            />
          </View>
          {geoType === 'Point' && (
            <View style={styles.containerEachLine}>
              <Text style={styles.title}>Tọa độ</Text>
              <Text style={styles.content}>Kinh độ: {coor?.lon}</Text>
              <Text style={styles.content}>Vĩ độ: {coor?.lat}</Text>
            </View>
          )}
          {geoType === 'LineString' && (
            <View style={styles.containerEachLine}>
              <Text style={styles.title}>Chiều dài</Text>
              <Text style={styles.content}>{distance}</Text>
            </View>
          )}
          {geoType === 'Polygon' && (
            <View style={styles.containerEachLine}>
              <Text style={styles.title}>Diện tích</Text>
              <Text style={styles.content}>{area}</Text>
            </View>
          )}
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Thời gian tạo</Text>
            <Text style={styles.content}>Ngày: {dateCreate}</Text>
            <Text style={styles.content}>Giờ: {timeCreate}</Text>
          </View>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>
              Ảnh thực địa {`(${allPhotos?.length || 0})`}
            </Text>

            {allPhotos?.length != 0 && allPhotos?.length != undefined && (
              <BottomSheetFlatList
                scrollEnabled={false}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                data={allPhotos}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.containerFlatlist}
                renderItem={albumRender}
                numColumns={2}
              />
            )}
          </View>

          {/* {imgPicker && (
            <FullScreenImg
              img={imgPicker}
              toggle={toggleImgPicker}
              setToggle={setToggleImgPicker}
            />
          )} */}

          <View style={styles.rmBtn}>
            <RoundBtn
              icon={require('../assets/images/remove.png')}
              iconColor={Colors.WHITE}
              iconSize={26}
              btnColor={'red'}
              pd={10}
              bdRadius={50}
              event={handleOpenRemove}
            />
          </View>
          <ConfirmActions
            ref={removeObjRef}
            deleteText={'đối tượng'}
            onCancel={handleCancelRemove}
            onRemove={handleRemove}
            prjInfo={objPicker}
          />
        </KeyboardAwareScrollView>
      </BottomSheetScrollView>
      {/* <View style={styles.cameraContaier}>
        <RoundBtn
          icon={Images.camera}
          iconColor={Colors.WHITE}
          iconSize={28}
          btnColor={mainColor}
          pd={10}
          event={handleOpenCamera}
        />
      </View> */}

      {/* {hasPermission && (
        <F4Camera
          isVisible={toggleCam}
          saveTextBtn={'Lưu'}
          onClose={() => {
            setToggleCam(false);
          }}
          coors={projection}
          onPick={handleSaveImg}
          addCoor={true}
        />
      )} */}
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('3%'),
    backgroundColor: Colors.PRIMARY_BLUE,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  headerBottomText: {
    // fontFamily: Fonts.SF_BOLD,
    fontSize: Dimension.fontSize(20),
    color: Colors.WHITE,
    ...fontDefault,
  },

  scrollViewBottom: {
    flex: 1,
    marginTop: Dimension.setHeight(1),
    paddingHorizontal: Dimension.setWidth(3),
  },

  containerKeyborad: {
    flex: 1,
    backgroundColor: '#fbfbfd',
    borderRadius: 12,
    marginHorizontal: Dimension.setWidth(0.6),
    marginBottom: Dimension.setHeight(2),
    paddingHorizontal: Dimension.setWidth(3),
    paddingTop: Dimension.setHeight(3),
    elevation: 5,
    ...shadowIOS,
  },

  containerEachLine: {
    marginBottom: Dimension.setHeight(2),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 12,
    paddingVertical: Dimension.setHeight(1.6),
    paddingHorizontal: Dimension.setWidth(3),
  },

  inputText: {
    borderBottomWidth: 0.6,
    borderBottomColor: 'gray',
    marginHorizontal: Dimension.setWidth(1.6),
    // fontFamily: Fonts.SF_MEDIUM,
    fontSize: Dimension.fontSize(16),
    height: Dimension.setHeight(6),
    color: Colors.TEXT_COLOR,
  },

  title: {
    // fontFamily: Fonts.SF_BOLD,
    fontSize: Dimension.fontSize(15),
    ...fontDefault,
    color: Colors.TEXT_COLOR
  },

  content: {
    // fontFamily: Fonts.SF_MEDIUM,
    fontSize: wp('3.6%'),
    color: "#000",
    marginLeft: 6,
  },

  cameraContaier: {
    position: 'absolute',
    right: 30,
    bottom: 40,
  },

  containerFlatlist: {
    paddingHorizontal: wp('0.8%'),
    marginTop: hp('1%'),
  },

  rmBtn: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  imgContainer: {
    marginBottom: hp('0.8%'),
    borderWidth: 0.6,
    borderRadius: 8,
    borderColor: Colors.INACTIVE_GREY,
  },

  img: {
    width: imgWidth,
    height: imgWidth / 1.5,
    borderRadius: 8,
  },
});

export default ObjectDetail;
