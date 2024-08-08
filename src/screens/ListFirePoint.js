import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import {
  Image,
  Text,
  Pressable,
  FlatList,
  // Image,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  VStack,
  HStack,
  Heading,
  ScrollView,
  Spacer,
  Stack,
} from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Loader from 'react-native-modal-loader';
import Moment from 'moment';
import Colors from '../contans/Colors';
import Dimension from '../contans/Dimension';
import {
  compareDate,
  formatDate,
  formatDateToPost,
} from '../untils/dateTimeFunc';
import { getFirePointDate } from '../redux/apiRequest';
// import { mainURL } from "../untils/Variable";

const ListFirePoint = ({ navigation }) => {
  const [toggleDatePicker, setToggleDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dailyCheck, setDailyCheck] = useState(true);
  const [hisCheck, setHisCheck] = useState(false);
  const [isLoadData, setLoadData] = useState(false);
  const [startDay, setStartDay] = useState(formatDate(new Date()));
  const [endDay, setEndDay] = useState(formatDate(new Date()));
  const [checkPick, setCheckPick] = useState(null);
  const [ToastAlert, setToastAlert] = useState(null);
  const [firePoint, setFirePoint] = useState([]);
  const [selectedValue, setSelectedValue] = useState('1');

  // Hàm xử lý khi checkbox thay đổi
  const handleChange = value => {
    setSelectedValue(
      selectedValue === value ? (value === '1' ? '2' : '1') : value,
    );
    setDailyCheck(!dailyCheck);
    setHisCheck(!hisCheck);
    setLoadData(false);
  };

  const handlePickDate = date => {
    setToggleDatePicker(false);
    if (checkPick) {
      const dayStart = formatDate(date);
      setStartDay(dayStart);
    } else {
      const dayEnd = formatDate(date);
      setEndDay(dayEnd);
    }
  };

  const handleDownData = async () => {
    setLoading(true);
    try {
      const data = {
        dateStart: formatDateToPost(startDay),
        dateEnd: formatDateToPost(endDay),
      };
      if (compareDate(startDay, endDay)) {
        const res = await getFirePointDate(data);
        setFirePoint(res);
        if (res.length > 0) {
          setLoadData(true);
        }
      } else {
        console.log('ko hợp lệ');
      }
      setLoading(false);
      console.log(firePoint.length);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Center>
      <ScrollView
        showsVerticalScrollIndicator={false}
        width={Dimension.setWidth(90)}>
        <VStack space={4}>
          <Box>
            <VStack w="100%" space={4}>
              <Badge
                _text={{
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                Lựa chọn điểm cháy
              </Badge>
              <VStack space={4} width="full">
                <Box>
                  <Checkbox
                    value="1"
                    isChecked={selectedValue === '1'}
                    onChange={() => handleChange('1')}
                    my={1}>
                    Dữ liệu cháy trong 24h qua
                  </Checkbox>
                </Box>
                <Box>
                  <Checkbox
                    value="2"
                    isChecked={selectedValue === '2'}
                    onChange={() => handleChange('2')}
                    my={1}>
                    Lịch sử điểm cháy
                  </Checkbox>
                </Box>
              </VStack>
              {hisCheck && (
                <VStack space={4}>
                  <Pressable
                    onPress={() => {
                      setCheckPick(true);
                      setToggleDatePicker(true);
                    }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <Box
                        alignItems="center"
                        flex={1}
                        borderWidth="1"
                        _dark={{
                          borderColor: 'muted.50',
                        }}
                        borderColor="muted.300"
                        padding={3}>
                        <Text>{startDay}</Text>
                      </Box>
                      <Image
                        source={require('../assets/images/calendar.png')}
                        alt="Alternate Text"
                        size="xs"
                      />
                    </Stack>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setCheckPick(false);
                      setToggleDatePicker(true);
                    }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <Box
                        alignItems="center"
                        flex={1}
                        borderWidth="1"
                        _dark={{
                          borderColor: 'muted.50',
                        }}
                        borderColor="muted.300"
                        padding={3}>
                        <Text>{endDay}</Text>
                      </Box>
                      <Image
                        source={require('../assets/images/calendar.png')}
                        alt="Alternate Text"
                        size="xs"
                      />
                    </Stack>
                  </Pressable>
                </VStack>
              )}
              <DateTimePickerModal
                isVisible={toggleDatePicker}
                mode="date"
                onConfirm={handlePickDate}
                onCancel={() => {
                  setToggleDatePicker(false);
                }}
              />
              {!isLoadData ? (
                <Button
                  isLoading={loading}
                  isLoadingText="Đang tải dữ liệu"
                  w="100%"
                  size="lg"
                  shadow="3"
                  onPress={handleDownData}>
                  Tải dữ liệu điểm cháy
                </Button>
              ) : (
                <Button
                  w="100%"
                  size="lg"
                  shadow="3"
                  onPress={() =>
                    navigation.navigate('MapScreen', { firePoint: firePoint })
                  }>
                  Mở trong bản đồ
                </Button>
              )}
            </VStack>
          </Box>
          <Box>
            <Badge
              _text={{
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Điểm cháy trong ngày
            </Badge>
            <Box marginTop={4}>
              {firePoint.length === 0 ? (
                <Box alignItems="center" justifyContent="center">
                  <Image
                    source={require('../assets/images/empty.png')}
                    size="xl"
                    alt='empty'
                    marginBottom={4}
                  />
                  <Text>Không có điểm cháy trong ngày</Text>
                </Box>
              ) : (
                <FlatList
                  data={firePoint}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() =>
                        navigation.navigate('DetailFirePoint', item)
                      }
                      borderBottomWidth="1"
                      _dark={{
                        borderColor: 'muted.50',
                      }}
                      borderColor="muted.300"
                      pl={['0', '4']}
                      pr={['0', '5']}
                      py="1">
                      <HStack alignItems="center" space={5} paddingX={5}>
                        {item.properties.XACMINH == 1 && (
                          <Image
                            source={require('../assets/images/fire_notconfirmed.png')}
                            alt="Alternate Text"
                            size="sm"
                          />
                        )}
                        {item.properties.XACMINH == 2 && (
                          <Image
                            source={require('../assets/images/confirmed_fire_forest.png')}
                            alt="Alternate Text"
                            size="sm"
                          />
                        )}
                        {item.properties.XACMINH == 3 && (
                          <Image
                            source={require('../assets/images/confirmed_not_fire.png')}
                            alt="Alternate Text"
                            size="sm"
                          />
                        )}
                        {item.properties.XACMINH == 4 && (
                          <Image
                            source={require('../assets/images/confirmed_fire_not_forest.png')}
                            alt="Alternate Text"
                            size="sm"
                          />
                        )}
                        <VStack space={0}>
                          <Heading size="xs">
                            {item.properties.XACMINH} -
                            {item.properties.XACMINH == 1
                              ? ' Chưa xác minh'
                              : item.properties.XACMINH == 2
                                ? ' Xác minh là cháy rừng'
                                : item.properties.XACMINH == 3
                                  ? ' Xác minh không phải cháy rừng'
                                  : ' Xác minh có cháy nhưng không phải cháy rừng'}
                          </Heading>
                          <Text style={{ fontSize: 12 }}>
                            Huyện: {item.properties.HUYEN}
                          </Text>
                          <Text style={{ fontSize: 12 }}>
                            Xã: {item.properties.XA}
                          </Text>
                          <Text style={{ fontSize: 12 }}>
                            Thời gian ghi nhận: {item.properties.ACQ_DATE}
                          </Text>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 12 }}>
                              Tiểu khu: {item.properties.TIEUKHU}
                            </Text>
                            <Text style={{ fontSize: 12 }}>
                              {' '}
                              - Khoảnh: {item.properties.KHOANH}
                            </Text>
                            <Text style={{ fontSize: 12 }}>
                              {' '}
                              - Lô: {item.properties.LO}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 12 }}>
                            Độ tin cậy: {item.properties.CONFIDENCE}
                          </Text>
                        </VStack>
                      </HStack>
                    </Pressable>
                  )}
                  keyExtractor={item => item._id}
                />
              )}
            </Box>
          </Box>
        </VStack>
      </ScrollView>
    </Center>
  );
};

export default ListFirePoint;
