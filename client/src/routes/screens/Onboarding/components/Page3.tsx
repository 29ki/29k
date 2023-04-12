import React, {useMemo} from 'react';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import Heading from './Heading';
import {useTranslation} from 'react-i18next';
import ActionList from '../../../../lib/components/ActionList/ActionList';
import {
  Spacer16,
  Spacer28,
  Spacer8,
} from '../../../../lib/components/Spacers/Spacer';
import {Display24} from '../../../../lib/components/Typography/Display/Display';
import styled from 'styled-components/native';
import Markdown from '../../../../lib/components/Typography/Markdown/Markdown';
import {Platform} from 'react-native';

const BlurbImage = styled.Image({
  aspectRatio: 2.2,
});

const imageSource = {
  uri: Platform.select({android: 'community', ios: 'community.jpg'}),
};

const Page3 = () => {
  const {t} = useTranslation('Screen.Onboarding');

  return (
    <Gutters>
      <ActionList>
        <BlurbImage source={imageSource} resizeMode="cover" />
        <Gutters>
          <Spacer16 />
          <Display24>{t('page3.card.heading')}</Display24>
          <Spacer8 />
          <Markdown>{t('page3.card.text__markdown')}</Markdown>
          <Spacer8 />
        </Gutters>
      </ActionList>
      <Spacer28 />
      <Heading>{t('page3.heading__text')}</Heading>
    </Gutters>
  );
};

export default Page3;
