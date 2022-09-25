import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  FlatList,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native-gesture-handler';
import {Icon, Header} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {API_DRIVER} from '../API';
import Pusher from 'pusher-js/react-native';
import Echo from 'laravel-echo';
import moment from 'moment';
import EndPoint from '../Endpoit';

const RECEIEVE = 'RECEIVE';
const SEND = 'SEND';

const LeftComponent = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <Icon
        type="material-community"
        name="arrow-left"
        size={22}
        containerStyle={{marginLeft: 5}}
      />
    </TouchableWithoutFeedback>
  );
};

const CenterComponent = (props) => {
  return (
    <View style={styles.centerComp}>
      <FastImage source={props.image} style={styles.centerImage} />
      <Text style={styles.centerName}>{props.name}</Text>
    </View>
  );
};

const RightComponent = (props) => {
  return (
    <View style={styles.rightComp}>
      <TouchableWithoutFeedback onPress={props.chat}>
        <Icon
          type="material-community"
          name="whatsapp"
          size={27}
          color="#000"
          containerStyle={{alignSelf: 'center'}}
        />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={props.call}>
        <Icon
          type="feather"
          name="phone"
          size={22}
          color="#000"
          containerStyle={{marginLeft: 13, marginTop: 3}}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

let chatVar = [];

const Chat = () => {
  const navigation = useNavigation();
  const lng = useSelector((state) => state.driver.english);
  const order = useSelector((state) => state.order);
  const id = useSelector((state) => state.profile.id);
  const [message, setMessage] = useState('');
  const [data, setData] = useState();
  const isFocused = useIsFocused();

  const handleCallback = async () => {
    try {
      const url = EndPoint.GET_CHAT + order.chat_id;
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.get(
        // `http://mysupir.omindtech.id/api/chat/conversation/${order.chat_id}`,
        url,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (res) {
        console.log(res.data.messages.data);
        setData(res.data.messages.data);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const messaging = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = EndPoint.AUTH_BROADCAST;
      const pusher = new Pusher('b18ddeb2c00212231da7', {
        // authEndpoint: 'http://mysupir.omindtech.id/broadcasting/auth',
        authEndpoint: url,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        cluster: 'ap1',
      });
      const echo = new Echo({
        broadcaster: 'pusher',
        client: pusher,
      });
      echo
        .private(`mc-chat-conversation.${order.chat_id}`)
        .listen('.Musonza\\Chat\\Eventing\\MessageWasSent', handleCallback);
    } catch (error) {
      console.log(error, 'error');
    }
  };

  useEffect(() => {
    messaging();
  }, []);

  useEffect(() => {
    handleCallback();
  }, [isFocused]);

  const onMessageChange = (val) => {
    setMessage(val);
  };

  const sendChat = async () => {
    try {
      const url = EndPoint.SEND_CHAT + order.chat_id;
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.post(
        // `http://mysupir.omindtech.id/api/chat/message/${order.chat_id}`,
        url,
        {
          text: message,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      if (res !== null) {
        console.log(res.data);
        setMessage('');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const renderItem = ({item}) => (
    <View
      style={[
        styles.chatBox,
        {
          backgroundColor: item.sender.id === id ? '#17273F' : '#FFFFFF',
          alignSelf: item.sender.id === id ? 'flex-end' : 'flex-start',
        },
      ]}>
      <Text
        style={[
          styles.chatTxt,
          {color: item.sender.id === id ? '#FFFFFF' : '#17273F'},
        ]}>
        {item.body}
      </Text>
      <Text
        style={[
          styles.chatTime,
          {color: item.sender.id === id ? '#FFFFFF' : '#17273F'},
        ]}>
        {moment(item.created_at).format('LL')}
      </Text>
    </View>
  );

  console.log(chatVar);

  return (
    <>
      <Header
        leftComponent={<LeftComponent onPress={() => navigation.goBack()} />}
        centerComponent={
          <CenterComponent
            image={{uri: order.user_pict}}
            name={order.user_name}
          />
        }
        containerStyle={styles.header}
      />
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
        <View style={styles.sendBox}>
          <TextInput
            style={styles.inputBox}
            placeholder={
              lng === true
                ? 'Tap to write a message ...'
                : 'Ketuk untuk menulis pesan...'
            }
            multiline={true}
            value={message}
            onChangeText={onMessageChange}
          />
          <TouchableWithoutFeedback onPress={sendChat}>
            <FastImage
              source={require('../assets/send.png')}
              style={styles.send}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 3,
  },
  chatBox: {
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 6,
    maxWidth: '70%',
  },
  chatTxt: {
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    marginTop: 12,
    marginLeft: 15,
    textAlign: 'left',
    marginRight: 32,
  },
  chatTime: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '300',
    textAlign: 'right',
    marginHorizontal: 12,
    marginBottom: 6,
  },
  header: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      height: 4,
      width: 0,
    },
    elevation: 4,
  },
  centerComp: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: -30,
  },
  centerImage: {
    borderRadius: 100,
    width: 36,
    height: 36,
    alignSelf: 'center',
  },
  centerName: {
    fontWeight: 'bold',
    fontFamily: 'Source Sans Pro',
    fontSize: 16,
    color: '#151522',
    alignSelf: 'center',
    marginLeft: 10,
  },
  rightComp: {
    flexDirection: 'row',
    marginRight: 10,
  },
  send: {
    width: 27.5,
    height: 24.5,
  },
  sendBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingTop: 15,
    paddingBottom: 17,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      height: 4,
      width: 0,
    },
    elevation: 4,
  },
  inputBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    paddingLeft: 13,
    width: 280,
    marginRight: 30,
  },
});
