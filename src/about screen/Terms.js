import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';

const Paragraph = (props) => {
  return <Text style={styles.text}>{props.children}</Text>;
};

const Terms = () => {
  const lng = useSelector((state) => state.driver.english);
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>
          {lng === true ? 'Terms & conditions' : 'Syarat & Ketentuan'}
        </Text>
        <Text style={styles.subTitle}>
          {lng === true
            ? 'SERVICES AGREEMENT'
            : 'PERJANJIAN PENGGUNAAN LAYANAN SITUS'}
        </Text>
        <View style={{marginTop: 5}}>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis
            fames mauris, pellentesque maecenas morbi pretium. Enim et tristique
            in facilisis nisi, eget venenatis. Mattis cursus est semper in
            tempor malesuada. Sit arcu molestie auctor nullam.
          </Paragraph>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis
            fames mauris, pellentesque maecenas morbi pretium. Enim et tristique
            in facilisis nisi, eget venenatis. Mattis cursus est semper in
            tempor malesuada. Sit arcu molestie auctor nullam.
          </Paragraph>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis
            fames mauris, pellentesque maecenas morbi pretium. Enim et tristique
            in facilisis nisi, eget venenatis. Mattis cursus est semper in
            tempor malesuada. Sit arcu molestie auctor nullam.
          </Paragraph>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis
            fames mauris, pellentesque maecenas morbi pretium. Enim et tristique
            in facilisis nisi, eget venenatis. Mattis cursus est semper in
            tempor malesuada. Sit arcu molestie auctor nullam.
          </Paragraph>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis
            fames mauris, pellentesque maecenas morbi pretium. Enim et tristique
            in facilisis nisi, eget venenatis. Mattis cursus est semper in
            tempor malesuada. Sit arcu molestie auctor nullam.
          </Paragraph>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis
            fames mauris, pellentesque maecenas morbi pretium. Enim et tristique
            in facilisis nisi, eget venenatis. Mattis cursus est semper in
            tempor malesuada. Sit arcu molestie auctor nullam.
          </Paragraph>
        </View>
        <View style={styles.termsContainer}>
          <Text style={styles.termsTitle}>1 Pendahuluan</Text>
          <Paragraph>
            1.1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            1.2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            1.3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            1.4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            1.5 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            1.6 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            1.7 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            1.8 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            1.9 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            1.10 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
        </View>
      </ScrollView>
    </View>
  );
};

export default Terms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  title: {
    fontFamily: 'Source Sans Pro',
    fontSize: 16,
    fontWeight: '600',
    color: '#222831',
    marginTop: 19,
  },
  subTitle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 16,
    color: '#222831',
    marginTop: 4,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    color: '#000',
    marginTop: 10,
  },
  termsTitle: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    color: '#222831',
    marginBottom: 5,
  },
  termsContainer: {
    marginTop: 35,
  },
});
