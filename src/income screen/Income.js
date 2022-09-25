import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import Cashback from '../assets/cashback.png';
import {Icon} from 'react-native-elements';
import {TouchableWithoutFeedback, FlatList} from 'react-native-gesture-handler';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {API_DRIVER} from '../API';
import {useEffect} from 'react';
import EndPoint from '../Endpoit';

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

const Income = () => {
  const navigation = useNavigation();
  const lng = useSelector((state) => state.driver.english);
  const income = useSelector((state) => state.profile.income);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  const generateIncome = async () => {
    try {
      const url = EndPoint.GENERATE_INCOME;
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.post(
        // `${API_DRIVER}/generate-income`,
        url,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (res) {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const getIncome = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = EndPoint.INCOME_HISTORIES;
      const res = await Axios.get(
        // 'http://mysupir.omindtech.id/api/driver/get-histories',
        url,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (res) {
        console.log(res.data);
        const incomes = res.data.earning_history.filter(
          (item) => item.amount !== 0,
        );
        setData(incomes);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const type = (types) => {
    let word;
    if (types === 'outcome') {
      word = lng ? 'Total Outcome' : 'Total Pengeluaran';
    } else {
      word = lng ? 'Total Income' : 'Total Pendapatan';
    }

    return word;
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.incomeCard}>
        <View style={styles.income}>
          <Text style={styles.incomeTitle}>{type(item.type)}</Text>
          <Text style={styles.incomeAmount}>
            Rp{currencyFormat(item.amount)}
          </Text>
        </View>
        <View style={styles.period}>
          <Text style={styles.periodTitle}>
            {lng === true ? 'Period' : 'Periode'}
          </Text>
          <Text style={styles.date}>{item.period}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    generateIncome();
    getIncome();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerIncome}>
          <Text style={styles.totalIncome}>Rp{currencyFormat(income)}</Text>
          <Text style={styles.headerTitle}>
            {lng === true ? 'Total Income' : 'Total Pendapatan'}
          </Text>
        </View>
      </View>
      <View style={styles.withdrawContainer}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Withdraw')}>
          <FastImage style={styles.cashback} source={Cashback} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Withdraw')}>
          <Text style={styles.withdrawText}>
            {lng === true ? 'Withdraw' : 'Ambil Pendapatan'}
          </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Withdraw')}>
          <Icon
            type="material-community"
            name="chevron-right"
            size={25}
            color="#17273F"
            containerStyle={styles.icon}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyTitle}>
          {lng === true ? 'Income History' : 'Histori Pendapatan'}
        </Text>
        <View style={styles.incomeContainer}>
          {data.length > 0 && (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                paddingBottom: 50,
                paddingTop: 15,
                marginBottom: 20,
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
          {/*
          <View style={styles.incomeCard}>
            <View style={styles.income}>
              <Text style={styles.incomeTitle}>
                {lng === true ? 'Total Income' : 'Total Pendapatan'}
              </Text>
              <Text style={styles.incomeAmount}>Rp4.000.000</Text>
            </View>
            <View style={styles.period}>
              <Text style={styles.periodTitle}>
                {lng === true ? 'Period' : 'Periode'}
              </Text>
              <Text style={styles.date}>10 Feb - 25 Feb 2020</Text>
            </View>
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default Income;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  totalIncome: {
    fontFamily: 'Source Sans Pro',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#17273F',
    borderBottomStartRadius: 50,
    borderBottomEndRadius: 50,
  },
  headerIncome: {
    marginTop: 80,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: 'Source Sans Pro',
    color: '#FFFFFF',
    marginTop: 2,
    marginBottom: 46,
  },
  cashback: {
    width: 30,
    height: 30,
  },
  withdrawContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowRadius: 10,
    alignSelf: 'center',
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    elevation: 5,
    bottom: 32,
    flexDirection: 'row',
  },
  withdrawText: {
    fontFamily: 'Source Sans Pro',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
    marginLeft: 10,
    color: '#17273F',
    marginTop: 2,
  },
  icon: {
    alignSelf: 'center',
    marginLeft: 20,
    marginTop: 2,
  },
  bodyTitle: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Source Sans Pro',
    color: '#ACACAC',
    marginBottom: 5,
  },
  bodyContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  incomeCard: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F1F3F6',
    elevation: 2,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  incomeTitle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontWeight: '600',
    color: '#6E6D6B',
  },
  incomeAmount: {
    fontFamily: 'Source Sans Pro',
    fontSize: 18,
    fontWeight: '600',
    color: '#434343',
    marginBottom: 5,
  },
  periodTitle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontWeight: '600',
    color: '#6E6D6B',
    textAlign: 'right',
  },
  date: {
    fontWeight: '600',
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    color: '#353535',
    marginTop: 5,
  },
  // incomeContainer: {
  //   flex: 1,
  // }
});
