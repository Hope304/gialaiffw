import {
  Image,
  ImageBackground,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Images from '../contans/Images';
import Dimension from '../contans/Dimension';
import Slide from '../components/Carousel';
import Colors from '../contans/Colors';
import { RoundBtn } from '../components/AllBtn';
import { HStack, Spinner } from 'native-base';
import { getFormattedDate, getVietnameseDayOfWeek } from '../utils/dateTimeFunc';
import { shadowIOS } from '../contans/propsIOS';
import { getCommuneName, getWeatherData } from '../redux/apiRequest';
import { requestPermissions } from '../utils/permissionFunc';
import { fontDefault } from '../contans/Variable';
import Fonts from '../contans/Fonts';
import { useFocusEffect } from '@react-navigation/native';
const defaultW = wp('100%');
const defaultH = hp('60%');

const data = [Images.img1, Images.img2, Images.img3, Images.img4];

const HomeScreen = ({ navigation }) => {
  const [weather, setWeather] = useState(null);
  const weekdays = getVietnameseDayOfWeek();
  const date = getFormattedDate();
  const [communeName, setCommuneName] = useState(null);
  const fetchImportantData = async () => {
    try {
      await requestPermissions();
      await fetchCommuneName();
      const res = await getWeatherData();
      setWeather(res);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCommuneName = async () => {
    try {
      await requestPermissions();
      const res = await getCommuneName();
      if (res && res != 0) {
        setCommuneName(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const shareApp = async () => {
    try {
      const result = await Share.share({
        message: `Ứng dụng Gia Lai FFW - Hệ thống cảnh báo cháy gia lai
        Tải xuống IOS: 
        Tải xuống Android: `,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) { }
  };

  useFocusEffect(
    useCallback(() => {
      // getInternalNoti();
      fetchImportantData();
    }, []),
  );

  const handleClickNavigate = (routerName, title) => {
    navigation.navigate(routerName, { title: title });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        resizeMode="cover"
        source={Images.bg}
        style={{ width: defaultW, height: defaultH, marginBottom: hp('4%') }}>
        <View style={styles.appInforContainer}>
          <View>
            <Text style={styles.appNameText}>Gia Lai FFW</Text>
            <Text style={styles.textWelcome}>Welcome</Text>
          </View>
          <Image source={Images.logo} style={styles.logoImg} />
        </View>
        <Slide data={data} stylesContain={{ marginTop: hp('4%') }} />
        <View style={styles.btnContainer}>
          <View>
            <RoundBtn
              icon={Images.levelFire}
              btnColor={Colors.WHITE}
              iconSize={40}
              pd={10}
              bdRadius={10}
              event={() =>
                handleClickNavigate('ListFireLevel', 'Danh sách cấp cháy huyện')
              }
            />
            <Text style={styles.btnText}>Cấp cháy</Text>
          </View>
          <View>
            <RoundBtn
              icon={Images.map}
              btnColor={Colors.WHITE}
              iconSize={40}
              pd={10}

              bdRadius={10}
              event={() => navigation.navigate('MapScreen', { title: 'Bản đồ' })}
            />
            <Text style={styles.btnText}>Bản đồ</Text>
          </View>
          <View>
            <RoundBtn
              icon={Images.ifee}
              btnColor={Colors.WHITE}
              iconSize={40}
              pd={10}
              bdRadius={10}
              event={() => navigation.navigate('Contributor', { title: 'Thông tin tác giả' })}
            />
            <Text style={styles.btnText}>Tác giả</Text>
          </View>
          <View>
            <RoundBtn
              icon={Images.share}
              btnColor={Colors.WHITE}
              iconSize={40}
              pd={10}
              bdRadius={10}
              event={() => shareApp()}
            />
            <Text style={styles.btnText}>Chia sẻ</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.containerWeather}>
        <Text style={styles.textWeather}>Thời tiết</Text>
        <View style={[styles.todayInforContainer]}>
          <View style={styles.calendarContainer}>
            <Image source={Images.calendar} style={styles.calendarImg} />
            <View
              style={{
                marginLeft: Dimension.setWidth(2),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.dayInWeekText}>{weekdays}</Text>
              <Text style={styles.calendarText}>{date}</Text>
            </View>
          </View>
          <View style={styles.weatherContainer}>
            {!weather ? (
              <HStack space={8} justifyContent="center" alignItems="center">
                <Spinner size="sm" />
              </HStack>
            ) : (
              <>
                <Image
                  source={{ uri: weather?.iconUrl }}
                  style={styles.weatherImg}
                />
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.dayInWeekText}>
                    {weather?.temp}°C - {weather?.humidity}%
                  </Text>
                  <Text style={styles.calendarText}>
                    {Math.round(((weather?.wind_kph * 1000) / 3600) * 10) / 10}{' '}
                    m/s -
                    {weather?.wind_degree >= 0 && weather?.wind_degree <= 11.25
                      ? ' Hướng Bắc'
                      : weather?.wind_degree > 11.25 &&
                        weather?.wind_degree <= 33.75
                        ? ' Huớng BĐB'
                        : weather?.wind_degree > 33.75 &&
                          weather?.wind_degree <= 56.25
                          ? ' Huớng ĐB'
                          : weather?.wind_degree > 56.25 &&
                            weather?.wind_degree <= 78.75
                            ? ' Huớng ĐĐB'
                            : weather?.wind_degree > 78.75 &&
                              weather?.wind_degree <= 101.25
                              ? ' Hướng Đông'
                              : weather?.wind_degree > 101.25 &&
                                weather?.wind_degree <= 123.75
                                ? ' Huớng ĐĐN'
                                : weather?.wind_degree > 123.75 &&
                                  weather?.wind_degree <= 146.25
                                  ? ' Huớng ĐN'
                                  : weather?.wind_degree > 146.25 &&
                                    weather?.wind_degree <= 168.75
                                    ? ' Huớng NĐN'
                                    : weather?.wind_degree > 168.75 &&
                                      weather?.wind_degree <= 191.25
                                      ? ' Hướng Nam'
                                      : weather?.wind_degree > 191.25 &&
                                        weather?.wind_degree <= 213.75
                                        ? ' Huớng NTN'
                                        : weather?.wind_degree > 213.75 &&
                                          weather?.wind_degree <= 236.25
                                          ? ' Huớng TN'
                                          : weather?.wind_degree > 236.25 &&
                                            weather?.wind_degree <= 258.75
                                            ? ' Huớng TTN'
                                            : weather?.wind_degree > 258.75 &&
                                              weather?.wind_degree <= 281.25
                                              ? ' Hướng Tây'
                                              : weather?.wind_degree > 281.25 &&
                                                weather?.wind_degree <= 303.75
                                                ? ' Huớng TTB'
                                                : weather?.wind_degree > 303.75 &&
                                                  weather?.wind_degree <= 326.25
                                                  ? ' Huớng TB'
                                                  : weather?.wind_degree > 326.25 &&
                                                    weather?.wind_degree <= 348.75
                                                    ? ' Huớng BTB'
                                                    : ' Hướng Bắc'}
                  </Text>
                  <Text style={styles.calendarText}>
                    {communeName ? communeName : '...'}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appInforContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Dimension.setWidth(5),
    marginTop:
      Platform.OS == 'android'
        ? Dimension.setHeight(5)
        : Dimension.setHeight(6),
    marginBottom: hp('2%'),
  },
  logoImg: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: 50,
  },
  appNameText: {
    fontSize: Dimension.fontSize(23),
    color: Colors.WHITE,
    fontFamily: Fonts.RB_BOLD,
  },
  textWelcome: {
    color: Colors.WHITE,
    fontSize: Dimension.fontSize(16),
    fontFamily: Fonts.RB_BOLD,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Dimension.setWidth(5),
    marginVertical: hp('5%'),
  },
  btnText: {
    marginTop: hp('1%'),
    ...fontDefault,
    fontFamily: Fonts.RB_REGULAR,
  },
  containerWeather: {
    marginHorizontal: Dimension.setWidth(5),
  },
  textWeather: {
    marginTop: hp('5%'),
    ...fontDefault,
    fontFamily: Fonts.RB_MEDIUM,
    fontSize: Dimension.fontSize(25),
    marginBottom: Dimension.setHeight(5),
  },
  todayInforContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: Dimension.setHeight(2.5),
    marginHorizontal: Dimension.setWidth(5),
    backgroundColor: '#f5f5f5',
    elevation: 5,
    ...shadowIOS,
    paddingVertical: Dimension.setHeight(1.8),
    paddingHorizontal: Dimension.setWidth(1.5),
    height: hp('10%'),
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  calendarImg: {
    width: 40,
    height: 40,
  },
  dayInWeekText: {
    fontSize: Dimension.fontSize(16),
    fontFamily: Fonts.RB_BOLD,
    ...fontDefault,
  },
  calendarText: {
    fontSize: Dimension.fontSize(12),
    fontFamily: Fonts.RB_BOLD,
    ...fontDefault,
    marginTop: Platform.OS === 'ios' ? 5 : 0,
    opacity: 0.6,
  },

  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderLeftWidth: 1,
    borderColor: Colors.INACTIVE_GREY,
  },
  weatherImg: {
    width: 50,
    height: 50,
  },
});

export default HomeScreen;
