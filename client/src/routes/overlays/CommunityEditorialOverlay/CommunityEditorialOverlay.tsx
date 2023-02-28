import {useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import styled from 'styled-components/native';
import Gutters from '../../../lib/components/Gutters/Gutters';
import HeaderScrollView from '../../../lib/components/HeaderScrollView/HeaderScrollView';
import Screen from '../../../lib/components/Screen/Screen';
import {
  BottomSafeArea,
  Spacer16,
  Spacer24,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import SETTINGS from '../../../lib/constants/settings';
import useIsTransitioning from '../../../lib/navigation/hooks/useIsTransitioning';
import CommunityActionList from './components/CommunityActionList';

const BlurbImage = styled.Image({
  height: '100%',
  borderTopLeftRadius: Platform.select({ios: SETTINGS.BORDER_RADIUS.CARDS}),
  borderTopRightRadius: Platform.select({ios: SETTINGS.BORDER_RADIUS.CARDS}),
});

const CommunityOverlay = () => {
  const {goBack} = useNavigation();
  const {t} = useTranslation('Overlay.CommunityEditorial');
  const isTransitioning = useIsTransitioning();

  const source = useMemo(() => ({uri: t('image__image')}), [t]);

  return (
    <Screen onPressClose={isTransitioning ? undefined : goBack}>
      <HeaderScrollView
        header={
          <SharedElement id="community.image">
            <BlurbImage source={source} resizeMode="cover" />
          </SharedElement>
        }>
        <Gutters>
          <Spacer16 />
          <SharedElement id="community.heading">
            <Display24>{t('heading')}</Display24>
          </SharedElement>
          <Spacer16 />
          <SharedElement id="community.text">
            <Markdown>
              {`${t('preamble__markdown')}\n\n${t('body__markdown')}`}
            </Markdown>
          </SharedElement>
          <Spacer8 />
          <CommunityActionList />
        </Gutters>
        <Spacer24 />
        <BottomSafeArea />
      </HeaderScrollView>
    </Screen>
  );
};

export default CommunityOverlay;
