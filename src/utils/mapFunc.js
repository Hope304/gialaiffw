import Geolocation from 'react-native-geolocation-service';
import proj from 'proj4';
import epsg from 'epsg-to-proj';
import RNFS from 'react-native-fs';
import SQLite from 'react-native-sqlite-storage';

const fileTypeAllow = ['mbtiles'];
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const check = async (path) => {
  try {
    const exists = await RNFS.exists(path);
    if (exists) {
      console.log('Path exists: ', path);
    } else {
      console.log('Path does not exist: ', path);
    }
  } catch (error) {
    console.error(error);
  }
}

const androidPath = '/data/user/0/com.gialaiffw/databases';
const platformPath =
  Platform.OS === 'android' ? androidPath : RNFS.DocumentDirectoryPath;

const readMbtileFile = async (file) => {
  try {
    const { name, uri } = file[0];
    const filePath = platformPath + '/' + name;
    const fileExist = await RNFS.exists(filePath);
    check(fileExist);
    if (!fileExist) {
      await RNFS.copyFile(uri, filePath);
    };
    const mbtileFolderPath = platformPath + '/mbtiles';
    const mbtileFilePath = mbtileFolderPath + '/' + name.split('.')[0];
    const isExist = await RNFS.exists(mbtileFolderPath);
    check(mbtileFilePath);
    if (!isExist) {
      await RNFS.mkdir(mbtileFolderPath);
    }

    await RNFS.mkdir(mbtileFilePath);
    const db = await SQLite.openDatabase({
      name: name,
      location: 'Documents',
    });
    let coor;

    await db.transaction(tx => {
      tx.executeSql(
        'SELECT DISTINCT zoom_level FROM tiles',
        [],
        (tx, { rows }) => {
          const zoomLength = rows?.length;
          for (let i = 0; i < zoomLength; i++) {
            const rowZoom = rows.item(i);
            const zoomPath = mbtileFilePath + '/' + rowZoom.zoom_level;
            RNFS.mkdir(zoomPath);

            tx.executeSql(
              'SELECT DISTINCT tile_column FROM tiles WHERE zoom_level = ' +
              rowZoom.zoom_level,
              [],
              (tx, tileColumn) => {
                const len_column = tileColumn.rows?.length;
                for (let j = 0; j < len_column; j++) {
                  const rowColumn = tileColumn.rows.item(j);
                  const columnPath = zoomPath + '/' + rowColumn.tile_column;
                  RNFS.mkdir(columnPath);

                  tx.executeSql(
                    'SELECT tile_row, tile_data FROM tiles WHERE zoom_level = ' +
                    rowZoom.zoom_level +
                    ' AND tile_column = ' +
                    rowColumn.tile_column,
                    [],
                    (tx, data) => {
                      const len = data.rows?.length;
                      for (let k = 0; k < len; k++) {
                        const y = parseInt(
                          Math.pow(2, parseInt(rowZoom.zoom_level)) -
                          parseInt(data.rows.item(k).tile_row) -
                          1,
                        );

                        const imgPath = columnPath + `/${y}.png`;

                        RNFS.writeFile(
                          imgPath,
                          data.rows.item(k).tile_data,
                          'base64',
                        );
                      }
                    },
                  );
                }
              },
            );
          }
        },
      );

      tx.executeSql('SELECT * FROM metadata', [], (tx, { rows }) => {
        const data = rows.item(rows?.length - 1);
        const coordinate = data.value.split(',');

        // for (let i = 0; i < rows?.length; i++) {
        //   console.log(rows.item(i));
        // }

        coor = { longitude: coordinate[0], latitude: coordinate[1] };

      });
    });
    return { mbtiles: mbtileFilePath, coordinate: coor };
  } catch (error) {
    return false;
  }
};
const detectType = file => {
  return file.split('.').pop();
};
const detectFilePicker = async (file) => {
  const type = detectType(file[0].name);

  if (!fileTypeAllow.includes(type)) {
    return 'Định dạng file không được hỗ trợ!';
  }

  const fileFormat = {
    name: file[0].name,
    size: file[0].size,
    path: file[0].uri,
    type: type,
    isVisible: true,
  };

  const { coordinate, mbtiles } = await readMbtileFile(file);

  return {
    ...fileFormat,
    commonCoor: coordinate,
    mbtiles: mbtiles,
  };
};


