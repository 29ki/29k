import React, {useCallback} from 'react';
import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import {Heading16} from '../Typography/Heading/Heading';
import Relates from './Relates';
import {Spacer28} from '../Spacers/Spacer';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';

export const AllStates = () => {
  const [count, setCount] = React.useState(0);
  const onPress = useCallback(() => setCount(prev => prev + 1), []);

  return (
    <ScreenWrapper>
      <Heading16>No count</Heading16>
      <Relates />
      <Spacer28 />
      <Heading16>With count</Heading16>
      <Relates count={1} />
      <Relates count={100} />
      <Spacer28 />
      <Heading16>Animated on increase (onPress)</Heading16>
      <TouchableOpacity onPress={onPress}>
        <Relates count={count} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};
