import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Linking,
  Image,
  Dimensions,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Overlay} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {Icon, Button} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {TouchableWithoutFeedback, FlatList} from 'react-native-gesture-handler';
import {Modal} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {ONTRIP, REPORT} from '../redux/case type/DriverCase';
import {DONE} from '../redux/case type/OrderCase';
import Geolocation from "@react-native-community/geolocation";
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from "@react-native-community/async-storage";
import geocoder from "react-native-geocoder/js/geocoder";
import EndPoint from "../Endpoit";
import Axios from "axios";

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

const HomeTrip = () => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyBqHYPUOXnXhE9CcUOgua9Ru6cv-IBWAB8';
  const [modal, setModal] = useState(false);

  const navigation = useNavigation();
  const images = useSelector((state) => state.driver.reportImage);
  const status = useSelector((state) => state.driver.report);
  const done = useSelector((state) => state.order.done);
  const dispatch = useDispatch();
  const lng = useSelector((state) => state.driver.english);
  const order = useSelector((state) => state.order);
  const origin = {
    latitude: parseFloat(order.start_lat),
    longitude: parseFloat(order.start_long),
  };
  const destination = {
    latitude: parseFloat(order.end_lat),
    longitude: parseFloat(order.end_long),
  };

  const [currLat, setCurrLat] = useState(origin.latitude);
  const [currLng, setCurrLng] = useState(origin.longitude);

  console.log(origin);

  const openGps = () => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${origin.latitude},${origin.longitude}`;
    const label = 'Open Google Map';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  const report = () => {
    dispatch({type: REPORT, report: false});
    setModal(false);
    if (status === false) {
      navigation.navigate('Report Start');
    } else {
      navigation.navigate('Report Finish');
    }
  };

  const ChooseFile = async () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };


    await ImagePicker.openCamera({
      multiple: false,
    }).then((data) => sendPhoto(data));
    // sendPhoto(res);
    // if (res) {
    //   // console.log(res);
    // }
    // ImagePicker.openCamera(options, (response) => {
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error);
    //   } else {
    //     sendPhoto(response);
    //   }
    // });
  };

  const sendPhoto = async (foto) => {
    const formData = new FormData();
    formData.append('order_id', order.order_id);
    formData.append('location_latitude', currLat);
    formData.append('location_longitude', currLng);
    formData.append('photo', {
      name: 'ghostImage',
      type: foto.mime,
      uri: foto.path,
    });
    try {
      const token = await AsyncStorage.getItem('userToken');
      const position = await geocoder.geocodePosition({
        lat: currLat,
        lng: currLng,
      });
      const url = EndPoint.SEND_PANIC_PHOTO;
      formData.append('location_name', position[1].formattedAddress);
      const res = await Axios.post(
          url,
          // `${API_DRIVER}/photo-driver`
          formData,
          {
            headers: {
              Authorization: 'Bearer ' + token,
              accept: 'application/json',
              'Content-type': 'application/json',
            },
          },
      );
      if (res !== null) {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error, 'error foto');
    }
  };

  const handlePanic = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await Axios.get(
          `http://mysupir.com/api/call-canter`,
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
      );
      if (res) {
        Linking.openURL(`tel:${res.data.call_center.call_center}`);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const watchLocation = () => {
    Geolocation.watchPosition(pos => {
      console.log(pos);
      setCurrLat(pos.coords.latitude);
      setCurrLng(pos.coords.longitude);
    }, error => {
      console.log('error', error);
    })
  }

  useEffect(() => {
    watchLocation()
  });

  const {width, height} = Dimensions.get('window');
  const aspectRatio = width / height;
  const latitudeDelta = 0.0822;
  const longitudeDelta = latitudeDelta * aspectRatio;

  return (
    <>
      <View style={styles.container}>
        <MapView
          region={{
            latitude: currLat,
            longitude: currLng,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }}
          style={styles.map}
          provider={PROVIDER_GOOGLE}>
          <Marker coordinate={destination}>
            <View style={styles.labelContainer}>
              <FastImage
                source={require('../assets/label.png')}
                style={styles.label}
              />
              <Text
                style={[styles.labelText, {maxWidth: 117}]}
                numberOfLines={1}
                ellipsizeMode={'clip'}>
                {order.end_loc}
              </Text>
            </View>
            <Icon
              type="material-community"
              name="map-marker"
              size={30}
              color="#17273F"
            />
          </Marker>
          <Marker coordinate={{
            latitude: currLat,
            longitude: currLng
          }}>
            {status === true ? (
              <View>
                <FastImage
                  source={require('../assets/car.png')}
                  style={styles.car}
                />
              </View>
            ) : (
              <>
                <View style={styles.labelContainer}>
                  <FastImage
                    source={require('../assets/label.png')}
                    style={styles.label}
                  />
                  <Text
                    style={[styles.labelText, {maxWidth: 117}]}
                    numberOfLines={1}
                    ellipsizeMode={'clip'}>
                    {order.start_loc}
                  </Text>
                </View>
                <Icon
                  type="material-community"
                  name="account"
                  size={24}
                  color="#FFF"
                  containerStyle={{
                    backgroundColor: '#17273F',
                    borderRadius: 100,
                    alignSelf: 'center',
                  }}
                />
              </>
            )}
          </Marker>
          <MapViewDirections
            origin={{
              latitude: currLat,
              longitude: currLng
            }}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="#17273F"
          />
        </MapView>
        <Overlay style={{right: 0, bottom: 238}}>
          <View style={styles.camera}>
            <Icon
                type="material-community"
                name="camera"
                size={30}
                onPress={ChooseFile}
            />
          </View>
          <View style={styles.panic}>
            <TouchableWithoutFeedback
              onPress={handlePanic}>
              <FastImage
                source={require('../assets/panic.png')}
                style={styles.panicImage}
              />
            </TouchableWithoutFeedback>
          </View>
        </Overlay>
        <Overlay style={{right: 0, bottom: 243}}>
          <View style={styles.google}>
            <TouchableWithoutFeedback onPress={openGps}>
              <Text style={styles.googleText}>
                {lng === true ? 'See at Google Maps' : 'Lihat di Google Maps'}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </Overlay>
        <Overlay style={{width: '100%', bottom: 0}}>
          <View style={styles.customerCard}>
            <View style={styles.customer}>
              <View style={styles.customerInfo}>
                <FastImage
                  source={{uri: order.user_pict}}
                  style={styles.customerImage}
                />
                <Text style={styles.customerName}>{order.user_name}</Text>
              </View>
              <View style={styles.contact}>
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate('Chat')}>
                  <FastImage
                    source={require('../assets/chat.png')}
                    style={styles.chat}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View style={styles.price}>
              <Text style={styles.priceTitle}>
                {lng === true ? 'Price' : 'Tarif'}
              </Text>
              <Text style={styles.priceNum}>
                Rp{currencyFormat(order.price)}
              </Text>
            </View>
            {status === true ? (
              <>
                <FlatList
                  data={images}
                  renderItem={({item}) => (
                    <TouchableWithoutFeedback
                      onPress={() => navigation.navigate('Photo')}>
                      <FastImage
                        source={{uri: item.image}}
                        style={styles.image}
                      />
                    </TouchableWithoutFeedback>
                  )}
                  horizontal={true}
                  style={{marginLeft: 8, marginBottom: 30}}
                  initialNumToRender={5}
                />
              </>
            ) : (
              <Button
                title={lng === true ? 'Start Trip' : 'Mulai Perjalanan'}
                titleStyle={styles.buttonTitle}
                buttonStyle={{backgroundColor: '#17273F'}}
                containerStyle={styles.button}
                onPress={() => {
                  setModal(true);
                  dispatch({type: ONTRIP});
                }}
              />
            )}
          </View>
        </Overlay>
        <Overlay>
          <View style={styles.back}>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
              <Icon
                type="material-community"
                name="arrow-left"
                size={25}
                containerStyle={{alignSelf: 'center'}}
              />
            </TouchableWithoutFeedback>
          </View>
        </Overlay>
        <Overlay style={{width: '100%'}}>
          <View style={styles.destinationInfo}>
            <View style={styles.desIcon}>
              <Icon
                type="material-community"
                name="map-marker"
                size={20}
                color="#17273F"
              />
              <Icon
                type="material-community"
                name="circle"
                size={4}
                color="#C4C4C4"
                containerStyle={styles.icon}
              />
              <Icon
                type="material-community"
                name="circle"
                size={2}
                color="#C4C4C4"
                containerStyle={styles.icon}
              />
              <Icon
                type="material-community"
                name="circle"
                size={2}
                color="#C4C4C4"
                containerStyle={styles.icon}
              />
              <Icon
                type="material-community"
                name="circle"
                size={2}
                color="#C4C4C4"
                containerStyle={styles.icon}
              />
              <Icon
                type="material-community"
                name="circle"
                size={2}
                color="#C4C4C4"
                containerStyle={styles.icon}
              />
              <Icon
                type="material-community"
                name="circle"
                size={10}
                color="#17273F"
                containerStyle={{marginTop: 2}}
              />
            </View>
            <View style={styles.des}>
              <View style={styles.palace}>
                <Text
                  style={styles.desText}
                  ellipsizeMode={'clip'}
                  numberOfLines={1}>
                  {order.start_loc}
                </Text>
              </View>
              <View style={[styles.palace, {marginBottom: 25}]}>
                <Text
                  style={styles.desText}
                  ellipsizeMode={'clip'}
                  numberOfLines={1}>
                  {order.end_loc}
                </Text>
              </View>
            </View>
          </View>
        </Overlay>
      </View>
      <Modal visible={modal} onDismiss={() => setModal(false)}>
        <View style={styles.modalContainer}>
          <FastImage
            source={require('../assets/photo.png')}
            style={styles.photo}
          />
          <Text style={styles.modalText}>
            {lng === true
              ? "Take car's pictures first to"
              : 'Foto mobil terlebih dahulu untuk'}{' '}
            {status === false
              ? lng === true
                ? 'start'
                : 'melanjutkan'
              : lng === true
              ? 'end'
              : 'mengakhiri'}{' '}
            {lng === true
              ? 'your trip with customer'
              : 'perjalanan anda bersama penumpang'}
          </Text>
          <Button
            title="Oke"
            titleStyle={styles.modalButtonTitle}
            buttonStyle={{backgroundColor: '#17273F'}}
            containerStyle={{marginTop: 17, marginHorizontal: 76}}
            onPress={report}
          />
          <Button
            title={lng === true ? 'Later' : 'Nanti Saja'}
            titleStyle={[styles.modalButtonTitle, {color: '#17273F'}]}
            buttonStyle={{backgroundColor: '#FFF'}}
            containerStyle={styles.modalButton}
            onPress={() => setModal(false)}
          />
        </View>
      </Modal>
      <Modal
        visible={done}
        onDismiss={() => dispatch({type: DONE, done: false})}>
        <View style={styles.finish}>
          <FastImage
            source={require('../assets/finish.png')}
            style={styles.finishImage}
          />
          <Text style={styles.finishTitle}>
            {lng === true
              ? 'Is Your Trip Over?'
              : 'Apakah Perjalanan Anda Sudah Selesai?'}
          </Text>
          <Text style={styles.finishMessage}>
            {lng === true
              ? 'Tap “Yes” to send a photo of the final condition of the booking car and end the trip'
              : `Ketuk “Ya” untuk mengirim foto kondisi akhir mobil pemesanmu dan mengakhiri perjalanan`}
          </Text>
          <Button
            title={lng === true ? 'Yes' : 'Ya'}
            titleStyle={[styles.finishButtonTitle, {color: '#FFF'}]}
            buttonStyle={{backgroundColor: '#17273F'}}
            containerStyle={styles.finishButton}
            onPress={() => {
              dispatch({type: DONE, done: false});
              setModal(true);
            }}
          />
          <Button
            title={lng === true ? 'Not yet' : 'Belum'}
            titleStyle={[styles.finishButtonTitle, {color: '#17273F'}]}
            buttonStyle={{backgroundColor: '#FFF'}}
            containerStyle={styles.finishButton}
            onPress={() => dispatch({type: DONE, done: false})}
          />
        </View>
      </Modal>
    </>
  );
};

