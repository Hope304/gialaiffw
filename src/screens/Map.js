import {
  Box,
  HStack,
  Image,
  Pressable,
  Spacer,
  Text,
  View,
} from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Colors from '../contans/Colors';
import {
  PixelRatio,
  Platform,
  StyleSheet,
} from 'react-native';
import MapView, {
  Callout,
  Geojson,
  MAP_TYPES,
  Marker,
  PROVIDER_GOOGLE,
  UrlTile,
} from 'react-native-maps';
import { defaultProjection, VNCoor } from '../utils/Variable';
import Dimension from '../contans/Dimension';
import { FloatingAction } from 'react-native-floating-action';
import Geolocation from 'react-native-geolocation-service';
import {
  calculateAreaPolygonMeter,
  calculatePolylineLength,
  prjTransform,
  roundNumber,
} from '../utils/mapFunc';
import {
  generateID,
  getCurrentDate,
  getCurrentTime,
} from '../utils/dateTimeFunc';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { readObjData, storeObjData } from '../utils/storageData';
import { useFocusEffect } from '@react-navigation/native';
import ObjectDetail from '../components/ObjectDeltail';
import { RoundBtn } from '../components/AllBtn';
import { rowAlignCenter } from '../contans/CssFE';
import MapSetting from '../components/MapSetting';
import FileAlbumn from '../components/FileAlbumn';
import Images from '../contans/Images';
const mapbase = [
  { title: 'Tích hợp', img: require('../assets/images/Hibirth.png'), map: MAP_TYPES.HYBRID },
  { title: 'Vệ tinh', img: require('../assets/images/basemap.png'), map: MAP_TYPES.SATELLITE },
  { title: 'Giao thông', img: require('../assets/images/Trafict.png'), map: MAP_TYPES.STANDARD },
  { title: 'Địa hình', img: require('../assets/images/Terrain.png'), map: MAP_TYPES.TERRAIN },
];
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
const locationConfig = {
  enableHighAccuracy: true,
  distanceFilter: 3,
  interval: 5000,
  fastestInterval: 5000,
  showsBackgroundLocationIndicator: true,
  showLocationDialog: true,
};

