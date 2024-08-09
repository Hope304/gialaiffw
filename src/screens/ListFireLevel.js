import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import Header from "../components/Header";
import Colors from "../contants/Colors";
import { getListFireLevel } from "../redux/apiRequest";
import { useEffect, useLayoutEffect, useState } from "react";
// import { FlatList } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { shadowIOS } from "../contants/propsIOS";
import { fontDefault } from "../contants/Variable";
import Dimension from "../contants/Dimension";
import Fonts from "../contants/Fonts";



const ListFireLevel = ({ navigation, route }) => {
  const { title } = route.params;
  const [listFireLevel, setListFireLevel] = useState([]);

  const fetchData = async () => {
    try {
      const Data = await getListFireLevel();
      const DataTemp = getUnique(Data, "MAHUYEN");
      const listHuyen = [];
      for (var i = 0; i < DataTemp.length; i++) {
        const ListData = [];
        for (var j = 0; j < Data.length; j++) {
          if (DataTemp[i].MAHUYEN == Data[j].MAHUYEN) {
            ListData.push(Data[j]);
          }
        }
        const temp = {
          mahuyen: DataTemp[i].MAHUYEN,
          huyen: DataTemp[i].HUYEN,
          Data: ListData,
        };
        listHuyen.push(temp);
      }

      const detail = [];
      for (var i = 0; i < listHuyen.length; i++) {
        var fireLv1 = 0;
        var fireLv2 = 0;
        var fireLv3 = 0;
        var fireLv4 = 0;
        var fireLv5 = 0;
        for (var j = 0; j < listHuyen[i].Data.length; j++) {
          if (listHuyen[i].Data[j].CAPCHAY == 1) {
            fireLv1++;
          }
          if (listHuyen[i].Data[j].CAPCHAY == 2) {
            fireLv2++;
          }
          if (listHuyen[i].Data[j].CAPCHAY == 3) {
            fireLv3++;
          }
          if (listHuyen[i].Data[j].CAPCHAY == 4) {
            fireLv4++;
          }
          if (listHuyen[i].Data[j].CAPCHAY == 5) {
            fireLv5++;
          }
        }
        const listtemp = {
          mahuyen: listHuyen[i].mahuyen,
          huyen: listHuyen[i].huyen,
          tongxa: listHuyen[i].Data.length,
          capI: fireLv1,
          capII: fireLv2,
          capIII: fireLv3,
          capIV: fireLv4,
          capV: fireLv5,
          listXa: listHuyen[i].Data,
        };
        detail.push(listtemp);
      }
      setListFireLevel(detail);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);
  const getUnique = (arr, index) => {
    const unique = arr
      .map((e) => e[index])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return unique;
  }

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
        onPress={() => navigation.navigate('CommuneListFireLevel', { item: item.listXa, title: 'Danh sách cấp cháy xã' })}
      >
        <View style={styles.listItem} >
          <Text style={styles.title} >{item.mahuyen} - {item.huyen}</Text>
          <Text style={styles.text}>Tổng số xã: {item.tongxa}</Text>
          <Text style={styles.text}>Số xã ở các cấp cháy:</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.text}>Cấp V: {item.capV}, </Text>
            <Text style={styles.text}>Cấp IV: {item.capIV}, </Text>
            <Text style={styles.text}>Cấp III: {item.capIII}, </Text>
            <Text style={styles.text}>Cấp II: {item.capII}, </Text>
            <Text style={styles.text}>Cấp I: {item.capI}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  };



  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Header navigation={navigation} title={title} />
        <FlatList
          data={listFireLevel}
          keyExtractor={item => item.mahuyen}
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

export default ListFireLevel;