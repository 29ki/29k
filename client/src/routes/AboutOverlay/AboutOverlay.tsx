import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {ENVIRONMENT} from 'config';

import Gutters from '../../lib/components/Gutters/Gutters';
import {
  BottomSafeArea,
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer8,
} from '../../lib/components/Spacers/Spacer';

import {Heading16} from '../../lib/components/Typography/Heading/Heading';
import Screen from '../../lib/components/Screen/Screen';
import ActionList from '../../lib/components/ActionList/ActionList';
import ActionButton from '../../lib/components/ActionList/ActionItems/ActionButton';
import {CommandIcon} from '../../lib/components/Icons';
import {useNavigation} from '@react-navigation/native';
import {
  ModalStackProps,
  OverlayStackProps,
} from '../../lib/navigation/constants/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import SETTINGS from '../../lib/constants/settings';
import {Display24} from '../../lib/components/Typography/Display/Display';
import {SharedElement} from 'react-navigation-shared-element';
import TouchableOpacity from '../../lib/components/TouchableOpacity/TouchableOpacity';
import Markdown from '../../lib/components/Typography/Markdown/Markdown';
import AboutActionList from '../AboutEditorialOverlay/components/AboutActionList';
import CommunityActionList from '../CommunityEditorialOverlay/components/CommunityActionList';
import {ScrollView} from 'react-native';
import TopBar from '../../lib/components/TopBar/TopBar';
import {COLORS} from '../../../../shared/src/constants/colors';

const BlurbImage = styled.Image({
  aspectRatio: 1.7,
  borderTopLeftRadius: SETTINGS.BORDER_RADIUS.ACTION_LISTS,
  borderTopRightRadius: SETTINGS.BORDER_RADIUS.ACTION_LISTS,
});

const Profile = () => {
  const {t} = useTranslation('Overlay.About');
  const {navigate, goBack} =
    useNavigation<
      NativeStackNavigationProp<ModalStackProps & OverlayStackProps>
    >();

  const aboutPress = useCallback(
    () => navigate('AboutEditorialOverlay'),
    [navigate],
  );

  const aboutBlurbSource = useMemo(
    () => ({uri: t('image__image', {ns: 'Overlay.AboutEditorial'})}),
    [t],
  );

  const communityPress = useCallback(
    () => navigate('CommunityEditorialOverlay'),
    [navigate],
  );

  const communityBlurbSource = useMemo(
    () => ({uri: t('image__image', {ns: 'Overlay.CommunityEditorial'})}),
    [t],
  );

  const developerPress = useCallback(
    () => navigate('DeveloperModal'),
    [navigate],
  );

  return (
    <Screen>
      <Spacer16 />
      <TopBar onPressClose={goBack} backgroundColor={COLORS.WHITE} fade />
      <ScrollView>
        <Gutters>
          <Spacer24 />
          <Heading16>{t('about')}</Heading16>
          <Spacer8 />
          {t('heading', {ns: 'Overlay.AboutEditorial'}) && (
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
                        {t('heading', {ns: 'Overlay.AboutEditorial'})}
                      </Display24>
                    </SharedElement>
                    <Spacer8 />
                    <SharedElement id="about.text">
                      <Markdown>
                        {t('preamble__markdown', {
                          ns: 'Overlay.AboutEditorial',
                        })}
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
          {t('heading', {ns: 'Overlay.CommunityEditorial'}) && (
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
                        {t('heading', {ns: 'Overlay.CommunityEditorial'})}
                      </Display24>
                    </SharedElement>
                    <Spacer8 />
                    <SharedElement id="community.text">
                      <Markdown>
                        {t('preamble__markdown', {
                          ns: 'Overlay.CommunityEditorial',
                        })}
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
        <Spacer24 />
        <BottomSafeArea />
      </ScrollView>
    </Screen>
  );
};

export default Profile;
