import React, {Fragment, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {Switch} from 'react-native';
import {ENVIRONMENT} from 'config';

import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {
  Spacer16,
  Spacer28,
  Spacer32,
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
import {
  Heading16,
  Heading18,
} from '../../common/components/Typography/Heading/Heading';
import CurrentUser from './components/CurrentUser';
import Screen from '../../common/components/Screen/Screen';
import useIsPublicHost from '../../lib/user/hooks/useIsPublicHost';
import useAppState from '../../lib/appState/state/state';
import {COLORS} from '../../../../shared/src/constants/colors';
import {Body16, BodyBold} from '../../common/components/Typography/Body/Body';
import useSetPreferredLanguage from '../../lib/i18n/hooks/useSetPreferedLanguage';
import useToggleHiddenContent from '../../lib/i18n/hooks/useToggleHiddenContent';
import ActionList from '../../common/components/ActionList/ActionList';
import ActionButton from '../../common/components/ActionList/ActionItems/ActionButton';
import {
  CommandIcon,
  CommunityIcon,
  DeleteIcon,
  EnvelopeIcon,
  HangUpIcon,
  LanguagesIcon,
  MegaphoneIcon,
  ProfileIcon,
  SunUpIcon,
  WandIcon,
} from '../../common/components/Icons';
import {useNavigation} from '@react-navigation/native';
import {
  AppStackProps,
  ModalStackProps,
} from '../../lib/navigation/constants/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ProfileMini from './components/ProfileMini';
import LinearGradient from 'react-native-linear-gradient';
import hexToRgba from 'hex-to-rgba';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const StartCol = styled.View({
  alignItems: 'flex-start',
});
const WorkInProgressWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const HEADER_HEIGHT = 72;

const Header = styled(LinearGradient).attrs({
  colors: [
    hexToRgba(COLORS.WHITE, 1),
    hexToRgba(COLORS.WHITE, 1),
    hexToRgba(COLORS.WHITE, 0),
  ],
})<{top: number}>(({top}) => ({
  position: 'absolute',
  top,
  left: 0,
  right: 0,
  height: HEADER_HEIGHT,
  zIndex: 1,
}));

const ScrollView = styled.ScrollView({
  paddingTop: HEADER_HEIGHT,
});

const Profile = () => {
  const {t} = useTranslation('Screen.Profile');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const {top} = useSafeAreaInsets();
  const {toggle: toggleUiLib} = useUiLib();
  const clearUpdates = useClearUpdates();
  const checkForUpdate = useCheckForUpdate();
  const isPublicHost = useIsPublicHost();
  const toggleHiddenContent = useToggleHiddenContent();
  const showNonPublishedContent = useAppState(state => state.showHiddenContent);

  const languagePress = useCallback(
    () => navigate('ChangeLanguageModal'),
    [navigate],
  );

  const earlyAccessInfoPress = useCallback(
    () => navigate('Welcome'),
    [navigate],
  );
  const publicHostAccessPress = useCallback(
    () => navigate('UpgradeAccountModal'),
    [navigate],
  );

  return (
    <Screen>
      <TopSafeArea />
      <Header top={top}>
        <ProfileMini />
      </Header>
      <ScrollView>
        <Gutters>
          <Heading16>{t('settings')}</Heading16>
          <Spacer8 />
          <ActionList>
            <ActionButton Icon={ProfileIcon}>{t('account')}</ActionButton>
            <ActionButton Icon={LanguagesIcon} onPress={languagePress}>
              {t('language')}
            </ActionButton>
            <ActionButton Icon={HangUpIcon}>{t('signIn')}</ActionButton>
          </ActionList>
          <Spacer16 />
          <ActionList>
            <ActionButton Icon={DeleteIcon}>{t('deleteData')}</ActionButton>
          </ActionList>
          <Spacer32 />

          <Heading16>{t('about')}</Heading16>
          <Spacer8 />
          <ActionList>
            <ActionButton Icon={SunUpIcon} onPress={earlyAccessInfoPress}>
              {t('earlyAccessInfo')}
            </ActionButton>
            {!isPublicHost && (
              <ActionButton
                Icon={MegaphoneIcon}
                onPress={publicHostAccessPress}>
                {t('publicHostAccess')}
              </ActionButton>
            )}
            <ActionButton Icon={EnvelopeIcon}>{t('contact')}</ActionButton>
          </ActionList>
          <Spacer32 />

          <Heading16>{t('community')}</Heading16>
          <Spacer8 />
          <ActionList>
            <ActionButton Icon={WandIcon}>{t('contribute')}</ActionButton>
            <ActionButton Icon={CommunityIcon}>
              {t('contributors')}
            </ActionButton>
          </ActionList>
          <Spacer32 />

          <ActionList>
            <ActionButton Icon={CommandIcon}>{t('developer')}</ActionButton>
          </ActionList>

          <Spacer28 />
          <CurrentUser isPublicHost={isPublicHost} />
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
                  onValueChange={toggleHiddenContent}
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
