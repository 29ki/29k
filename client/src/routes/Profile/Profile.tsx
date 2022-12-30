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
  CheckedIcon,
  CommandIcon,
  CommunityIcon,
  DeleteIcon,
  EnvelopeIcon,
  HangUpIcon,
  LanguagesIcon,
  MegaphoneIcon,
  ProfileIcon,
  SunUpIcon,
} from '../../lib/components/Icons';
import {useNavigation} from '@react-navigation/native';
import {
  AppStackProps,
  ModalStackProps,
  ProfileStackProps,
} from '../../lib/navigation/constants/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ProfileMini from './components/ProfileMini';
import LinearGradient from 'react-native-linear-gradient';
import hexToRgba from 'hex-to-rgba';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useUser from '../../lib/user/hooks/useUser';
import useDeleteUser from '../../lib/user/hooks/useDeleteUser';
import useIsPublicHost from '../../lib/user/hooks/useIsPublicHost';
import SETTINGS from '../../lib/constants/settings';
import {Display24} from '../../lib/components/Typography/Display/Display';
import {SharedElement} from 'react-navigation-shared-element';
import TouchableOpacity from '../../lib/components/TouchableOpacity/TouchableOpacity';
import Markdown from '../../lib/components/Typography/Markdown/Markdown';

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
        AppStackProps & ProfileStackProps & ModalStackProps
      >
    >();
  const {top} = useSafeAreaInsets();
  const user = useUser();
  const isPublicHost = useIsPublicHost();
  const {deleteUser} = useDeleteUser();

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
    () => ({uri: t('Overlay.About:image__image')}),
    [t],
  );

  const earlyAccessInfoPress = useCallback(
    () => navigate('EarlyAccessInfo'),
    [navigate],
  );

  const publicHostAccessPress = useCallback(
    () => navigate('UpgradeAccountModal'),
    [navigate],
  );

  const contactPress = useCallback(() => navigate('ContactModal'), [navigate]);

  const contributorsPress = useCallback(
    () => navigate('ContributorsModal'),
    [navigate],
  );

  const partnersPress = useCallback(
    () => navigate('PartnersModal'),
    [navigate],
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
              {t('profileSettings')}
            </ActionButton>
            {(!user || user?.isAnonymous) && (
              <ActionButton Icon={HangUpIcon} onPress={signInPress}>
                {t('signIn')}
              </ActionButton>
            )}
            <ActionButton Icon={LanguagesIcon} onPress={languagePress}>
              {t('language')}
            </ActionButton>
          </ActionList>
          {user && (
            <>
              <Spacer16 />
              <ActionList>
                <ActionButton Icon={DeleteIcon} onPress={deleteUser}>
                  {t('deleteData')}
                </ActionButton>
              </ActionList>
            </>
          )}
          <Spacer32 />

          <Heading16>{t('about')}</Heading16>
          <Spacer8 />
          <ActionList>
            <TouchableOpacity onPress={aboutPress}>
              <SharedElement id="editorial.image">
                <BlurbImage source={aboutBlurbSource} resizeMode="cover" />
              </SharedElement>
              <Gutters>
                <Spacer16 />
                <SharedElement id="editorial.heading">
                  <Display24>{t('Overlay.About:heading')}</Display24>
                </SharedElement>
                <Spacer8 />
                <SharedElement id="editorial.text">
                  <Markdown>{t('Overlay.About:preamble__markdown')}</Markdown>
                </SharedElement>
                <Spacer8 />
              </Gutters>
            </TouchableOpacity>
          </ActionList>
          <Spacer16 />
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
            <ActionButton Icon={EnvelopeIcon} onPress={contactPress}>
              {t('contact')}
            </ActionButton>
          </ActionList>
          <Spacer32 />
          <Heading16>{t('community')}</Heading16>
          <Spacer8 />
          <ActionList>
            {/*
            <ActionButton Icon={WandIcon}>{t('contribute')}</ActionButton>
            */}
            <ActionButton Icon={CommunityIcon} onPress={contributorsPress}>
              {t('contributors')}
            </ActionButton>
            <ActionButton Icon={CheckedIcon} onPress={partnersPress}>
              {t('partners')}
            </ActionButton>
          </ActionList>
          <Spacer32 />
          {ENVIRONMENT !== 'production' && (
            <ActionList>
              <ActionButton Icon={CommandIcon} onPress={developerPress}>
                {t('developer')}
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
