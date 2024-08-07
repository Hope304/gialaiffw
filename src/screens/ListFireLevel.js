import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";
import Colors from "../contants/Colors";
import { getListFireLevel } from "../redux/apiRequest";
import { useEffect, useLayoutEffect, useState } from "react";



const ListFireLevel = ({ navigation, route }) => {
  const [listFireLevel, setListFireLevel] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListFireLevel();
        console.log('data', data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const getUnique = (arr, index) => {
    if (!Array.isArray(arr)) {
      throw new Error('Expected arr to be an array');
    }
    const unique = arr
      .map((e) => e[index])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return unique;
  }

  const RenderItem = () => {

  }
  const { title } = route.params;
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Header navigation={navigation} title={title} />
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  }
})

export default ListFireLevel;