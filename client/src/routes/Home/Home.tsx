import React from 'react';

import {useUiLib} from '../../lib/uiLib/hooks/useUiLib';
import styled from 'styled-components/native';
import {Spacer32} from '../../common/components/Spacers/Spacer';
import Button from '../../common/components/Buttons/Button';
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
  const {toggle: toggleUiLib} = useUiLib();

  return (
    <Wrapper>
      <Gutters>
        <Logotype
          source={require('../../assets/logotype.png')}
          resizeMode="contain"
        />
        <Spacer32 />
        <Button onPress={toggleUiLib}>UI lib</Button>
      </Gutters>
    </Wrapper>
  );
};

export default Home;
