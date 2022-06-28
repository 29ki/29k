import React from 'react';
import {View, Button} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useUiLib} from '../../hooks/useUiLib';

import {Heading1} from '../../common/components/Typography/Heading/Heading';

import styles from './Home.styles';

const Home = () => {
  const {t} = useTranslation();
  const {toggle: toggleUiLib} = useUiLib();

  return (
    <View style={styles.screen}>
      <Heading1>{t('welcome')}</Heading1>
      <Button title="Show UI lib" onPress={toggleUiLib} />
    </View>
  );
};

export default Home;
