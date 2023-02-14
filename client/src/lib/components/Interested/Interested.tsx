import React from 'react';
import {useTranslation} from 'react-i18next';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {BellFillIcon, StarFillIcon, StarIcon} from '../Icons';
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
  compact?: boolean;
  active?: boolean;
  count?: number;
  reminder?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
};

const Body = styled(BodyBold)<InterestedProps>(({active}) => ({
  color: active ? COLORS.PRIMARY : COLORS.GREYDARK,
}));

const Interested: React.FC<InterestedProps> = ({
  compact,
  active,
  reminder,
  count,
  style,
  onPress,
}) => {
  const {t} = useTranslation('Component.Interested');
  return (
    <Container style={style} onPress={onPress} disabled={!onPress}>
      {reminder ? (
        <IconWrapper>
          <BellFillIcon fill={COLORS.PRIMARY} />
        </IconWrapper>
      ) : (
        !compact &&
        count === undefined && (
          // Only show star if not compact and not showing count
          <IconWrapper>
            {active ? (
              <StarFillIcon fill={COLORS.PRIMARY} />
            ) : (
              <StarIcon fill={COLORS.GREYDARK} />
            )}
          </IconWrapper>
        )
      )}
      {Boolean(count) && (
        <>
          <Count>{count}</Count>
          <Spacer4 />
        </>
      )}
      {!compact && count !== 0 && (
        // Only show "interested" if not compact and count undefined or > 0
        <Body active={active || Boolean(count)}>{t('text')}</Body>
      )}
    </Container>
  );
};

export default Interested;
