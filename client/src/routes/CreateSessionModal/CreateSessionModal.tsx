import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import styled from 'styled-components/native';

import {Exercise} from '../../../../shared/src/types/generated/Exercise';
import {SessionType} from '../../../../shared/src/types/Session';
import {COLORS} from '../../../../shared/src/constants/colors';
import {UserProfile} from '../../../../shared/src/types/User';

import useIsPublicHost from '../../lib/user/hooks/useIsPublicHost';
import useUser from '../../lib/user/hooks/useUser';

import SheetModal from '../../lib/components/Modals/SheetModal';

import SelectTypeStep from './components/steps/SelectTypeStep';
import SetDateTimeStep from './components/steps/SetDateTimeStep';
import SelectContentStep from './components/steps/SelectContentStep';
import UpdateProfileStep from './components/steps/ProfileStep';

export const Step = styled(Animated.View).attrs({
  entering: FadeIn.duration(300),
  exiting: FadeOut.duration(300),
})({
  flex: 1,
});

export type StepProps = {
  selectedExercise: Exercise['id'] | undefined;
  setSelectedExercise: Dispatch<SetStateAction<StepProps['selectedExercise']>>;
  nextStep: () => void;
  firstStep: () => void;
  lastStep: () => void;
  isPublicHost: boolean;
  selectedType: SessionType | undefined;
  userProfile: UserProfile;
  setSelectedType: Dispatch<SetStateAction<StepProps['selectedType']>>;
};

const publicHostSteps = (skipProfile: boolean) =>
  skipProfile
    ? [SelectTypeStep, SelectContentStep, SetDateTimeStep]
    : [SelectTypeStep, UpdateProfileStep, SelectContentStep, SetDateTimeStep];
const normalUserSteps = (skipProfile: boolean) =>
  skipProfile
    ? [SelectTypeStep, SelectContentStep, SetDateTimeStep]
    : [SelectTypeStep, UpdateProfileStep, SelectContentStep, SetDateTimeStep];

const CreateSessionModal = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<
    Exercise['id'] | undefined
  >();
  const isPublicHost = useIsPublicHost();
  const user = useUser();
  const [selectedType, setSelectedType] = useState<SessionType | undefined>(
    isPublicHost ? undefined : SessionType.private,
  );

  const hasProfile = Boolean(user?.displayName) && Boolean(user?.photoURL);
  const userProfile = useMemo(
    () => ({
      displayName: user?.displayName ?? undefined,
      photoURL: user?.photoURL ?? undefined,
    }),
    [user?.displayName, user?.photoURL],
  );

  const currentSteps = useMemo(
    () =>
      isPublicHost
        ? publicHostSteps(selectedType === 'async' || hasProfile)
        : normalUserSteps(selectedType === 'async' || hasProfile),
    [isPublicHost, hasProfile, selectedType],
  );

  const CurrentStepComponent: React.FC<StepProps> = useMemo(
    () => currentSteps[currentStep],
    [currentSteps, currentStep],
  );

  const nextStep = useCallback(
    () => setCurrentStep(currentStep + 1),
    [currentStep],
  );

  const firstStep = useCallback(() => setCurrentStep(0), []);

  const lastStep = useCallback(
    () => setCurrentStep(currentSteps.length - 1),
    [currentSteps],
  );

  return (
    <SheetModal
      backgroundColor={currentStep === 0 ? COLORS.WHITE : COLORS.CREAM}>
      <Step>
        <CurrentStepComponent
          selectedExercise={selectedExercise}
          setSelectedExercise={setSelectedExercise}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          userProfile={userProfile}
          nextStep={nextStep}
          firstStep={firstStep}
          lastStep={lastStep}
          isPublicHost={isPublicHost}
        />
      </Step>
    </SheetModal>
  );
};

export default CreateSessionModal;
