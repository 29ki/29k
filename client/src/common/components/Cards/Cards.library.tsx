import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {SPACINGS} from '../../constants/spacings';
import {BellIcon} from '../Icons';
import {Spacer16, Spacer4} from '../Spacers/Spacer';
import {Body14, Body18, BodyBold} from '../Typography/Body/Body';
import Card from './Card';

const lottieSource = require('../../../assets/animations/mandala.json');
const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});
const Badge = styled.View({
  backgroundColor: COLORS.PURE_WHITE,
  paddingVertical: SPACINGS.FOUR,
  paddingHorizontal: SPACINGS.EIGHT,
  borderRadius: SPACINGS.EIGHT,
});

export const AllCards = () => (
  <ScreenWrapper>
    <Card
      title="Title"
      description="And description"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png',
      }}
      buttonText="Join"
      onPress={() => console.log('Session Card!')}
    />
    <Spacer16 />
    <Card
      title="Only title and animation"
      lottie={lottieSource}
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png',
      }}
      buttonText="Go dance!"
      onPress={() => console.log('Session Card!')}
    />
    <Spacer16 />

    <Card
      title="With reminder and menu"
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
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png',
      }}
      buttonText="Join"
      onPress={() => console.log('Session Card!')}
      onContextPress={() => {}}>
      <Row>
        <Body14>{'Starts'}</Body14>
        <Spacer4 />
        <Badge>
          <Body14>
            <BodyBold>
              <Body14>{'Today 12:43'}</Body14>
            </BodyBold>
          </Body14>
        </Badge>
      </Row>
    </Card>
    <Spacer16 />
    <Card
      title="Title with icon ➡️"
      description="Custom"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png',
      }}
      buttonText="Go dance!"
      onPress={() => console.log('Session Card!')}>
      <Body18>Can have custom content</Body18>
      <Body18>Go crazy</Body18>
    </Card>
  </ScreenWrapper>
);
