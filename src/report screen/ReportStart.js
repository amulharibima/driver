import React, {useState, useMemo, useEffect} from 'react';
import {View, Text, StyleSheet, Image, ActivityIndicator, BackHandler, Alert} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import {Button, Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {REPORT_IMAGE, REPORT} from '../redux/case type/DriverCase';
import {Modal} from 'react-native-paper';
import {reportStart} from '../redux/action/DriverAction';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {API_ORDER} from '../API';
import EndPoint from '../Endpoit';
import { RNCamera } from 'react-native-camera';
import Rec from '../assets/rec.png';
import {PICTURE} from "../redux/case type/DriverProfileCase";
import {changePicture} from "../redux/action/DriverProfileAction";

const ReportStart = () => {
  const send = useSelector((state) => state.driver.report);
  const [filePath, setFilePath] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [view, setView] = useState(false);
  const [idImage, setIdImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState([]);
  const navigation = useNavigation();
  const lng = useSelector((state) => state.driver.english);
  const dispatch = useDispatch();
  const time = useSelector((state) => state.driver.onTime);
  const order_id = useSelector((state) => state.order.order_id);
  let images = [
    {
      id: 5,
      add: true,
      image: Image.resolveAssetSource(require('../assets/addphoto.png')).uri,
    },
  ];
  const [select, setSelect] = useState(false);
  const [isCameraOpened, setIsCameraOpened] = useState(false);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }
  }, [isCameraOpened]);

  const handleBackButtonClick = () => {
    if(isCameraOpened){
      setIsCameraOpened(false);
      return true;
    }
    return false;
  }

  const preview = (image, id) => {
    setPreviewImage(image);
    setView(true);
    setIdImage(id);
  };

  const takePicture = async function(camera) {
    if (filePath.length < 5){
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);

      console.log('ini foto', data)

      const source = {path: data.uri};
      const joined = filePath.concat(source);
      console.log('joined : ', joined);
      setFilePath(joined);
      setPicture([...picture, source]);
      setIsCameraOpened(false);
    } else {
      Alert.alert('Foto maksimal hanya 5');
    }
  };

  const chooseFile = async (type) => {
    let tmpArr = [];
    if (filePath.length <= 4) {
      try {
        let pictures;
        if (type === 1) {
          pictures = await ImagePicker.openPicker({
            multiple: true,
          });
          if (pictures.length > 5) {
            alert('Max Pict is 5');
          } else {
            const joined = filePath.concat(pictures);
            setFilePath(joined);
            setPicture(pictures);
          }
        } else {
          console.log('IMAGES', images);
          setIsCameraOpened(true);
        }
        setSelect(false);
      } catch (error) {
        console.log(error, 'error');
      }
    } else {
      alert('max photo 5');
    }
  };

  const handlePutImage = (item) => {
    return item.map((obj, index) => {
      return Object.assign({}, obj, {id: index}, {add: false});
    });
  };

  useMemo(() => {
    if (filePath.length > 0) {
      const arrPict = handlePutImage(filePath);
      arrPict?.forEach((item) => {
        images.unshift({
          id: item.id,
          image: item.path !== undefined ? item.path : item.image,
          add: item.add,
        });
      });
    }

    return images;
  }, [filePath, images]);

  const deleteImage = (id) => {
    const arr = images.filter((item) => {
      return item.id !== id && item.id !== 5;
    });
    setFilePath(arr);
  };

  const pict = (props) => {
    if (props.add === false) {
      preview(props.image, props.id);
    } else {
      setSelect(true);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => pict(item)}>
      <View>
        {item.add === false && (
          <Icon
            type="feather"
            name="x-circle"
            size={15}
            containerStyle={styles.iconImage}
            color="#000"
            onPress={() => deleteImage(item.id)}
          />
        )}
        <FastImage source={{uri: item.image}} style={styles.image} />
      </View>
    </TouchableOpacity>
  );

  console.log(picture);

  const sendPict = async () => {
    setLoading(true);
    const formData = new FormData();
    if (picture.length > 0 || Object.values(picture).length > 0) {
      images.pop();
      picture.forEach((item, index) => {
        formData.append(`photos[${index}]`, {
          uri: item.path,
          name: `picture[${index}]`,
          type: 'jpg/png',
        });
      });
      console.log(order_id);
      dispatch({type: REPORT_IMAGE, reportImage: images});
      console.log('data dikirim', formData)
      try {
        const url = EndPoint.START_ORDER + order_id;
        const token = await AsyncStorage.getItem('userToken');
        const res = await Axios.post(
          // `${API_ORDER}init/${order_id}`,
          url,
          formData,
          {
            headers: {
              Authorization: 'Bearer ' + token,
              // accept: 'application/json',
              // 'Content-Type': 'application/json',
            },
          },
        );
        if (res !== null) {
          console.log(res.data);
          setLoading(false);
          dispatch({type: REPORT, report: true});
          dispatch({type: 'TIME_START'});
        }
      } catch (error) {
        console.log('error');
        console.log(error);
        alert(error);
        setLoading(false);
      }
    } else {
      alert('Please Input Pictures');
      setLoading(false);
    }
  };

  return (
      isCameraOpened ?
          <RNCamera
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              captureAudio={false}
              pauseAfterCapture={true}
          >
            {({ camera }) => {
              return (
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => takePicture(camera)} style={styles.capture}>
                      <Image source={Rec} style={{width: 70, height: 70, alignSelf: 'center'}} resizeMode={'contain'} />
                    </TouchableOpacity>
                  </View>
              );
            }}
          </RNCamera> :
    <>
      <View style={styles.container}>
        {send === false ? (
          <>
            <Text style={styles.title}>
              {lng === true ? 'Upload Damage Picture' : 'Upload Foto Kerusakan'}
            </Text>
            <View style={styles.imageContainer}>
              <FlatList
                data={images}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={4}
              />
            </View>
            <View style={styles.border} />
            <Button
              title={lng === true ? 'Send Report' : 'Kirim Laporan'}
              titleStyle={styles.buttonTitle}
              buttonStyle={{backgroundColor: '#17273F'}}
              containerStyle={styles.button}
              onPress={sendPict}
            />
          </>
        ) : (
          <View style={styles.sendContainer}>
            <FastImage
              source={require('../assets/report.png')}
              style={styles.reportImage}
            />
            <Text style={styles.sendTitle}>
              {lng === true
                ? 'Report Successfully Sent'
                : 'Laporan Berhasil Dikirim'}
            </Text>
            <Text style={styles.message}>
              {lng === true
                ? `The car picture has been sent. Please tap "Continue" to start the trip`
                : `Foto mobilnya sudah terkirim. Silahkan ketuk “Lanjut ke
              Perjalanan” untuk memulai perjalanan`}
            </Text>
            <Button
              title={lng === true ? 'Continue' : 'Lanjut ke Perjalanan'}
              titleStyle={styles.buttonSendTitle}
              buttonStyle={{backgroundColor: '#17273F'}}
              containerStyle={styles.sendButton}
              icon={
                <Icon
                  type="material-community"
                  name="chevron-right"
                  size={16}
                  color="#EEFFFB"
                  containerStyle={styles.icon}
                />
              }
              iconRight={true}
              onPress={() => {
                navigation.push(time === true ? 'Home Time' : 'Home Trip');
                setFilePath([]);
              }}
            />
          </View>
        )}
      </View>
      <Modal
        visible={view}
        onDismiss={() => {
          setView(false);
          setPreviewImage('');
        }}>
        <View style={styles.modalHeader}>
          <Icon
            type="material-community"
            name="delete"
            size={30}
            color="#FFF"
            containerStyle={styles.modalIcon}
            onPress={() => {
              deleteImage(idImage);
              setView(false);
            }}
          />
          <Icon
            type="material-community"
            name="close-circle"
            size={30}
            color="#FFF"
            containerStyle={styles.modalIcon}
            onPress={() => setView(false)}
          />
        </View>
        <FastImage
          source={{uri: previewImage}}
          style={styles.imagePreview}
          resizeMode={FastImage.resizeMode.contain}
        />
      </Modal>
      <Modal visible={select} onDismiss={() => setSelect(false)}>
        <View
          style={{
            backgroundColor: '#FFF',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            marginHorizontal: 20,
            borderRadius: 20,
          }}>
          <TouchableOpacity onPress={() => chooseFile(0)}>
            <View
              style={{
                marginHorizontal: 10,
              }}>
              <Text>Buka Kamera</Text>
              <FastImage
                source={{
                  uri: Image.resolveAssetSource(
                    require('../assets/addphoto.png'),
                  ).uri,
                }}
                style={styles.image}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => chooseFile(1)}>
            <View
              style={{
                marginHorizontal: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                Buka Galeri
              </Text>
              <FastImage
                source={{
                  uri: Image.resolveAssetSource(
                    require('../assets/addphoto.png'),
                  ).uri,
                }}
                style={styles.image}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={loading}>
        <ActivityIndicator size="large" />
      </Modal>
    </>
  );
};

