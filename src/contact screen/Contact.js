import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Linking,
  StatusBar,
} from 'react-native';
import {Icon, Image} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Phone from '../assets/hub.png';
import Email from '../assets/email.png';
import WhatsApp from '../assets/wa.png';

const ContactList = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.ContactList}>
      <Image source={props.source} style={styles.image} />
      <View style={styles.ContactCard}>
        <Text style={styles.text}>{props.children}</Text>
        <Text style={styles.subtitle}>{props.data}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Contact = () => {
  const lng = useSelector((state) => state.driver.english);

  const dialCall = () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:${02112345678}';
    } else {
      phoneNumber = 'telprompt:${02112345678}';
    }
    Linking.openURL(phoneNumber);
  };

  const sendWhatsApp = () => {
    let msg = 'Hay, MySupir..';
    let mobile = 82276201549;
    if (mobile) {
      if (msg) {
        // Kode negara 62 = Indonesia
        let url = 'whatsapp://send?text=' + msg + '&phone=62' + mobile;
        Linking.openURL(url)
          .then((data) => {
            console.log('WhatsApp Opened');
          })
          .catch(() => {
            alert('Make sure Whatsapp installed on your device');
          });
      } else {
        alert('Please insert message to send');
      }
    } else {
      alert('Please insert mobile no');
    }
  };

  const sendEmail = () => {
    Linking.openURL(
      'mailto:support@mysupir.com?subject=Help/Support&body=This is Description',
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.ContactContainer}>
        <ContactList onPress={dialCall} source={Phone} data={'021-0000000'}>
          {lng === true ? 'Phone' : 'Telephone'}
        </ContactList>
        <ContactList
          onPress={sendEmail}
          source={Email}
          data={'mysupir@gmail.com'}>
          {lng === true ? 'Email' : 'Email'}
        </ContactList>
        <ContactList
          onPress={sendWhatsApp}
          source={WhatsApp}
          data={'Chat langsung dengan costumer care melalui Whatsapp'}>
          {lng === true ? 'Whatsapp' : 'Whatsapp'}
        </ContactList>
      </View>
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ContactContainer: {
    marginTop: 14,
  },
  ContactCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
  },
  ContactList: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  text: {
    fontWeight: '600',
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    color: '#17273F',
  },
  icon: {
    alignSelf: 'center',
    marginRight: 13,
  },
});
