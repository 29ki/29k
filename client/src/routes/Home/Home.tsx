import React from 'react';
import {View, Button} from 'react-native';
import {useTranslation} from 'react-i18next';

import {H1} from '../../common/components/Typography/Heading/Heading';

import useClearUpdates from '../../lib/codePush/hooks/useClearUpdates';
import useCheckForUpdate from '../../lib/codePush/hooks/useCheckForUpdate';
import {useUiLib} from '../../lib/uiLib/hooks/useUiLib';
import styles from './Home.styles';

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
