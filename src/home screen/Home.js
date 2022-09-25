import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  DeviceEventEmitter,
  Dimensions,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Overlay} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {Icon, Header, Button} from 'react-native-elements';
import {Modal} from 'react-native-paper';
import {useNetInfo} from '@react-native-community/netinfo';
import FastImage from 'react-native-fast-image';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {
  useNavigation,
  DrawerActions,
  useIsFocused,
} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import Toggle from '../component/Toggle';
import {useSelector, useDispatch} from 'react-redux';
import {getProfile} from '../redux/action/DriverProfileAction';
import {orderStatus, broadcast} from '../redux/action/DriverAction';
import {LOCATION} from '../redux/case type/DriverCase';
import {CANCEL, LATER_COUNT} from '../redux/case type/OrderCase';
import {declineOrder, acceptOrder} from '../redux/action/OrderAction';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import geocoder from 'react-native-geocoder/js/geocoder';
import Axios from 'axios';
import {API_DRIVER} from '../API';
import EndPoint from '../Endpoit';

const MyLeftComponent = (props) => {
  return (
    <Icon
      type="material-community"
      name="menu"
      size={30}
      onPress={props.onPress}
    />
  );
};

const MyCenterComponent = (props) => {
  let name;
  if (props.name !== null) {
    name = props.name.split(' ');
  } else {
    name = '';
  }
  return (
    <View style={{alignSelf: 'flex-start', marginLeft: -25}}>
      <Text style={styles.headerText}>
        Hai,{' '}
        <Text style={[styles.headerText, {fontWeight: 'bold'}]}>{name[0]}</Text>
      </Text>
    </View>
  );
};

const MyRightComponent = (props) => {
  let val;
  if (props.value === 1) {
    val = true;
  } else if (props.value === 0) {
    val = false;
  }
  return (
    <View style={{marginRight: 10}}>
      <Toggle
        isOn={val}
        onToggle={props.handleValueChange}
        onColor="#55B947"
        offColor="#A8A8A8"
      />
    </View>
  );
};

const currencyFormat = (num) => {
  if (num !== null) {
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
  } else {
    return null;
  }
};

