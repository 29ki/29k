import React from 'react';
import {View} from 'react-native';

import styled from 'styled-components/native';
import Gutters from '../../common/components/Gutters/Gutters';
import {Logo} from '../../common/components/Icons';
import {
  BottomSafeArea,
  Spacer12,
  Spacer48,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {H1, H3} from '../../common/components/Typography/Heading/Heading';
import {B1} from '../../common/components/Typography/Text/Text';

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const Logotype = styled.View({
  width: 50,
  height: 50,
});

const ContentWrapper = styled.View({
  width: '80%',
  alignItems: 'center',
  flexDirection: 'row',
});

const Home = () => {
  return (
    <Wrapper>
      <Gutters>
        <TopSafeArea />
        <ContentWrapper>
          <Logotype>
            <Logo />
          </Logotype>
          <Spacer12 />
          <View>
            <H3>Vulnerability</H3>
            <B1>
              To share beyond the layers of shoeshine and collateral sticks and
              bones
            </B1>
          </View>
        </ContentWrapper>
        <Spacer48 />
        <H1>Vulnerability is a birthday cake served with fireworks</H1>
        <BottomSafeArea />
      </Gutters>
    </Wrapper>
  );
};

export default Home;
