import React from 'react';
import styled from 'styled-components/native';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {Spacer12} from '../Spacers/Spacer';
import {B3} from '../Typography/Text/Text';
import * as icons from './index';

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const IconListWrapper = styled.View({
  width: 30,
  height: 30,
});

const IconGridWrapper = styled(IconListWrapper)({
  marginRight: 18,
  marginBottom: 18,
});

const GridWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
});

export const IconsList = () => (
  <ScreenWrapper>
    {Object.entries(icons).map(([name, Icon]) => (
      <Row key={name}>
        <IconListWrapper>
          <Icon />
        </IconListWrapper>
        <Spacer12 />
        <B3>{name}</B3>
      </Row>
    ))}
  </ScreenWrapper>
);

export const IconsGrid = () => (
  <ScreenWrapper>
    <GridWrapper>
      {Object.entries(icons).map(([name, Icon]) => (
        <IconGridWrapper key={name}>
          <Icon />
        </IconGridWrapper>
      ))}
    </GridWrapper>
  </ScreenWrapper>
);
