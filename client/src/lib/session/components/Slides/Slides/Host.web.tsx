import React from 'react';
import styled from 'styled-components/native';
import {ProfileIcon} from '../../../../components/Icons';
import useSessionState from '../../../state/state';

const Container = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
});

const Icon = styled(ProfileIcon)({
  width: '33%',
});

const Sharing = () => {
  const theme = useSessionState(state => state.exercise?.theme);
  return (
    <Container>
      <Icon fill={theme?.textColor} />
    </Container>
  );
};

export default Sharing;
