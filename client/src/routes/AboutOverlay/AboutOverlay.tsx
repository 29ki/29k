import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import styled from 'styled-components/native';
import ActionButton from '../../lib/components/ActionList/ActionItems/ActionButton';
import ActionList from '../../lib/components/ActionList/ActionList';
import Gutters from '../../lib/components/Gutters/Gutters';
import {
  SunUpIcon,
  MegaphoneIcon,
  EnvelopeIcon,
} from '../../lib/components/Icons';
import Screen from '../../lib/components/Screen/Screen';
import {
  BottomSafeArea,
  Spacer16,
  Spacer24,
  Spacer8,
} from '../../lib/components/Spacers/Spacer';
import {Display24} from '../../lib/components/Typography/Display/Display';
import Markdown from '../../lib/components/Typography/Markdown/Markdown';
import {
  ModalStackProps,
  ProfileStackProps,
} from '../../lib/navigation/constants/routes';
import useIsPublicHost from '../../lib/user/hooks/useIsPublicHost';

const BlurbImage = styled.Image({
  aspectRatio: 1,
});

const AboutOverlay = () => {
  const {goBack, navigate} =
    useNavigation<
      NativeStackNavigationProp<ProfileStackProps & ModalStackProps>
    >();
  const {t} = useTranslation('Overlay.About');
  const isPublicHost = useIsPublicHost();

  const source = useMemo(() => ({uri: t('image__image')}), [t]);

  const earlyAccessInfoPress = useCallback(
    () => navigate('EarlyAccessInfo'),
    [navigate],
  );

  const publicHostAccessPress = useCallback(
    () => navigate('UpgradeAccountModal'),
    [navigate],
  );

  const contactPress = useCallback(() => navigate('ContactModal'), [navigate]);

  return (
    <Screen onPressBack={goBack}>
      <ScrollView>
        <SharedElement id="editorial.image">
          <BlurbImage source={source} />
        </SharedElement>
        <Gutters>
          <Spacer16 />
          <SharedElement id="editorial.heading">
            <Display24>{t('heading')}</Display24>
          </SharedElement>
          <Spacer16 />
          <SharedElement id="editorial.text">
            <Markdown>{t('preamble__markdown')}</Markdown>
            <Markdown>{t('body__markdown')}</Markdown>
          </SharedElement>
          <Spacer8 />
          <ActionList>
            <ActionButton Icon={SunUpIcon} onPress={earlyAccessInfoPress}>
              {t('Screen.Profile:earlyAccessInfo')}
            </ActionButton>
            {!isPublicHost && (
              <ActionButton
                Icon={MegaphoneIcon}
                onPress={publicHostAccessPress}>
                {t('Screen.Profile:publicHostAccess')}
              </ActionButton>
            )}
            <ActionButton Icon={EnvelopeIcon} onPress={contactPress}>
              {t('Screen.Profile:contact')}
            </ActionButton>
          </ActionList>
        </Gutters>
        <Spacer24 />
        <BottomSafeArea />
      </ScrollView>
    </Screen>
  );
};

export default AboutOverlay;
