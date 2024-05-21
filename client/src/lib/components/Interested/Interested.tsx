import React from 'react';
import {useTranslation} from 'react-i18next';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {BellFillIcon} from '../Icons';
import {Spacer4} from '../Spacers/Spacer';
import {BodyBold} from '../Typography/Body/Body';
import Tag from '../Tag/Tag';

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const IconWrapper = styled.View({
  width: 20,
  height: 20,
  marginLeft: -4,
});

const Count = styled(Tag)({
  backgroundColor: COLORS.PRIMARY,
  color: COLORS.WHITE,
});

const Body = styled(BodyBold)({
  color: COLORS.PRIMARY,
});

type InterestedProps = {
  compact?: boolean;
  count?: number;
  reminder?: boolean;
  style?: ViewStyle;
};

const Interested: React.FC<InterestedProps> = ({
  compact,
  reminder,
  count,
  style,
}) => {
  const {t} = useTranslation('Component.Interested');
  return (
    <Container style={style}>
      {reminder && (
        <IconWrapper>
          <BellFillIcon fill={COLORS.PRIMARY} />
        </IconWrapper>
      )}
      {Boolean(count) && (
        <>
          {!compact && (
            <>
              <Body>{t('text')}</Body>
              <Spacer4 />
            </>
          )}

          <Count>{count}</Count>
        </>
      )}
    </Container>
  );
};

export default Interested;
