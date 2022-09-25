import React, {useEffect} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import RootStack from './RootStack';
import {View, StyleSheet, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {FlatList, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Icon, Button} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {onLogout} from './redux/action';
import {DrawerActions} from '@react-navigation/native';
import StarRating from 'react-native-star-rating';

const Drawer = createDrawerNavigator();

const CustomDrawerComponent = ({navigation}) => {
  const lng = useSelector((state) => state.driver.english);
  const profile = useSelector((state) => state.profile);
  const rate = useSelector((state) => state.driver.rating);
  const sim = useSelector((state) => state.driver.licenses);
  const dispatch = useDispatch();
  const DummyRate = [
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

  let Rate = [];

  const logout = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    dispatch(onLogout(navigation));
  };

  return (
    <DrawerContentScrollView>
      <View style={styles.header}>
        <View style={styles.profile}>
          <FastImage source={{uri: profile.picture}} style={styles.image} />
          <Text style={styles.name}>{profile.name}</Text>
        </View>
      </View>
      <View style={styles.profileCard}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Profile')}>
          <View style={styles.driver}>
            <View style={styles.phone}>
              <Text style={styles.cardTitle}>
                {lng === true ? 'Phone Number' : 'No. telp'}
              </Text>
              <Text style={styles.number}>+62{profile.phone_profile}</Text>
            </View>
            <View style={styles.rating}>
              <Text style={styles.cardTitle}>
                Rating
                <Text style={[styles.cardTitle, {fontFamily: 'Poppins'}]}>
                  /{rate}
                </Text>
              </Text>
              <FlatList
                data={Rate}
                renderItem={({item}) => (
                  <Icon
                    type="material-community"
                    name="star"
                    size={15}
                    color={item.selected === true ? '#FBB709' : 'grey'}
                  />
                )}
                keyExtractor={(item) => item.id}
                horizontal={true}
              />
              <StarRating
                maxStars={5}
                rating={rate}
                disabled
                starSize={20}
                fullStarColor={'#f0a500'}
                halfStarColor={'#f0a500'}
                starStyle={{marginHorizontal: 2}}
                containerStyle={styles.starContainer}
              />
            </View>
          </View>
          <FlatList
            data={sim}
            renderItem={({item}) => (
              <View style={styles.licenseCard}>
                <Text style={styles.licenseText}>{item}</Text>
              </View>
            )}
            horizontal={true}
            contentContainerStyle={styles.license}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.navContainer}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Order History')}>
          <View style={styles.navi}>
            <FastImage
              source={require('./assets/order.png')}
              style={styles.imageIcon}
            />
            <Text style={styles.text}>
              {lng === true ? 'Order History' : 'Riwayat Order'}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Income')}>
          <View style={styles.navi}>
            <FastImage
              source={require('./assets/money.png')}
              style={styles.imageIcon}
            />
            <Text style={styles.text}>
              {lng === true ? 'Income' : 'Pendapatan'}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Review')}>
          <View style={styles.navi}>
            <FastImage
              source={require('./assets/review.png')}
              style={styles.imageIcon}
            />
            <Text style={styles.text}>Review</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('About')}>
          <View style={styles.navi}>
            <FastImage
              source={require('./assets/about.png')}
              style={styles.imageIcon}
            />
            <Text style={styles.text}>
              {lng === true ? 'About Us' : 'Tentang Kami'}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Contact')}>
          <View style={styles.navi}>
            <FastImage
              source={require('./assets/call.png')}
              style={styles.imageIcon}
            />
            <Text style={styles.text}>
              {lng === true ? 'Contact Us' : 'Hubungi Kami'}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Language')}>
          <View style={styles.navi}>
            <FastImage
              source={require('./assets/language.png')}
              style={styles.imageIcon}
            />
            <Text style={styles.text}>
              {lng === true ? 'Change Language' : 'Ubah Bahasa'}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Button
        title={lng === true ? 'Logout' : 'Keluar'}
        titleStyle={styles.buttonTitle}
        buttonStyle={{backgroundColor: '#17273F'}}
        containerStyle={styles.button}
        onPress={logout}
      />
    </DrawerContentScrollView>
  );
};

const RootDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerComponent {...props} />}
      drawerStyle={{width: '90%'}}>
      <Drawer.Screen
        name="Dashboard"
        component={RootStack}
        options={{swipeEnabled: false}}
      />
    </Drawer.Navigator>
  );
};

export default RootDrawer;

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#17273F',
    borderBottomEndRadius: 150,
    marginTop: -4,
    padding: 20,
    height: 180,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  buttonTitle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginVertical: 3,
  },
  button: {
    marginHorizontal: 60,
    borderRadius: 10,
    // marginTop: 45,
  },
  navi: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginVertical: 6,
  },
  navContainer: {
    bottom: 90,
    marginTop: 20,
  },
  imageIcon: {
    width: 32,
    height: 32,
  },
  text: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Source Sans Pro',
    color: '#17273F',
    marginLeft: 20,
  },
  license: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginBottom: 20,
    marginTop: 15,
  },
  licenseText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
  },
  licenseCard: {
    backgroundColor: '#17273F',
    borderRadius: 5,
    paddingHorizontal: 6,
    marginLeft: 15,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#F1F3F6',
    marginTop: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    elevation: 5,
    marginHorizontal: 20,
    bottom: 90,
  },
  phone: {
    borderRightWidth: 1,
    borderColor: '#F1F3F6',
    paddingRight: 20,
    marginRight: 20,
  },
  number: {
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    color: '#1C1C1C',
  },
  name: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 15,
  },
  driver: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#F1F3F6',
    paddingBottom: 10,
    marginHorizontal: 20,
    marginTop: 7,
  },
  cardTitle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 10,
    fontWeight: '600',
    color: '#8D8D8D',
    textAlign: 'center',
  },
});
