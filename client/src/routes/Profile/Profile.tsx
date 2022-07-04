import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Profile = () => (
  <Wrapper>
    <Text>Profile!</Text>
  </Wrapper>
);

export default Profile;
