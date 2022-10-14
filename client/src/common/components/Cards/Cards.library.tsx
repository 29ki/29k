import React from 'react';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {BellIcon} from '../Icons';
import {Spacer16} from '../Spacers/Spacer';
import {Body18} from '../Typography/Body/Body';
import Card from './Card';

const lottieSource = require('../../../assets/animations/mandala.json');

export const AllCards = () => (
  <ScreenWrapper>
    <Card
      title="Test session"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png',
      }}
      buttonText="Join"
      onPress={() => console.log('Session Card!')}
    />
    <Spacer16 />
    <Card
      title="With context menu ➡️"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png',
      }}
      buttonText="Go dance!"
      onPress={() => console.log('Session Card!')}
      onContextPress={() => {}}
    />
    <Spacer16 />
    <Card
      title="With icon ➡️ "
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png',
      }}
      buttonText="Go dance!"
      onPress={() => console.log('Session Card!')}
      Icon={BellIcon}
    />
    <Spacer16 />
    <Card
      title="With icon and menu ➡️ "
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png',
      }}
      buttonText="Go dance!"
      onPress={() => console.log('Session Card!')}
      onContextPress={() => {}}
      Icon={BellIcon}
    />
    <Spacer16 />
    <Card
      title="Test session"
      description="With description"
      lottie={lottieSource}
      buttonText="Go fish!"
      onPress={() => console.log('Session Card!')}
    />
    <Spacer16 />
    <Card
      description="Only description"
      lottie={lottieSource}
      buttonText="Go fish!"
      onPress={() => console.log('Session Card!')}
    />
    <Spacer16 />
    <Card
      description="Only description"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png',
      }}
      buttonText="Go dance!"
      onPress={() => console.log('Session Card!')}>
      <Body18>Can have custom content</Body18>
      <Body18>Can have custom content</Body18>
      <Body18>Can have custom content</Body18>
    </Card>
  </ScreenWrapper>
);
