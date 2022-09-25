import React, { useEffect } from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {Icon} from 'react-native-elements';
import Avatar from '../assets/profile.png';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useSelector, useDispatch} from 'react-redux';
import { getProfile } from '../redux/action/DriverProfileAction';

const Profile = () => {
  const navigation = useNavigation();
  const lng = useSelector((state) => state.driver.english);
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  console.log('data profil', profile)

  useEffect(() => {
    dispatch(getProfile());
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.headerContainer}>
        <Icon
          type="material"
          name="arrow-back"
          size={26}
          containerStyle={{alignSelf: 'center'}}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>
          {lng === true ? 'My Profle' : 'Profile Saya'}
        </Text>
        <Icon
          type="material"
          name="edit"
          size={18}
          containerStyle={{alignSelf: 'center'}}
          onPress={() => navigation.navigate('Edit Profile')}
        />
      </View>
      <FastImage source={{uri: profile.picture}} style={styles.avatar} />
      <View style={styles.bioContainer}>
        <View style={styles.biodata}>
          <Text style={styles.bioTitle}>
            {lng === true ? 'Full Name' : 'Nama Lengkap'}
          </Text>
          <View style={styles.bioTextContainer}>
            <Text style={styles.bioText}>{profile.name}</Text>
          </View>
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
          <View style={styles.bioTextContainer}>
            <Text style={styles.bioText}>{profile.address}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerText: {
    fontFamily: 'Source Sans Pro',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 20,
    justifyContent: 'space-between',
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
    color: '#17273F',
    fontWeight: '600',
  },
});
