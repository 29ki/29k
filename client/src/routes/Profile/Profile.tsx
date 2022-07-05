import React from 'react';
import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {useUiLib} from '../../lib/uiLib/hooks/useUiLib';

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const Profile = () => {
  const {toggle: toggleUiLib} = useUiLib();
  return (
    <Wrapper>
      <Gutters>
        <Button onPress={toggleUiLib}>UI lib</Button>
      </Gutters>
    </Wrapper>
  );
};

export default Profile;
