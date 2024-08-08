import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

const storeObjData = (key, val) => {
  storage.set(key, JSON.stringify(val));
};

const readObjData = key => {
  const jsonData = storage.getString(key);
  return jsonData !== null && jsonData !== undefined
    ? JSON.parse(jsonData)
    : null;
};
const deleteObjData = async key => {
  await storage.removeItem(key);
};

export {storeObjData, readObjData, deleteObjData};
