import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {languageChange} from '../redux/action/DriverAction';
import {INDONESIA, ENGLISH} from '../redux/case type/DriverCase';
import AsyncStorage from '@react-native-community/async-storage';

const Language = () => {
  const language = useSelector((state) => state.driver.english);
  const dispatch = useDispatch();

  const langChange = async (lang) => {
    await AsyncStorage.setItem('language', lang);
    if (lang == 'Indo') {
      dispatch({type: INDONESIA});
    } else if (lang == 'Eng') {
      dispatch({type: ENGLISH});
    }
  };

  console.log(language);
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => langChange('Indo')}>
          <View style={[styles.button, {marginTop: 15}]}>
            <Text style={styles.text}>
              {language === true ? 'Indonesian' : 'Bahasa Indonesia'}
            </Text>
            {language === false && (
              <Icon
                type="material-community"
                name="check"
                color="#17273F"
                size={20}
                containerStyle={{marginVertical: 13}}
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => langChange('Eng')}>
          <View style={styles.button}>
            <Text style={styles.text}>
              {language === true ? 'English' : 'Bahasa Inggris'}
            </Text>
            {language === true && (
              <Icon
                type="material-community"
                name="check"
                color="#17273F"
                size={20}
                containerStyle={{marginVertical: 13}}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Language;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  text: {
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontWeight: '600',
    color: '#17273F',
    marginVertical: 13,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    paddingBottom: 5,
    marginBottom: 5,
    alignContent: 'center',
  },
});
