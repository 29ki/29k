import React from 'react';
import {View, Button} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useUiLib} from '../../hooks/useUiLib';

import {H1} from '../../common/components/Typography/Heading/Heading';

import styles from './Home.styles';
import useClearUpdates from '../../CodePush/hooks/useClearUpdates';
import useCheckForUpdate from '../../CodePush/hooks/useCheckForUpdate';

const Home = () => {
  const {t} = useTranslation();
  const {toggle: toggleUiLib} = useUiLib();
  const clearUpdate = useClearUpdates();
  const checkForUpdate = useCheckForUpdate();

  return (
    <View style={styles.screen}>
      <H1>{t('welcome')}</H1>
      <Button title="Show The Awesome UI lib" onPress={toggleUiLib} />
      <Button title="Clear update" onPress={clearUpdate} />
      <Button title="Check update" onPress={checkForUpdate} />
    </View>
  );
};

export default Home;
