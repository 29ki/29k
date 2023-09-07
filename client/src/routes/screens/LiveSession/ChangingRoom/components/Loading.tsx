import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../../../../lib/components/Screen/Screen';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const Loading = () => {
  const {goBack} = useNavigation();
  return (
    <Screen onPressBack={goBack}>
      <Wrapper>
        <ActivityIndicator size="large" />
      </Wrapper>
    </Screen>
  );
};

export default Loading;