export default ReportStart;

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Source Sans Pro',
    color: '#282828',
    marginLeft: 20,
    marginTop: 20,
  },
  imagePreview: {
    width: '80%',
    height: undefined,
    aspectRatio: 2 / 3,
    alignSelf: 'center',
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sendButton: {
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 25,
    alignItems: 'center',
  },
  iconImage: {
    position: 'absolute',
    alignSelf: 'flex-end',
    zIndex: 3,
    marginTop: 10,
    paddingRight: 2,
  },
  icon: {
    marginTop: 3,
    marginLeft: 7,
    marginRight: 9,
  },
  buttonSendTitle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    fontWeight: '600',
    color: '#EEFFFB',
    marginLeft: 14,
  },
  message: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    color: '#535353',
    textAlign: 'center',
    marginTop: 10,
    alignSelf: 'center',
    display: 'flex',
    marginHorizontal: 40,
  },
  sendTitle: {
    fontWeight: 'bold',
    fontFamily: 'Source Sans Pro',
    fontSize: 18,
    color: '#17273F',
    textAlign: 'center',
    marginTop: 27,
  },
  reportImage: {
    height: 157,
    width: 183,
    alignSelf: 'center',
  },
  sendContainer: {
    marginTop: 105,
  },
  buttonTitle: {
    fontSize: 16,
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    color: '#FFF',
    marginVertical: 3,
  },
  button: {
    margin: 20,
    borderRadius: 6,
  },
  image: {
    width: 63,
    height: 63,
    marginLeft: 15,
    marginTop: 10,
  },
  imageContainer: {
    marginLeft: 5,
  },
  addImage: {
    height: 63,
    width: 63,
    marginLeft: 15,
    marginTop: 10,
    position: 'absolute',
  },
  photoText: {
    fontFamily: 'Source Sans Pro',
    fontSize: 8,
    color: '#828282',
    marginLeft: 18,
    marginTop: 50,
  },
  border: {
    height: 24,
    backgroundColor: '#EDEDED',
    marginTop: 35,
  },
});
