import React from 'react';

import {TextOverlay} from '../../Overlay';
import {B3} from '../../../../common/components/Typography/Text/Text';
import {Spacer12} from '../../../../common/components/Spacers/Spacer';
import {H3} from '../../../../common/components/Typography/Heading/Heading';

const Waiting = () => {
  return (
    <TextOverlay>
      <H3>waiting.title</H3>
      <Spacer12 />
      <B3>waiting.line1</B3>
      <B3>waiting.line2</B3>
    </TextOverlay>
  );
};

export default Waiting;
