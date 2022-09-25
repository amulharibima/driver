import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const AboutList = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.aboutCard}>
        <Text style={styles.text}>{props.children}</Text>
        <Icon
          type="material-community"
          name="chevron-right"
          size={20}
          containerStyle={styles.icon}
        />
      </View>
    </TouchableOpacity>
  );
};

const About = () => {
  const lng = useSelector((state) => state.driver.english);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.aboutContainer}>
        <AboutList onPress={() => navigation.navigate('About Us')}>
          {lng === true ? 'About My Supir' : 'Tentang My Supir'}
        </AboutList>
        <AboutList onPress={() => navigation.navigate('Terms')}>
          {lng === true ? 'Terms & conditions' : 'Syarat & Ketentuan'}
        </AboutList>
        <AboutList onPress={() => navigation.navigate('Policy')}>
          {lng === true ? 'Privacy Policy' : 'Kebijakan Privasi'}
        </AboutList>
      </View>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  aboutContainer: {
    marginTop: 14,
  },
  aboutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginTop: 5,
  },
  text: {
    fontWeight: '600',
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    color: '#17273F',
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 13,
    alignSelf: 'center',
  },
  icon: {
    alignSelf: 'center',
    marginRight: 13,
  },
});
