import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components/native';
import {partition} from 'ramda';

import Gutters from '../../../../lib/components/Gutters/Gutters';

import FilterStatus from '../../../screens/Journey/components/FilterStatus';

import {
  ThumbsDownWithoutPadding,
  ThumbsUpWithoutPadding,
} from '../../../../lib/components/Thumbs/Thumbs';
import useUserEvents from '../../../../lib/user/hooks/useUserEvents';
import {Spacer16} from '../../../../lib/components/Spacers/Spacer';
import {useTranslation} from 'react-i18next';

const Row = styled(Gutters)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const FeedbackFilters: React.FC<{
  selectedFeedback?: boolean;
  onChange: (newValue: boolean | undefined) => void;
}> = ({onChange, selectedFeedback}) => {
  const {t} = useTranslation('Modal.CompletedSessions');
  const {feedbackEvents} = useUserEvents();
  const [positiveFeedbacks, negativeFeedbacks] = useMemo(
    () => partition(f => f.payload.answer, feedbackEvents),
    [feedbackEvents],
  );

  const onThumbsUpPress = useCallback(
    () => onChange(selectedFeedback ? undefined : true),
    [onChange, selectedFeedback],
  );

  const onThumbsDownPress = useCallback(
    () => onChange(selectedFeedback === false ? undefined : false),
    [onChange, selectedFeedback],
  );

  return (
    <Row>
      <FilterStatus
        selected={selectedFeedback === true}
        Icon={ThumbsUpWithoutPadding}
        onPress={onThumbsUpPress}
        heading={`${positiveFeedbacks.length}`}
        description={t('meaningful')}
        disabled={!positiveFeedbacks.length}
      />
      <Spacer16 />
      <FilterStatus
        selected={selectedFeedback === false}
        Icon={ThumbsDownWithoutPadding}
        onPress={onThumbsDownPress}
        heading={`${negativeFeedbacks.length}`}
        description={t('notMeaningful')}
        disabled={!negativeFeedbacks.length}
      />
    </Row>
  );
};

export default FeedbackFilters;
