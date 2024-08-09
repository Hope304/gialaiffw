import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  PixelRatio,
  TouchableOpacity,
} from 'react-native';
import MapView, {
  Callout,
  Geojson,
  MAP_TYPES,
  Marker,
  WMSTile,
  UrlTile,
  Polygon,
} from 'react-native-maps';
import {
  calculateAreaPolygonMeter,
  calculateAreaPolygonHa,
  calculatePolylineLength,
  getCurrCoords,
  roundNumber,
} from '../utils/mapFunc';
import { BackBtn2, RoundBtn, TextBtn } from '../components/AllBtn';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Colors from '../contants/Colors';
import Fonts from '../contants/Fonts';
import Geolocation from 'react-native-geolocation-service';
import Images from '../contants/Images';
// import ProjectionSystem from './components/ProjectionBottomSheet';
import { defaultProjection, VNCoor } from '../contants/MapVariable';
import { prjTransform } from '../utils/mapFunc';
import { getRegionInfoData, getVN2000Projection } from '../redux/apiRequest';
// import { CoorSearchModal, LandRender } from '../components/MapComponent';
import { ToastAlert, ToastSuccess } from '../components/Toast';
// import { useCameraPermission } from 'react-native-vision-camera';
import { readObjData, storeObjData } from '../utils/storageData';
// import ImageLibrary from './components/ImageLibrary';
// import { geoKey } from './variable/asyncStorageKey';
import StaggerCustom from '../components/StaggerCustom';
import FastImage from 'react-native-fast-image';
// import FullScreenImg from '../components/FullScreenImg';
import DeleteAnimation from '../components/DeleteAnimation';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import ConfirmActions from '../components/ConfirmActions';
import RNFS from 'react-native-fs';
import { rowAlignCenter } from '../contants/CssFE';
import ObjectDetail from '../components/ObjectDeltail';
import {
  generateID,
  getCurrentDate,
  getCurrentTime,
} from '../utils/dateTimeFunc';
import FileAlbumn from '../components/FileAlbumn';
import WebMapService from '../components/WebMapService';
import {
  getCodeText,
  listDisplayLabelExplantFull,
  listDisplayLabelFull,
} from '../utils/DBR_Rule';
// import Modal from 'react-native-modal';
// import FileFieldDetails from '../components/FileFieldDetail';
import MapSetting from '../components/MapSetting';
// import F4Camera from '../../components/Camera';
// import { useSelector } from 'react-redux';
import { closeNotifier, warningNotifier } from '../components/Notifier';
// import BackgroundFetch from 'react-native-background-fetch';
// import SystemNavigationBar from 'react-native-system-navigation-bar';
import Loading from '../components/LoadingUI';
import { HStack, Pressable, Spacer } from 'native-base';
import Dimension from '../contants/Dimension';
import { fontDefault } from '../contants/Variable';
import { useFocusEffect } from '@react-navigation/native';

const isIOS = Platform.OS === 'ios';
const iconSize = 18;
const btnSpace = 12;
const pad = 9;
const mapbase = [
  { title: 'Tích hợp', img: Images.baseHybrid, map: MAP_TYPES.HYBRID },
  { title: 'Vệ tinh', img: Images.baseSatellite, map: MAP_TYPES.SATELLITE },
  { title: 'Giao thông', img: Images.baseStandard, map: MAP_TYPES.STANDARD },
  { title: 'Địa hình', img: Images.baseTerrain, map: MAP_TYPES.TERRAIN },
];

const locationConfig = {
  enableHighAccuracy: true,
  distanceFilter: 3,
  interval: 5000,
  fastestInterval: 5000,
  showsBackgroundLocationIndicator: true,
  showLocationDialog: true,
};

const mode = {
  0: { name: 'Point', img: Images.point },
  1: { name: 'LineString', img: Images.line },
  2: { name: 'Polygon', img: Images.polygon },
  3: { name: 'GPSLineString', img: Images.line },
  4: { name: 'GPSPolygon', img: Images.polygon },
};

const commonColor = {
  pending: '#bd2828',
  saved: '#e8e679',
};

const commonObj = {
  timeCreate: getCurrentTime(),
  dateCreate: getCurrentDate(),
  name: '',
  type: '',
  info: '',
  note: '',
  photos: [],
  editting: true,
};

const path =
  Platform.OS == 'android'
    ? RNFS.DownloadDirectoryPath
    : RNFS.DocumentDirectoryPath;

