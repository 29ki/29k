import {useNavigation} from '@react-navigation/native';
import React from 'react';
import styled from 'styled-components/native';

import {BackIcon} from '../../common/components/Icons';
import {BottomSafeArea} from '../../common/components/Spacers/Spacer';
import {GUTTERS, SPACINGS} from '../../common/constants/spacings';
import DailyProvider from './DailyProvider';
import Session from './Session';

const Back = styled.TouchableOpacity({
  position: 'absolute',
  left: GUTTERS,
  width: 40,
  height: 40,
});

const Temple = () => {
  const {goBack} = useNavigation();

  return (
    <>
      <Back onPress={goBack}>
        <BackIcon />
      </Back>
      <DailyProvider>
        <Session />
      </DailyProvider>
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </>
  );
};

export default Temple;
