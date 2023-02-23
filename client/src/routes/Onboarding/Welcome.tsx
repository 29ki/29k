import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../shared/src/constants/colors';
import Button from '../../lib/components/Buttons/Button';
import Gutters from '../../lib/components/Gutters/Gutters';
import Image from '../../lib/components/Image/Image';
import Screen from '../../lib/components/Screen/Screen';
import {
  BottomSafeArea,
  Spacer16,
  Spacer20,
  Spacer32,
  Spacer40,
  TopSafeArea,
} from '../../lib/components/Spacers/Spacer';
import {Display24} from '../../lib/components/Typography/Display/Display';
import Markdown from '../../lib/components/Typography/Markdown/Markdown';
import useAppState from '../../lib/appState/state/state';
import {AppStackProps} from '../../lib/navigation/constants/routes';
import TopBar from '../../lib/components/TopBar/TopBar';

const Wrapper = styled(Gutters).attrs({big: true})({
  flex: 1,
  justifyContent: 'space-between',
});
const TopImage = styled(Image)({
  minWidth: 132,
  minHeight: 132,
  flex: 1,
  alignSelf: 'center',
  aspectRatio: '1',
});
const CenteredHeading = styled(Display24)({
  textAlign: 'center',
});
const ButtonWrapper = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
});

const Welcome = () => {
  const {t} = useTranslation('Screen.Welcome');
  const {goBack} = useNavigation();
  const {params: {showBack} = {}} =
    useRoute<RouteProp<AppStackProps, 'Welcome'>>();
  const setSettings = useAppState(state => state.setSettings);

  const onContinue = useCallback(() => {
    setSettings({showWelcome: false});
  }, [setSettings]);

  return (
    <Screen backgroundColor={COLORS.CREAM}>
      {showBack ? (
        <>
          <Spacer16 />
          <TopBar backgroundColor={COLORS.CREAM} onPressClose={goBack} fade />
        </>
      ) : (
        <TopSafeArea />
      )}
      <ScrollView>
        <Wrapper>
          <Spacer32 />
          <TopImage source={{uri: t('image__image')}} />
          <Spacer20 />
          <CenteredHeading>{t('heading')}</CenteredHeading>
          <Spacer16 />
          <Markdown>{t('text__markdown')}</Markdown>
          {!showBack && (
            <ButtonWrapper>
              <Button onPress={onContinue}>{t('button')}</Button>
            </ButtonWrapper>
          )}
          <Spacer40 />
        </Wrapper>
      </ScrollView>
      <BottomSafeArea />
    </Screen>
  );
};
export default Welcome;