const Home = () => {
  const [currlocation, setCurrlocation] = useState('');
  const [longitude, setLongtitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [value, setValue] = useState(false);
  const [status, setStatus] = useState(false);
  const [internetModal, setInternetModal] = useState(false);
  const [lokasiModal, setLokasiModal] = useState(false);
  const [gps, setGps] = useState(true);
  const [navGPS, setNavGPS] = useState(false);
  const [acc, setAcc] = useState(false);
  const [order, setOrder] = useState(false);
  const [orderTime, setOrderTime] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [orderLater, setOrderLater] = useState(false);
  const [alert, setAlert] = useState(false);
  const [exitApp, setExitApp] = useState(0);
  const netInfo = useNetInfo();
  const connection = netInfo.isConnected;
  const navigation = useNavigation();
  const lng = useSelector((state) => state.driver.english);
  const orders = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const orderOn = useSelector((state) => state.driver.order_on);
  const profile = useSelector((state) => state.profile);
  const id = useSelector((state) => state.profile.id);
  const rate = useSelector((state) => state.driver.rating);
  const later = orders.later_order;
  const isFocused = useIsFocused();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCurrLocation = async () => {
    Geolocation.getCurrentPosition((info) => {
      setLongtitude(info.coords.longitude);
      setLatitude(info.coords.latitude);
      dispatch({
        type: LOCATION,
        lat: info.coords.latitude,
        long: info.coords.longitude,
      });
    });
  };

  const backAction = () => {
    setTimeout(() => {
      setExitApp(0);
    }, 2000);
    if (exitApp === 0) {
      setExitApp(exitApp + 1);
      ToastAndroid.show('Press Again To Exit !', ToastAndroid.SHORT);
    } else if (exitApp === 1) {
      BackHandler.exitApp();
    }
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return backHandler.remove();
  });

  const handleGPS = () => {
    setNavGPS(true);
  };

  useEffect(() => {
    dispatch(getProfile(navigation));
  }, [isFocused]);

  useEffect(() => {
    getCurrLocation();
  }, [getCurrLocation, longitude, latitude]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkGps = async () => {
    const gps = await LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: 'Use Location ?',
      ok: 'YES',
      cancel: 'NO',
      enableHighAccuracy: true,
      showDialog: false,
      openLocationServices: navGPS,
      preventOutSideTouch: false,
      preventBackClick: false,
      providerListener: true,
    }).catch((err) => {
      console.log(err);
      setGps(false);
    });
  };

  const sendPhoto = async (foto) => {
    const formData = new FormData();
    formData.append('location_latitude', latitude);
    formData.append('location_longitude', longitude);
    formData.append('photo', {
      name: 'ghostImage',
      type: foto.mime,
      uri: foto.path,
    });
    try {
      const token = await AsyncStorage.getItem('userToken');
      const position = await geocoder.geocodePosition({
        lat: latitude,
        lng: longitude,
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

  useEffect(() => {
    checkGps();
    DeviceEventEmitter.addListener('locationProviderStatusChange', function (
      stat,
    ) {
      setGps(stat.enabled);
      setNavGPS(false);
    });
    if (gps === false) {
      setLokasiModal(true);
    } else {
      setLokasiModal(false);
    }
  }, [checkGps, gps]);

  const handleRegionChange = ({region}) => {
    setCurrlocation(region);
  };

  useEffect(() => {
    if (connection === false) {
      setInternetModal(true);
    } else {
      setInternetModal(false);
    }
  }, [connection]);

  const handleValueChange = () => {
    let status;

    setStatus(true);

    if(profile.is_suspended === 0){
      if (orderOn === 1) {
        status = 0;
        setValue(false);
      } else {
        status = 1;
        setValue(true);
      }
      dispatch(orderStatus(status, latitude, longitude));
    }
  };

  const laterCard = (
    <Overlay style={{bottom: 115, width: '100%'}}>
      <View style={styles.laterList}>
        <TouchableWithoutFeedback
          style={{flexDirection: 'row'}}
          onPress={() => setAlert(true)}>
          <FastImage
            source={require('../assets/later.gif')}
            style={styles.laterGif}
          />
          <View style={{marginLeft: 5, paddingRight: 51}}>
            <View style={styles.laterTime}>
              <Icon
                type="material-community"
                name="circle"
                size={6}
                color="#FF2525"
              />
              <Text
                style={[
                  styles.laterDateTitle,
                  {color: '#A0A0A0', marginLeft: 3},
                ]}>
                Based on Trip -{' '}
                <Text style={{color: '#000', fontWeight: '600'}}>
                  {moment(orders.later_datetime).format('lll')}
                </Text>
              </Text>
            </View>
            <Text style={styles.textLater}>{orders.end_loc}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Overlay>
  );

  const proceed = () => {
    if (orders.payment_status == 'dibayar' && orders.order_trip === true) {
      navigation.navigate('Home Trip');
    } else if (
      orders.payment_status == 'dibayar' &&
      orders.order_time === true
    ) {
      navigation.navigate('Home Time');
    }
  };

  let onStatus;
  if (profile.is_suspended === 1) {
    onStatus = (
        <View
            style={[
              styles.statusContainer,
              {
                backgroundColor: 'rgba(255, 181, 180, 0.54)',
                borderColor: '#FB5553',
              },
            ]}>
          <Text style={[styles.statusText, {color: '#FB5553', marginLeft: 120}]}>
            {lng === true ? `Your account is suspended.\nReason : ${profile.alasan_suspend}` : `Akun anda di-suspend.\nAlasan : ${profile.alasan_suspend}`}
          </Text>
          <Icon
              type="material-community"
              name="window-close"
              size={12}
              color="#FB5553"
              containerStyle={styles.icon}
              onPress={() => setStatus(false)}
          />
        </View>
    );
  }
  else if (value === false) {
    onStatus = (
      <View
        style={[
          styles.statusContainer,
          {
            backgroundColor: 'rgba(255, 181, 180, 0.54)',
            borderColor: '#FB5553',
          },
        ]}>
        <Text style={[styles.statusText, {color: '#FB5553', marginLeft: 150}]}>
          {lng === true ? 'You are offline' : 'Anda sedang offline'}
        </Text>
        <Icon
          type="material-community"
          name="window-close"
          size={12}
          color="#FB5553"
          containerStyle={styles.icon}
          onPress={() => setStatus(false)}
        />
      </View>
    );
  } else if (value === true) {
    onStatus = (
      <View
        style={[
          styles.statusContainer,
          {
            backgroundColor: 'rgba(142, 209, 177, 0.41)',
            borderColor: '#4B9D76',
          },
        ]}>
        <Text style={[styles.statusText, {color: '#4B9D76', marginLeft: 70}]}>
          {lng === true
            ? `You are online, happy working ${profile.name}`
            : `Anda sudah online, selamat bekerja ${profile.name}`}
        </Text>
        <Icon
          type="material-community"
          name="window-close"
          size={12}
          color="#4B9D76"
          containerStyle={styles.icon}
          onPress={() => setStatus(false)}
        />
      </View>
    );
  }

  if (status === true) {
    setTimeout(() => {
      setStatus(false);
    }, 5000);
  }

  console.log(later);

  const canceled = () => {
    setCancel(false);
    dispatch({type: 'CANCELED', canceled: false});
    setOrder(false);
    setOrderTime(false);
    setAcc(false);
    setOrderLater(false);
  };
  const {width, height} = Dimensions.get('window');
  const aspectRatio = width / height;
  const latitudeDelta = 0.0122;
  const longitudeDelta = latitudeDelta * aspectRatio;
  return (
    <>
      <Header
        leftComponent={
          <MyLeftComponent
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
        }
        centerComponent={<MyCenterComponent name={profile.name} />}
        backgroundColor="#FFFFFF"
        rightComponent={
          <MyRightComponent
            value={orderOn}
            handleValueChange={handleValueChange}
          />
        }
        leftContainerStyle={{marginLeft: 10}}
      />
      <View style={styles.container}>
        <MapView
          region={{
            longitude: longitude,
            latitude: latitude,
            longitudeDelta: longitudeDelta,
            latitudeDelta: latitudeDelta,
          }}
          style={styles.maps}
          onRegionChange={handleRegionChange}
          provider={PROVIDER_GOOGLE}
          onPress={() => console.log('pressed')}
          showsUserLocation={true}
        />
        <Overlay style={{width: '100%'}}>{status === true && onStatus}</Overlay>
        <Overlay style={{width: '100%', bottom: 0}}>
          <View style={styles.driver}>
            <FastImage
              source={{
                uri: profile.picture,
              }}
              style={styles.image}
            />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{profile.name}</Text>
              <Text style={styles.driverRating}>{profile.identify}</Text>
            </View>
            <View style={styles.income}>
              {profile.income !== undefined && (
                <Text style={styles.driverName}>
                  Rp.{currencyFormat(profile.income)}
                </Text>
              )}
              <Text style={styles.driverRating}>
                {lng === true ? 'Total income' : 'Total Pendapatan'}
              </Text>
            </View>
          </View>
        </Overlay>
        <Overlay style={{alignSelf: 'flex-end', bottom: later > 0 ? 195 : 115}}>
          <View style={styles.iconContainer}>
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
                onPress={() => navigation.navigate('Panic')}>
                <FastImage
                  source={require('../assets/panic.png')}
                  style={styles.panicImage}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Overlay>
        {later > 0 && laterCard}
      </View>
      <Modal visible={internetModal} onDismiss={() => setInternetModal(false)}>
        <View style={styles.modal}>
          <FastImage
            source={require('../assets/wifi.png')}
            style={styles.internetLogo}
          />
          <Text style={styles.modalTitle}>
            {lng === true
              ? 'Oops, your network is disconnected'
              : 'Oops, Jaringan Kamu Terputus'}
          </Text>
          <Text style={styles.modalText}>
            {lng === true
              ? "we can't access you. Let's activate your Internet connection first, hehe"
              : 'kami gabisa mengakses kamu nih. Ayo aktifin dulu dong Koneksi Internet kamu hehe'}
          </Text>
          <Button
            title={lng === true ? 'Enable Internet' : 'Aktifkan Internet'}
            buttonStyle={{backgroundColor: '#17273F'}}
            titleStyle={styles.buttonTitle}
            containerStyle={styles.buttonContainer}
            onPress={() => setInternetModal(false)}
          />
        </View>
      </Modal>
      <Modal visible={lokasiModal} onDismiss={() => setLokasiModal(false)}>
        <View style={styles.modal}>
          <FastImage
            source={require('../assets/lokasi.png')}
            style={styles.lokasiLogo}
          />
          <Text style={styles.modalTitle}>
            {lng === true
              ? "Oops, let's activate the location"
              : 'Oops, ayo aktifkan lokasinya'}
          </Text>
          <Text style={styles.modalText}>
            {lng === true
              ? "we can't access your location. Let's activate the service location first hehe"
              : 'kami gabisa mengakses lokasi kamu nih. Ayo aktifin dulu dong lokasi servisnya hehe'}
          </Text>
          <Button
            title={lng === true ? 'Enable Location' : 'Aktifkan Lokasi'}
            buttonStyle={{backgroundColor: '#17273F'}}
            titleStyle={styles.buttonTitle}
            containerStyle={styles.buttonContainer}
            onPress={handleGPS}
          />
        </View>
      </Modal>
      <Modal visible={orders.order_trip}>
        <View style={styles.orderIn}>
          <Text style={styles.title}>Based On Trip</Text>
          <View style={styles.orderCard}>
            <View style={styles.customerInfo}>
              <View style={styles.customer}>
                <FastImage
                  source={{uri: orders.user_pict}}
                  style={styles.customerImage}
                />
                <Text style={styles.customerName}>{orders.user_name}</Text>
              </View>
              <View style={styles.priceContainer}>
                {orders.price !== undefined && (
                  <Text style={styles.price}>
                    Rp.{currencyFormat(orders.price)}
                  </Text>
                )}
                <Text style={styles.length}>{orders.total_distance} KM</Text>
              </View>
            </View>
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
                />
                <Icon
                  type="material-community"
                  name="circle"
                  size={2}
                  color="#C4C4C4"
                />
                <Icon
                  type="material-community"
                  name="circle"
                  size={2}
                  color="#C4C4C4"
                />
                <Icon
                  type="material-community"
                  name="circle"
                  size={2}
                  color="#C4C4C4"
                />
                <Icon
                  type="material-community"
                  name="circle"
                  size={2}
                  color="#C4C4C4"
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
                  <Text style={styles.desText}>{orders.start_loc}</Text>
                </View>
                <View style={[styles.palace, {marginTop: 9}]}>
                  <Text style={styles.desText}>{orders.end_loc}</Text>
                </View>
              </View>
            </View>
            <View style={styles.message}>
              <Icon type="material-community" name="text" size={16} />
              <Text style={styles.text}>{orders.notes}</Text>
            </View>
          </View>
          {!acc ? (
            <View style={styles.buttonConfirm}>
              <Button
                title={lng === true ? 'Reject' : 'Tolak'}
                titleStyle={[styles.buttonTitle, {color: '#F53649'}]}
                buttonStyle={{backgroundColor: '#FFFFFF'}}
                containerStyle={styles.cancel}
                onPress={() => {
                  dispatch(declineOrder(orders.order_id));
                }}
              />
              <Button
                title={lng === true ? 'Accept' : 'Terima'}
                titleStyle={styles.buttonTitle}
                buttonStyle={{backgroundColor: '#17273F'}}
                containerStyle={styles.accept}
                onPress={() => {
                  setAcc(true);
                  dispatch(
                    acceptOrder(orders.order_id, orders.later, orders.trip),
                  );
                }}
              />
            </View>
          ) : (
            <>
              <View style={styles.confirm}>
                <Text style={styles.confirmText}>
                  {lng === true
                    ? 'Waiting for confirmation'
                    : 'Menunggu Konfirmasi'}
                </Text>
              </View>
              {proceed()}
            </>
          )}
        </View>
      </Modal>
      <Modal visible={orders.order_time}>
        <View style={[styles.orderIn, {marginTop: 440}]}>
          <Text style={styles.title}>Based On Time</Text>
          <View style={styles.orderCard}>
            <View style={styles.customerInfo}>
              <View style={styles.customer}>
                <FastImage
                  source={{uri: orders.user_pict}}
                  style={styles.customerImage}
                />
                <Text style={styles.customerName}>{orders.user_name}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  Rp{currencyFormat(orders.price)}
                </Text>
                <Text style={styles.long}>
                  {moment(orders.end_dateTime).diff(
                    moment(orders.start_dateTime),
                    'minutes',
                  )}{' '}
                  Menit
                </Text>
              </View>
            </View>
            <View style={styles.dateContainer}>
              <View style={styles.dateStart}>
                <Text style={styles.dateTitle}>
                  {lng === true ? 'Start date' : 'Tanggal mulai'}
                </Text>
                <Text style={styles.date}>
                  {moment(orders.start_dateTime).format('LLLL')}
                </Text>
              </View>
              <View style={styles.dateEnd}>
                <Text style={styles.dateTitle}>
                  {lng === true ? 'End date' : 'Tanggal Selesai'}
                </Text>
                <Text style={styles.date}>
                  {moment(orders.end_dateTime).format('LLLL')}
                </Text>
              </View>
            </View>
          </View>
          {!acc ? (
            <View style={styles.buttonConfirm}>
              <Button
                title={lng === true ? 'Reject' : 'Tolak'}
                titleStyle={[styles.buttonTitle, {color: '#F53649'}]}
                buttonStyle={{backgroundColor: '#FFFFFF'}}
                containerStyle={styles.cancel}
                onPress={() => {
                  dispatch(declineOrder(orders.order_id));
                }}
              />
              <Button
                title={lng === true ? 'Accept' : 'Terima'}
                titleStyle={styles.buttonTitle}
                buttonStyle={{backgroundColor: '#17273F'}}
                containerStyle={styles.accept}
                onPress={() => {
                  setAcc(true);
                  dispatch(
                    acceptOrder(orders.order_id, orders.later, orders.trip),
                  );
                }}
              />
            </View>
          ) : (
            <>
              <View style={styles.confirm}>
                <Text style={styles.confirmText}>
                  {lng === true
                    ? 'Waiting for confirmation'
                    : 'Menunggu Konfirmasi'}
                </Text>
              </View>
              {proceed()}
            </>
          )}
        </View>
      </Modal>
      <Modal visible={orders.later}>
        <View style={styles.orderIn}>
          <Text style={styles.title}>
            Based On Trip {lng === true ? '(Later)' : '(Sewa Nanti)'}
          </Text>
          <View style={styles.orderCard}>
            <View style={styles.customerInfo}>
              <View style={styles.customer}>
                <FastImage
                  source={{uri: orders.user_pict}}
                  style={styles.customerImage}
                />
                <Text style={styles.customerName}>{orders.user_name}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  Rp{currencyFormat(orders.price)}
                </Text>
                <Text style={styles.length}>5 km</Text>
              </View>
            </View>
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
                />
                <Icon
                  type="material-community"
                  name="circle"
                  size={2}
                  color="#C4C4C4"
                />
                <Icon
                  type="material-community"
                  name="circle"
                  size={2}
                  color="#C4C4C4"
                />
                <Icon
                  type="material-community"
                  name="circle"
                  size={2}
                  color="#C4C4C4"
                />
                <Icon
                  type="material-community"
                  name="circle"
                  size={2}
                  color="#C4C4C4"
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
                  <Text style={styles.desText}>{orders.start_loc}</Text>
                </View>
                <View style={[styles.palace, {marginTop: 9}]}>
                  <Text style={styles.desText}>{orders.end_loc}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.laterDateCard}>
            <Text style={styles.laterDateTitle}>
              {lng === true ? 'Rental Date' : 'Tanggal Sewa'}
            </Text>
            <Text style={styles.laterDate}>
              {moment(orders.later_datetime).format('LLLL')}
            </Text>
          </View>
          {!acc ? (
            <View style={styles.buttonConfirm}>
              <Button
                title={lng === true ? 'Reject' : 'Tolak'}
                titleStyle={[styles.buttonTitle, {color: '#F53649'}]}
                buttonStyle={{backgroundColor: '#FFFFFF'}}
                containerStyle={styles.cancel}
                onPress={() => dispatch({type: CANCEL})}
              />
              <Button
                title={lng === true ? 'Accept' : 'Terima'}
                titleStyle={styles.buttonTitle}
                buttonStyle={{backgroundColor: '#17273F'}}
                containerStyle={styles.accept}
                onPress={() => {
                  setAcc(true);
                  dispatch(
                    acceptOrder(orders.order_id, orders.later, orders.trip),
                  );
                }}
              />
            </View>
          ) : (
            <>
              <View style={styles.confirm}>
                <Text style={styles.confirmText}>
                  {lng === true
                    ? 'Waiting for Confirmation'
                    : 'Menunggu Konfirmasi'}
                </Text>
              </View>
              {orders.payment_status === true && dispatch({type: LATER_COUNT})}
            </>
          )}
        </View>
      </Modal>
      <Modal visible={order.canceled} onDismiss={canceled}>
        <View style={styles.reject}>
          <Text style={styles.rejectTitle}>
            {lng === true ? 'Order Canceled' : 'Pesanan Dibatalkan'}
          </Text>
          <Text style={styles.rejectMessage}>
            {lng === true
              ? "Orders canceled, don't be sad, let's find another order"
              : 'Pesanan dibatalkan, jangan sedih yuk cari lagi'}
          </Text>
          <Button
            title="OK"
            titleStyle={styles.buttonTitleReject}
            buttonStyle={{backgroundColor: '#17273F'}}
            containerStyle={styles.rejectButton}
            onPress={canceled}
          />
        </View>
      </Modal>
      <Modal visible={alert} onDismiss={() => setAlert(false)}>
        <View style={styles.alert}>
          <FastImage
            source={require('../assets/laterAlert.png')}
            style={styles.alertImage}
          />
          <Text style={styles.alertTitle}>
            {lng === true
              ? 'Your Trip Will Start Soon'
              : 'Sebentar Lagi Perjalanan Anda Akan Segera Dimulai'}
          </Text>
          <Text style={styles.alertMessage}>
            {lng === true
              ? "You cannot accept orders at this time because there are later's order."
              : 'Kamu tidak bisa menerima pesanan untuk saat ini karena ada pesanan Sewa Nanti.'}
          </Text>
          <Button
            title="OK"
            titleStyle={styles.buttonTitleReject}
            buttonStyle={{backgroundColor: '#17273F'}}
            containerStyle={styles.rejectButton}
            onPress={() => navigation.navigate('Home Trip')}
          />
        </View>
      </Modal>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maps: {
    width: '100%',
    height: '100%',
  },
  dateTitle: {
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    fontSize: 12,
    color: '#808080',
  },
  laterDateTitle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    color: '#979797',
  },
  laterDate: {
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    fontSize: 16,
    color: '#333333',
    marginTop: 5,
  },
  alertTitle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555555',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 15,
  },
  alertMessage: {
    fontFamily: 'Source Sans Pro',
    fontSize: 10,
    textAlign: 'center',
    color: '#80807E',
    marginTop: 10,
    marginLeft: 26,
    marginRight: 36,
  },
  alertImage: {
    width: 179,
    height: 129,
    marginTop: 21,
  },
  alert: {
    backgroundColor: '#FFF',
    borderColor: '#F1F3F6',
    borderRadius: 17,
    borderWidth: 1,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  laterDateCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F3F6',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 3,
    paddingTop: 8,
    paddingHorizontal: 15,
    paddingBottom: 18,
  },
  laterGif: {
    width: 41,
    height: 41,
    marginHorizontal: 4,
  },
  laterList: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    elevation: 4,
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
    marginHorizontal: 8,
  },
  reject: {
    backgroundColor: '#FFF',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#F1F3F6',
    marginHorizontal: 20,
  },
  rejectTitle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#17273F',
    textAlign: 'center',
    marginTop: 20,
  },
  rejectMessage: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    color: '#80807E',
    textAlign: 'center',
    marginTop: 6,
  },
  buttonTitleReject: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginHorizontal: 77,
  },
  rejectButton: {
    borderRadius: 8,
    marginVertical: 22,
    alignSelf: 'center',
  },
  long: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    color: '#80807E',
    textAlign: 'right',
  },
  date: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Source Sans Pro',
    color: '#303030',
    marginTop: 5,
    maxWidth: 150,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  confirm: {
    backgroundColor: '#E2E2E2',
    borderRadius: 2,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  laterTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'Source Sans Pro',
    fontWeight: 'bold',
    color: '#818181',
    textAlign: 'center',
  },
  buttonConfirm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  driverName: {
    fontFamily: 'Source Sans Pro',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#17273F',
  },
  cancel: {
    borderColor: '#F53649',
    borderWidth: 1,
    borderRadius: 5,
    width: '42%',
  },
  accept: {
    borderRadius: 5,
    width: '42%',
  },
  message: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: '#EFEFEF',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    padding: 5,
  },
  text: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    color: '#6C6C6C',
    marginLeft: 5,
  },
  desText: {
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontWeight: '600',
    color: '#303030',
    paddingRight: 20,
  },
  des: {
    marginLeft: 12,
    width: 284,
  },
  palace: {
    borderBottomWidth: 1,
    borderColor: '#F1F3F6',
    borderRadius: 5,
    paddingBottom: 5,
  },
  textLater: {
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Source Sans Pro',
    color: '#000',
    marginTop: 2,
  },
  desIcon: {
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  destinationInfo: {
    flexDirection: 'row',
    marginTop: 12,
  },
  price: {
    fontFamily: 'Source Sans Pro',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#17273F',
    marginTop: 3,
    textAlign: 'right',
  },
  length: {
    fontSize: 16,
    fontFamily: 'Source Sans Pro',
    color: '#80807E',
    textAlign: 'right',
  },
  customerImage: {
    height: 40,
    width: 40,
    borderRadius: 100,
  },
  customerName: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Source Sans Pro',
    color: '#333333',
    alignSelf: 'center',
    marginLeft: 5,
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#E1E1E1',
    paddingBottom: 5,
  },
  customer: {
    flexDirection: 'row',
  },
  orderCard: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F1F3F6',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 3,
  },
  driverInfo: {
    marginLeft: 10,
  },
  orderIn: {
    backgroundColor: '#FFF',
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    paddingVertical: 30,
    marginTop: 350,
  },
  title: {
    fontFamily: 'Source Sans Pro',
    fontSize: 18,
    fontWeight: '600',
    color: '#17273F',
    marginLeft: 35,
  },
  panic: {
    marginTop: 10,
  },
  panicImage: {
    width: 50,
    height: 50,
    alignSelf: 'flex-end',
  },
  iconContainer: {
    marginRight: 20,
  },
  camera: {
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#DEDEDE',
    padding: 10,
    alignSelf: 'flex-end',
  },
  driverRating: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    color: '#8D8D8D',
  },
  income: {
    marginLeft: 30,
    marginRight: 18,
  },
  driver: {
    backgroundColor: '#FFFFFF',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 100,
    marginLeft: 20,
    marginTop: 29,
    marginBottom: 25,
  },
  buttonContainer: {
    marginHorizontal: 22,
    marginTop: 25,
    marginBottom: 21,
    borderRadius: 10,
  },
  lokasiLogo: {
    width: 123,
    height: 134,
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 17,
  },
  internetLogo: {
    width: 148,
    height: 148,
    alignSelf: 'center',
    marginTop: 28,
  },
  modalTitle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1C1C1C',
    marginTop: 6,
  },
  buttonTitle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontWeight: '600',
    color: '#EEFFFB',
  },
  modalText: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    color: '#727272',
    textAlign: 'center',
    marginTop: 5,
    marginHorizontal: 17,
  },
  headerText: {
    fontFamily: 'Source Sans Pro',
    fontSize: 18,
    color: '#17273F',
    textAlign: 'left',
  },
  statusContainer: {
    zIndex: 3,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontWeight: '600',
    fontSize: 10,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  icon: {
    alignSelf: 'flex-end',
    marginRight: 15,
  },
  modal: {
    borderWidth: 1,
    borderColor: '#BEB9B9',
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginHorizontal: 22,
  },
});

const Maps = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];
