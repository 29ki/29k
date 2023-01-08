import {BottomSheetScrollView, useBottomSheet} from '@gorhom/bottom-sheet';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../shared/src/constants/colors';
import Button from '../../lib/components/Buttons/Button';
import Gutters from '../../lib/components/Gutters/Gutters';
import SheetModal from '../../lib/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer40,
  Spacer60,
  Spacer8,
  Spacer96,
} from '../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../lib/components/TouchableOpacity/TouchableOpacity';
import {
  Heading16,
  Heading24,
  ModalHeading,
} from '../../lib/components/Typography/Heading/Heading';
import TextInput, {
  BottomSheetTextInput,
} from '../../lib/components/Typography/TextInput/TextInput';
import * as metrics from '../../lib/metrics';
import {ModalStackProps} from '../../lib/navigation/constants/routes';

import confetti from '../../assets/animations/confetti.json';
import {BottomSheetNavigatorProps} from '@th3rdwave/react-navigation-bottom-sheet';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const Confetti = styled(AnimatedLottieView).attrs({
  source: confetti,
})({
  position: 'absolute',
  width: '100%',
});

const Votes = styled.View({
  flexDirection: 'row',
});

const Vote = styled.Text<{selected: boolean}>(({selected}) => ({
  width: 125,
  height: 125,
  fontSize: 75,
  lineHeight: 125,
  textAlign: 'center',
  borderRadius: 62.5,
  borderWidth: 5,
  borderColor: selected ? COLORS.PRIMARY : 'transparent',
  overflow: 'hidden',
}));

const Wrapper = styled(Gutters)({
  alignItems: 'center',
  justifyContent: 'center',
});

const TextField = styled(BottomSheetTextInput)({
  height: 80,
  width: '100%',
});

const Submitted = styled.View({
  height: 250,
  alignItems: 'center',
  justifyContent: 'center',
});

const SessionFeedbackModal = () => {
  const {params} =
    useRoute<RouteProp<ModalStackProps, 'SessionFeedbackModal'>>();
  const {popToTop} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const {snapToIndex} = useBottomSheet();
  const {sessionId, completed} = params;

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
    metrics.logEvent('Sharing Session Feedback', {
      'Feedback Question ID': 'foo',
      'Feedback Answer': answer,
      'Feedback Comment': comment,
      'Sharing Session ID': sessionId,
      'Sharing Session Completed': completed,
    });
    setSubmitted(true);
  }, [sessionId, completed, answer, comment, setSubmitted]);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(popToTop, 3000);
      return () => clearTimeout(timer);
    }
  }, [setSubmitted, submitted, popToTop]);

  if (submitted) {
    return (
      <SheetModal>
        <Submitted>
          <Confetti autoPlay />
          <Heading24>Thank you!</Heading24>
        </Submitted>
      </SheetModal>
    );
  }

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <ModalHeading>One last thing...</ModalHeading>
        <Spacer24 />
        <Wrapper>
          <Heading24>Was this meaningful for you?</Heading24>
          <Spacer16 />
          <Votes>
            <TouchableOpacity onPress={thumbsUpPress}>
              <Vote selected={answer === true}>👍</Vote>
            </TouchableOpacity>
            <Spacer16 />
            <TouchableOpacity onPress={thumbsDownPress}>
              <Vote selected={answer === false}>👎</Vote>
            </TouchableOpacity>
          </Votes>
          <Spacer96 />

          <Heading16>Do you have any comments?</Heading16>
          <Spacer8 />
          <TextField
            multiline
            onChangeText={setComment}
            onSubmitEditing={submit}
            returnKeyType="send"
            placeholder="Optional"
            numberOfLines={3}
          />

          <Spacer16 />
          <Button onPress={submit}>Submit</Button>
          <Spacer24 />
        </Wrapper>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default SessionFeedbackModal;
