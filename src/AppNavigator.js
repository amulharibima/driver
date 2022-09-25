import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootDrawer from './RootDrawer';
import {useDispatch, useSelector} from 'react-redux';
import {loadLanguage} from './redux/action/DriverAction';
import Pusher, {Channel} from 'pusher-js/react-native';
import Echo from 'laravel-echo';
import AsyncStorage from '@react-native-community/async-storage';

const AppNavigator = () => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.profile.id);
  useEffect(() => {
    dispatch(loadLanguage());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavigationContainer>
      <RootDrawer />
    </NavigationContainer>
  );
};

export default AppNavigator;
