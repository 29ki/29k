import React from 'react';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {HKGroteskBold} from '../../constants/fonts';

import {Spacer4} from '../Spacers/Spacer';
import {Body14} from '../Typography/Body/Body';

const Wrapper = styled.View<{themeColor?: string}>(({themeColor}) => ({
  backgroundColor: themeColor ? COLORS.BLACK_TRANSPARENT_15 : COLORS.PURE_WHITE,
  paddingVertical: 1,
  paddingHorizontal: SPACINGS.EIGHT,
  borderRadius: SPACINGS.EIGHT,
  flexDirection: 'row',
  alignItems: 'center',
}));

const StatusText = styled(Body14)<{themeColor?: string}>(({themeColor}) => ({
  color: themeColor ? themeColor : COLORS.BLACK,
  fontFamily: HKGroteskBold,
}));

const BadgeIcon = styled.View({
  width: 20,
  height: 20,
});

type BadgeProps = {
  IconBefore?: React.ReactNode;
  IconAfter?: React.ReactNode;
  text: string | React.ReactNode;
  themeColor?: string;
};

const Badge: React.FC<BadgeProps> = ({
  IconBefore,
  IconAfter,
  text,
  themeColor,
}) => {
  return (
    <Wrapper themeColor={themeColor}>
      {IconBefore && (
        <>
          <BadgeIcon>{IconBefore}</BadgeIcon>
          <Spacer4 />
        </>
      )}
      <StatusText themeColor={themeColor}>{text}</StatusText>
      {IconAfter && (
        <>
          <Spacer4 />
          <BadgeIcon>{IconAfter}</BadgeIcon>
        </>
      )}
    </Wrapper>
  );
};
export default React.memo(Badge);
