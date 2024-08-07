import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
  } else {
    await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
    await messaging().requestPermission({
      alert: true,
      announcement: true,
      badge: true,
      carPlay: false,
      provisional: false,
      sound: true,
    });
  }
};
