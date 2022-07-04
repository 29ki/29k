import React from 'react';
import {ActivityIndicator} from 'react-native';
import {COLORS} from '../../../../common/constants/colors';

import {Overlay} from '../../Overlay';

const Loading = () => (
  <Overlay>
    <ActivityIndicator size="large" color={COLORS.WHITE} />
  </Overlay>
);

export default Loading;
