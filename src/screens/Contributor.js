import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";
import { fontDefault } from "../contants/Variable";
import Dimension from "../contants/Dimension";
import Fonts from "../contants/Fonts";

const Contributor = ({ navigation, route }) => {
  const { title } = route.params;
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Header navigation={navigation} title={title} />
        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 10 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.title}>Viện sinh thái Rừng và môi trường (IFEE)</Text>
              <Text style={styles.title}>Đại học Lâm Nghiệp Việt Nam</Text>
            </View>

            <View style={{ height: 10 }} />
            <Text style={styles.title}>Thông tin liên hệ:</Text>
            <View style={{ height: 10 }} />
            <Text style={{ fontSize: 16 }}>
              <Text style={styles.label}>
                Địa chỉ
              </Text>
              <Text style={styles.text} >
                Tòa nhà A3, Trường đại học Lâm Nghiệp Viêt Nam, Thị trấn Xuân Mai, huyện Chương Mỹ, Thành phố Hà Nội.
              </Text>
            </Text>
            <Text style={{ fontSize: 16 }}>
              <Text style={styles.label}>
                Điện thoại:
              </Text>
              <Text style={styles.text} >
                (24) 22.458.161
              </Text>
            </Text>
            <Text style={{ fontSize: 16 }}>
              <Text style={styles.label}>
                Email:
              </Text>
              <Text style={styles.text}>
                info@ifee.edu.vn
              </Text>
            </Text>
            <View style={{ height: 40 }} />
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
    fontSize: Dimension.fontSize(18),
  },
  title: {
    ...fontDefault,
    fontFamily: Fonts.RB_BOLD,
    fontSize: Dimension.fontSize(20),
  },
  listItem: {
    padding: Dimension.boxWidth(10)
  },
  label: {
    ...fontDefault,
    fontFamily: Fonts.RB_BOLD,
    fontSize: Dimension.fontSize(18),
  }
})


export default Contributor;