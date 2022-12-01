import React from 'react';
import styled from 'styled-components/native';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import Badge from '../Badge/Badge';
import {BellIcon, PlusIcon, PrivateIcon, PublicIcon} from '../Icons';
import {Spacer16, Spacer4} from '../Spacers/Spacer';
import {Body14} from '../Typography/Body/Body';
import Card from './Card';

const lottieSource = require('../../../assets/animations/mandala.json');
const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

export const AllCards = () => (
  <ScreenWrapper>
    <Card
      title="A nice title"
      hostPictureURL="https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png"
      hostName="with Jenny Johansson"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      buttonText="Join"
      onPress={() => {}}
      ButtonIcon={PlusIcon}
    />
    <Spacer16 />
    <Card
      title="A longer title and animation"
      lottie={lottieSource}
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png',
      }}
      buttonText="Go dance!"
      onPress={() => {}}
    />
    <Spacer16 />

    <Card
      title="With reminder and menu, no button"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}
      onContextPress={() => {}}
      Icon={BellIcon}
    />
    <Spacer16 />
    <Card
      title="Private session starts soon"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      buttonText="Join"
      onPress={() => {}}
      onContextPress={() => {}}>
      <Row>
        <Spacer4 />
        <Badge text="03:43s" Icon={<PrivateIcon />} />
      </Row>
    </Card>
    <Spacer16 />
    <Card
      title="Session starts in 24h"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}
      onContextPress={() => {}}>
      <Row>
        <Body14>{'Starts in'}</Body14>
        <Spacer4 />
        <Badge text="12:43" Icon={<PublicIcon />} />
      </Row>
    </Card>
  </ScreenWrapper>
);
