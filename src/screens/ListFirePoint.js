import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../components/Header";
import { fontDefault } from "../contants/Variable";
import Dimension from "../contants/Dimension";
import Fonts from "../contants/Fonts";
import Colors from "../contants/Colors";
import { Checkbox } from "native-base";
import { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TextBtn } from "../components/AllBtn";
import Images from "../contants/Images";
import { compareDate, formatDate, formatDateToPost } from "../utils/dateTimeFunc";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getFirePointDate } from "../redux/apiRequest";
import { shadowIOS } from "../contants/propsIOS";

const ListFirePoint = ({ navigation, route }) => {
  const { title } = route.params;
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
  const handleChange = value => {
    setSelectedValue(
      selectedValue === value ? (value === '1' ? '2' : '1') : value,
    );
    setDailyCheck(!dailyCheck);
    setHisCheck(!hisCheck);
    setLoadData(false);
  };

  const handlePickDate = date => {
    setLoadData(false);
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
      console.log(firePoint);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const RenderItem = ({ item, index }) => {
    console.log('item', item);
    return (
      <TouchableOpacity
        style={{
          marginBottom: hp('2%'),
          marginHorizontal: wp('2%'),
          elevation: 6,
          ...shadowIOS,
          backgroundColor: '#ffffff',
          borderRadius: 16,
        }}
        onPress={() => console.log(item)}
      >
        {/* {item.properties.XACMINH == 1 && (
        )} */}
        <Image source={Images.fire_notconfirmed} style={styles.firePointImg} />
      </TouchableOpacity>
    )
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Header navigation={navigation}
          title={title} />
        <View style={styles.conten}>
          <View style={styles.header} >
            <Text style={styles.label} >Lựa chọn điểm cháy</Text>
          </View>
          <View style={styles.containerCheckBox} >
            <View
              style={styles.checkbox}>
              <Checkbox
                value="1"
                isChecked={selectedValue === '1'}
                onChange={() => handleChange('1')}
                my={1}>
                Dữ liệu cháy trong 24h qua
              </Checkbox>
            </View>
            <View
              style={styles.checkbox}>
              <Checkbox
                value="2"
                isChecked={selectedValue === '2'}
                onChange={() => handleChange('2')}
                my={1}>
                Lịch sử điểm cháy
              </Checkbox>
            </View>
            {hisCheck && (
              <View style={styles.containerCalendar}>
                <TouchableOpacity
                  onPress={() => {
                    setCheckPick(true);
                    setToggleDatePicker(true);
                  }}
                  style={styles.calendar}
                >
                  <View style={styles.calendarText}>
                    <Text style={styles.text}>{startDay}</Text>
                  </View>
                  <Image style={styles.calendarImage} source={Images.calendar} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setCheckPick(false);
                    setToggleDatePicker(true);
                  }}
                  style={styles.calendar}
                >
                  <View style={styles.calendarText}>
                    <Text style={styles.text}>{endDay}</Text>
                  </View>
                  <Image style={styles.calendarImage} source={Images.calendar} />
                </TouchableOpacity>
              </View>

            )}
            {!isLoadData ? (
              <TextBtn
                text={'Tải dữ liệu'}
                btnColor={'#5B99C2'}
                W={'100%'}
                pd={15}
                textFont={Fonts.RB_BOLD}
                mTop={Dimension.setHeight(2)}
                event={handleDownData}
              />
            ) : (

              <TextBtn
                text={'Mở trong bản đồ'}
                btnColor={'#5B99C2'}
                W={'100%'}
                pd={15}
                textFont={Fonts.RB_BOLD}
                mTop={Dimension.setHeight(2)}
              // event={() => console.log(firePoint)}
              />
            )
            }
          </View>
          <DateTimePickerModal
            isVisible={toggleDatePicker}
            mode="date"
            onConfirm={handlePickDate}
            onCancel={() => {
              setToggleDatePicker(false);
            }}
          />
          <View style={styles.header}>
            <Text style={styles.label} >Điểm cháy trong ngày</Text>
          </View>
        </View>
        {firePoint.length === 0 ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: Dimension.setWidth(60), height: Dimension.setWidth(60) }} source={Images.empty} />
            <Text style={styles.text}>Không có điểm cháy trong ngày</Text>
          </View>

        ) : (
          firePoint?.map((item, index) => {
            <RenderItem item={item} index={index} />
          })
        )
        }
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  text: {
    ...fontDefault,
    fontSize: Dimension.fontSize(15),
  },
  label: {
    ...fontDefault,
    fontFamily: Fonts.RB_BOLD,
    fontSize: Dimension.fontSize(15),
  },
  listItem: {
    marginTop: Dimension.setHeight(3),
    padding: Dimension.boxWidth(10)
  },
  item: {
    padding: 10
  },
  conten: {
    marginHorizontal: wp('2%')
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', paddingHorizontal:
      Dimension.boxWidth(20),
    gap: 10,
    marginTop: Dimension.setHeight(2)
  },
  calendarText: {
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    borderRadius: 4,
    height: Dimension.boxHeight(40),
    justifyContent: 'center',
    borderColor: Colors.DARK_FIVE
  },
  calendarImage: {
    width: Dimension.boxWidth(30),
    height: Dimension.boxWidth(30),
    resizeMode: "cover"
  },
  header: {
    marginTop: Dimension.setHeight(2),
    paddingVertical: Dimension.setHeight(2),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.LIGHT_GREY2,
    borderBottomColor: Colors.LIGHT_GREY2,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Dimension.setHeight(2)
  },
  checkbox: {
    // marginTop: Dimension.setHeight(2),
    borderBottomColor: Colors.LIGHT_GREY2,
    borderBottomWidth: 1,
    padding: Dimension.setHeight(2),
  }
})

export default ListFirePoint;