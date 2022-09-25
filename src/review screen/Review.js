import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {API_DRIVER} from '../API';
import {useEffect} from 'react';
import moment from 'moment';
import {useState} from 'react';
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

const Review = () => {
  const [rating, setRating] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getReview = async () => {
    try {
      const url = EndPoint.GET_REVIEW;
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.get(
        // 'http://mysupir.omindtech.id/api/reviews',
        url,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );

      if (res) {
        console.log(res.data.reviews);
        setRating(res.data.reviews);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error, 'error');
    }
  };

  useEffect(() => {
    getReview();
  }, []);

  const renderItem = ({item}) => {
    let rating;
    if (item.rating === 1) {
      rating = Rating1;
    } else if (item.rating === 2) {
      rating = Rating2;
    } else if (item.rating === 3) {
      rating = Rating3;
    } else if (item.rating === 4) {
      rating = Rating4;
    } else if (item.rating === 5) {
      rating = Rating5;
    }
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Text style={styles.date}>
            {moment(item.created_at).local(true).format('LL')}
          </Text>
          <View style={styles.ratingContainer}>
            <FlatList
              data={rating}
              renderItem={({item}) => (
                <Icon
                  type="material-community"
                  name="star"
                  size={15}
                  color={item.selected === true ? '#F3C51D' : '#B1B1B1'}
                  containerStyle={styles.icon}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true}
              scrollEnabled={false}
              // style={{bottom: 4}}
            />
          </View>
        </View>
        <View style={styles.reviewBody}>
          <Text style={styles.text}>{item.notes}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!isLoading ? (
        <View style={styles.reviewContainer}>
          {rating.length > 0 && (
            <FlatList
              data={rating.reverse()}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading...</Text>
        </View>
      )}
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  reviewCard: {
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 17,
    marginTop: 5,
    borderColor: '#F1F3F6',
    borderWidth: 1,
    borderRadius: 3,
  },
  reviewContainer: {
    paddingHorizontal: 20,
    marginTop: 9,
  },
  reviewHeader: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#F1F3F6',
  },
  date: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    color: '#636363',
  },
  text: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    color: '#323333',
    alignSelf: 'flex-start',
  },
  reviewBody: {
    marginTop: 15,
    paddingBottom: 20,
  },
});
