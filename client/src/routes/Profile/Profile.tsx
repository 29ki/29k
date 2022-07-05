import React from 'react';
import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {Spacer16} from '../../common/components/Spacers/Spacer';
import useCheckForUpdate from '../../lib/codePush/hooks/useCheckForUpdate';
import useClearUpdates from '../../lib/codePush/hooks/useClearUpdates';
import {useUiLib} from '../../lib/uiLib/hooks/useUiLib';

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const Profile = () => {
  const {toggle: toggleUiLib} = useUiLib();
  const clearUpdates = useClearUpdates();
  const checkForUpdate = useCheckForUpdate();
  return (
    <Wrapper>
      <Gutters>
        <Button onPress={toggleUiLib}>UI lib</Button>
        <Spacer16 />
        <Button onPress={clearUpdates}>Clear update</Button>
        <Spacer16 />
        <Button onPress={checkForUpdate}>Check for update</Button>
      </Gutters>
    </Wrapper>
  );
};

export default Profile;
