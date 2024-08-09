import React, { forwardRef, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import Dimension from '../contants/Dimension';
import Colors from '../contants/Colors';
import { RoundBtn, TextBtn } from '../components/AllBtn';
import Images from '../contants/Images';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
// import { Dropdown } from 'react-native-element-dropdown';
import {
  getListLayerWmsGeopfes,
  getVnRegionMap,
} from '../redux/apiRequest';
import { ToastAlert } from '../components/Toast';
import Fonts from '../contants/Fonts';

const mainColor = Colors.GOOGLE_BLUE;

const WebMapService = forwardRef((props, ref) => {
  const { onOpenWMS } = props;
  const snapPoints = useMemo(() => ['94%'], []);
  const [vnRegion, setVnRegion] = useState([]);
  const [listLayer, setListLayer] = useState([]);
  const [columnName, setColumnName] = useState('');
  const [mapTypes, setMapTypes] = useState([]);
  const [mapTypesVal, setMapTypesVal] = useState(null);
  const [year, setYear] = useState([]);
  const [yearVal, setYearVal] = useState(null);
  const [province, setProvince] = useState([]);
  const [provinceVal, setProvinceVal] = useState(null);
  const [district, setDistrict] = useState([]);
  const [districtVal, setDistrictVal] = useState(null);
  const [commune, setCommune] = useState([]);
  const [communeVal, setCommuneVal] = useState(null);
  const [centerPoint, setCenterPoint] = useState(null);

  const handleClose = () => {
    ref.current?.close();
  };

  const handleOpenWMS = () => {
    if (!provinceVal) {
      return ToastAlert('Chưa chọn đủ thông tin!');
    }

    handleClose();

    const data = filterLabelValue();
    const link = getLinkLayer(data.label, data.value);

    const wms = {
      WMSLink: link.wmsLink,
      linkRoot: link.rootLink,
      centerPoint: centerPoint,
      label: data.label,
      value: data.value,
    };

    onOpenWMS(wms);
  };

  const filterLabelValue = () => {
    const label = communeVal ? 'maxa' : districtVal ? 'mahuyen' : 'matinh';
    const value = communeVal || districtVal || provinceVal;

    return { label, value };
  };

  const getLinkLayer = (label, value) => {
    const layerFilter = getMapLayer();

    return {
      wmsLink: `${layerFilter?.linkRoot}&version=${layerFilter?.version}&request=GetMap&layers=${layerFilter?.layers}&cql_filter=${label}=${value}&styles=&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=${layerFilter?.format}&transparent=true`,
      rootLink: `${layerFilter?.linkRoot}&version=${layerFilter?.version}&request=GetFeatureInfo&layers=${layerFilter?.layers}&cql_filter=${label}=${value}&query_layers=${layerFilter?.layers}&srs=EPSG:4326&info_format=application/json`,
    };
  };

  const getMapLayer = () => {
    const layerFilter = listLayer.filter(
      item =>
        item.codeMapGroup === mapTypesVal &&
        item.nameRegionCol === columnName &&
        (item.multiProvince === '1'
          ? true
          : item.provinceCode === provinceVal.toString()),
    );

    return layerFilter[0];
  };

  const handlePickMapType = item => {
    setMapTypesVal(item.value);
    // getYear(item.value);
  };

  // const getYear = mapType => {
  //   const yearList = [];

  //   listLayer.forEach(item => {
  //     if (
  //       item.codeMapGroup === mapType &&
  //       !yearList.some(y => y.label === item.year)
  //     ) {
  //       const year = {
  //         label: item.year,
  //         value: item.nameRegionCol,
  //       };
  //       yearList.push(year);
  //     }
  //   });

  //   setYear(yearList);
  // };


  // const getProvince = column => {
  //   const provinceList = [];

  //   vnRegion.forEach(item => {
  //     if (
  //       item[column] === '1' &&
  //       !provinceList.some(obj => obj.value === item.MATINH)
  //     ) {
  //       const province = {
  //         label: item.TINH,
  //         value: item.MATINH,
  //         provinX: item.X_TINH,
  //         provinY: item.Y_TINH,
  //       };

  //       provinceList.push(province);
  //     }
  //   });

  //   setProvince(provinceList);
  // };

  const handlePickProvince = item => {
    setProvinceVal(item.value);
    getDistrict(item.value);
    setCenterPoint({ x: item.provinX, y: item.provinY });
  };

  const getDistrict = provinceCode => {
    let districtList = [];

    vnRegion.forEach(item => {
      if (
        item[columnName] === '1' &&
        item.MATINH === provinceCode &&
        !districtList.some(obj => obj.value === item.MAHUYEN)
      ) {
        const obj = {
          label: item.HUYEN,
          value: item.MAHUYEN,
          districtX: item.X_HUYEN,
          districtY: item.Y_HUYEN,
        };

        districtList.push(obj);
      }
    });

    setDistrict(districtList);
  };

  const handlePickDistrict = item => {
    setDistrictVal(item.value);
    getCommune(item.value);
    setCenterPoint({ x: item.districtX, y: item.districtY });
  };

  const getCommune = districtCode => {
    let communeList = [];

    vnRegion.forEach(item => {
      if (
        item[columnName] === '1' &&
        item.MAHUYEN === districtCode &&
        !communeList.some(obj => obj.value === item.MAXA)
      ) {
        const obj = {
          label: item.XA,
          value: item.MAXA,
          communeX: item.X_XA,
          communeY: item.Y_XA,
        };

        communeList.push(obj);
      }
    });

    setCommune(communeList);
  };

  const handlePickCommune = item => {
    setCommuneVal(item.value);
    setCenterPoint({ x: item.communeX, y: item.communeY });
  };

  const handleGetVNRegion = async () => {
    try {
      const vnRegionData = await getVnRegionMap();
      const listLayerData = await getListLayerWmsGeopfes();

      getMapTypeList(listLayerData);
      setVnRegion(vnRegionData);
      setListLayer(listLayerData);
    } catch (error) {
      console.log(error);
    }
  };

  const getMapTypeList = listLayer => {
    const mapType = [];

    listLayer.forEach(item => {
      if (
        !mapType.some(obj => obj.label === item.nameMapGroup) &&
        item.nameMapGroup !== 'Bản đồ cấp cháy'
      ) {
        const obj = { label: item.nameMapGroup, value: item.codeMapGroup };
        mapType.push(obj);
      }
    });

    setMapTypes(mapType);
  };

  useEffect(() => {
    handleGetVNRegion();
  }, []);

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
        <Text style={styles.headerBottomText}>Dịch vụ bản đồ</Text>
        <View style={{ width: 24 }} />
      </View>

      <BottomSheetScrollView style={styles.scrollViewContainer}>
        <View style={styles.dropdownContainer}>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Loại bản đồ</Text>
            <Dropdown
              style={styles.dropdown}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.containerOptionStyle}
              imageStyle={styles.imageStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={styles.itemContainer}
              itemTextStyle={styles.itemText}
              fontFamily={Fonts.SF_MEDIUM}
              activeColor="#eef2feff"
              placeholder="Chọn loại bản đồ"
              data={mapTypes}
              maxHeight={Dimension.setHeight(30)}
              labelField="label"
              valueField="value"
              value={mapTypesVal}
              onChange={handlePickMapType}
            />
          </View>
          {/* <View style={styles.containerEachLine}>
            <Text style={styles.title}>Chọn Tỉnh/Thành phố</Text>
            <Dropdown
              style={styles.dropdown}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.containerOptionStyle}
              imageStyle={styles.imageStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={styles.itemContainer}
              itemTextStyle={styles.itemText}
              fontFamily={Fonts.SF_MEDIUM}
              activeColor="#eef2feff"
              placeholder="Tỉnh"
              data={province}
              disable={province?.length != 0 ? false : true}
              maxHeight={Dimension.setHeight(30)}
              labelField="label"
              valueField="value"
              value={provinceVal}
              onChange={handlePickProvince}
            />
          </View> */}
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Chọn Quận/Huyện/Thị xã</Text>
            <Dropdown
              style={styles.dropdown}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.containerOptionStyle}
              imageStyle={styles.imageStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={styles.itemContainer}
              itemTextStyle={styles.itemText}
              fontFamily={Fonts.SF_MEDIUM}
              activeColor="#eef2feff"
              placeholder="Quận/huyện/thị xã"
              data={district}
              disable={district?.length != 0 ? false : true}
              maxHeight={Dimension.setHeight(30)}
              labelField="label"
              valueField="value"
              value={districtVal}
              onChange={handlePickDistrict}
            />
          </View>
          <View style={styles.containerEachLine}>
            <Text style={styles.title}>Chọn Xã/Phường/Thị trấn</Text>
            <Dropdown
              style={styles.dropdown}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.containerOptionStyle}
              imageStyle={styles.imageStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={styles.itemContainer}
              itemTextStyle={styles.itemText}
              fontFamily={Fonts.SF_MEDIUM}
              activeColor="#eef2feff"
              placeholder="Xã/Phường/Thị trấn"
              data={commune}
              disable={commune?.length != 0 ? false : true}
              maxHeight={Dimension.setHeight(30)}
              labelField="label"
              valueField="value"
              value={communeVal}
              onChange={handlePickCommune}
            />
          </View>

          <View style={styles.btnContainer}>
            <TextBtn
              text={'Hiển thị'}
              textFont={Fonts.SF_MEDIUM}
              textSize={wp('4.2%')}
              btnColor={mainColor}
              pd={12}
              bdRadius={10}
              w={'30%'}
              event={handleOpenWMS}
            />
          </View>
        </View>
      </BottomSheetScrollView>
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
    fontFamily: Fonts.SF_BOLD,
    fontSize: Dimension.fontSize(20),
    color: Colors.WHITE,
  },

  containerEachLine: {
    marginBottom: hp('1.2%'),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 12,
    paddingVertical: Dimension.setHeight(1),
    paddingHorizontal: Dimension.setWidth(2),
  },

  dropdownContainer: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 0.3,
    borderColor: Colors.INACTIVE_GREY,
  },

  scrollViewContainer: {
    paddingHorizontal: wp('3%'),
    marginTop: hp('1.6%'),
    backgroundColor: '#fbfbfd',
  },

  title: {
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: Dimension.fontSize(15),
    color: '#8bc7bc',
    marginBottom: Dimension.setHeight(1),
  },

  dropdown: {
    height: Dimension.setHeight(4.5),
    marginHorizontal: Dimension.setWidth(1.6),
    borderBottomColor: Colors.INACTIVE_GREY,
    borderBottomWidth: 0.5,
  },
  leftIconDropdown: {
    width: 20,
    height: 20,
    marginRight: Dimension.setWidth(1.8),
  },
  itemContainer: {
    borderRadius: 12,
  },
  containerOptionStyle: {
    borderRadius: 12,
  },

  btnContainer: {
    alignItems: 'flex-end',
    marginTop: hp('1%'),
    width: '100%',
  },
});

export default WebMapService;
