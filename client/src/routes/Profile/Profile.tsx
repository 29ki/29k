import React, {Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native-gesture-handler';
import {Alert} from 'react-native';

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
import {
  LANGUAGES,
  LANGUAGE_TAG,
  LANGUAGE_TAGS,
  CLIENT_LANGUAGE_TAGS,
} from '../../../../shared/src/constants/i18n';
import {Heading18} from '../../common/components/Typography/Heading/Heading';
import CurrentUser from './components/CurrentUser';
import Screen from '../../common/components/Screen/Screen';
import useIsPublicHost from '../../lib/user/hooks/useIsPublicHost';

const Row = styled.View({
  flexDirection: 'row',
});
const StartCol = styled.View({
  alignItems: 'flex-start',
});

const Profile = () => {
  const {i18n, t} = useTranslation('Screen.Profile');
  const {toggle: toggleUiLib} = useUiLib();
  const clearUpdates = useClearUpdates();
  const checkForUpdate = useCheckForUpdate();
  const isPublicHost = useIsPublicHost();

  const onPressLanguage = (languageTag: LANGUAGE_TAG) => {
    if (CLIENT_LANGUAGE_TAGS.includes(languageTag)) {
      i18n.changeLanguage(languageTag);
    } else {
      const language = LANGUAGES[languageTag];
      Alert.alert(
        t('unsupportedLanguage.title'),
        t('unsupportedLanguage.message', {language}),
        [
          {
            text: t('unsupportedLanguage.confirm'),
            onPress: () => i18n.changeLanguage(languageTag),
          },
          {text: t('unsupportedLanguage.dismiss'), style: 'cancel'},
        ],
      );
    }
  };

  return (
    <Screen>
      <ScrollView>
        <TopSafeArea />
        <Gutters>
          <Spacer28 />
          <CurrentUser isPublicHost={isPublicHost} />
          <Spacer48 />
          <Heading18>{t('language')}</Heading18>
          <Spacer8 />
          <Row>
            {LANGUAGE_TAGS.map((languageTag, i) => (
              <Fragment key={i}>
                <Button
                  variant={
                    CLIENT_LANGUAGE_TAGS.includes(languageTag)
                      ? 'secondary'
                      : 'tertiary'
                  }
                  key={languageTag}
                  onPress={() => onPressLanguage(languageTag)}>
                  {languageTag.toUpperCase()}
                </Button>
                <Spacer8 />
              </Fragment>
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
          </StartCol>
          <Spacer48 />
        </Gutters>
      </ScrollView>
    </Screen>
  );
};

export default Profile;
