import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {TextInput} from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {API_DRIVER} from '../API';
import {useNavigation} from '@react-navigation/native';
import EndPoint from '../Endpoit';

const Withdraw = () => {
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [rekNum, setRekNum] = useState(0);
  const [label, setLabel] = useState('');
  const navigation = useNavigation();
  const lng = useSelector((state) => state.driver.english);
  const Items = [
    {
      label: 'BCA',
      value: 'BCA',
    },
    {
      label: 'BNI',
      value: 'BNI',
    },
    {
      label: 'BRI',
      value: 'BRI',
    },
    {
      label: 'MANDIRI',
      value: 'MANDIRI',
    },
  ];

  const onSelected = (val) => {
    setValue(val);
  };

  const withdraw = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = EndPoint.REQUEST_INCOME;
      const res = await Axios.post(
        // `${API_DRIVER}/request-income`,
        url,
        {
          nominal: amount,
          bank: value,
          bank_account_number: rekNum,
          bank_account_holder: name,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      if (res) {
        console.log(res.data);
        alert('berhasil');
        navigation.goBack();
      }
    } catch (error) {
      console.log('error', error);
      alert('Failed');
    }
  };

  console.log(value);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {lng === true
          ? 'Please fill in the following form to continue the withdraw process'
          : 'Silakan isi form berikut untuk melanjutkan proses tarik dana'}
      </Text>
      <Text style={styles.title}>
        {lng === true
          ? 'Bank Account to Withdraw Funds'
          : 'Rekening Bank untuk Tarik Dana'}
      </Text>
      <View>
        <DropDownPicker
          items={Items}
          onChangeItem={(item) => {
            setValue(item.value);
            setLabel(item.label);
          }}
          itemStyle={{
            justifyContent: 'flex-start',
          }}
          placeholder="Pilih Bank"
          placeholderStyle={styles.placeholder}
          containerStyle={styles.dropdown}
          defaultValue={value}
          labelStyle={styles.label}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>
            {lng === true ? 'Account number' : 'Nomor rekening'}
          </Text>
          <TextInput
            style={styles.inputBox}
            placeholder={
              lng === true
                ? 'Enter the account number'
                : 'Masukkan nomor rekening'
            }
            keyboardType="numeric"
            onChangeText={(val) => setRekNum(val)}
          />
          <Text style={[styles.inputText, {marginTop: 10}]}>
            Nama pemilik rekening
          </Text>
          <TextInput
            style={styles.inputBox}
            placeholder={
              lng === true
                ? 'Enter the name of the account holder'
                : 'Masukkan nama pemilik rekening'
            }
            onChangeText={(val) => setName(val)}
          />
          <Text style={[styles.inputText, {marginTop: 10}]}>
            Jumlah Dana yang ingin ditarik
          </Text>
          <TextInput
            style={styles.inputBox}
            placeholder={
              lng === true ? 'Input Amount of Cash' : 'Masukan Jumlah uang'
            }
            keyboardType={'numeric'}
            onChangeText={(val) => setAmount(val)}
          />
        </View>
        <Button
          title={
            lng === true ? 'Send Fund Withdrawal Form' : 'Kirim Form Tarik Dana'
          }
          titleStyle={styles.buttonTitle}
          buttonStyle={{backgroundColor: '#17273F'}}
          containerStyle={styles.button}
          onPress={withdraw}
        />
      </View>
    </View>
  );
};

export default Withdraw;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  header: {
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    color: '#555555',
    textAlign: 'left',
    marginTop: 20,
  },
  placeholder: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    color: '#80807E',
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Source Sans Pro',
    color: '#000',
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    color: '#616161',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonTitle: {
    fontWeight: '600',
    fontFamily: 'Source Sans Pro',
    fontSize: 18,
    color: '#F9F9F9',
  },
  button: {
    marginTop: 30,
    borderRadius: 10,
  },
  dropdown: {
    marginTop: 11,
    alignSelf: 'flex-start',
    width: 126,
    alignItems: 'center',
    height: 38,
  },
  inputContainer: {
    marginTop: 15,
  },
  inputText: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    color: '#6E6D6B',
  },
  inputBox: {
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    marginTop: 8,
    padding: 12,
  },
});
