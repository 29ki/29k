import dayjs from 'dayjs';
import React, {useMemo} from 'react';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import SETTINGS from '../../constants/settings';
import {SPACINGS} from '../../constants/spacings';

import {Spacer8} from '../Spacers/Spacer';
import Tag from '../Tag/Tag';
import {
  ThumbsUpWithoutPadding,
  ThumbsDownWithoutPadding,
} from '../Thumbs/Thumbs';
import {Body16} from '../Typography/Body/Body';

export const CARD_WIDTH = 216;

const Card = styled.View({
  ...SETTINGS.BOXSHADOW_SMALL,
  backgroundColor: COLORS.WHITE,
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  padding: SPACINGS.SIXTEEN,
  width: CARD_WIDTH,
  minHeight: 120,
  maxHeight: 216,
  marginBottom: SPACINGS.SIXTEEN,
});

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const DateTag = styled(Tag)({
  marginTop: 0,
  backgroundColor: COLORS.PURE_WHITE,
});

const ThumbWrapper = styled.View({
  width: SPACINGS.TWENTYFOUR,
  height: SPACINGS.TWENTYFOUR,
});

const FeedbackCard: React.FC<{
  answer: boolean;
  date?: string;
  children: React.ReactNode;
}> = ({children, answer, date}) => {
  const formattedDate = useMemo(() => dayjs(date).format('d MMM'), [date]);

  return (
    <Card>
      <Row>
        <ThumbWrapper>
          {answer ? <ThumbsUpWithoutPadding /> : <ThumbsDownWithoutPadding />}
        </ThumbWrapper>

        {date && (
          <>
            <Spacer8 />
            <DateTag>{formattedDate}</DateTag>
          </>
        )}
      </Row>
      <Spacer8 />
      <Body16>{children}</Body16>
    </Card>
  );
};

export default FeedbackCard;
