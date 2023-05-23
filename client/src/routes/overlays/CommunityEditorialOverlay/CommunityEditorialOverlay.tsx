import {useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {StatusBar} from 'react-native';
import {useTranslation} from 'react-i18next';
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
import TopBar from '../../../lib/components/TopBar/TopBar';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import CommunityActionList from './components/CommunityActionList';

const BlurbImage = styled.Image({
  height: '100%',
});

const CommunityOverlay = () => {
  const {goBack} = useNavigation();
  const {t} = useTranslation('Overlay.CommunityEditorial');

  const source = useMemo(() => ({uri: t('image__image')}), [t]);

  return (
    <Screen>
      <StatusBar barStyle="light-content" />
      <Spacer16 />
      <TopBar onPressClose={goBack} />
      <HeaderScrollView
        header={<BlurbImage source={source} resizeMode="cover" />}>
        <Gutters>
          <Spacer16 />
          <Display24>{t('heading')}</Display24>
          <Spacer16 />
          <Markdown>
            {`${t('preamble__markdown')}\n\n${t('body__markdown')}`}
          </Markdown>
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
