import React from 'react';
import styled from 'styled-components/native';

import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import Badge from '../Badge/Badge';
import {MeIcon, CommunityIcon} from '../Icons';
import {Spacer16, Spacer4} from '../Spacers/Spacer';
import {Body14} from '../Typography/Body/Body';
import Card from './Card';
import ExerciseWalletCard from './WalletCards/ExerciseWalletCard';
import SessionWalletCard from './WalletCards/SessionWalletCard';

const lottieSource = require('../../../assets/animations/mandala.json');
const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

export const AllCards = () => (
  <ScreenWrapper>
    <Card
      title="A nice title"
      tags={['Gratitude']}
      hostPictureURL="https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png"
      hostName="Jenny"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}
    />
    <Spacer16 />
    <Card
      title="A nice title"
      hostPictureURL="https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png"
      hostName="Jenny WithALongName"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}
    />
    <Spacer16 />
    <Card
      title="A longer title and animation"
      lottie={lottieSource}
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png',
      }}
      onPress={() => {}}
    />
    <Spacer16 />

    <Card
      title="With reminder and menu"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}
    />
    <Spacer16 />
    <Card
      title="Private session starts soon"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}>
      <Row>
        <Spacer4 />
        <Badge text="03:43s" IconAfter={<MeIcon />} />
      </Row>
    </Card>
    <Spacer16 />
    <Card
      title="Session starts in 24h"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}>
      <Row>
        <Body14>{'Starts in'}</Body14>
        <Spacer4 />
        <Badge text="12:43" IconAfter={<CommunityIcon />} />
      </Row>
    </Card>
    <Spacer16 />
    <SessionWalletCard
      hasCardAfter={false}
      hasCardBefore={false}
      title="Private session starts soon"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      hostPictureURL="https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png"
      hostName="Jenny"
      onPress={() => {}}>
      <Row>
        <Badge text="03:43s" />
      </Row>
    </SessionWalletCard>
    <Spacer16 />
    <ExerciseWalletCard
      hasCardAfter={false}
      hasCardBefore={false}
      title="Some exercise name"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}
    />
    <Spacer16 />
    <ExerciseWalletCard
      hasCardAfter={true}
      hasCardBefore={false}
      title="First in wallet"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}
    />
    <ExerciseWalletCard
      hasCardAfter={false}
      hasCardBefore={true}
      title="Last in wallet"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}
    />
  </ScreenWrapper>
);
