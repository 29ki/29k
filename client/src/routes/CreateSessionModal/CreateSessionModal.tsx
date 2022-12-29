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
  prevStep: () => void;
  isPublicHost: boolean;
  selectedType: SessionType | undefined;
  userProfile: UserProfile;
  setSelectedType: Dispatch<SetStateAction<StepProps['selectedType']>>;
};

const publicHostSteps = (hasProfile: boolean) =>
  hasProfile
    ? [SelectContentStep, SelectTypeStep, SetDateTimeStep]
    : [UpdateProfileStep, SelectContentStep, SelectTypeStep, SetDateTimeStep];
const normalUserSteps = (hasProfile: boolean) =>
  hasProfile
    ? [SelectContentStep, SetDateTimeStep]
    : [UpdateProfileStep, SelectContentStep, SetDateTimeStep];

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

  const CurrentStepComponent: React.FC<StepProps> = useMemo(
    () =>
      isPublicHost
        ? publicHostSteps(hasProfile)[currentStep]
        : normalUserSteps(hasProfile)[currentStep],
    [isPublicHost, currentStep, hasProfile],
  );

  const prevStep = useCallback(
    () => setCurrentStep(currentStep - 1),
    [currentStep],
  );

  const nextStep = useCallback(
    () => setCurrentStep(currentStep + 1),
    [currentStep],
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
          prevStep={prevStep}
          isPublicHost={isPublicHost}
        />
      </Step>
    </SheetModal>
  );
};

export default CreateSessionModal;
