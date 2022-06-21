import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

const Home = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.screen}>
      <Text>{t('welcome')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
