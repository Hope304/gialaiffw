import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { fontDefault } from "../contans/Variable";
import Fonts from "../contans/Fonts";
import Dimension from "../contans/Dimension";
import Header from "../components/Header";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { shadowIOS } from "../contans/propsIOS";
import Colors from "../contans/Colors";
import { Center } from "native-base";

const DetailFirePoint = ({ navigation, route }) => {
  const { item, title } = route.params;
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
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Mã tỉnh: </Text>
                <Text style={styles.text} >{item.MATINH}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Tên tỉnh: </Text>
                <Text style={styles.text} >{item.TINH}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Mã huyện: </Text>
                <Text style={styles.text} >{item.MAHUYEN}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Tên huyện: </Text>
                <Text style={styles.text} >{item.HUYEN}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Mã xã: </Text>
                <Text style={styles.text} >{item.MAXA}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Tên xã: </Text>
                <Text style={styles.text} >{item.XA}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Lượng mưa: </Text>
                <Text style={styles.text} >{item.RAIN}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Cấp cháy: </Text>
                <Text style={styles.text} >{item.CAPCHAY}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Chỉ số P: </Text>
                <Text style={styles.text} >{item.CHISOP}</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Nhiệt độ: </Text>
                <Text style={styles.text} >{item.TEMP}°C </Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Độ ẩm: </Text>
                <Text style={styles.text} >{item.HUMIDITY}%</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Tốc độ gió: </Text>
                <Text style={styles.text} >{item.WIN_SPEED}{' '}m/s</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
            <View style={styles.item}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.label}>Hướng gió: </Text>
                <Text style={styles.text} >{item.WIN_DEG}°</Text>
              </View>
              <View style={styles.borderButtom}></View>
            </View>
          </View>

        </ScrollView>
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
    padding: Dimension.boxWidth(10)
  },
  item: {
    padding: 10
  },
  borderButtom: {
    marginTop: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.DARK_FIVE,
  }
})

export default DetailFirePoint;