import React from 'react';

import styled from 'styled-components/native';
import Gutters from '../../common/components/Gutters/Gutters';

const Wrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Logotype = styled.Image`
  flex-grow: 0;
  width: 150px;
  height: 150px;
  border-radius: 20px;
`;

const Home = () => {
  return (
    <Wrapper>
      <Gutters>
        <Logotype
          source={require('../../assets/logotype.png')}
          resizeMode="contain"
        />
      </Gutters>
    </Wrapper>
  );
};

export default Home;