const MapScreen = ({ navigation, route }) => {
  const { firePoint } = route.params;

  const actions = [
    {
      text: 'Thêm điểm mới',
      icon: Images.point,
      name: 'Point',
      position: 1,
    },
    {
      text: 'Thêm đường mới',
      icon: Images.line,
      name: 'LineString',
      position: 2,
    },
    {
      text: 'Thêm vùng mới',
      icon: Images.polygon,
      name: 'Polygon',
      position: 3,
    },
    {
      text: 'Thêm đường tự động GPS',
      icon: Images.line.png,
      name: 'bt_addLineAuto',
      position: 4,
    },
    {
      text: 'Thêm vùng tự động GPS',
      icon: Images.polygon,
      name: 'bt_addPolyAuto',
      position: 5,
    },
  ];
  const mapSettingRef = useRef(null);
  const mapViewRef = useRef(null);
  const detailObj = useRef(null);
  const watchIdRef = useRef(null);
  const mapFileRef = useRef(null);
  const toggleLocationInfo = useSharedValue(true);
  const [currCoor, setCurrCoor] = useState(null);
  const [mapType, setMapType] = useState(MAP_TYPES.HYBRID);
  const [toolMode, setToolMode] = useState(null);
  const [undoArr, setUndoArr] = useState([]);
  const toggleTool = useSharedValue(false);
  const [redoArr, setRedoArr] = useState([]);
  const [geojson, setGeojson] = useState([]);
  const [currPrj, setCurrPrj] = useState(defaultProjection);
  const [objectDraw, setObjectDraw] = useState(true);
  const [linegonMarker, setLinegonMarker] = useState([]);
  const [distanceCur, setDistanceCur] = useState(0);
  const [areaCur, setAreaCur] = useState(0);
  const [objPicker, setObjPicker] = useState(null);
  const [objectFile, setObjectFile] = useState(true);
  const [objectWMS, setObjectWMS] = useState(true);
  const [files, setFiles] = useState([]);
  const getGeoProject = useCallback(async () => {
    try {
      const allPrj = await readObjData('geoProject');
      if (allPrj) {
        setGeojson(allPrj.geojson);
      }
    } catch (error) {
      console.error('Failed to load geo project:', error);
    }
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     getGeoProject();
  //   }, []),
  // );

  // useEffect(() => {
  //   watchIdRef.current = handleWatchPosition();
  //   // fetchVn2000Prj();
  //   return () => {
  //     Geolocation.clearWatch(watchIdRef?.current);
  //   };
  // }, [currPrj]);

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
      const calculateArea = calculateAreaPolygonMeter(updateCoor[0]);
      setAreaCur(calculateArea);
      const updateProps = {
        ...lastItem?.properties,
        editting: isEditting,
        area: `${calculateArea} m²`,
      };

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
  const addPointForPolinegon = coor => {
    setLinegonMarker([...linegonMarker, coor]);
  };

  const handleTempMarker = useCallback(
    (coor, type, state) => {
      console.log('handleTempMarker called', {
        coor,
        type,
        state,
        linegonMarker,
      });
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
    },
    [linegonMarker],
  );

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

    if (newPolygon.checkEditting) {
      newUndo.splice(newUndo?.length - 1, 1, newPolygon.newPolygon);

      setUndoArr(newUndo);
    } else {
      setUndoArr([...undoArr, newPolygon.newPolygon]);
    }
  };
  const createObject = (latitude, longitude, isEditting) => {
    switch (toolMode) {
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
  const handleCloseMapSetting = () => { };
  const handlePickMap = item => {
    setMapType(item.map);
  };
  const handleOpenMapSetting = () => {
    mapSettingRef.current?.collapse();
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

  const animatedToRegion = coor => {
    mapViewRef.current?.animateToRegion(coor, 1111);
  };

  const handleToolPress = e => {
    const coor = e?.nativeEvent?.coordinate;
    createObject(coor?.latitude, coor?.longitude, true);
  };
  const handlePickMode = name => {
    setToolMode(name);
    toggleTool.value = true;
  };
  const clearToolData = useCallback(() => {
    setLinegonMarker([]);
    setUndoArr([]);
    setRedoArr([]);
  }, []);

  const handleUndo = () => {
    let undoTemp = [...undoArr];

    const lastItem = undoTemp.pop();
    const { coordinates, type } = lastItem.geometry;

    if (type != 'Point') {
      handleTempMarker(coordinates, type, true);
    }
    setUndoArr(undoTemp);
    setRedoArr([lastItem, ...redoArr]);
  };

  const handleRedo = () => {
    let redoTemp = [...redoArr];

    const firstItem = redoTemp.shift();
    const { coordinates, type } = firstItem.geometry;

    if (type != 'Point') {
      handleTempMarker(coordinates, type, false);
    }
    setUndoArr([...undoArr, firstItem]);
    setRedoArr(redoTemp);
  };
  const storeObj = useCallback(async obj => {
    try {
      console.log('file', obj);
      // const allPrj = await readObjData('geoProject');
      // const updatedPrj = {
      //   geojson: obj.geojson,
      // };
      // await storeObjData('geoProject', updatedPrj);
    } catch (error) {
      console.log('err', error);
    }
  }, []);

  const handleWatchPosition = useCallback(() => {
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
      },
      err => {
        console.log(err);
      },
      locationConfig,
    );
  }, [currPrj, currCoor]);
  const handleCompleteChange = coor => {
    // closeRemoveBtn();
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

      handleOffMapTool();
      await storeObj(obj);
    } catch (error) {
      console.log(error);
    }
  }, [undoArr]);
  const handleInfoPress = event => {
    const position = event?.nativeEvent?.position;
    const coor = event?.nativeEvent?.coordinate;
    let x = position?.x;
    let y = position?.y;

    if (Platform.OS === 'android') {
      x = x / PixelRatio.get();
      y = y / PixelRatio.get();
    }

    // handleGetInfoRegion(x, y, coor?.latitude, coor?.longitude);
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

  const handlePress = e => {
    if (toolMode && toolMode !== 'GPSLineString' && toolMode !== 'GPSPolygon') {
      handleToolPress(e);
    } else {
      handleInfoPress(e);
    }
  };
  const handleOffMapTool = () => {
    toggleTool.value = false;
    setToolMode(null);
    clearToolData();
    // closeNotifier();
  };
  const handleOpenEdit = useCallback(
    item => {
      setObjPicker(item.feature);
    },
    [objPicker],
  );
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
      [-40, 100],
      Extrapolation.CLAMP,
    );

    return {
      opacity: withSpring(opacity, { duration: 400 }),
      bottom: withTiming(bottom, { duration: 400 }),
    };
  });
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
  const handleOpenAllDoc = () => {
    mapFileRef.current?.collapse();
  };
  const handleCloseEditting = () => {
    detailObj.current?.close();
  };
  const handleBottomSheetClose = idx => {
    if (idx === -1) {
      setObjPicker(null);
    }
  };
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
  const handleToggleInfo = () => {
    toggleLocationInfo.value = !toggleLocationInfo.value;
  };
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
  // const [mapType, setMapType] = useState(MAP_TYPES.HYBRID);
  return (
    <Box flex={1} safeAreaTop width="100%" alignSelf="center">
      <MapView
        ref={mapViewRef}
        style={styles.mapContainer}
        provider={'google'}
        initialRegion={VNCoor}
        mapType={mapType}
        // onLongPress={handleLongPressMap}
        onPress={handlePress}
        onRegionChangeComplete={handleCompleteChange}
        showsScale={true}
        showsUserLocation={true}
        showsMyLocationButton={true}>
        {firePoint?.length != 0 &&
          firePoint?.map((item, index) => {
            const imgSrc = Images.confirmed_fire_not_forest;
            switch (item.properties.XACMINH) {
              case '1':
                imgSrc = Images.fire_notconfirmed;
                break;
              case '2':
                imgSrc = Images.confirmed_fire_forest;
                break;
              case '3':
                imgSrc = Images.confirmed_not_fire;
                break;
            }
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: Number(item.geometry.coordinates[1]),
                  longitude: Number(item.geometry.coordinates[0]),
                }}
                anchor={{ x: 0.5, y: 0.5 }}
                zIndex={10}
                tappable={false}>
                <Image
                  source={imgSrc}
                  alt="target"
                  style={{ width: 50, height: 50 }}
                  resizeMode="cover"
                />
                <Callout
                  style={{ padding: 5 }}
                // onPress={() =>
                //   this.props.navigation.navigate("detailFirePoint", {
                //     item: marker,
                //   })
                // }
                >
                  <View style={styles.bubble}>
                    <View>
                      <Text style={styles.name}>
                        Ngày: {item.properties.ACQ_DATE}
                      </Text>
                      <Text style={styles.name}>
                        Giờ: {item.properties.ACQ_TIME}
                      </Text>
                      <Text style={styles.name}>
                        Tên chủ rừng: {item.properties.CHURUNG}
                      </Text>
                      <Text style={styles.name}>
                        Huyện: {item.properties.HUYEN}
                      </Text>
                      <Text style={styles.name}>Xã: {item.properties.XA}</Text>
                      <Text style={styles.name}>Lô: {item.properties.LO}</Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            );
          })}

        {linegonMarker?.length != 0 &&
          linegonMarker?.map((item, index) => {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: item?.latitude,
                  longitude: item?.longitude,
                }}
                anchor={{ x: -0.1 }}
                tappable={false}>
                <Image
                  source={Images.pin}
                  alt="target"
                  style={{ width: 20, height: 20 }}
                  resizeMode="cover"
                />
              </Marker>
            );
          })}
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
        {undoArr?.length != 0 && (
          <Geojson
            geojson={{
              type: 'FeatureCollection',
              features: undoArr,
            }}
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
      </MapView>
      <View style={styles.iconTool}>
        <RoundBtn
          icon={Images.layers}
          iconSize={18 * 1.7}
          event={handleOpenMapSetting}
        />
      </View>
      <Animated.View style={[styles.edittingContainer, toolContainerStyle]}>
        <View
          style={{
            justifyContent: 'space-around',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Pressable onPress={handleOffMapTool}>
            <Image
              source={Images.miniClose}
              alt="close"
              size={6}
            />
          </Pressable>
          <Pressable onPress={handleUndo}>
            <Image
              source={Images.undo}
              alt="undo"
              size={6}
            />
          </Pressable>
          <Pressable onPress={handleRedo}>
            <Image
              source={Images.redo}
              alt="redo"
              size={6}
            />
          </Pressable>
          {/* <Pressable onPress={targetUserLocation} >
            <Image
              source={require('../assets/images/targetLocation.png')}
              alt="targetLocation"
              size={6}

            />
          </Pressable> */}
          <Pressable onPress={handleSaveGeojson}>
            <Image
              source={Images.save}
              alt="save"
              size={6}
            />
          </Pressable>
        </View>
      </Animated.View>
      <Animated.View style={[styles.infoDraw, toolContainerStyle]}>
        {toolMode == 'LineString' && (
          <Text style={styles.txtInfoDraw}>
            Khoảng cách:{' '}
            <Text style={{ fontWeight: 'bold', color: Colors.DEFAULT_BLUE }}>
              {Math.round(distanceCur)}
            </Text>{' '}
            m
          </Text>
        )}
        {toolMode == 'Polygon' && (
          <Text style={styles.txtInfoDraw}>
            Diện tích:{' '}
            <Text style={{ fontWeight: 'bold', color: Colors.DEFAULT_BLUE }}>
              {Math.round(areaCur) / 10000}
            </Text>{' '}
            Ha
          </Text>
        )}
      </Animated.View>

      <View style={{ position: 'absolute', top: Dimension.setWidth(20) }}>
        <Animated.View
          style={[
            toggleBtnStyle,
            StyleSheet.absoluteFill,
            { alignItems: 'flex-start' },
          ]}>
          <RoundBtn
            icon={Images.maximize}
            iconColor={Colors.WHITE}
            iconSize={30}
            event={handleToggleInfo}
          />
        </Animated.View>

        <Animated.View style={[styles.coorInfoContainer, locationInfoStyle]}>
          <View style={[rowAlignCenter, { justifyContent: 'space-between' }]}>
            <Text style={styles.titleInfoText}>{currPrj?.zone}</Text>
            <RoundBtn
              icon={Images.down}
              bdRadius={50}
              iconColor={Colors.WHITE}
              iconSize={26}
              event={handleToggleInfo}
            />
          </View>
          <Text style={styles.coorInfoText}>Khu vực: {currPrj?.province}</Text>
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

      <HStack
        safeAreaBottom
        justifyContent="center"
        height={Dimension.setHeight(8)}
        px="10">
        <Pressable
          cursor="pointer"
          alignItems="center"
          py="2"
          onPress={() => navigation.navigate('SelectWMSLayerScreen')}>
          <Image
            source={Images.map}
            style={{ width: 30, height: 30 }}
            alt="bản đồ"
          />
          <Text>Bản đồ</Text>
        </Pressable>
        <Spacer />
        <Pressable
          cursor="pointer"
          alignItems="center"
          py="2"
          onPress={() => handleOpenAllDoc()}>
          <Image
            source={Images.mbtiles}
            style={{ width: 30, height: 30 }}
            alt="Mbtiles"
          />
          <Text>Mbtiles</Text>
        </Pressable>
        <Spacer />
        <Pressable
          cursor="pointer"
          alignItems="center"
          py="2"
          onPress={() => navigation.navigate('ListFirePoint')}>
          <Image
            source={Images.fire_point}
            style={{ width: 30, height: 30 }}
            alt="điểm cháy"
          />
          <Text>Điểm cháy</Text>
        </Pressable>
        <Spacer />
        <Pressable
          cursor="pointer"
          alignItems="center"
          py="2"
          onPress={() => console.log('Liên hệ')}>
          <Image
            source={Images.contact}
            style={{ width: 30, height: 30 }}
            alt="liên hệ "
          />
          <Text>Liên hệ</Text>
        </Pressable>
      </HStack>
      <FloatingAction
        actions={actions}
        position="right"
        distanceToEdge={{ vertical: 100, horizontal: 10 }}
        buttonSize={48}
        actionsPaddingTopBottom={3}
        onPressItem={name => handlePickMode(name)}
      />


      {files && (
        <FileAlbumn
          ref={mapFileRef}
          files={files}
          setFiles={setFiles}
          storeObj={storeObj}
          animateToFile={animatedToRegion}
        />
      )}

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
      {objPicker && (
        <ObjectDetail
          ref={detailObj}
          projection={currPrj}
          objectInfo={objPicker}
          onSave={handleEdit}
          onClose={handleCloseEditting}
          onRemove={handleRemoveObj}
          onChangeBottom={handleBottomSheetClose}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    // ...StyleSheet.absoluteFillObject,
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
    // color: Colors.DARK_ONE,
  },
  coorInfoText: {
    color: Colors.WHITE,
    // fontFamily: Fonts.SF_MEDIUM,
    // fontSize: wp('3.3%'),
  },
  titleInfoText: {
    color: Colors.DEFAULT_GREEN,
    // fontFamily: Fonts.SF_MEDIUM,
    // fontSize: wp('3.6%'),
  },

  coorInfoContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 10,
  },
  bubble: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: 150,
  },
  name: {
    fontSize: 10,
    marginBottom: 2,
    marginLeft: 10,
  },
  iconTool: {
    position: 'absolute',
    right: Dimension.setWidth(3),
    top: Dimension.setHeight(8),
  }
});

export default MapScreen;
