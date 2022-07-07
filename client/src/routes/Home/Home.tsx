import React from 'react';
import styled from 'styled-components/native';
import Gutters from '../../common/components/Gutters/Gutters';
import {
  BottomSafeArea,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';

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

const Home = () => {
  return (
    <Wrapper>
      <Gutters>
        <TopSafeArea />
        <Logotype>
          <Image source={require('../../assets/logotype.png')} />
        </Logotype>
        <BottomSafeArea />
      </Gutters>
    </Wrapper>
  );
};

export default Home;
