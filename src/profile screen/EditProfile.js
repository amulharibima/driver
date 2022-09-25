import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Alert, BackHandler} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import Avatar from '../assets/profile.png';
import {
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import {useSelector, useDispatch} from 'react-redux';
import {
  changePicture,
  changeProfile,
} from '../redux/action/DriverProfileAction';
import {PICTURE} from '../redux/case type/DriverProfileCase';
import { RNCamera } from 'react-native-camera';
import Rec from '../assets/rec.png';

const EditProfile = () => {
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const lng = useSelector((state) => state.driver.english);
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
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

  const getImage = async () => {
    Alert.alert(
        "Upload Photo",
        "Select image source",
        [
          { text: "Cancel", onPress: () => console.log("OK Pressed") },
          {
            text: "From camera...",
            onPress: () => setIsCameraOpened(true),
          },
          {
            text: "From file...",
            onPress: () => pickSingle(false)
          },

        ]
    );
  };

  const takePicture = async function(camera) {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    //  eslint-disable-next-line
    setAvatar(data.uri);
    const formData = new FormData();
    formData.append('foto', {
      name: 'ghostImage',
      type: 'image/jpg',
      uri: data.uri,
    });
    dispatch({type: PICTURE, picture: data.uri});
    dispatch(changePicture(formData));
    console.log('foto', data);
    setIsCameraOpened(false);
//    console.log(data.uri);
  };

  const pickSingle = (cropit, circular = false, mediaType) => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: cropit,
      cropperCircleOverlay: circular,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      cropperStatusBarColor: 'white',
      cropperToolbarColor: 'white',
      cropperActiveWidgetColor: 'white',
      cropperToolbarWidgetColor: '#3498DB',
    })
      .then((image) => {
        setAvatar(image.path);
        const formData = new FormData();
        formData.append('foto', {
          name: 'ghostImage',
          type: image.mime,
          uri: image.path,
        });
        dispatch({type: PICTURE, picture: image.path});
        dispatch(changePicture(formData));
        console.log('galeri', image);
        // this.setState({
        //   image: {
        //     uri: image.path,
        //     width: image.width,
        //     height: image.height,
        //     mime: image.mime,
        //   },
        //   images: null,
        // });
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  }

  let avatarImage;
  if (profile.picture !== null && avatar === null) {
    avatarImage = {uri: profile.picture};
  } else if (avatar !== null) {
    avatarImage = {uri: avatar};
  } else {
    avatarImage = Avatar;
  }

  console.log(avatarImage);

  const profileUpdate = () => {
    let user_name;
    let user_address;
    if (name !== '') {
      user_name = name;
    } else {
      user_name = profile.name;
    }
    if (address !== '') {
      user_address = address;
    } else {
      user_address = profile.address;
    }
    dispatch(changeProfile(user_name, user_address, navigation));
  };

  const onChangeName = (val) => {
    setName(val);
  };

  const onChangeAddress = (val) => {
    setAddress(val);
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
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Icon
            type="material"
            name="arrow-back"
            size={26}
            containerStyle={{alignSelf: 'center'}}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>
            {lng === true ? 'My Profile' : 'Profile Saya'}
          </Text>
        </View>
        <View style={styles.imageContainer}>
        <TouchableWithoutFeedback onPress={getImage}>
          {/* <TouchableWithoutFeedback onPress={() => setModalVisible(true)}> */}
            <FastImage source={avatarImage} style={styles.avatar} />
            <Icon
              type="material-community"
              name="pencil-circle"
              size={30}
              containerStyle={styles.icon}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.bioContainer}>
          <View style={styles.biodata}>
            <Text style={styles.bioTitle}>
              {lng === true ? 'Full Name' : 'Nama Lengkap'}
            </Text>
            <TextInput
              placeholder={
                lng === true ? 'Input Full Name' : 'Masukkan Nama Lengkap'
              }
              onChangeText={onChangeName}
              defaultValue={profile.name}
              style={styles.bioTextContainer}
            />
          </View>
          <View style={styles.biodata}>
            <Text style={styles.bioTitle}>
              {lng === true ? 'ID Identifier' : 'Identifikasi ID'}
            </Text>
            <View style={styles.bioTextContainer}>
              <Text style={styles.bioText}>{profile.identify}</Text>
            </View>
          </View>
          <View style={styles.biodata}>
            <Text style={styles.bioTitle}>
              {lng === true ? 'Phone Number' : 'No. Telp'}
            </Text>
            <View style={styles.bioTextContainer}>
              <Text style={styles.bioText}>(+62) {profile.phone_profile}</Text>
            </View>
          </View>
          <View style={styles.biodata}>
            <Text style={styles.bioTitle}>
              {lng === true ? 'Address' : 'Alamat'}
            </Text>
            <TextInput
              placeholder={
                lng === true ? 'Input Your Address' : 'Masukkan Alamat Lengkap'
              }
              defaultValue={profile.address}
              style={styles.bioTextContainer}
              multiline={true}
              onChangeText={onChangeAddress}
            />
          </View>
        </View>
        <Button
          title={lng === true ? 'Save' : 'Simpan'}
          containerStyle={styles.buttonContainer}
          buttonStyle={{backgroundColor: '#17273F'}}
          titleStyle={styles.titleButton}
          onPress={profileUpdate}
        />
        {/* <PilihFoto/> */}
      </View>
    </ScrollView>
  );
};

export default EditProfile;

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
  headerText: {
    fontFamily: 'Source Sans Pro',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 97,
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 20,
    marginRight: 15,
  },
  avatar: {
    width: 111,
    height: 111,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 35,
  },
  bioTitle: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    color: '#8F8F8F',
  },
  biodata: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  bioContainer: {
    marginTop: 20,
  },
  bioTextContainer: {
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  bioText: {
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    color: '#A8A8A8',
  },
  buttonContainer: {
    marginHorizontal: 16,
    borderRadius: 10,
    marginVertical: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  icon: {
    alignSelf: 'flex-end',
    bottom: 22,
    padding: 0,
    margin: 0,
    right: 10,
  },
  titleButton: {
    fontSize: 16,
    fontFamily: 'Source Sans Pro',
    color: '#F9F9F9',
    fontWeight: '600',
    marginBottom: 10,
  },
});
