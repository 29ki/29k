import {useNavigation} from '@react-navigation/native';
import React from 'react';
import styled from 'styled-components/native';

import Gutters from '../../common/components/Gutters/Gutters';
import {BackIcon} from '../../common/components/Icons';
import {TopSafeArea} from '../../common/components/Spacers/Spacer';
import DailyProvider from './DailyProvider';
import Session from './Session';

const Back = styled.TouchableOpacity({
  width: 40,
  height: 40,
});

const Temple = () => {
  const {goBack} = useNavigation();

  return (
    <>
      <TopSafeArea />
      <Gutters>
        <Back onPress={goBack}>
          <BackIcon />
        </Back>
      </Gutters>
      <DailyProvider>
        <Session />
      </DailyProvider>
    </>
  );
};

export default Temple;
