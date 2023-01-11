import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';

import {COLORS} from '../../../../shared/src/constants/colors';
import {GUTTERS} from './spacings';

import {Body16, Body14} from '../components/Typography/Body/Body';
import ScreenWrapper from '../uiLib/decorators/ScreenWrapper';
import * as Spacers from '../components/Spacers/Spacer';
import {Spacer24, Spacer16, Spacer4} from '../components/Spacers/Spacer';

const SwatchList = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
});
const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
});

const SwatchCard = styled.View({
  width: '48%',
  height: 120,
  marginBottom: 16,
});

const Swatch = styled.View<{color: string}>(props => ({
  height: 70,
  backgroundColor: props.color,
}));

const SwatchTextContainer = styled.View({
  padding: 8,
  backgroundColor: COLORS.WHITE,
});
const SwatchNameText = styled(Body14)({
  fontSize: 12,
  marginBottom: -4,
  fontWeight: 'bold',
});
const SwatchValueText = styled(Body14)({
  fontSize: 12,
});

const Gutter = styled.View<{big?: boolean}>(props => ({
  backgroundColor: COLORS.BLACK,
  height: props.big ? 32 : 16,
  width: props.big ? 32 : 16,
}));

const SpacerWrapper = styled.View({
  backgroundColor: COLORS.BLACK,
});

const Swatches = () => {
  const colorslist = Object.entries(COLORS).map(([name, value]) => ({
    name,
    value,
  }));
  return (
    <SwatchList>
      {colorslist?.map(color => (
        <SwatchCard key={color.name}>
          <Swatch color={color.value} />
          <SwatchTextContainer>
            <SwatchNameText>{color.name}</SwatchNameText>
            <SwatchValueText>{color.value}</SwatchValueText>
          </SwatchTextContainer>
        </SwatchCard>
      ))}
    </SwatchList>
  );
};

export const ColorSwatches = () => (
  <ScreenWrapper>
    <Swatches />
  </ScreenWrapper>
);

const getSpacerSizeInt = (name: string) =>
  parseInt(name.replace('Spacer', ''), 10);

export const Spacings = () => (
  <ScreenWrapper>
    {Object.entries(Spacers)
      .filter(([name]) => name.startsWith('Spacer'))
      .sort(([a], [b]) => getSpacerSizeInt(a) - getSpacerSizeInt(b))
      .map(([name, Spacer]) => (
        <View key={name}>
          <Body16>{name}</Body16>
          <SpacerWrapper>
            <Spacer />
          </SpacerWrapper>
          <Spacer4 />
        </View>
      ))}
    <Spacer24 />
    <Row>
      <Gutter />
      <Spacer16 />
      <Body16>Gutters ({GUTTERS.SMALL})</Body16>
    </Row>
    <Spacer16 />
    <Row>
      <Gutter big />
      <Spacer16 />
      <Body16>Gutters big ({GUTTERS.BIG})</Body16>
    </Row>
  </ScreenWrapper>
);
