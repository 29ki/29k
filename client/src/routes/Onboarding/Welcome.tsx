import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {COLORS} from '../../../../shared/src/constants/colors';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import Image from '../../common/components/Image/Image';
import Screen from '../../common/components/Screen/Screen';
import {
  BottomSafeArea,
  Spacer16,
  Spacer20,
  Spacer32,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {Display24} from '../../common/components/Typography/Display/Display';
import Markdown from '../../common/components/Typography/Markdown/Markdown';
import useAppState from '../../lib/appState/state/state';

const ImageWrapper = styled.View({
  width: 152,
  Height: 137,
});
const TopImage = styled(Image)({
  aspectRatio: '1',
});

const Center = styled.View({
  alignItems: 'center',
});
const Welcome = () => {
  const {t} = useTranslation('Screen.Welcome');
  const setIsFirstLaunch = useAppState(state => state.setIsFirstLaunch);
  const onContinue = () => {
    setIsFirstLaunch(false);
  };
  return (
    <Screen backgroundColor={COLORS.CREAM}>
      <ScrollView>
        <TopSafeArea />
        <Gutters big>
          <Spacer32 />
          <Center>
            <ImageWrapper>
              <TopImage source={{uri: t('image__image')}} />
            </ImageWrapper>
          </Center>
          <Spacer20 />
          <Center>
            <Display24>{t('heading')}</Display24>
          </Center>
          <Spacer16 />
          <Markdown>{t('text__markdown')}</Markdown>
          <Spacer32 />
          <Center>
            <Button onPress={onContinue}>{t('button')}</Button>
          </Center>
        </Gutters>
        <BottomSafeArea />
      </ScrollView>
    </Screen>
  );
};
export default Welcome;
