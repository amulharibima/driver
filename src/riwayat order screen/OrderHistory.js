import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableWithoutFeedback, FlatList} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {useEffect} from 'react';
import moment from 'moment';
import {useState} from 'react';
import EndPoint from '../Endpoit';

const currencyFormat = (num) => {
  let number_string = num.toString(),
    sisa = number_string.length % 3,
    rupiah = number_string.substr(0, sisa),
    ribuan = number_string.substr(sisa).match(/\d{3}/g);
  let separator;

  if (ribuan) {
    separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }
  return rupiah;
};

const OrderHistory = () => {
  const navigation = useNavigation();
  const lng = useSelector((state) => state.driver.english);
  const [order, setOrder] = useState();

  const getOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = EndPoint.GET_ORDER_HISTORY;
      const res = await Axios.get(
        // 'http://mysupir.omindtech.id/api/order/history',
        url,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (res) {
        console.log(res.data);
        setOrder(res.data.orders);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('History Detail', {id: item.id})}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.type}>Based On {item.type}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.bodyDetail}>
              <View style={styles.date}>
                <Text style={styles.dateTitle}>
                  {lng === true ? 'Start Date' : 'Tanggal Mulai'}
                </Text>
                <Text style={styles.dateContent}>
                  {moment(item.start_datetime).format('LLLL')}
                </Text>
              </View>
              <View style={styles.location}>
                <Text style={styles.locationTitle}>
                  {lng === true ? 'Location' : 'Lokasi'}
                </Text>
                <Text
                  style={styles.locationContent}
                  ellipsizeMode={'clip'}
                  numberOfLines={2}>
                  {item.start_location.name}
                </Text>
              </View>
            </View>
            <View style={styles.price}>
              <Text style={styles.priceContent}>
                Rp{currencyFormat(item.transaction.total_price.split('.')[0])}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <FlatList
          data={order}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 30,
          }}
        />
        {/* <TouchableWithoutFeedback
          onPress={() => navigation.navigate('History Detail')}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.type}>Based On Trip</Text>
              <Text style={styles.status}>
                {lng === true
                  ? 'Ongoing (Later)'
                  : 'Sedang Berjalan (Sewa Nanti)'}
              </Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.bodyDetail}>
                <View style={styles.date}>
                  <Text style={styles.dateTitle}>
                    {lng === true ? 'Start Date' : 'Tanggal Mulai'}
                  </Text>
                  <Text style={styles.dateContent}>
                    Rabu, 2 Nov 2020, 10:00 WIB
                  </Text>
                </View>
                <View style={styles.location}>
                  <Text style={styles.locationTitle}>
                    {lng === true ? 'Location' : 'Lokasi'}
                  </Text>
                  <Text style={styles.locationContent}>
                    Universitas Kampus A
                  </Text>
                </View>
              </View>
              <View style={styles.price}>
                <Text style={styles.priceContent}>Rp25.000</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback> */}
      </View>
    </View>
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#E3E3E3',
    marginTop: 10,
    paddingBottom: 13,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    marginHorizontal: 14,
    marginTop: 5,
    paddingBottom: 5,
  },
  type: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    color: '#8F8F8F',
  },
  status: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    color: '#404040',
  },
  cardBody: {
    marginHorizontal: 14,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTitle: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    color: '#7C7C7C',
  },
  dateContent: {
    fontSize: 10,
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    color: '#303030',
  },
  location: {
    marginTop: 5,
  },
  locationTitle: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    color: '#7C7C7C',
  },
  locationContent: {
    fontSize: 10,
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    color: '#303030',
    maxWidth: 200,
  },
  priceContent: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Source Sans Pro',
    color: '#17273F',
  },
});