function calculateAreaInSquareMeters(x1, x2, y1, y2) {
  return (y1 * x2 - x1 * y2) / 2;
}

function calculateYSegment(latitudeRef, latitude, circumference) {
  return ((latitude - latitudeRef) * circumference) / 360;
}

function calculateXSegment(longitudeRef, longitude, latitude, circumference) {
  return (
    ((longitude - longitudeRef) *
      circumference *
      Math.cos(latitude * (Math.PI / 180))) /
    360
  );
}

const prjTransform = (fromPrj, toPrj, lat, long) => {
  try {
    const longlat = proj(epsg[fromPrj], epsg[toPrj], [
      Number(lat),
      Number(long),
    ]);

    return longlat;
  } catch (error) {
    console.log(error);
  }
};
const deg2rad = deg => {
  return deg * (Math.PI / 180);
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
};

const calculatePolylineLength = arr => {
  let totalLength = 0;

  for (let i = 0; i < arr?.length - 1; i++) {
    const lon1 = arr[i][0];
    const lat1 = arr[i][1];
    const lon2 = arr[i + 1][0];
    const lat2 = arr[i + 1][1];

    totalLength += calculateDistance(lat1, lon1, lat2, lon2);
  }

  return totalLength;
};
const roundNumber = (num, dec) => {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);

};
const calculateAreaPolygonHa = arr => {
  const radius = 6371000;

  const diameter = radius * 2;
  const circumference = diameter * Math.PI;
  const listY = [];
  const listX = [];
  const listArea = [];

  const latitudeRef = arr[0][1];
  const longitudeRef = arr[0][0];
  for (let i = 1; i < arr?.length; i++) {
    let latitude = arr[i][1];
    let longitude = arr[i][0];
    listY.push(calculateYSegment(latitudeRef, latitude, circumference));
    listX.push(
      calculateXSegment(longitudeRef, longitude, latitude, circumference),
    );
  }

  for (let i = 1; i < listX?.length; i++) {
    let x1 = listX[i - 1];
    let y1 = listY[i - 1];
    let x2 = listX[i];
    let y2 = listY[i];
    listArea.push(calculateAreaInSquareMeters(x1, x2, y1, y2));
  }

  let areasSum = 0;
  listArea.forEach(area => (areasSum = areasSum + area));

  let areaCalcA = Math.abs(areasSum) / 10000;
  let areaCalc = (
    Math.round(areaCalcA * 1000000000000000) / 1000000000000000
  ).toFixed(2);
  return areaCalc;
};
const calculateAreaPolygonMeter = arr => {
  const radius = 6371000;

  const diameter = radius * 2;
  const circumference = diameter * Math.PI;
  const listY = [];
  const listX = [];
  const listArea = [];

  const latitudeRef = arr[0][1];
  const longitudeRef = arr[0][0];
  for (let i = 1; i < arr?.length; i++) {
    let latitude = arr[i][1];
    let longitude = arr[i][0];
    listY.push(calculateYSegment(latitudeRef, latitude, circumference));
    listX.push(
      calculateXSegment(longitudeRef, longitude, latitude, circumference),
    );
  }

  for (let i = 1; i < listX?.length; i++) {
    let x1 = listX[i - 1];
    let y1 = listY[i - 1];
    let x2 = listX[i];
    let y2 = listY[i];
    listArea.push(calculateAreaInSquareMeters(x1, x2, y1, y2));
  }

  let areasSum = 0;
  listArea.forEach(area => (areasSum = areasSum + area));

  let areaCalc = Math.abs(areasSum);
  return areaCalc;
};

const getCurrCoords = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        resolve({ latitude, longitude });
      },
      err => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  });
};

export {
  getCurrCoords,
  prjTransform, calculateDistance, calculatePolylineLength, roundNumber, calculateAreaPolygonMeter, detectFilePicker, calculateAreaPolygonHa
};