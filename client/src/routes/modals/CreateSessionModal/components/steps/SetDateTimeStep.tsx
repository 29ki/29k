import React from 'react';
import {BottomSheetScrollView, useBottomSheet} from '@gorhom/bottom-sheet';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import Button from '../../../../../lib/components/Buttons/Button';
import Byline from '../../../../../lib/components/Bylines/Byline';
import Image from '../../../../../lib/components/Image/Image';
import Gutters from '../../../../../lib/components/Gutters/Gutters';
import {
  BottomSafeArea,
  Spacer16,
  Spacer28,
  Spacer8,
} from '../../../../../lib/components/Spacers/Spacer';
import {Display24} from '../../../../../lib/components/Typography/Display/Display';
import useExerciseById from '../../../../../lib/content/hooks/useExerciseById';
import {LANGUAGE_TAG} from '../../../../../lib/i18n';
import {ModalStackProps} from '../../../../../lib/navigation/constants/routes';
import useSessions from '../../../../../lib/sessions/hooks/useSessions';
import {StepProps} from '../../CreateSessionModal';
import DateTimePicker from '../../../../../lib/components/DateTimePicker/DateTimePicker';
import {SPACINGS} from '../../../../../lib/constants/spacings';
import EditSessionType from '../../../../../lib/components/EditSessionType/EditSessionType';
import {formatContentName} from '../../../../../lib/utils/string';
import useLogSessionMetricEvents from '../../../../../lib/sessions/hooks/useLogSessionMetricEvents';

const TextWrapper = styled.View({
  flex: 2,
  paddingVertical: SPACINGS.SIXTEEN,
});

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const Cta = styled(Button)({alignSelf: 'center'});

const CardImageWrapper = styled.View({
  width: 80,
  height: 80,
});

const SetDateTimeStep: React.FC<StepProps> = ({
  selectedExercise,
  selectedModeAndType,
  isPublicHost,
  userProfile,
  firstStep,
}) => {
  const {t, i18n} = useTranslation('Modal.CreateSession');
  const {expand, collapse} = useBottomSheet();
  const {goBack, navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps, 'SessionModal'>>();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionDateTime, setSessionDateTime] = useState<dayjs.Dayjs>(dayjs());

  const {addSession} = useSessions();
  const exercise = useExerciseById(selectedExercise);
  const logSessionMetricEvent = useLogSessionMetricEvents();

  const onChange = useCallback(
    (selectedDateTime: dayjs.Dayjs) => setSessionDateTime(selectedDateTime),
    [setSessionDateTime],
  );

  const onSubmit = useCallback(async () => {
    if (selectedExercise && selectedModeAndType?.type) {
      setIsLoading(true);
      const session = await addSession({
        exerciseId: selectedExercise,
        type: selectedModeAndType.type,
        startTime: sessionDateTime,
        language: i18n.resolvedLanguage as LANGUAGE_TAG,
      });
      setIsLoading(false);
      logSessionMetricEvent('Create Sharing Session', session);
      goBack();
      navigate('SessionModal', {session});
    }
  }, [
    sessionDateTime,
    selectedExercise,
    selectedModeAndType,
    addSession,
    goBack,
    navigate,
    i18n.resolvedLanguage,
    logSessionMetricEvent,
  ]);

  const cardImg = useMemo(
    () => ({uri: exercise?.card?.image?.source}),
    [exercise],
  );

  const onToggle = useCallback(
    (expanded: boolean) => (expanded ? expand() : collapse()),
    [expand, collapse],
  );

  const onEditSessionType = useCallback(() => {
    firstStep();
  }, [firstStep]);

  return (
    <BottomSheetScrollView focusHook={useIsFocused}>
      <Gutters>
        <Spacer8 />
        <Row>
          <TextWrapper>
            <Display24>{formatContentName(exercise)}</Display24>
            <Spacer8 />
            <Byline
              pictureURL={userProfile?.photoURL}
              name={userProfile?.displayName}
              duration={exercise?.duration}
            />
          </TextWrapper>
          <Spacer16 />
          <CardImageWrapper>
            <Image source={cardImg} />
          </CardImageWrapper>
        </Row>
        <Spacer28 />
        {isPublicHost && selectedModeAndType?.type && (
          <EditSessionType
            sessionType={selectedModeAndType.type}
            onPress={onEditSessionType}
          />
        )}
        <Spacer16 />
        <DateTimePicker
          minimumDate={dayjs().local()}
          onChange={onChange}
          onToggle={onToggle}
        />
        <Spacer16 />
        <Cta
          variant="secondary"
          small
          onPress={onSubmit}
          loading={isLoading}
          disabled={isLoading}>
          {t('setDateTime.cta')}
        </Cta>
        <Spacer16 />
      </Gutters>
      <BottomSafeArea minSize={SPACINGS.THIRTYTWO} />
    </BottomSheetScrollView>
  );
};
export default SetDateTimeStep;
