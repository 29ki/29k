import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {ENVIRONMENT} from 'config';

import Gutters from '../../lib/components/Gutters/Gutters';
import {
  Spacer16,
  Spacer32,
  Spacer8,
  TopSafeArea,
} from '../../lib/components/Spacers/Spacer';

import {Heading16} from '../../lib/components/Typography/Heading/Heading';
import Screen from '../../lib/components/Screen/Screen';
import {COLORS} from '../../../../shared/src/constants/colors';
import ActionList from '../../lib/components/ActionList/ActionList';
import ActionButton from '../../lib/components/ActionList/ActionItems/ActionButton';
import {
  BellIcon,
  CommandIcon,
  DeleteIcon,
  HangUpIcon,
  LanguagesIcon,
  ProfileIcon,
} from '../../lib/components/Icons';
import {useNavigation} from '@react-navigation/native';
import {
  AppStackProps,
  ModalStackProps,
  OverlayStackProps,
  ProfileStackProps,
} from '../../lib/navigation/constants/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ProfileMini from './components/ProfileMini';
import LinearGradient from 'react-native-linear-gradient';
import hexToRgba from 'hex-to-rgba';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useUser from '../../lib/user/hooks/useUser';
import useDeleteUser from '../../lib/user/hooks/useDeleteUser';
import SETTINGS from '../../lib/constants/settings';
import {Display24} from '../../lib/components/Typography/Display/Display';
import {SharedElement} from 'react-navigation-shared-element';
import TouchableOpacity from '../../lib/components/TouchableOpacity/TouchableOpacity';
import Markdown from '../../lib/components/Typography/Markdown/Markdown';
import AboutActionList from '../AboutOverlay/components/AboutActionList';
import CommunityActionList from '../CommunityOverlay/components/CommunityActionList';
import ActionSwitch from '../../lib/components/ActionList/ActionItems/ActionSwitch';
import useReminderNotificationsSetting from '../../lib/notifications/hooks/useReminderNotificationsSetting';

const HEADER_HEIGHT = 72;

const BlurbImage = styled.Image({
  aspectRatio: 1.7,
  borderTopLeftRadius: SETTINGS.BORDER_RADIUS.ACTION_LISTS,
  borderTopRightRadius: SETTINGS.BORDER_RADIUS.ACTION_LISTS,
});

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

const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: {paddingTop: HEADER_HEIGHT},
})({});

const Profile = () => {
  const {t} = useTranslation('Screen.Profile');
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<
        AppStackProps & ProfileStackProps & ModalStackProps & OverlayStackProps
      >
    >();
  const {top} = useSafeAreaInsets();
  const user = useUser();
  const {deleteUser} = useDeleteUser();
  const {remindersEnabled, setRemindersEnabled} =
    useReminderNotificationsSetting();

  const profileSettingsPress = useCallback(
    () => navigate('ProfileSettingsModal'),
    [navigate],
  );

  const languagePress = useCallback(
    () => navigate('ChangeLanguageModal'),
    [navigate],
  );

  const signInPress = useCallback(() => navigate('SignInModal'), [navigate]);

  const aboutPress = useCallback(() => navigate('AboutOverlay'), [navigate]);

  const aboutBlurbSource = useMemo(
    () => ({uri: t('image__image', {ns: 'Overlay.About'})}),
    [t],
  );

  const communityPress = useCallback(
    () => navigate('CommunityOverlay'),
    [navigate],
  );

  const communityBlurbSource = useMemo(
    () => ({uri: t('image__image', {ns: 'Overlay.Community'})}),
    [t],
  );

  const developerPress = useCallback(
    () => navigate('DeveloperModal'),
    [navigate],
  );

  return (
    <Screen>
      <TopSafeArea />
      <Header top={top}>
        <Spacer8 />
        <ProfileMini />
      </Header>
      <ScrollView>
        <Gutters>
          <Heading16>{t('settings')}</Heading16>
          <Spacer8 />
          <ActionList>
            <ActionButton Icon={ProfileIcon} onPress={profileSettingsPress}>
              {t('actions.profileSettings')}
            </ActionButton>
            {(!user || user?.isAnonymous) && (
              <ActionButton Icon={HangUpIcon} onPress={signInPress}>
                {t('actions.signIn')}
              </ActionButton>
            )}
            <ActionButton Icon={LanguagesIcon} onPress={languagePress}>
              {t('actions.language')}
            </ActionButton>
            <ActionSwitch
              Icon={BellIcon}
              onValueChange={setRemindersEnabled}
              value={remindersEnabled}>
              {t('actions.notifications')}
            </ActionSwitch>
          </ActionList>
          {user && (
            <>
              <Spacer16 />
              <ActionList>
                <ActionButton Icon={DeleteIcon} onPress={deleteUser}>
                  {t('actions.deleteData')}
                </ActionButton>
              </ActionList>
            </>
          )}
          <Spacer32 />

          <Heading16>{t('about')}</Heading16>
          <Spacer8 />
          {t('heading', {ns: 'Overlay.About'}) && (
            <>
              <ActionList>
                <TouchableOpacity onPress={aboutPress}>
                  <SharedElement id="about.image">
                    <BlurbImage source={aboutBlurbSource} resizeMode="cover" />
                  </SharedElement>
                  <Gutters>
                    <Spacer16 />
                    <SharedElement id="about.heading">
                      <Display24>
                        {t('heading', {ns: 'Overlay.About'})}
                      </Display24>
                    </SharedElement>
                    <Spacer8 />
                    <SharedElement id="about.text">
                      <Markdown>
                        {t('preamble__markdown', {ns: 'Overlay.About'})}
                      </Markdown>
                    </SharedElement>
                    <Spacer8 />
                  </Gutters>
                </TouchableOpacity>
              </ActionList>
              <Spacer16 />
            </>
          )}
          <AboutActionList />
          <Spacer32 />

          <Heading16>{t('community')}</Heading16>
          <Spacer8 />
          {t('heading', {ns: 'Overlay.Community'}) && (
            <>
              <ActionList>
                <TouchableOpacity onPress={communityPress}>
                  <SharedElement id="community.image">
                    <BlurbImage
                      source={communityBlurbSource}
                      resizeMode="cover"
                    />
                  </SharedElement>
                  <Gutters>
                    <Spacer16 />
                    <SharedElement id="community.heading">
                      <Display24>
                        {t('heading', {ns: 'Overlay.Community'})}
                      </Display24>
                    </SharedElement>
                    <Spacer8 />
                    <SharedElement id="community.text">
                      <Markdown>
                        {t('preamble__markdown', {ns: 'Overlay.Community'})}
                      </Markdown>
                    </SharedElement>
                    <Spacer8 />
                  </Gutters>
                </TouchableOpacity>
              </ActionList>
              <Spacer16 />
            </>
          )}
          <CommunityActionList />
          <Spacer32 />

          {ENVIRONMENT !== 'production' && (
            <ActionList>
              <ActionButton Icon={CommandIcon} onPress={developerPress}>
                {t('actions.developer')}
              </ActionButton>
            </ActionList>
          )}
        </Gutters>
        <Spacer16 />
      </ScrollView>
    </Screen>
  );
};

export default Profile;
