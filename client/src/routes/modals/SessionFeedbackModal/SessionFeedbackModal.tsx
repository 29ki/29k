import {StyleSheet} from 'react-native';
import {BottomSheetScrollView, useBottomSheet} from '@gorhom/bottom-sheet';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';

import Button from '../../../lib/components/Buttons/Button';
import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer24,
  Spacer60,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';
import {
  Heading16,
  Heading24,
  ModalHeading,
} from '../../../lib/components/Typography/Heading/Heading';
import {BottomSheetTextInput} from '../../../lib/components/Typography/TextInput/TextInput';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';

import {DEFAULT_LANGUAGE_TAG} from '../../../lib/i18n';
import {Display36} from '../../../lib/components/Typography/Display/Display';
import {ThumbsUp, ThumbsDown} from '../../../lib/components/Thumbs/Thumbs';

import useCompletedSessionById from '../../../lib/user/hooks/useCompletedSessionById';
import useSessionFeedback from '../../../lib/session/hooks/useSessionFeedback';
import useRating from '../../../lib/rating/hooks/useRating';
import VideoLooper from '../../../lib/components/VideoLooper/VideoLooper';

const BackgroundVideo = styled(VideoLooper).attrs({
  repeat: true,
  muted: true,
  sources: [
    {
      source: 'clouds.mp4',
      repeat: true,
    },
  ],
})(({paused}) => ({
  ...StyleSheet.absoluteFillObject,
  opacity: paused ? 0 : 1, // Hide it when not playing to pre-load it a bit
}));

const ThankYou = styled(Display36)({
  paddingTop: 150,
  fontSize: 40,
  lineHeight: 53,
  textAlign: 'center',
});

const Votes = styled.View({
  flexDirection: 'row',
});

const Vote = styled(TouchableOpacity)({
  width: 160,
  height: 160,
});

const Wrapper = styled(Gutters)({
  alignItems: 'center',
  justifyContent: 'center',
});

const TextField = styled(BottomSheetTextInput)({
  height: 80,
  width: '100%',
});

const SessionFeedbackModal = () => {
  const {t} = useTranslation('Modal.SessionFeedback');
  const {params} =
    useRoute<RouteProp<ModalStackProps, 'SessionFeedbackModal'>>();
  const {popToTop, navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const {snapToIndex} = useBottomSheet();
  const {exerciseId, sessionId, completed, isHost, sessionMode, sessionType} =
    params;
  const {addSessionFeedback} = useSessionFeedback();
  const askForRating = useRating();

  const completedSessionEvent = useCompletedSessionById(sessionId);

  const [answer, setAnswer] = useState<undefined | boolean>();
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const thumbsUpPress = useCallback(() => {
    snapToIndex(2);
    setAnswer(true);
  }, [snapToIndex, setAnswer]);

  const thumbsDownPress = useCallback(() => {
    snapToIndex(2);
    setAnswer(false);
  }, [snapToIndex, setAnswer]);

  const submit = useCallback(() => {
    if (answer !== undefined) {
      addSessionFeedback({
        exerciseId,
        sessionId,
        completed,
        question: t('question', {lng: DEFAULT_LANGUAGE_TAG}),
        answer,
        comment,
        host: isHost,
        sessionType,
        sessionMode,
      });
      setSubmitted(true);
    }
  }, [
    t,
    exerciseId,
    sessionId,
    completed,
    isHost,
    answer,
    comment,
    sessionType,
    sessionMode,
    setSubmitted,
    addSessionFeedback,
  ]);

  useEffect(() => {
    if (submitted) {
      snapToIndex(1);
    }
  }, [submitted, snapToIndex]);

  const handleClose = useCallback(() => {
    popToTop();
    if (completedSessionEvent) {
      navigate('CompletedSessionModal', {
        completedSessionEvent,
      });
    }

    if (answer) {
      askForRating();
    }
  }, [completedSessionEvent, popToTop, navigate, askForRating, answer]);

  return (
    <SheetModal onPressClose={handleClose}>
      <BackgroundVideo paused={!submitted} />
      {submitted ? (
        <Gutters big>
          <ThankYou>{t('thankYou__text')}</ThankYou>
        </Gutters>
      ) : (
        <>
          <BottomSheetScrollView focusHook={useIsFocused}>
            <ModalHeading>{t('title')}</ModalHeading>
            <Spacer24 />
            <Wrapper>
              <Heading24>{t('question')}</Heading24>
              <Votes>
                <Vote onPress={thumbsUpPress}>
                  <ThumbsUp active={answer === true} />
                </Vote>
                <Vote onPress={thumbsDownPress}>
                  <ThumbsDown active={answer === false} />
                </Vote>
              </Votes>
              <Spacer60 />

              <Heading16>{t('comments')}</Heading16>
              <Spacer8 />
              <TextField
                multiline
                onChangeText={setComment}
                placeholder={t('commentsPlaceholder')}
                numberOfLines={3}
              />

              <Spacer16 />
              <Button onPress={submit}>{t('submit')}</Button>
              <Spacer24 />
            </Wrapper>
          </BottomSheetScrollView>
        </>
      )}
    </SheetModal>
  );
};

export default SessionFeedbackModal;
