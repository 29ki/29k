import React from 'react';

import {TextOverlay} from '../../Overlay';
import {H3} from '../../../../common/components/Typography/Heading/Heading';
import {B3} from '../../../../common/components/Typography/Text/Text';
import {Spacer12, Spacer48} from '../../../../common/components/Spacers/Spacer';
import Button from '../../../../common/components/Buttons/Button';

const Error = () => {
  const onReconnectPress = () => {
    // TODO implement retry
  };

  return (
    <TextOverlay>
      <H3>connectionError.heading</H3>
      <Spacer12 />
      <B3>connectionError.text</B3>
      <Spacer48 />
      <Button
        onPress={onReconnectPress}
        title="connectionError.reconnectButton"
      />
    </TextOverlay>
  );
};

export default Error;
