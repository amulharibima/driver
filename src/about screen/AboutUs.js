import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Paragraph = (props) => {
  return <Text style={styles.text}>{props.children}</Text>;
};

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TEKS LOGO</Text>
      <View style={{marginTop: 16}}>
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis fames
          mauris, pellentesque maecenas morbi pretium. Enim et tristique in
          facilisis nisi, eget venenatis. Mattis cursus est semper in tempor
          malesuada. Sit arcu molestie auctor nullam.
        </Paragraph>
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis fames
          mauris, pellentesque maecenas morbi pretium. Enim et tristique in
          facilisis nisi, eget venenatis. Mattis cursus est semper in tempor
          malesuada. Sit arcu molestie auctor nullam.
        </Paragraph>
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis fames
          mauris, pellentesque maecenas morbi pretium. Enim et tristique in
          facilisis nisi, eget venenatis. Mattis cursus est semper in tempor
          malesuada. Sit arcu molestie auctor nullam.
        </Paragraph>
      </View>
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Source Sans Pro',
    fontWeight: 'bold',
    color: '#17273F',
    marginTop: 18,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    color: '#000',
    marginTop: 10,
  },
});
