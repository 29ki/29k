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
      graphicSrc="https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png"
      buttonText="Join"
      time="Some time"
      onPress={() => console.log('Temple Card!')}
    />
    <Spacer16 />
    <TempleCard
      temple={{url: '', name: 'Test temple', id: 'sdf', active: true}}
      graphicSrc={animation.src}
      animation
      buttonText="Join"
      time="Some time"
      onPress={() => console.log('Temple Card!')}
    />
  </ScreenWrapper>
);
