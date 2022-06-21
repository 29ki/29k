import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Heading1} from '../../common/components/Typography/Heading/Heading';

import styles from './Home.styles';

const Home = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.screen}>
      <Heading1>{t('welcome')}</Heading1>
    </View>
  );
};

export default Home;