export default HomeTrip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  icon: {
    marginTop: 2,
  },
  finish: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 17,
    borderColor: '#F1F3F6',
    marginHorizontal: 20,
    paddingBottom: 15,
  },
  finishImage: {
    width: 180,
    height: 120,
    alignSelf: 'center',
    marginTop: 47,
  },
  finishButton: {
    marginHorizontal: 70,
    borderRadius: 8,
    marginTop: 5,
  },
  finishTitle: {
    fontSize: 18,
    fontFamily: 'Source Sans Pro',
    fontWeight: 'bold',
    color: '#17273F',
    textAlign: 'center',
    maxWidth: 200,
    alignSelf: 'center',
    marginTop: 20,
  },
  finishButtonTitle: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '600',
  },
  finishMessage: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    color: '#535353',
    textAlign: 'center',
    marginHorizontal: 32,
    marginVertical: 10,
  },
  modalButton: {
    marginTop: 5,
    marginHorizontal: 70,
    marginBottom: 15,
    borderRadius: 8,
  },
  photo: {
    width: 181,
    height: 79,
    marginTop: 34,
    alignSelf: 'center',
  },
  car: {
    width: undefined,
    height: 31,
    aspectRatio: 2 / 3,
  },
  image: {
    width: 63,
    height: 63,
    marginLeft: 10,
    marginTop: 10,
  },
  modalButtonTitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '600',
  },
  modalText: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    color: '#80807E',
    textAlign: 'center',
    marginHorizontal: 31,
    marginTop: 6,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#F1F3F6',
    marginHorizontal: 20,
  },
  back: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowOpacity: 0.25,
    elevation: 4,
    marginLeft: 20,
    marginTop: 59,
  },
  label: {
    width: 117,
    height: 29,
    position: 'absolute',
  },
  panic: {
    marginBottom: 66,
    marginRight: 20,
  },
  panicImage: {
    width: 50,
    height: 50,
    alignSelf: 'flex-end',
  },
  labelText: {
    fontFamily: 'Source Sans Pro',
    fontSize: 10,
    color: '#000',
    marginVertical: 4,
    marginLeft: 7,
    paddingRight: 9,
    marginRight: 8,
  },
  desText: {
    fontFamily: 'Source Sans Pro',
    fontSize: 13,
    fontWeight: '600',
    color: '#80807E',
    maxWidth: 250,
  },
  palace: {
    marginTop: 17,
  },
  des: {
    marginLeft: 12,
  },
  desIcon: {
    alignSelf: 'flex-start',
    marginTop: 15,
    marginLeft: 14,
  },
  destinationInfo: {
    flexDirection: 'row',
    marginTop: 122,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F1F3F6',
    shadowOpacity: 0.25,
    shadowColor: '#000',
    shadowOffset: {
      height: 10,
      width: 0,
    },
    elevation: 5,
    marginHorizontal: 20,
  },
  priceTitle: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Source Sans Pro',
    color: '#636363',
    marginLeft: 20,
  },
  buttonTitle: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Source Sans Pro',
    color: '#FFF',
  },
  button: {
    borderRadius: 5,
    marginHorizontal: 28,
    marginVertical: 23,
  },
  priceNum: {
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#17273F',
    marginRight: 52,
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    marginTop: 21,
    paddingVertical: 7,
  },
  customerImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  customer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 16,
  },
  chat: {
    width: 24,
    height: 22,
  },
  call: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerName: {
    fontFamily: 'Source Sans Pro',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#17273F',
    marginLeft: 15,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerCard: {
    backgroundColor: '#FFF',
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 5,
  },
  googleText: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    color: '#3685DE',
    textAlign: 'center',
  },
  google: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    alignSelf: 'flex-end',
    paddingHorizontal: 19,
    paddingVertical: 10,
    marginRight: 19,
    shadowColor: '#000',
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  camera: {
    backgroundColor: '#F5F5F5',
    marginRight: 18,
    marginBottom: 10,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#DEDEDE',
    padding: 10,
    alignSelf: 'flex-end',
  },
});
