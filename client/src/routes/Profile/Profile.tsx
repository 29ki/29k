import React, {Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native-gesture-handler';
import {Switch} from 'react-native';
import {ENVIRONMENT} from 'config';

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
  LANGUAGE_TAGS,
  CLIENT_LANGUAGE_TAGS,
} from '../../../../shared/src/constants/i18n';
import {Heading18} from '../../common/components/Typography/Heading/Heading';
import CurrentUser from './components/CurrentUser';
import Screen from '../../common/components/Screen/Screen';
import useIsPublicHost from '../../lib/user/hooks/useIsPublicHost';
import useAppState from '../../lib/appState/state/state';
import {COLORS} from '../../../../shared/src/constants/colors';
import {Body16} from '../../common/components/Typography/Body/Body';
import useSetPreferredLanguage from '../../lib/i18n/hooks/useSetPreferedLanguage';

const Row = styled.View({
  flexDirection: 'row',
});
const StartCol = styled.View({
  alignItems: 'flex-start',
});
const WorkInProgressWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const Profile = () => {
  const {t} = useTranslation('Screen.Profile');
  const {toggle: toggleUiLib} = useUiLib();
  const clearUpdates = useClearUpdates();
  const checkForUpdate = useCheckForUpdate();
  const isPublicHost = useIsPublicHost();
  const setShowNonPublishedContent = useAppState(
    state => state.setShowNonPublishedContent,
  );
  const showNonPublishedContent = useAppState(
    state => state.showNonPublishedContent,
  );

  const setPreferredLanguage = useSetPreferredLanguage();

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
                  onPress={() => setPreferredLanguage(languageTag)}>
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
            <Spacer8 />
            {ENVIRONMENT !== 'production' && isPublicHost && (
              <WorkInProgressWrapper>
                <Body16>{t('showWip')}</Body16>
                <Spacer8 />
                <Switch
                  onValueChange={setShowNonPublishedContent}
                  value={showNonPublishedContent}
                  trackColor={{true: COLORS.PRIMARY, false: undefined}}
                />
              </WorkInProgressWrapper>
            )}
          </StartCol>
          <Spacer48 />
        </Gutters>
      </ScrollView>
    </Screen>
  );
};

export default Profile;
