import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {
  BottomSafeArea,
  Spacer16,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {ROUTES} from '../../common/constants/routes';
import {StackNavigatorScreens} from '../../lib/navigation/Stacks';

const Wrapper = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
});

const Logotype = styled.View({
  width: '50%',
  height: undefined,
  aspectRatio: '1',
  borderRadius: 20,
  overflow: 'hidden',
});

const Image = styled.Image({
  width: '100%',
  height: '100%',
});

type BreathinhScreenNavigationProp = StackNavigationProp<StackNavigatorScreens>;

const Home = () => {
  const {navigate} = useNavigation<BreathinhScreenNavigationProp>();
  return (
    <Wrapper>
      <Gutters>
        <TopSafeArea />
        <Logotype>
          <Image source={require('../../assets/logotype.png')} />
        </Logotype>
        <Spacer16 />
        <Button onPress={() => navigate(ROUTES.BREATHING)}>Hej</Button>
        <BottomSafeArea />
      </Gutters>
    </Wrapper>
  );
};

export default Home;
