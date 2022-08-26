import React from 'react';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {Spacer16} from '../Spacers/Spacer';
import TempleCard from './TempleCard/TempleCard';
const lottieSource = require('../../../assets/animations/mandala.json');

const animation = {src: lottieSource, animation: true};

export const AllCards = () => (
  <ScreenWrapper>
    <Spacer16 />
    <TempleCard
      temple={{url: '', name: 'Test temple', id: 'sdf', active: true}}
      lottieSrc={animation.src}
      buttonText="Join"
      time="Some time"
      onPress={() => console.log('Temple Card!')}
    />
  </ScreenWrapper>
);
