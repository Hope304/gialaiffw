import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../components/Header";
import { fontDefault } from "../contants/Variable";
import Dimension from "../contants/Dimension";
import Fonts from "../contants/Fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { shadowIOS } from "../contants/propsIOS";

const CommuneListFireLevel = ({ navigation, route }) => {
  const { title, item } = route.params;

  const RenderItem = ({ item, index }) => {
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
        key={index}
        onPress={() => navigation.navigate('DetailFirePoint', { item: item, title: 'Chi tiết điểm cháy' })}
      >
        <View style={styles.listItem} >
          <Text style={styles.title} >{item.MAXA} - {item.XA}</Text>
          <Text style={styles.text}>Huyện: {item.HUYEN}</Text>
          <Text style={styles.text}>Cấp cháy: {item.CAPCHAY}</Text>
        </View>
      </TouchableOpacity>
    )
  };



  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Header navigation={navigation} title={title} />
        <FlatList
          data={item}
          keyExtractor={item => item.MAXA}
          renderItem={(item, index) => (
            <RenderItem item={item.item} index={index} />
          )}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: Dimension.setHeight(4) }}
        // refreshing={refresh}
        />
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
    fontSize: Dimension.fontSize(12),
  },
  title: {
    ...fontDefault,
    fontFamily: Fonts.RB_BOLD,
    fontSize: Dimension.fontSize(15),
  },
  listItem: {
    padding: Dimension.boxWidth(10)
  }
})

export default CommuneListFireLevel;