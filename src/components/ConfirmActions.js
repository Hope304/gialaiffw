import React, { useMemo, forwardRef } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Colors from '../contants/Colors';
import { TextBtn } from './AllBtn';
import Fonts from '../contants/Fonts';
import Images from '../contants/Images';

const marginItem = hp('0.8%');
const height = Platform.OS === 'ios' ? '26%' : '28%';

const ConfirmActions = forwardRef((props, ref) => {
  const { deleteText, prjInfo, onCancel, onRemove } = props;
  const snapPoints = useMemo(() => [height], []);

  const handleCancel = () => {
    ref.current?.close();
    onCancel();
  };

  const handleRemove = () => {
    ref.current?.close();
    onRemove();
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      bottomInset={24}
      detached={true}
      style={styles.sheetContainer}
      handleComponent={null}>
      <View style={styles.contentContainer}>
        <View style={styles.containerLogo}>
          <Image source={Images.warning} style={styles.logo} />
        </View>
        <Text style={styles.textAlert}>Xoá {deleteText}</Text>
        <Text style={styles.textConfirm}>
          Chắc chắn muốn xoá {deleteText} `{prjInfo?.prjName}`
        </Text>
        <View style={styles.btnContainer}>
          <TextBtn
            text={'Huỷ'}
            textColor={Colors.TEXT_COLOR}
            textFont={Fonts.RB_BOLD}
            btnColor={'#f5f5f7'}
            bdRadius={20}
            w={'48%'}
            event={handleCancel}
            pd={10}
          />
          <TextBtn
            text={'Xoá'}
            textColor={Colors.WHITE}
            textFont={Fonts.RB_BOLD}
            btnColor={'#ff3e56'}
            bdRadius={20}
            w={'48%'}
            event={handleRemove}
            pd={10}
          />
        </View>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: Colors.INACTIVE_GREY,
    borderRadius: 16,
  },
  containerLogo: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#fff2f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: marginItem,
  },
  logo: {
    width: 36,
    height: 36,
  },
  textAlert: {
    fontFamily: Fonts.RB_BOLD,
    color: Colors.TEXT_COLOR,
    fontSize: wp('5.2%'),
    marginBottom: marginItem,
  },
  textConfirm: {
    fontFamily: Fonts.RB_REGULAR,
    color: Colors.TEXT_COLOR,
    fontSize: wp('3.8%'),
    marginBottom: marginItem,
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
    marginTop: marginItem,
  },
});

export default ConfirmActions;
