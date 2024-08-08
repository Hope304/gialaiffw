import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  UIManager,
  LayoutAnimation,
  Pressable,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DocumentPicker from 'react-native-document-picker';
import ConfirmActions from './ConfirmActions';
import RNFS from 'react-native-fs';
import Dimension from '../contans/Dimension';
import { ToastAlert } from './Toast';
import { RoundBtn } from './AllBtn';
import Colors from '../contans/Colors';
import { detectFilePicker } from '../utils/mapFunc';
import { shadowIOS } from '../contans/propsIOS';
import Images from '../contans/Images';
import Fonts from '../contans/Fonts';
import { rowAlignCenter } from '../contans/CssFE';

const mainColor = Colors.PRIMARY_BLUE;
const fileImg = {
  mbtiles: { img: Images.mbtile, color: Colors.LIGHT_RED },
};
const androidPath = '/data/user/0/com.ffw/databases';
const path =
  Platform.OS === 'android' ? androidPath : RNFS.DocumentDirectoryPath;

if (Platform.OS == 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const expandAnimation = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

const FileAlbumn = forwardRef((props, ref) => {
  const { files, setFiles, storeObj, animateToFile } = props;
  const snapPoints = useMemo(() => ['94%'], []);
  const removeConfirmRef = useRef(null);
  const [idxPicker, setIdxPicker] = useState(null);
  const [prjPicker, setPrjPicker] = useState(null);
  const [toggleColor, setToggleColor] = useState(false);

  const handleClose = () => {
    ref.current?.close();
  };

  const existCheck = file => {
    const isExist = files.find(item => item.path === file.path);

    return isExist;
  };

  const handleAddFile = async () => {
    try {
      const res = await DocumentPicker.pickMultiple();
      const fileDetect = await detectFilePicker(res);

      if (typeof fileDetect === 'string') {
        return ToastAlert(fileDetect);
      }

      const isExist = existCheck(fileDetect);
      if (isExist) {
        return ToastAlert('File đã tồn tại');
      }

      const newFiles = [...files, fileDetect];
      const obj = { files: newFiles };

      setFiles(newFiles);
      await storeObj(obj);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMoveFile = async (index, position) => {
    try {
      let fileMove = [...files];
      const idxMove = index + position;

      [fileMove[index], fileMove[idxMove]] = [
        fileMove[idxMove],
        fileMove[index],
      ];

      const obj = { files: fileMove };

      setIdxPicker(idxMove);
      setFiles(fileMove);
      await storeObj(obj);
      expandAnimation();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFileExpand = index => {
    if (idxPicker == index) {
      setIdxPicker(null);
    } else {
      setIdxPicker(index);
    }
    expandAnimation();
  };

  const handleOpenRemove = (item, index) => {
    setPrjPicker({ prjName: item.name, index: index, type: item.type });
    removeConfirmRef.current?.collapse();
  };

  const closeConfirmModal = () => {
    setIdxPicker(null);
    setPrjPicker(null);
  };

  const handleRemove = async () => {
    try {
      expandAnimation();
      let fileRemove = [...files];
      fileRemove.splice(prjPicker.index, 1);

      if (prjPicker.type === 'mbtiles') {
        await RNFS.unlink(
          path + '/' + id + '/mbtiles/' + prjPicker.prjName.split('.')[0],
        );
      }

      const obj = { files: fileRemove };

      setFiles(fileRemove);
      await storeObj(obj);
      closeConfirmModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleFileData = async (item, index) => {
    try {
      let fileVisible = [...files];
      const toggleVisible = !item.isVisible;
      const updateObj = {
        ...item,
        isVisible: toggleVisible,
      };

      fileVisible.splice(index, 1, updateObj);
      const obj = { files: fileVisible };

      setFiles(fileVisible);

      await storeObj(obj);
    } catch (error) {
      console.log(error);
    }
  };


  const handleCloseCustomColor = () => {
    setPrjPicker(null);
    setToggleColor(false);
  };

  const handleSaveStyle = async style => {
    try {
      const idxPicker = prjPicker.index;
      const filePicker = files[idxPicker];

      const newStyle = {
        ...filePicker,
        ...style,
      };
      let fileStyle = [...files];
      fileStyle.splice(idxPicker, 1, newStyle);

      const obj = { files: fileStyle };

      setFiles(fileStyle);
      await storeObj(obj);
    } catch (error) {
      console.log(error);
    }
  };

  const handleZoomToFile = coor => {
    ref?.current?.close();

    const coordinate = {
      latitude: Number(coor?.latitude),
      longitude: Number(coor?.longitude),
      latitudeDelta: 0.06,
      longitudeDelta: 0.06,
    };

    animateToFile(coordinate);
  };

  const renderFiles = useCallback(
    ({ item, index }) => {
      const idxExpandEqual = idxPicker === index;

      return (
        <Pressable
          onPress={() => {
            handleZoomToFile(item.commonCoor);
          }}
          style={styles.fileContainer}>
          <View style={styles.minimizeContainer}>
            <Image
              source={fileImg[item?.type]?.img}
              style={[styles.typeImg, { tintColor: fileImg[item?.type]?.color }]}
            />
            <View style={styles.textContainer}>
              <Text style={styles.fileNameText}>{item?.name}</Text>
              <Text style={styles.fileSizeText}>
                Kích thước: {item?.size} bits
              </Text>
            </View>
          </View>

          <View style={styles.dotsContainer}>
            <RoundBtn
              icon={idxExpandEqual ? Images.up : Images.down}
              w={'100%'}
              event={() => {
                toggleFileExpand(index);
              }}
            />
          </View>

          {idxExpandEqual && (
            <View style={styles.expandContainer}>
              <RoundBtn
                icon={Images.up}
                iconColor={Colors.WHITE}
                iconSize={22}
                pd={6}
                btnColor={
                  index === 0 ? Colors.INACTIVE_GREY : Colors.GOOGLE_BLUE
                }
                disabled={index === 0 ? true : false}
                event={() => {
                  handleMoveFile(index, -1);
                }}
              />
              <RoundBtn
                icon={Images.down}
                iconColor={Colors.WHITE}
                iconSize={22}
                pd={6}
                btnColor={
                  index === files?.length - 1
                    ? Colors.INACTIVE_GREY
                    : Colors.DEFAULT_GREEN
                }
                disabled={index === files?.length - 1 ? true : false}
                event={() => {
                  handleMoveFile(index, 1);
                }}
              />
              <RoundBtn
                icon={item?.isVisible ? Images.eye : Images.noeye}
                iconColor={Colors.WHITE}
                iconSize={20}
                pd={8}
                btnColor={
                  item.isVisible ? Colors.DEFAULT_YELLOW : Colors.LIGHT_GREEN
                }
                event={() => {
                  handleToggleFileData(item, index);
                }}
              />
              <RoundBtn
                icon={Images.remove}
                iconColor={Colors.WHITE}
                iconSize={20}
                pd={8}
                btnColor={'red'}
                event={() => {
                  handleOpenRemove(item, index);
                }}
              />
            </View>
          )}
        </Pressable>
      );
    },
    [idxPicker, files],
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      handleComponent={null}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.5}
          enableTouchThrough={true}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}>
      <View style={styles.containerHeader}>
        <RoundBtn
          icon={Images.close}
          iconColor={Colors.WHITE}
          event={handleClose}
          pd={10}
          iconSize={14}
        />
        <Text style={styles.headerBottomText}>File bản đồ</Text>
        <View style={{ width: 24 }} />
      </View>

      {files?.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={Images.nofile} style={{ width: 188, height: 188 }} />
        </View>
      ) : (
        <BottomSheetFlatList
          data={files}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderFiles}
          contentContainerStyle={styles.flatlistContainer}
        />
      )}

      <View style={styles.cameraContaier}>
        <RoundBtn
          icon={Images.addfile}
          iconColor={Colors.WHITE}
          iconSize={28}
          btnColor={mainColor}
          pd={10}
          event={handleAddFile}
        />
      </View>

      {/* {prjPicker && (
        <ObjectStyleCustom
          toggleStyleModal={toggleColor}
          setToggleStyleModal={setToggleColor}
          onSaveStyle={handleSaveStyle}
          onClose={handleCloseCustomColor}
          currStyle={prjPicker?.style}
        />
      )} */}

      <ConfirmActions
        ref={removeConfirmRef}
        deleteText={'file'}
        prjInfo={prjPicker}
        onCancel={closeConfirmModal}
        onRemove={handleRemove}
      />
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.6%'),
    paddingHorizontal: wp('3%'),
    backgroundColor: mainColor,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  headerBottomText: {
    fontFamily: Fonts.RB_BOLD,
    fontSize: Dimension.fontSize(20),
    color: Colors.WHITE,
  },

  cameraContaier: {
    position: 'absolute',
    right: 30,
    bottom: 40,
  },

  flatlistContainer: {
    marginTop: hp('1%'),
    paddingHorizontal: wp('5%'),
  },

  minimizeContainer: {
    ...rowAlignCenter,
    marginBottom: hp('0.6%'),
  },

  fileNameText: {
    fontFamily: Fonts.RB_MEDIUM,
    fontSize: wp('3.8%'),
    color: Colors.TEXT_COLOR2,
  },

  fileSizeText: {
    fontFamily: Fonts.RB_LIGHT,
    fontSize: wp('3.3%'),
    color: Colors.TEXT_COLOR,
  },

  typeImg: {
    width: 40,
    height: 40,
    marginLeft: wp('3%'),
    marginRight: wp('2%'),
  },

  fileContainer: {
    borderWidth: 1,
    marginBottom: hp('1.2%'),
    borderRadius: 12,
    paddingTop: hp('1%'),
    paddingBottom: hp('0.6%'),
    elevation: 6,
    ...shadowIOS,
    borderColor: Colors.INACTIVE_GREY,
    backgroundColor: '#e7f5ff',
  },

  dotsContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.6,
    width: '80%',
    borderTopColor: Colors.INACTIVE_GREY,
    paddingTop: hp('0.3%'),
  },

  expandContainer: {
    width: '88%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginBottom: hp('0.6%'),
  },
});

export default FileAlbumn;
