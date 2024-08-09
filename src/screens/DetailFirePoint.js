import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fontDefault} from '../contants/Variable';
import Dimension from '../contants/Dimension';
import Fonts from '../contants/Fonts';
import Header from '../components/Header';
import {shadowIOS} from '../contants/propsIOS';
import Colors from '../contants/Colors';
import {transformLatLng} from '../utils/converProject';
import {TextBtn} from '../components/AllBtn';

const DetailFirePoint = ({navigation, route}) => {
  const {title, data} = route.params;
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Header navigation={navigation} title={title} />
        <ScrollView style={styles.listItem}>
          <View
            style={{
              marginBottom: hp('2%'),
              marginHorizontal: wp('2%'),
              elevation: 6,
              ...shadowIOS,
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 4,
            }}>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Kinh độ: </Text>
                <Text style={styles.text}>
                  {Math.floor(
                    transformLatLng(
                      data.geometry.coordinates[1],
                      data.geometry.coordinates[0],
                      49,
                    ).lat * 100,
                  ) / 100}{' '}
                  ({data.geometry.coordinates[0]})
                </Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Kinh độ: </Text>
                <Text style={styles.text}>
                  {Math.floor(
                    transformLatLng(
                      data.geometry.coordinates[1],
                      data.geometry.coordinates[0],
                      49,
                    ).lat * 100,
                  ) / 100}{' '}
                  ({data.geometry.coordinates[0]})
                </Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Độ sáng: </Text>
                <Text style={styles.text}>{data.properties.BRIGHTNESS}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Scan: </Text>
                <Text style={styles.text}>{data.properties.SCAN}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Track: </Text>
                <Text style={styles.text}>{data.properties.TRACK}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Ngày chụp: </Text>
                <Text style={styles.text}>{data.properties.ACQ_DATE}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Giời chụp: </Text>
                <Text style={styles.text}>{data.properties.ACQ_TIME}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Vệ tinh: </Text>
                <Text style={styles.text}>{data.properties.SATELLITE}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Độ tin cậy: </Text>
                <Text style={styles.text}>{data.properties.CONFIDENCE}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Phiên bản vệ tinh: </Text>
                <Text style={styles.text}>{data.properties.VERSION}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Độ sáng kênh 31: </Text>
                <Text style={styles.text}>{data.properties.BRIGHT_T31}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Thời gian chụp: </Text>
                <Text style={styles.text}>{data.properties.DAYNIGHT}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Mã tỉnh:</Text>
                <Text style={styles.text}>{data.properties.MATINH}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Tên tỉnh:</Text>
                <Text style={styles.text}>{data.properties.TINH}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Mã huyện:</Text>
                <Text style={styles.text}>{data.properties.MAHUYEN}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Tên huyện:</Text>
                <Text style={styles.text}>{data.properties.HUYEN}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Mã xã:</Text>
                <Text style={styles.text}>{data.properties.MAXA}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Tên xã:</Text>
                <Text style={styles.text}>{data.properties.XA}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Tiểu khu:</Text>
                <Text style={styles.text}>{data.properties.TIEUKHU}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Khoảnh:</Text>
                <Text style={styles.text}>{data.properties.KHOANH}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Lô:</Text>
                <Text style={styles.text}>{data.properties.LO}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Mã MALDLR:</Text>
                <Text style={styles.text}>{data.properties.MALDLR}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>LDLR:</Text>
                <Text style={styles.text}>{data.properties.LDLR}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Chủ rừng: </Text>
                <Text style={styles.text}>{data.properties.CHURUNG}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Tình trạng xác minh: </Text>
                <Text style={styles.text}>
                  {data.properties.XACMINH == 1
                    ? ' Chưa xác minh'
                    : data.properties.XACMINH == 2
                    ? ' Xác minh là cháy rừng'
                    : data.properties.XACMINH == 3
                    ? ' Xác minh không phải cháy rừng'
                    : ' Xác minh có cháy nhưng không phải cháy rừng'}
                </Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Tình trạng kiểm duyệt: </Text>
                <Text style={styles.text}>
                  {data.properties.KIEMDUYET == 1
                    ? 'Đã kiểm duyệt'
                    : 'Chưa kiểm duyệt'}
                </Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  gap: Dimension.boxWidth(5),
                }}>
                <TextBtn
                  text={'Xem trên bản đồ'}
                  flex={true}
                  pd={15}
                  btnColor={'#5B99C2'}
                  textFont={Fonts.RB_BOLD}
                  event={() =>
                    navigation.navigate('MapScreen', {
                      title: 'Bản đồ',
                      firePoint: [data],
                    })
                  }
                />
                {data.properties.KIEMDUYET == 0 ? (
                  <TextBtn
                    text={'Xác minh điểm cháy'}
                    flex={true}
                    pd={15}
                    btnColor={Colors.DEFAULT_GREEN}
                    textFont={Fonts.RB_BOLD}
                  />
                ) : null}
              </View>
              <View style={styles.borderButtom}></View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  text: {
    ...fontDefault,
    fontSize: Dimension.fontSize(15),
    flex: 1,
  },
  label: {
    ...fontDefault,
    fontFamily: Fonts.RB_BOLD,
    fontSize: Dimension.fontSize(15),
    flex: 1,
  },
  listItem: {
    marginTop: Dimension.setHeight(3),
    padding: Dimension.boxWidth(10),
  },
  item: {
    padding: 10,
  },
  borderButtom: {
    marginTop: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.DARK_FIVE,
  },
});

export default DetailFirePoint;
