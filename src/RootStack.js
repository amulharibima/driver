import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './splash screen/SplashScreen';
import SplashScreen_2 from './splash screen/SplashScreen_2';
import VerifyOTP from './otp screen/VerifyOTP';
import Login from './login screen/Login';
import Profile from './profile screen/Profile';
import EditProfile from './profile screen/EditProfile';
import OrderHistory from './riwayat order screen/OrderHistory';
import HistoryDetail from './riwayat order screen/OrderHistoryDetail';
import Income from './income screen/Income';
import Review from './review screen/Review';
import About from './about screen/About';
import AboutUs from './about screen/AboutUs';
import Terms from './about screen/Terms';
import Policy from './about screen/Policy';
import Withdraw from './income screen/Withdraw';
import Home from './home screen/Home';
import Panic from './panic screen/Panic';
import HomeTrip from './home screen/HomeTrip';
import ReportStart from './report screen/ReportStart';
import HomeTime from './home screen/HomeTime';
import ReportEnd from './report screen/ReportEnd';
import Photo from './report screen/Photo';
import Chat from './chat screen/Chat';
import Contact from './contact screen/Contact';
import Language from './language screen/Language';
import {useSelector} from 'react-redux';

const Stack = createStackNavigator();
const RootStack = () => {
  const language = useSelector((state) => state.driver.english);
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Splash 2"
        component={SplashScreen_2}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{headerTitle: language === true ? 'About Us' : 'Tentang Kami'}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Verify OTP"
        component={VerifyOTP}
        options={{
          headerTitle:
            language === true ? 'OTP verification' : 'Verifikasi OTP',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Order History"
        component={OrderHistory}
        options={{
          headerTitle:
            language === true ? 'Order History' : 'Riwayat Mengemudi',
        }}
      />
      <Stack.Screen
        name="History Detail"
        component={HistoryDetail}
        options={{
          headerTitle:
            language === true
              ? 'Order History Detail'
              : 'Detail Riwayat Mengemudi',
        }}
      />
      <Stack.Screen
        name="Income"
        component={Income}
        options={{
          headerTitle: language === true ? 'Income' : 'Pendapatan',
          headerTransparent: true,
          headerTintColor: '#FFFFFF',
        }}
      />
      <Stack.Screen
        name="Review"
        component={Review}
        options={{headerTitle: 'Review'}}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{headerTitle: language === true ? 'About' : 'Tentang'}}
      />
      <Stack.Screen
        name="About Us"
        component={AboutUs}
        options={{headerTitle: language === true ? 'About Us' : 'Tentang Kami'}}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{
          headerTitle:
            language === true ? 'Terms & conditions' : 'Syarat & Ketentuan',
        }}
      />
      <Stack.Screen
        name="Policy"
        component={Policy}
        options={{
          headerTitle:
            language === true ? 'Privacy Policy' : 'Kebijakan Privasi',
        }}
      />
      <Stack.Screen
        name="Withdraw"
        component={Withdraw}
        options={{
          headerTitle: language === true ? 'Withdraw' : 'Penarikan Dana',
        }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Panic"
        component={Panic}
        options={{headerTitle: language === true ? 'Emergency' : 'Darurat'}}
      />
      <Stack.Screen
        name="Home Trip"
        component={HomeTrip}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Report Start"
        component={ReportStart}
        options={{headerTitle: language === true ? 'Report' : 'Laporan'}}
      />
      <Stack.Screen
        name="Language"
        component={Language}
        options={{headerTitle: language === true ? 'Language' : 'Bahasa'}}
      />
      <Stack.Screen
        name="Home Time"
        component={HomeTime}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Report Finish"
        component={ReportEnd}
        options={{headerTitle: language === true ? 'Report' : 'Laporan'}}
      />
      <Stack.Screen
        name="Photo"
        component={Photo}
        options={{headerTitle: language === true ? 'Photo' : 'Foto'}}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
