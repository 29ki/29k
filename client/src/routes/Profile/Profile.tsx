import React from 'react';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {Spacer16} from '../../common/components/Spacers/Spacer';
import {B1} from '../../common/components/Typography/Text/Text';
import useCheckForUpdate from '../../lib/codePush/hooks/useCheckForUpdate';
import useClearUpdates from '../../lib/codePush/hooks/useClearUpdates';
import {useUiLib} from '../../lib/uiLib/hooks/useUiLib';
import {userAtom} from '../../lib/user/state/state';

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const Profile = () => {
  const user = useRecoilValue(userAtom);
  const {toggle: toggleUiLib} = useUiLib();
  const clearUpdates = useClearUpdates();
  const checkForUpdate = useCheckForUpdate();
  return (
    <Wrapper>
      <Gutters>
        {user && (
          <>
            <B1>User ID: {user.uid}</B1>
            <Spacer16 />
          </>
        )}
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
