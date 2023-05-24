import React from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {BellFillIcon} from '../Icons';
import {Spacer4} from '../Spacers/Spacer';
import {BodyBold} from '../Typography/Body/Body';

const Container = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
});

const IconWrapper = styled.View({
  width: 22,
  height: 22,
  marginLeft: -4,
});

const Count = styled(BodyBold)({
  color: COLORS.PURE_WHITE,
  fontSize: 14,
  lineHeight: 18,
  backgroundColor: COLORS.PRIMARY,
  paddingVertical: 2,
  paddingHorizontal: 6,
  borderRadius: 6,
  overflow: 'hidden',
});

type InterestedProps = {
  count?: number;
  reminder?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
};

const Interested: React.FC<InterestedProps> = ({
  reminder,
  count,
  style,
  onPress,
}) => {
  return (
    <Container style={style} onPress={onPress} disabled={!onPress}>
      {reminder && (
        <IconWrapper>
          <BellFillIcon fill={COLORS.PRIMARY} />
        </IconWrapper>
      )}
      {Boolean(count) && (
        <>
          <Count>{count}</Count>
          <Spacer4 />
        </>
      )}
    </Container>
  );
};

export default Interested;