const MapScreen = ({ navigation }) => {
  const id = 0;
  // const { hasPermission, requestPermission } = useCameraPermission();
  // const isConnected = useSelector(state => state.internet?.internet.state);
  const safeDimension = useSafeAreaInsets();

  const mapViewRef = useRef(null);
  const watchIdRef = useRef(null);
  const projectionSysRef = useRef(null);
  const imgLibRef = useRef(null);
  const removeRef = useRef(null);
  const detailObj = useRef(null);
  const mapFileRef = useRef(null);
  const wmsRef = useRef(null);
  const mapSettingRef = useRef(null);

  const [mapRender, setMapRender] = useState(false);
  const [mapType, setMapType] = useState(MAP_TYPES.HYBRID);
  const [currCoor, setCurrCoor] = useState(null);
  const [vn2000Prj, setVn2000Prj] = useState(null);
  const [toggleCoorModal, setToggleCoorModal] = useState(false);
  const [latText, setLatText] = useState('');
  const [longText, setLongText] = useState('');
  const [vn2000Picker, setVn2000Picker] = useState(defaultProjection);
  const [searchCoorTemp, setSearchCoorTemp] = useState([]);
  const [currPrj, setCurrPrj] = useState(defaultProjection);
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState(null);
  const [imgPicker, setImgPicker] = useState(null);
  const [toggleImgPicker, setToggleImgPicker] = useState(false);
  const toggleDeleteImg = useSharedValue(false);
  const toggleLocationInfo = useSharedValue(true);
  const toggleTool = useSharedValue(false);
  const [toolMode, setToolMode] = useState(null);
  const [linegonMarker, setLinegonMarker] = useState([]);
  const [undoArr, setUndoArr] = useState([]);
  const [redoArr, setRedoArr] = useState([]);
  const [geojson, setGeojson] = useState([]);
  const [objPicker, setObjPicker] = useState(null);
  const [linkWMS, setLinkWMS] = useState(null);
  const [mapDimension, setMapDimension] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [toggleRegionData, setToggleRegionData] = useState(false);
  const [toggleFileField, setToggleFileField] = useState(false);
  const [propsPicker, setPropsPicker] = useState(null);
  const [objectDraw, setObjectDraw] = useState(true);
  const [objectPhoto, setObjectPhoto] = useState(true);
  const [objectFile, setObjectFile] = useState(true);
  const [objectWMS, setObjectWMS] = useState(true);
  const [toggleCamera, setToggleCamera] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const [distanceCur, setDistanceCur] = useState(0);
  const [areaCur, setAreaCur] = useState(0);
  const [checkUndo, setCheckUndo] = useState(false);
  const [currentObj, setCurrentObj] = useState([]);
  const [revertedObj, setRevertedObj] = useState([]);
  const [redoObj, setRedoObj] = useState([]);
  const [loading, setLoading] = useState(false);

  // const requestCamPermission = async () => {
  //   try {
  //     await requestPermission();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleOpenCamera = async () => {
  //   SystemNavigationBar.navigationHide();
  //   await requestCamPermission();

  //   setToggleCamera(true);
  // };

  // const handleSaveImg = async img => {
  //   try {
  //     const destination = `${path}/${id}`;

  //     const fileName = img.slice(-10);
  //     const fullPath = destination + '/photos/' + fileName;
  //     const coor = await getCurrCoords();

  //     const photoObj = {
  //       id: photos?.length,
  //       img: fullPath,
  //       latitude: coor.latitude,
  //       longitude: coor.longitude,
  //     };

  //     const allPhoto = [...photos, photoObj];

  //     setPhotos(allPhoto);

  //     const obj = { photos: allPhoto };
  //     await storeObj(obj);

  //     await RNFS.copyFile(img, fullPath);
  //   } catch (error) {
  //     ToastAlert('Có lỗi đã xảy ra!');
  //   } finally {
  //     ToastSuccess('Đã lưu', 'top', 1234);
  //     clearToolData();
  //   }
  // };

  const getGeoProject = async () => {
    const prj = await readObjData('geoProject');
    if (prj) {
      setGeojson(prj.geojson);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getGeoProject();
    }, []),
  );

  const handleToggleInfo = () => {
    toggleLocationInfo.value = !toggleLocationInfo.value;
  };

  const handleOpenMapSetting = () => {
    mapSettingRef.current?.collapse();
  };

  const handleBottomSheetClose = idx => {
    if (idx === -1) {
      setObjPicker(null);
    }
  };

  const handleOpenImgLib = () => {
    imgLibRef.current?.collapse();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCompleteChange = coor => {
    closeRemoveBtn();
    const centerTransformCoor = prjTransform(
      4326,
      currPrj?.epsg_code,
      coor?.longitude,
      coor?.latitude,
    );

    setCurrCoor({
      ...currCoor,
      yCenter: centerTransformCoor[1],
      xCenter: centerTransformCoor[0],
      region: coor,
    });
  };

  const handleOpenPrjSys = () => {
    if (!vn2000Prj) {
      return ToastAlert('Danh sách hệ toạ độ không có sẵn!');
    }

    projectionSysRef.current?.collapse();
  };

  const handleOpenCoorModal = () => {
    if (!vn2000Prj) {
      return ToastAlert(
        'Thiết bị đang không kết nối mạng. Vui lòng thử lại sau',
      );
    }
    setToggleCoorModal(true);
  };

  const handleFindCoor = () => {
    const lat = Number(latText.replace(',', '.'));
    const long = Number(longText.replace(',', '.'));

    if (lat === NaN || long === NaN || lat === 0 || long === 0) {
      return ToastAlert('Dữ liệu đã nhập không hợp lệ!');
    }

    let coors = [];
    if (vn2000Picker == 4326) {
      coors = {
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    } else {
      const coorTransform = prjTransform(vn2000Picker, 4326, lat, long);

      coors = {
        latitude: coorTransform[1],
        longitude: coorTransform[0],
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    const marker = {
      id: searchCoorTemp?.length,
      coor: { latitude: coors?.latitude, longitude: coors?.longitude },
    };
    setSearchCoorTemp([...searchCoorTemp, marker]);

    setToggleCoorModal(false);
    animatedToRegion(coors);
  };

  const animatedToRegion = coor => {
    mapViewRef.current?.animateToRegion(coor, 1111);
  };

  const handlePickerPrj = useCallback(
    async item => {
      setCurrPrj(item);
      try {
        const userTransformCoor = prjTransform(
          currPrj.epsg_code,
          item.epsg_code,
          currCoor.xUser,
          currCoor.yUser,
        );

        const centerTransformCoor = prjTransform(
          currPrj.epsg_code,
          item.epsg_code,
          currCoor.xCenter,
          currCoor.yCenter,
        );

        const newPrj = {
          ...currCoor,
          yCenter: centerTransformCoor[1],
          xCenter: centerTransformCoor[0],
          yUser: userTransformCoor[1],
          xUser: userTransformCoor[0],
        };

        setCurrCoor(newPrj);

        const obj = { projection: item };
        await storeObj(obj);
      } catch (error) {
        console.log(error);
      } finally {
        projectionSysRef.current?.close();
      }
    },
    [currCoor, currPrj],
  );

  const storeObj = useCallback(async obj => {
    try {
      // const allPrj = await readObjData('geoProject');
      // console.log('old', allPrj);
      console.log('obj', obj);
      // const updatedPrj = Object.fromEntries(
      //   Object.entries(allPrj).map(([date, projects]) => [
      //     date,
      //     projects.map(prj => {
      //       if (prj.id == id) {
      //         return {
      //           ...prj,
      //           ...obj,
      //         };
      //       }

      //       return prj;
      //     }),
      //   ]),
      // );
      // console.log('new', updatedPrj);

      await storeObjData('geoProject', obj);
    } catch (error) {
      console.log('e', error);
    }
  }, []);
  const handleImgPress = () => {
    setToggleImgPicker(true);
  };

  const closeRemoveBtn = () => {
    toggleDeleteImg.value = false;
  };

  const handleIconPress = item => {
    handleOpenRemove(item);

    handleOffMapTool();
    console.log(item);
    setImgPicker({ id: item.id, path: item.img, photo: [{ uri: item.img }] });

    toggleDeleteImg.value = !toggleDeleteImg.value;
  };

  const handleOpenRemove = () => {
    removeRef.current?.collapse();
  };
  const removeLocalImg = async path => {
    try {
      await RNFS.unlink(path);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemove = async () => {
    try {
      const filterPhoto = photos.filter(item => item.id !== imgPicker.id);
      const obj = { photos: filterPhoto };

      await removeLocalImg(imgPicker.path);
      await storeObj(obj);
      setPhotos(filterPhoto);
    } catch (error) {
      ToastAlert('Có lỗi xảy ra khi xoá ảnh!');
    } finally {
      closeRemoveBtn();
    }
  };

  const handleCloseRemove = () => { };

  const handleWatchPosition = useCallback(() => {
    setLoading(true);
    return Geolocation.watchPosition(
      position => {
        let { longitude, latitude, accuracy } = position.coords;
        console.log('watch position', longitude, latitude);

        const centerTransformCoor = prjTransform(
          4326,
          currPrj?.epsg_code,
          longitude,
          latitude,
        );

        const coorInfo = {
          accuracy: roundNumber(accuracy, 1),
          yUser: centerTransformCoor[1],
          xUser: centerTransformCoor[0],
          yCenter: centerTransformCoor[1],
          xCenter: centerTransformCoor[0],
        };

        setCurrCoor(coorInfo);
        setLoading(false);
      },
      err => {
        console.log(err);
        setLoading(false);
      },
      locationConfig,
    );
  }, [currPrj, currCoor]);

  const fetchVn2000Prj = async () => {
    try {
      const data = await getVN2000Projection();

      setVn2000Prj(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    watchIdRef.current = handleWatchPosition();
    fetchVn2000Prj();

    return () => {
      Geolocation.clearWatch(watchIdRef?.current);
    };
  }, [currPrj]);

  const trackingOnApp = () => {
    let x = currCoor?.xUser;
    let y = currCoor?.yUser;

    if (currPrj?.epsg_code != 4326) {
      const userTransformCoor = prjTransform(currPrj?.epsg_code, 4326, x, y);

      y = userTransformCoor[1];
      x = userTransformCoor[0];
    }

    const data = {
      latitude: y,
      longitude: x,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    animatedToRegion(data);

    switch (toolMode?.name) {
      case 'GPSLineString':
        drawLine(x, y, true);
        break;
      case 'GPSPolygon':
        drawPolygon(x, y, true);
        break;
    }
  };

  // const backgroundTracking = async () => {
  //   let status = await BackgroundFetch.configure(
  //     {
  //       minimumFetchInterval: 15,
  //       forceAlarmManager: true,
  //     },
  //     async taskId => {
  //       // <-- Event callback
  //       console.log('[BackgroundFetch] taskId: ', taskId);
  //       BackgroundFetch.finish(taskId);
  //     },
  //     async taskId => {
  //       // <-- Task timeout callback
  //       // This task has exceeded its allowed running-time.
  //       // You must stop what you're doing and immediately .finish(taskId)
  //       BackgroundFetch.finish(taskId);
  //     },
  //   );

  //   console.log(status);
  //   // And with with #scheduleTask
  //   BackgroundFetch.scheduleTask({
  //     taskId: 'com.transistorsoft.custom',
  //     delay: 5000, // milliseconds
  //     forceAlarmManager: true,
  //     periodic: false,
  //   });
  // };

  const checkGPSMode = () => {
    return (
      toolMode?.name === 'GPSLineString' || toolMode?.name === 'GPSPolygon'
    );
  };

  useEffect(() => {
    if (checkGPSMode()) {
      trackingOnApp();

      // switch (AppState.currentState) {
      //   case 'background':
      //     backgroundTracking();
      //     break;

      //   default:
      //     trackingOnApp();
      //     break;
      // }
    }
  }, [toolMode, currCoor]);

  const handlePickMode = index => {
    toggleTool.value = true;
    setToolMode(mode[index]);
    setMapType(MAP_TYPES.SATELLITE);
    finishEditting();

    closeNotifier();
    if (index > 2) {
      const data = {
        title: 'Cảnh báo!',
        description:
          'Giữ trạng thái màn hình luôn bật để chức năng hoạt động bình thường.',
        img: Images.warningRec,
        state: 'warning',
      };
      warningNotifier(data);
    }
  };

  const clearToolData = useCallback(() => {
    setLinegonMarker([]);
    setUndoArr([]);
    setRedoArr([]);
  }, []);

  const handleSaveGeojson = useCallback(async () => {
    try {
      const geoSaved = undoArr.map(item => {
        const fieldFilter = {
          'marker-color': commonColor.saved,
          stroke: commonColor.saved,
        };

        const obj = {
          ...item,
          properties: {
            ...item.properties,
            ...fieldFilter,
          },
        };

        return obj;
      });

      const newGeo = [...geojson, ...geoSaved];
      setGeojson(newGeo);

      const obj = { geojson: newGeo };
      console.log(obj);
      handleOffMapTool();
      await storeObj(obj);
    } catch (error) {
      console.log(error);
    }
  }, [undoArr]);

  const finishEditting = () => {
    let undo = [...undoArr];
    let lastItem = { ...undo[undo?.length - 1] };
    if (lastItem?.properties?.editting) {
      lastItem.properties.editting = false;

      undo.splice(undo?.length - 1, 1, lastItem);
      setUndoArr(undo);
    }
  };
  const addPointForPolinegon = coor => {
    setLinegonMarker([...linegonMarker, coor]);
  };
  const addPoint = (latitude, longitude) => {
    const transformToCurrPrj = prjTransform(
      4326,
      currPrj?.epsg_code,
      longitude,
      latitude,
    );

    const newPoint = {
      type: 'Feature',
      properties: {
        'marker-color': commonColor.pending,
        id: generateID(3),
        coor: { lat: transformToCurrPrj[1], lon: transformToCurrPrj[0] },
        ...commonObj,
      },
      geometry: {
        coordinates: [longitude, latitude],
        type: 'Point',
      },
    };

    return newPoint;
  };
  const addLine = (latitude, longitude, isEditting) => {
    let lastItem = undoArr[undoArr?.length - 1];
    const checkEditting = lastItem?.properties?.editting;

    if (checkEditting) {
      const updateCoor = [
        ...lastItem?.geometry?.coordinates,
        [longitude, latitude],
      ];
      const distance = calculatePolylineLength(updateCoor);
      setDistanceCur(distance);
      console.log(distance);
      const updateProps = {
        ...lastItem?.properties,
        editting: isEditting,
        distance: `${roundNumber(distance, 2)} m`,
      };

      const newLine = {
        ...lastItem,
        properties: updateProps,
        geometry: {
          coordinates: updateCoor,
          type: 'LineString',
        },
      };

      return { newLine, checkEditting };
    }

    const newLine = {
      type: 'Feature',
      properties: {
        id: generateID(3),
        stroke: commonColor.pending,
        'stroke-width': 4,
        distance: '',
        ...commonObj,
      },
      geometry: {
        coordinates: [[longitude, latitude]],
        type: 'LineString',
      },
    };

    return { newLine, checkEditting };
  };

  const addPolygon = (latitude, longitude, isEditting) => {
    let lastItem = undoArr[undoArr?.length - 1];
    const checkEditting = lastItem?.properties?.editting;

    if (checkEditting) {
      const updateCoor = [
        [...lastItem?.geometry?.coordinates[0], [longitude, latitude]],
      ];
      console.log('updateCoor', updateCoor);
      const calculateArea = calculateAreaPolygonHa(updateCoor[0]);
      setAreaCur(calculateArea);
      const updateProps = {
        ...lastItem?.properties,
        editting: isEditting,
        area: `${calculateArea} Ha`,
      };
      // console.log('checkEditting', checkEditting);

      const newPolygon = {
        ...lastItem,
        properties: updateProps,
        geometry: {
          coordinates: updateCoor,
          type: 'Polygon',
        },
      };

      return { newPolygon, checkEditting };
    }

    const newPolygon = {
      type: 'Feature',
      properties: {
        id: generateID(3),
        stroke: commonColor.pending,
        'stroke-width': 2,
        'stroke-opacity': 1,
        fill: '#a8a8a8',
        'fill-opacity': 0.5,
        area: '',
        ...commonObj,
      },
      geometry: {
        coordinates: [[[longitude, latitude]]],
        type: 'Polygon',
      },
    };

    return { newPolygon, checkEditting };
  };

  const drawPoint = (x, y) => {
    let newUndo = [...undoArr];
    const newPoint = addPoint(y, x);

    setUndoArr([...newUndo, newPoint]);
  };

  const drawLine = (x, y, isEditting) => {
    let newUndo = [...undoArr];

    const newLine = addLine(y, x, isEditting);

    if (newLine.checkEditting) {
      newUndo.splice(newUndo?.length - 1, 1, newLine.newLine);

      setUndoArr(newUndo);
    } else {
      setUndoArr([...undoArr, newLine.newLine]);
    }
  };

  const drawPolygon = (x, y, isEditting) => {
    let newUndo = [...undoArr];

    const newPolygon = addPolygon(y, x, isEditting);
    setCurrentObj(newPolygon);

    console.log(newPolygon);

    if (newPolygon.checkEditting) {
      newUndo.splice(newUndo?.length - 1, 1, newPolygon.newPolygon);

      setUndoArr(newUndo);
    } else {
      setUndoArr([...undoArr, newPolygon.newPolygon]);
    }
  };

  const createObject = (latitude, longitude, isEditting) => {
    switch (toolMode?.name) {
      case 'Point':
        drawPoint(longitude, latitude);
        break;
      case 'LineString':
        drawLine(longitude, latitude, isEditting);
        addPointForPolinegon({ latitude, longitude });
        break;
      case 'Polygon':
        drawPolygon(longitude, latitude, isEditting);
        addPointForPolinegon({ latitude, longitude });
        break;
    }
  };

  const handleToolPress = e => {
    const coor = e?.nativeEvent?.coordinate;

    createObject(coor?.latitude, coor?.longitude, true);
  };

  const handleLongPressMap = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    createObject(latitude, longitude, false);
  };

  const targetUserLocation = () => {
    const latitude = currCoor?.yUser;
    const longitude = currCoor?.xUser;

    createObject(latitude, longitude);
  };

  const handleTempMarker = (coor, type, state) => {
    let markerTemp = [...linegonMarker];
    const length = type === 'LineString' ? -coor?.length : -coor[0]?.length;
    const coorArr = type === 'LineString' ? coor : coor[0];

    if (state) {
      markerTemp = markerTemp.slice(0, length);
    } else {
      coorArr.forEach(item => {
        markerTemp.push({ latitude: item[1], longitude: item[0] });
      });
    }

    setLinegonMarker(markerTemp);
  };

  const handleUndo = () => {
    let undoTemp = [...undoArr];

    const lastItem = undoTemp.pop();
    const { coordinates, type } = lastItem.geometry;
    console.log(coordinates);

    if (type != 'Point') {
      handleTempMarker(coordinates, type, true);
    }
    setUndoArr(undoTemp);
    setRedoArr([lastItem, ...redoArr]);
  };

  // const handleUndo = () => {
  //   if (Array.isArray(linegonMarker) && linegonMarker.length > 0) {
  //     let newLinegonMarker = [...linegonMarker];
  //     let undoArray = newLinegonMarker.pop(); // Pop điểm cuối cùng

  //     setLinegonMarker(newLinegonMarker);

  //     console.log(newLinegonMarker);

  //     if (newLinegonMarker.length > 0) {
  //       let currCoor = newLinegonMarker.map(marker => [marker.latitude, marker.longitude]);
  //       // Cập nhật tọa độ mới vào `currentObj`
  //       currentObj.newPolygon = {
  //         geometry: {
  //           coordinates: currCoor,
  //         },
  //       };
  //     } else {
  //       // Nếu không còn điểm nào, xóa luôn Polygon hiện tại
  //       currentObj.newPolygon = {
  //         geometry: {
  //           coordinates: [],
  //         },
  //       };
  //     }

  //     setCheckUndo(!checkUndo);
  //   } else {
  //     console.error('linegonMarker is not an array or is empty');
  //   }
  // };

  const handleRedo = () => {
    let redoTemp = [...redoArr];

    const firstItem = redoTemp.shift();
    const { coordinates, type } = firstItem.geometry;
    console.log(coordinates);

    if (type != 'Point') {
      handleTempMarker(coordinates, type, false);
    }
    setUndoArr([...undoArr, firstItem]);
    setRedoArr(redoTemp);
  };
  const handleOffMapTool = () => {
    toggleTool.value = false;
    setToolMode(null);
    setMapType(MAP_TYPES.HYBRID);
    clearToolData();
    closeNotifier();
  };

  const handleOpenEdit = useCallback(
    item => {
      setObjPicker(item.feature);
    },
    [objPicker],
  );
  const handleEdit = useCallback(
    async obj => {
      try {
        const geojsonEdited = geojson.map(item => {
          if (item.properties.id === obj.properties.id) {
            return obj;
          }

          return item;
        });

        const newObj = { geojson: geojsonEdited };

        setGeojson(geojsonEdited);
        await storeObj(newObj);
      } catch (error) {
        console.log(error);
      }
    },
    [geojson],
  );
  const handleRemoveObj = useCallback(
    async idObj => {
      try {
        let objRemove = [...geojson].filter(
          item => item.properties.id !== idObj,
        );

        const obj = { geojson: objRemove };
        setGeojson(objRemove);
        await storeObj(obj);
      } catch (error) {
        console.log(error);
      }
    },
    [geojson],
  );

  const handleCloseEditting = () => {
    detailObj.current?.close();
  };

  const handleOpenAllDoc = () => {
    mapFileRef.current?.collapse();
  };

  const handleOpenWMS = data => {
    const { WMSLink, linkRoot, centerPoint, label, value } = data;

    setLinkWMS({
      getMapLink: WMSLink,
      getFeatureLink: linkRoot,
      label: label,
      value: value,
    });
    setMapRender(!mapRender);

    setTimeout(() => {
      animatedToRegion({
        latitude: Number(centerPoint?.y),
        longitude: Number(centerPoint?.x),
        latitudeDelta: 2,
        longitudeDelta: 2,
      });
    }, 1234);
  };
  const handleOpenMapPicker = () => {
    if (isConnected === false) {
      return ToastAlert('Không có kết nối internet!');
    }

    wmsRef.current?.collapse();
  };

  const handleInfoPress = event => {
    const position = event?.nativeEvent?.position;
    const coor = event?.nativeEvent?.coordinate;
    let x = position?.x;
    let y = position?.y;

    if (Platform.OS === 'android') {
      x = x / PixelRatio.get();
      y = y / PixelRatio.get();
    }

    handleGetInfoRegion(x, y, coor?.latitude, coor?.longitude);
  };

  const handleGetInfoRegion = async (x, y, lat, lon) => {
    const region = currCoor?.region;

    const minX = region?.longitude - region?.longitudeDelta / 2;
    const minY = region?.latitude - region?.latitudeDelta / 2;
    const maxX = region?.longitude + region?.longitudeDelta / 2;
    const maxY = region?.latitude + region?.latitudeDelta / 2;

    const getFeatureLink = `${linkWMS?.getFeatureLink
      }&bbox=${minX},${minY},${maxX},${maxY}&width=${Math.round(
        mapDimension.width,
      )}&height=${Math.round(mapDimension.height)}&x=${Math.round(
        x,
      )}&y=${Math.round(y)}`;

    const regionFeatureInfo = await getRegionInfoData(getFeatureLink);

    if (!regionFeatureInfo) {
      return;
    }

    const properties = regionFeatureInfo?.features[0]?.properties;

    let contentFull = [];
    for (let [key, value] of Object.entries(properties)) {
      for (var i = 0; i < listDisplayLabelFull?.length; i++) {
        if (key.toLowerCase() === listDisplayLabelFull[i].toLowerCase()) {
          contentFull.push({
            label: listDisplayLabelExplantFull[i],
            value: getCodeText(key, value),
          });
        }
      }
    }
    const dataRegion = {
      latitude: roundNumber(lat, 5),
      longitude: roundNumber(lon, 5),
      content: contentFull,
    };

    setRegionData(dataRegion);

    setTimeout(() => {
      setToggleRegionData(true);
    });
  };

  const onLayout = event => {
    const { height, width } = event.nativeEvent.layout;
    setMapDimension({ width, height });
  };

  const displayFileInfo = item => {
    setPropsPicker(item.feature.properties);

    setToggleFileField(true);
  };
  const closeFileInfo = () => {
    setToggleFileField(false);
  };

  const handleZoomUserLocation = async () => {
    const coor = await getCurrCoords();
    const data = {
      latitude: coor?.latitude,
      longitude: coor?.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    try {
      animatedToRegion(data);
    } catch (err) {
      ToastAlert('Chưa có thông tin vị trí người dùng!');
    }
  };

  const handleCloseMapSetting = () => { };
  const handlePickMap = item => {
    setMapType(item.map);
  };
  const handleChangeMapStatus = (state, position) => {
    switch (position) {
      case 0:
        return setObjectDraw(state);
      // case 1:
      //   return setObjectPhoto(state);
      case 1:
        return setObjectFile(state);
      case 2:
        return setObjectWMS(state);
    }
  };

  const handlePress = e => {
    if (
      toolMode &&
      toolMode?.name !== 'GPSLineString' &&
      toolMode?.name !== 'GPSPolygon'
    ) {
      handleToolPress(e);
    } else {
      handleInfoPress(e);
    }
  };

  const toolContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      toggleTool.value,
      [false, true],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const bottom = interpolate(
      toggleTool.value,
      [false, true],
      [-40, 30],
      Extrapolation.CLAMP,
    );

    return {
      opacity: withSpring(opacity, { duration: 400 }),
      bottom: withTiming(bottom, { duration: 400 }),
    };
  });

  const locationInfoStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      toggleLocationInfo.value,
      [true, false],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      toggleLocationInfo.value,
      [true, false],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity: withTiming(opacity, { duration: 333 }),
      transform: [{ scale: withTiming(scale, { duration: 333 }) }],
    };
  });

  const toggleBtnStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      toggleLocationInfo.value,
      [true, false],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      toggleLocationInfo.value,
      [true, false],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: withTiming(opacity, { duration: 300 }),
      transform: [{ scale: withTiming(scale, { duration: 200 }) }],
    };
  });

  const toolOnStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      toggleTool.value,
      [true, false],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      toggleTool.value,
      [true, false],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: withSpring(opacity, { duration: 300 }),
      transform: [{ scale: withTiming(scale, { duration: 200 }) }],
    };
  });

  const iconPhotoData = [
    // <RoundBtn shadow={false}
    //   icon={Images.camera}
    //   iconColor={'#a1d3ff'}
    //   iconSize={iconSize * 1.7}
    //   event={handleOpenCamera}
    // />,
    // <RoundBtn shadow={false}
    //   icon={Images.imggallery}
    //   iconSize={iconSize * 1.7}
    //   event={handleOpenImgLib}
    // />,
  ];
  const iconProjectionData = [
    <RoundBtn shadow={false}
      icon={Images.geolocation}
      iconSize={iconSize * 1.7}
      event={handleOpenPrjSys}
    />,
    <RoundBtn shadow={false}
      icon={Images.layers}
      iconSize={iconSize * 1.7}
      event={handleOpenMapSetting}
    />,
  ];
  const toolIcon = [
    <RoundBtn
      bdRadius={50}
      shadow={false}
      icon={Images.point}
      iconColor={Colors.WHITE}
      pd={pad}
      btnColor={Colors.DEFAULT_GREEN}
      event={handlePickMode}
    />,
    <RoundBtn
      bdRadius={50}
      shadow={false}
      icon={Images.line}
      iconColor={Colors.WHITE}
      pd={pad}
      btnColor={Colors.DEFAULT_GREEN}
      event={handlePickMode}
    />,
    <RoundBtn
      bdRadius={50}
      shadow={false}
      icon={Images.polygon}
      iconColor={Colors.WHITE}
      pd={pad}
      btnColor={Colors.DEFAULT_GREEN}
      event={handlePickMode}
    />,
    <RoundBtn
      bdRadius={50}
      shadow={false}
      icon={Images.line}
      iconColor={Colors.WHITE}
      pd={pad}
      btnColor={Colors.GOOGLE_BLUE}
      event={handlePickMode}
    />,
    <RoundBtn
      bdRadius={50}
      shadow={false}
      icon={Images.polygon}
      iconColor={Colors.WHITE}
      pd={pad}
      btnColor={Colors.GOOGLE_BLUE}
      event={handlePickMode}
    />,
  ];

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View style={styles.container}>
        <MapView
          key={mapRender}
          ref={mapViewRef}
          style={styles.mapContainer}
          provider="google"
          initialRegion={VNCoor}
          mapType={mapType}
          onLongPress={handleLongPressMap}
          onRegionChangeComplete={handleCompleteChange}
          onPress={handlePress}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsScale={true}
          onLayout={onLayout}>
          {searchCoorTemp?.length != 0 &&
            searchCoorTemp.map((item, index) => {
              return <Marker key={index} coordinate={item?.coor} />;
            })}
          {/* {objectPhoto &&
          photos?.length != 0 &&
          photos.map((item, index) => {
            return (
              <Marker
                key={index}
                tappable={toolMode ? false : true}
                onPress={() => {
                  toolMode ? null : handleIconPress(item);
                }}
                coordinate={{
                  latitude: item?.latitude,
                  longitude: item?.longitude,
                }}>
                <Image
                  source={Images.cameraMarker}
                  style={{ width: 50, height: 50 }}
                />
                <Callout
                  pointerEvents={toolMode ? 'none' : 'auto'}
                  style={isIOS ? null : styles.calloutContainer}
                  tooltip={isIOS ? true : false}
                  onPress={toolMode ? null : handleImgPress}>
                  {isIOS && (
                    <FastImage
                      source={{
                        uri: item.img,
                      }}
                      style={styles.imgRender}
                    />
                  )}
                </Callout>
              </Marker>
            );
          })} */}
          {linegonMarker?.length != 0 &&
            linegonMarker?.map((item, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: item?.latitude,
                    longitude: item?.longitude,
                  }}
                  // anchor={{ x: 0.5, y: 0.5 }}
                  tappable={false}>
                  <Image source={Images.pin} style={{ width: 18, height: 18 }} />
                </Marker>
              );
            })}
          {undoArr?.length != 0 && (
            <Geojson
              geojson={{
                type: 'FeatureCollection',
                features: undoArr,
              }}
            />
          )}
          {objectDraw && geojson?.length != 0 && (
            <Geojson
              geojson={{
                type: 'FeatureCollection',
                features: geojson,
              }}
              tappable={toolMode ? false : true}
              onPress={handleOpenEdit}
            />
          )}
          {objectFile &&
            files &&
            files.map((item, index) => {
              if (!item.isVisible) {
                return;
              }

              return (
                <>
                  {item.type == 'mbtiles' ? (
                    <UrlTile
                      key={item.name}
                      urlTemplate={`file://${item.mbtiles}/{z}/{x}/{y}.png`}
                      offlineMode={true}
                    />
                  ) : (
                    <Geojson
                      key={index}
                      geojson={item.geojson}
                      strokeColor={item.strokeColor}
                      fillColor={item.fillColor}
                      strokeWidth={item.strokeWidth}
                      color={item.color}
                      tappable={toolMode ? false : true}
                      onPress={displayFileInfo}
                    />
                  )}
                </>
              );
            })}
          {objectWMS && linkWMS && (
            <WMSTile
              urlTemplate={linkWMS?.getMapLink}
              opacity={1}
              zIndex={100}
              tileSize={512}
            />
          )}
          {/* <Polygon
          coordinates={linegonMarker}
          fillColor="rgba(255, 0, 0, 0.5)"
          strokeColor="rgba(0, 0, 0, 0.5)"
          strokeWidth={2}
        /> */}
        </MapView>

        <Animated.View
          style={[
            styles.headerBtnContainer,
            {
              top: 80,
            },
            toolOnStyle,
          ]}
          pointerEvents={toggleTool.value ? 'none' : 'auto'}>
          <View style={{ alignItems: 'flex-start' }}>
            <BackBtn2
              iconSize={iconSize}
              event={handleBack}
              w={iconSize * 2.3}
              mBottom={btnSpace}
            />

            <View>
              <Animated.View
                style={[
                  toggleBtnStyle,
                  StyleSheet.absoluteFill,
                  { alignItems: 'flex-start' },
                ]}>
                <RoundBtn shadow={false}
                  icon={Images.maximize}
                  iconColor={Colors.WHITE}
                  iconSize={30}
                  event={handleToggleInfo}
                />
              </Animated.View>

              <Animated.View
                style={[styles.coorInfoContainer, locationInfoStyle]}>
                <View style={[rowAlignCenter, { justifyContent: 'space-between' }]}>
                  <Text style={styles.titleInfoText}>{currPrj?.zone}</Text>
                  <RoundBtn shadow={false}
                    icon={Images.down}
                    bdRadius={50}
                    iconColor={Colors.WHITE}
                    iconSize={26}
                    event={handleToggleInfo}
                  />
                </View>
                <Text style={styles.coorInfoText}>
                  Khu vực: {currPrj?.province}
                </Text>
                <Text style={styles.coorInfoText}>
                  X người dùng: {roundNumber(currCoor?.xUser, 3)}
                </Text>
                <Text style={styles.coorInfoText}>
                  Y người dùng: {roundNumber(currCoor?.yUser, 3)}
                </Text>
                <Text style={styles.coorInfoText}>
                  X tâm bản đồ: {roundNumber(currCoor?.xCenter, 3)}
                </Text>
                <Text style={styles.coorInfoText}>
                  Y tâm bản đồ: {roundNumber(currCoor?.yCenter, 3)}
                </Text>
                <Text style={styles.coorInfoText}>
                  Sai số vệ tinh: {currCoor?.accuracy} m
                </Text>
              </Animated.View>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.headerBtnContainer,
            {
              top: 80,
              right: 8,
            },
            toolOnStyle,
          ]}
          pointerEvents={toggleTool.value ? 'none' : 'auto'}>
          <View style={{ alignItems: 'flex-end' }}>
            <StaggerCustom
              mainIcon={
                <RoundBtn shadow={false}
                  icon={Images.setting}
                  iconSize={iconSize + 3}
                  iconColor={Colors.WHITE}
                  pd={10}
                  btnColor={Colors.GOOGLE_BLUE}
                  bdRadius={50}
                />
              }
              iconData={iconProjectionData}
              mb={btnSpace}
              placement={'left'}
            />

            <StaggerCustom
              mainIcon={
                <RoundBtn shadow={false} icon={Images.photos} iconSize={iconSize + 23} />
              }
              iconData={iconPhotoData}
              placement={'left'}
              mb={btnSpace}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.headerBtnContainer,
            {
              top: 185,
              right: 8,
            },
            toolOnStyle,
          ]}
          pointerEvents={toggleTool.value ? 'none' : 'auto'}>
          <View style={{ alignItems: 'flex-end' }}>

            <RoundBtn shadow={false}
              icon={Images.gps}
              iconSize={iconSize * 2}
              event={handleOpenCoorModal}
              mBottom={btnSpace}
            />

            <RoundBtn shadow={false}
              icon={Images.userLocation}
              iconSize={iconSize * 2}
              event={handleZoomUserLocation}
              mBottom={btnSpace}
            />
          </View>
        </Animated.View>

        <View style={styles.focusContainer} pointerEvents="none">
          <Image source={Images.focus} style={styles.focusImg} />
        </View>

        <View style={{ position: 'absolute', left: wp('3.6%'), bottom: hp('4%') }}>
          <StaggerCustom
            mainIcon={
              <RoundBtn
                shadow={false}
                icon={Images.add}
                iconSize={iconSize + 6}
                iconColor={Colors.WHITE}
                pd={12}
                btnColor={Colors.DEFAULT_GREEN}
                bdRadius={50}
              />
            }
            iconData={toolIcon}
            placement={'top'}
          />
        </View>

        <Animated.View style={[styles.infoDraw, toolContainerStyle]}>
          {toolMode?.name == 'LineString' && (
            <Text style={styles.txtInfoDraw}>
              Khoảng cách:{' '}
              <Text style={{ fontWeight: 'bold', color: Colors.DEFAULT_BLUE }}>
                {Math.round(distanceCur)}
              </Text>{' '}
              m
            </Text>
          )}
          {toolMode?.name == 'Polygon' && (
            <Text style={styles.txtInfoDraw}>
              Diện tích:{' '}
              <Text style={{ fontWeight: 'bold', color: Colors.DEFAULT_BLUE }}>
                {areaCur}
              </Text>{' '}
              Ha
            </Text>
          )}
        </Animated.View>

        <Animated.View style={[styles.edittingContainer, toolContainerStyle]}>
          <View
            style={[rowAlignCenter, { justifyContent: 'space-around', flex: 1 }]}>
            <RoundBtn shadow={false} icon={Images.miniClose} event={handleOffMapTool} />
            <RoundBtn shadow={false}
              icon={Images.undo}
              event={handleUndo}
              disabled={checkGPSMode() ? true : undoArr?.length == 0}
              iconColor={
                checkGPSMode() || undoArr?.length != 0
                  ? Colors.DEFAULT_BLACK
                  : Colors.DEFAULT_GREY
              }
            />
            <RoundBtn shadow={false}
              icon={Images.redo}
              event={handleRedo}
              disabled={checkGPSMode() ? true : redoArr?.length == 0}
              iconColor={
                checkGPSMode() || redoArr?.length != 0
                  ? Colors.DEFAULT_BLACK
                  : Colors.DEFAULT_GREY
              }
            />
            <RoundBtn shadow={false}
              icon={Images.targetLocation}
              event={targetUserLocation}
              disabled={checkGPSMode()}
              iconColor={
                checkGPSMode() ? Colors.DEFAULT_GREY : Colors.DEFAULT_BLACK
              }
            />
            <RoundBtn shadow={false} icon={Images.save} event={handleSaveGeojson} />

            {toolMode && (
              <RoundBtn shadow={false}
                icon={toolMode.img}
                btnColor={
                  checkGPSMode() ? Colors.GOOGLE_BLUE : Colors.DEFAULT_GREEN
                }
                pd={10}
                iconColor={Colors.WHITE}
                bdRadius={50}
              />
            )}
          </View>
        </Animated.View>

        {/* {currCoor && (
        <ProjectionSystem
          ref={projectionSysRef}
          onPicker={handlePickerPrj}
          prjData={vn2000Prj}
          prjVal={currPrj}
        />
      )} */}

        {/* <CoorSearchModal
          modalVisible={toggleCoorModal}
          setModalVisible={setToggleCoorModal}
          latValue={latText}
          setLatVal={setLatText}
          longVal={longText}
          setLongVal={setLongText}
          dropData={vn2000Prj}
          fieldVal={{ label: 'zone', value: 'epsg_code' }}
          dropVal={vn2000Picker}
          setDropVal={setVn2000Picker}
          event={handleFindCoor}
        /> */}

        {/* <ImageLibrary ref={imgLibRef} id={id} /> */}

        {files && (
          <FileAlbumn
            id={id}
            ref={mapFileRef}
            files={files}
            setFiles={setFiles}
            storeObj={storeObj}
            animateToFile={animatedToRegion}
          />
        )}

        {/* {imgPicker && (
        <FullScreenImg
          img={imgPicker.photo}
          toggle={toggleImgPicker}
          setToggle={setToggleImgPicker}
        />
      )} */}

        {/* <WebMapService ref={wmsRef} onOpenWMS={handleOpenWMS} /> */}

        <DeleteAnimation toggleVal={toggleDeleteImg} event={handleOpenRemove} />

        {imgPicker && (
          <ConfirmActions
            ref={removeRef}
            deleteText={'ảnh'}
            onCancel={handleCloseRemove}
            prjInfo={{ prjName: imgPicker?.id }}
            onRemove={handleRemove}
          />
        )}



        {/* {propsPicker && (
        <FileFieldDetails
          toggleKeyVal={toggleFileField}
          property={propsPicker}
          onClose={closeFileInfo}
        />
      )} */}

        <MapSetting
          ref={mapSettingRef}
          data={mapbase}
          objectDraw={objectDraw}
          // objectPhoto={objectPhoto}
          objectFile={objectFile}
          objectWMS={objectWMS}
          onClose={handleCloseMapSetting}
          onPickMapBase={handlePickMap}
          onChangeMapStatus={handleChangeMapStatus}
        />

        {/* <Modal
        isVisible={toggleRegionData}
        animationIn="fadeInUp"
        animationInTiming={100}
        animationOut="fadeOutDown"
        animationOutTiming={100}
        avoidKeyboard={true}>
        <LandRender
          coor={{
            latitude: regionData?.latitude,
            longitude: regionData?.longitude,
          }}
          data={regionData?.content}
          setToggleModal={setToggleRegionData}
        />
      </Modal> */}

        {loading === true && <Loading bg={true} />}

        {/* {hasPermission && (
        <F4Camera
          isVisible={toggleCamera}
          saveTextBtn={'Lưu'}
          onClose={() => {
            setToggleCamera(false);
          }}
          coors={currPrj}
          onPick={handleSaveImg}
          addCoor={true}
        />
      )} */}
      </View>
      <View style={styles.footer}>
        <View>
          <RoundBtn
            icon={Images.wms}
            iconColor={Colors.GOOGLE_BLUE}
            iconSize={iconSize * 1.5}
            event={handleOpenMapPicker}
            mBottom={Dimension.boxHeight(3)}
            shadow={false}
          />
          <Text style={styles.textIcon}>Bản đồ</Text>
        </View>
        <View>
          <RoundBtn
            shadow={false}
            icon={Images.folder}
            iconColor={'#FFDA76'}
            iconSize={iconSize * 1.5}
            event={handleOpenAllDoc}
            mBottom={Dimension.boxHeight(3)}
          />
          <Text style={styles.textIcon}>Mbtile</Text>
        </View>
        <View>
          <RoundBtn
            icon={Images.fire_point}
            iconSize={iconSize * 1.5}
            event={() => navigation.navigate('ListFirePoint', { title: 'Danh sách điểm cháy' })}
            mBottom={Dimension.boxHeight(3)}
            shadow={false}
          />
          <Text style={styles.textIcon}>Điểm cháy</Text>
        </View>
        <View>
          <RoundBtn
            icon={Images.contact}
            iconSize={iconSize * 1.5}
            event={handleOpenMapPicker}
            mBottom={Dimension.boxHeight(3)}
            shadow={false}
          />
          <Text style={styles.textIcon}>Liên hệ</Text>
        </View>
      </View>
      {objPicker && (
        <ObjectDetail
          ref={detailObj}
          id={id}
          projection={currPrj}
          objectInfo={objPicker}
          onSave={handleEdit}
          onClose={handleCloseEditting}
          onRemove={handleRemoveObj}
          onChangeBottom={handleBottomSheetClose}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1
  },

  headerBtnContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3%'),
    flexDirection: 'row',
    position: 'absolute',
  },

  coorInfoContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 10,
  },

  titleInfoText: {
    color: Colors.DEFAULT_GREEN,
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: wp('3.6%'),
  },

  coorInfoText: {
    color: Colors.WHITE,
    fontFamily: Fonts.SF_MEDIUM,
    fontSize: wp('3.3%'),
  },

  focusContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  focusImg: {
    height: 36,
    width: 36,
  },

  markerImg: {
    width: 12,
    height: 12,
  },

  imgRender: {
    width: Platform.OS === 'android' ? 100 : 50,
    height: Platform.OS === 'android' ? 100 : 50,
    borderRadius: Platform.OS === 'android' ? 0 : 50,
    borderWidth: 1,
    borderColor: Colors.FABEBOOK_BLUE,
  },

  calloutContainer: {
    width: 66,
    height: 90,
    borderRadius: 50,
  },

  edittingContainer: {
    position: 'absolute',
    right: 70,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '66%',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 30,
  },

  infoDraw: {
    position: 'absolute',
    left: 20,
    top: 50,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: '90%',
    height: '4%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  txtInfoDraw: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.DARK_ONE,
  },
  footer: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textIcon: {
    ...fontDefault,
  }
});

export default MapScreen;