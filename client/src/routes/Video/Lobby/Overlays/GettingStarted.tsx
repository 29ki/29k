import React from 'react';
import {ActivityIndicator} from 'react-native';
import {TextOverlay} from '../../Overlay';
import {H3} from '../../../../common/components/Typography/Heading/Heading';
import {Spacer12, Spacer48} from '../../../../common/components/Spacers/Spacer';
import {B1} from '../../../../common/components/Typography/Text/Text';

const GettingStarted = () => {
  return (
    <TextOverlay>
      <H3>gettingStarted.heading</H3>
      <Spacer12 />
      <B1>gettingStarted.text</B1>
      <Spacer48 />
      <ActivityIndicator size="large" color={'white'} />
    </TextOverlay>
  );
};

export default GettingStarted;
