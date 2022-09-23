import React from 'react';
import {View} from 'react-native';

import {B16, B14} from '../components/Typography/Text/Text';
import * as Spacers from '../components/Spacers/Spacer';
import {Spacer24} from '../components/Spacers/Spacer';
import ScreenWrapper from '../../lib/uiLib/decorators/ScreenWrapper';
import {COLORS} from './colors';
import {GUTTERS} from './spacings';
import styled from 'styled-components/native';

const SwatchList = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
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
const SwatchNameText = styled(B14)({
  fontSize: 12,
  marginBottom: -4,
  fontWeight: 'bold',
});
const SwatchValueText = styled(B14)({
  fontSize: 12,
});

const Gutter = styled(Spacer24)({
  backgroundColor: COLORS.BLACK,
});

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
          <B16>{name}</B16>
          <SpacerWrapper>
            <Spacer />
          </SpacerWrapper>
          <Spacers.Spacer4 />
        </View>
      ))}
    <Spacer24 />
    <B16>Gutters ({GUTTERS})</B16>
    <Gutter />
  </ScreenWrapper>
);
