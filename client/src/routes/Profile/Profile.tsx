import React from 'react';
import {useTranslation} from 'react-i18next';

import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {
  Spacer16,
  Spacer28,
  Spacer48,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import useCheckForUpdate from '../../lib/codePush/hooks/useCheckForUpdate';
import useClearUpdates from '../../lib/codePush/hooks/useClearUpdates';
import {useUiLib} from '../../lib/uiLib/hooks/useUiLib';
import {LANGUAGE_TAGS} from '../../../../shared/src/constants/i18n';
import {Heading24} from '../../common/components/Typography/Heading/Heading';
import NS from '../../lib/i18n/constants/namespaces';
import {ScrollView} from 'react-native-gesture-handler';
import CurrentUser from './components/CurrentUser';

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Profile = () => {
  const {i18n, t} = useTranslation(NS.SCREEN.PROFILE);
  const {toggle: toggleUiLib} = useUiLib();
  const clearUpdates = useClearUpdates();
  const checkForUpdate = useCheckForUpdate();

  return (
    <ScrollView>
      <TopSafeArea />
      <Gutters>
        <Spacer28 />
        <CurrentUser />
        <Spacer48 />
        <Heading24>{t('language')}</Heading24>
        <Spacer16 />
        <Row>
          {LANGUAGE_TAGS.map(languageTag => (
            <Button
              key={languageTag}
              onPress={() => i18n.changeLanguage(languageTag)}>
              {languageTag.toUpperCase()}
            </Button>
          ))}
        </Row>
        <Spacer48 />
        <Button onPress={toggleUiLib}>{t('uiLib')}</Button>
        <Spacer16 />
        <Button onPress={clearUpdates}>{t('clearUpdate')}</Button>
        <Spacer16 />
        <Button onPress={checkForUpdate}>{t('checkUpdate')}</Button>
        <Spacer48 />
      </Gutters>
    </ScrollView>
  );
};

export default Profile;
