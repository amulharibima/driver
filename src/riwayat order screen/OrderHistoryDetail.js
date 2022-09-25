import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Customer from '../assets/customer.png';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import moment from 'moment';
import {Modal} from 'react-native';
import EndPoint from '../Endpoit';

const Rating1 = [
  {
    id: 0,
    selected: true,
  },
  {
    id: 1,
    selected: false,
  },
  {
    id: 2,
    selected: false,
  },
  {
    id: 3,
    selected: false,
  },
  {
    id: 4,
    selected: false,
  },
];

const Rating2 = [
  {
    id: 0,
    selected: true,
  },
  {
    id: 1,
    selected: true,
  },
  {
    id: 2,
    selected: false,
  },
  {
    id: 3,
    selected: false,
  },
  {
    id: 4,
    selected: false,
  },
];

const Rating3 = [
  {
    id: 0,
    selected: true,
  },
  {
    id: 1,
    selected: true,
  },
  {
    id: 2,
    selected: true,
  },
  {
    id: 3,
    selected: false,
  },
  {
    id: 4,
    selected: false,
  },
];

const Rating4 = [
  {
    id: 0,
    selected: true,
  },
  {
    id: 1,
    selected: true,
  },
  {
    id: 2,
    selected: true,
  },
  {
    id: 3,
    selected: true,
  },
  {
    id: 4,
    selected: false,
  },
];

const Rating5 = [
  {
    id: 0,
    selected: true,
  },
  {
    id: 1,
    selected: true,
  },
  {
    id: 2,
    selected: true,
  },
  {
    id: 3,
    selected: true,
  },
  {
    id: 4,
    selected: true,
  },
];

const HistoryDetail = ({route}) => {
  const lng = useSelector((state) => state.driver.english);
  const id = route.params.id;
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = EndPoint.GET_ORDER_DETAIL + id;
      const res = await Axios.get(
        // `http://mysupir.omindtech.id/api/order/detail/${id}`,
        url,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (res) {
        console.log(res.data);
        setData(res.data.order);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error, 'error');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      {!isLoading ? (
        <>
          <View style={styles.customerContainer}>
            {data !== null && (
              <>
                <Text style={styles.orderType}>Based On {data.type}</Text>
                <View style={styles.ratingContainer}>
                  <Icon
                    type="material-community"
                    name="star"
                    size={20}
                    color="#FBB709"
                  />
                  <Icon
                    type="material-community"
                    name="star"
                    size={20}
                    color="#FBB709"
                  />
                  <Icon
                    type="material-community"
                    name="star"
                    size={20}
                    color="#FBB709"
                  />
                  <Icon
                    type="material-community"
                    name="star"
                    size={20}
                    color="#FBB709"
                  />
                  <Icon
                    type="material-community"
                    name="star"
                    size={20}
                    color="#FBB709"
                  />
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.title}>
                    {lng === true ? 'Your Customer' : 'Penumpang Anda'}
                  </Text>
                  <View style={styles.customerProfile}>
                    <FastImage
                      source={{uri: 'http://mysupir.com/get_image?img_path=' + data.user.foto}}
                      style={styles.image}
                    />
                    <View style={styles.customerName}>
                      <Text style={styles.name}>{data.user.name}</Text>
                      <Text style={styles.rating}>{data.rating}</Text>
                      <Icon
                        type="material-community"
                        name="star"
                        size={17}
                        color="#FBB709"
                        containerStyle={{marginTop: 4}}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.routeContainer}>
                  <Text style={styles.routeTitle}>
                    {lng === true ? 'Trip Route' : 'Rute Perjalanan'}
                  </Text>
                  <View style={styles.routeBody}>
                    <View style={styles.route}>
                      <Text style={styles.routeHeader}>
                        {lng === true ? 'Start Date' : 'Tanggal mulai'}
                      </Text>
                      <Text style={styles.routeContent}>
                        {moment(data.created_at).local(true).format('LLLL')}
                      </Text>
                    </View>
                    <View style={styles.route}>
                      <Text style={styles.routeHeader}>
                        {lng === true ? 'End Date' : 'Tanggal Selesai'}
                      </Text>
                      <Text style={styles.routeContent}>
                        {moment(data.finish_datetime)
                          .local(true)
                          .format('LLLL')}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={[styles.title, {marginHorizontal: 21}]}>
                    {lng === true ? 'Trip Price' : 'Tarif Perjalanan'}
                  </Text>
                  <View style={styles.price}>
                    <View style={styles.priceList}>
                      <Text style={styles.priceName}>
                        {lng === true
                          ? 'Basic Price (1 Day)'
                          : 'Tarif Dasar (1 Hari)'}
                      </Text>
                      <Text style={styles.priceNum}>
                        Rp{data.transaction.total_price.split('.')[0]}
                      </Text>
                    </View>
                    <View style={styles.priceSumContainer}>
                      <Text style={styles.priceSumName}>
                        {lng === true ? 'Total Price' : 'Total Tarif'}
                      </Text>
                      <Text style={styles.priceSum}>
                        Rp{data.transaction.total_price.split('.')[0]}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
          <Text>Loading....</Text>
          <ActivityIndicator size={'large'} color={'#0000'} />
        </View>
      )}
    </View>
  );
};

export default HistoryDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  orderType: {
    fontFamily: 'Source Sans Pro',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#17273F',
  },
  customerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Source Sans Pro',
    color: '#232323',
  },
  customerInfo: {
    marginTop: 15,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  customerProfile: {
    marginVertical: 10,
    flexDirection: 'row',
  },
  customerName: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 2,
  },
  name: {
    fontFamily: 'Source Sans Pro',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#17273F',
  },
  rating: {
    fontFamily: 'Source Sans Pro',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#7D7D7D',
    marginLeft: 5,
    marginRight: 3,
  },
  routeContainer: {
    backgroundColor: '#FFF',
    marginVertical: 15,
    paddingHorizontal: 21,
    paddingVertical: 15,
  },
  routeTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Source Sans Pro',
    color: '#232323',
  },
  route: {
    marginTop: 10,
  },
  routeHeader: {
    fontSize: 12,
    color: '#7C7C7C',
    fontFamily: 'Source Sans Pro',
  },
  routeContent: {
    fontFamily: 'Source Sans Pro',
    fontSize: 10,
    fontWeight: '600',
    color: '#303030',
  },
  priceContainer: {
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  priceName: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    color: '#80807E',
    marginLeft: 19,
  },
  priceNum: {
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    color: '#80807E',
    marginRight: 18,
  },
  priceList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderColor: '#F1F3F6',
    paddingBottom: 12,
  },
  price: {
    marginTop: 17,
  },
  priceSumContainer: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceSumName: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    color: '#80807E',
    fontWeight: '600',
    marginLeft: 19,
  },
  priceSum: {
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    color: '#80807E',
    marginRight: 18,
    fontWeight: '600',
  },
});
