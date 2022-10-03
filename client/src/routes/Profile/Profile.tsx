import React from 'react';
import {useTranslation} from 'react-i18next';

import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {
  Spacer28,
  Spacer48,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import useCheckForUpdate from '../../lib/codePush/hooks/useCheckForUpdate';
import useClearUpdates from '../../lib/codePush/hooks/useClearUpdates';
import {useUiLib} from '../../lib/uiLib/hooks/useUiLib';
import {LANGUAGE_TAGS} from '../../../../shared/src/constants/i18n';
import {Heading18} from '../../common/components/Typography/Heading/Heading';
import NS from '../../lib/i18n/constants/namespaces';
import {ScrollView} from 'react-native-gesture-handler';
import CurrentUser from './components/CurrentUser';
import {useNavigation} from '@react-navigation/native';
import {RootStackProps} from '../../common/constants/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootNavigationProps = NativeStackNavigationProp<RootStackProps>;

const Row = styled.View({
  flexDirection: 'row',
});
const StartCol = styled.View({
  alignItems: 'flex-start',
});

const Profile = () => {
  const {i18n, t} = useTranslation(NS.SCREEN.PROFILE);
  const {toggle: toggleUiLib} = useUiLib();
  const {navigate} = useNavigation<RootNavigationProps>();
  const clearUpdates = useClearUpdates();
  const checkForUpdate = useCheckForUpdate();

  const navigateToContributors = () => navigate('Contributors');

  return (
    <ScrollView>
      <TopSafeArea />
      <Gutters>
        <Spacer28 />
        <CurrentUser />
        <Spacer48 />
        <Heading18>{t('language')}</Heading18>
        <Spacer8 />
        <Row>
          {LANGUAGE_TAGS.map(languageTag => (
            <>
              <Button
                variant="secondary"
                key={languageTag}
                onPress={() => i18n.changeLanguage(languageTag)}>
                {languageTag.toUpperCase()}
              </Button>
              <Spacer8 />
            </>
          ))}
        </Row>
        <Spacer48 />
        <StartCol>
          <Button variant="secondary" onPress={toggleUiLib}>
            {t('uiLib')}
          </Button>
          <Spacer8 />
          <Button variant="secondary" onPress={clearUpdates}>
            {t('clearUpdate')}
          </Button>
          <Spacer8 />
          <Button variant="secondary" onPress={checkForUpdate}>
            {t('checkUpdate')}
          </Button>
          <Spacer8 />
          <Button variant="secondary" onPress={navigateToContributors}>
            {t('contributors')}
          </Button>
        </StartCol>
        <Spacer48 />
      </Gutters>
    </ScrollView>
  );
};

export default Profile;
