import React from 'react';
import styled from 'styled-components/native';
import {B1} from '../../common/components/Typography/Text/Text';

const Wrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Profile = () => (
  <Wrapper>
    <B1>Profile!</B1>
  </Wrapper>
);

export default Profile;
