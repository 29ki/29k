import {useIsFocused, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AnimatedLottieView from 'lottie-react-native';
import React, {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import Button, {ButtonText} from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {ForwardIcon, LogoIcon} from '../../common/components/Icons';
import {
  BottomSafeArea,
  Spacer16,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {H2} from '../../common/components/Typography/Heading/Heading';
import {COLORS} from '../../common/constants/colors';
import {ROUTES, ScreenProps} from '../../common/constants/routes';
import NS from '../../lib/i18n/constants/namespaces';

const Wrapper = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'space-around',
});

const Mandala = styled(AnimatedLottieView)({
  width: '80%',
  height: undefined,
  aspectRatio: '1',
  borderRadius: 20,
  overflow: 'hidden',
});

const Logo = styled.View({
  width: 80,
  aspectRatio: '1',
});

const Preamble = styled(H2)({
  textAlign: 'center',
});

const ButtonIcon = styled.View({
  width: 30,
  height: 30,
});

type ScreenNavigationProps = StackNavigationProp<ScreenProps>;

const Home = () => {
  const {t} = useTranslation(NS.SCREEN.HOME);
  const {navigate} = useNavigation<ScreenNavigationProps>();
  const isFocused = useIsFocused();
  const mandalaRef = useRef<AnimatedLottieView>(null);

  useEffect(() => {
    if (mandalaRef.current) {
      if (isFocused) {
        /* Reset animation on language change and/or getting focus */
        mandalaRef.current.play();
      } else {
        /* Since tabs aren't detached/unmounted we need to pause the animation when navigating away */
        mandalaRef.current.pause();
      }
    }
  }, [isFocused]);

  return (
    <>
      <TopSafeArea />
      <Wrapper>
        <Logo>
          <LogoIcon />
        </Logo>
        <Gutters>
          <Preamble>{t('heading')}</Preamble>
        </Gutters>
        <Mandala
          source={require('../../assets/animations/mandala.json')}
          ref={mandalaRef}
          autoPlay
          loop
        />
        <Spacer16 />
        <Button onPress={() => navigate(ROUTES.BREATHING)}>
          <ButtonText>{t('button')}</ButtonText>
          <Spacer16 />
          <ButtonIcon>
            <ForwardIcon fill={COLORS.YELLOW} />
          </ButtonIcon>
        </Button>
      </Wrapper>
      <BottomSafeArea />
    </>
  );
};

export default Home;
