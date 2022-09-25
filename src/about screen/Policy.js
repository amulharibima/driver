import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';

const Paragraph = (props) => {
  return <Text style={styles.text}>{props.children}</Text>;
};

const Policy = () => {
  const lng = useSelector((state) => state.driver.english);
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>
          {lng === true
            ? 'Terms & Privacy Policy'
            : 'Ketentuan & Kebijakan Privasi'}
        </Text>
        <Text style={styles.subTitle}>
          {lng === true ? 'Environment' : 'Ruang lingkup'}
        </Text>
        <View style={styles.textContainer}>
          <Paragraph>
            1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            3. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            4. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Text style={styles.userData}>
            Data pengguna dan informasi pengguna
          </Text>
          <Paragraph>
            5. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            6. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            7. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
          <Paragraph>
            8. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            lorem dictumst mi vivamus. Nam purus phasellus id est. Etiam
            imperdiet ornare orci aliquam, molestie semper rhoncus lacus. Sed
            dictumst eros metus imperdiet iaculis non turpis pharetra.
          </Paragraph>
        </View>
      </ScrollView>
    </View>
  );
};

export default Policy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    color: '#222831',
    marginTop: 10,
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
  userData: {
    fontSize: 14,
    fontFamily: 'Source Sans Pro',
    color: '#222831',
    marginTop: 15,
    marginBottom: 3,
  },
});
