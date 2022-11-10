import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList} from 'react-native-gesture-handler';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import styled from 'styled-components/native';

import {Exercise} from '../../../../shared/src/types/generated/Exercise';
import {SessionType} from '../../../../shared/src/types/Session';

import useExerciseById from '../../lib/content/hooks/useExerciseById';
import useExerciseIds from '../../lib/content/hooks/useExerciseIds';
import useSessions from '../Sessions/hooks/useSessions';

import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import Image from '../../common/components/Image/Image';
import HalfModal from '../../common/components/Modals/HalfModal';
import {
  Spacer16,
  Spacer24,
  Spacer28,
  Spacer8,
} from '../../common/components/Spacers/Spacer';
import TouchableOpacity from '../../common/components/TouchableOpacity/TouchableOpacity';
import {
  Display16,
  Display24,
} from '../../common/components/Typography/Display/Display';
import {Heading16} from '../../common/components/Typography/Heading/Heading';
import {COLORS} from '../../../../shared/src/constants/colors';
import SETTINGS from '../../common/constants/settings';
import {SPACINGS} from '../../common/constants/spacings';
import {Body16} from '../../common/components/Typography/Body/Body';
import DateTimePicker from './components/DateTimePicker';
import {LANGUAGE_TAG} from '../../lib/i18n';
import useIsPublicHost from '../../lib/user/hooks/useIsPublicHost';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ProfileInfo from '../../common/components/ProfileInfo/ProfileInfo';
import useUser from '../../lib/user/hooks/useUser';

const Row = styled.View({
  flexDirection: 'row',
  paddingHorizontal: SPACINGS.EIGHT,
});

const Content = styled(Gutters)({
  flexDirection: 'row',
});

const Card = styled(TouchableOpacity)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  paddingRight: 0,
  paddingLeft: SPACINGS.SIXTEEN,
  backgroundColor: '#F4EBC4',
  overflow: 'hidden',
});

const CardImageWrapper = styled.View({
  width: 80,
  height: 80,
});

const TextWrapper = styled.View({
  flex: 2,
  paddingVertical: SPACINGS.SIXTEEN,
});

const StepHeading = styled(Heading16)({
  alignSelf: 'center',
});

const Step = styled(Animated.View).attrs({
  entering: FadeIn.duration(300),
  exiting: FadeOut.duration(300),
})({
  flex: 1,
});

const Cta = styled(Button)({alignSelf: 'center'});

const TypeWrapper = styled(TouchableOpacity)({
  alignItems: 'center',
  flex: 1,
});

const ContentCard: React.FC<{
  exerciseId: Exercise['id'];
  onPress: () => void;
}> = ({exerciseId, onPress}) => {
  const exercise = useExerciseById(exerciseId);

  return (
    <Card onPress={onPress}>
      <TextWrapper>
        <Display16>{exercise?.name}</Display16>
      </TextWrapper>
      <Spacer16 />
      <CardImageWrapper>
        <Image source={{uri: exercise?.card?.image?.source}} />
      </CardImageWrapper>
    </Card>
  );
};

const UpdateProfileContainer = styled.View({flex: 1});

const UpdateProfileHeading = styled(Body16)({textAlign: 'center'});

const UpdateProfile: React.FC<StepProps> = () => {
  const {t} = useTranslation('Component.CreateSessionModal');
  return (
    <UpdateProfileContainer>
      <Spacer16 />
      <UpdateProfileHeading>{t('profile.text')}</UpdateProfileHeading>
      <Spacer16 />
      <ProfileInfo />
    </UpdateProfileContainer>
  );
};

const SelectContent: React.FC<StepProps> = ({
  nextStep,
  setSelectedExercise,
}) => {
  const exerciseIds = useExerciseIds();

  const {t} = useTranslation('Component.CreateSessionModal');

  return (
    <Step>
      <Spacer24 />
      <FlatList
        ListHeaderComponent={
          <>
            <StepHeading>{t('selectContent.title')}</StepHeading>
            <Spacer16 />
          </>
        }
        keyExtractor={id => id}
        data={exerciseIds}
        ItemSeparatorComponent={Spacer16}
        renderItem={({item}) => (
          <ContentCard
            onPress={() => {
              setSelectedExercise(item);
              nextStep();
            }}
            exerciseId={item}
          />
        )}
      />
      <Spacer24 />
    </Step>
  );
};

const TypeItem: React.FC<{
  icon: string;
  label: string;
  onPress: () => void;
}> = ({icon, label, onPress = () => {}}) => (
  <TypeWrapper onPress={onPress}>
    <CardImageWrapper>
      <Image source={{uri: icon}} />
    </CardImageWrapper>
    <Body16>{label}</Body16>
  </TypeWrapper>
);

const SelectType: React.FC<StepProps> = ({
  selectedExercise,
  setSelectedType,
  nextStep,
}) => {
  const exercise = useExerciseById(selectedExercise);
  const {t} = useTranslation('Component.CreateSessionModal');

  return (
    <Step>
      <Spacer8 />
      <Row>
        <TextWrapper>
          <Display24>{exercise?.name}</Display24>
        </TextWrapper>
        <Spacer16 />
        <CardImageWrapper>
          <Image source={{uri: exercise?.card?.image?.source}} />
        </CardImageWrapper>
      </Row>
      <Spacer28 />
      <StepHeading>{t('selectType.title')}</StepHeading>
      <Spacer16 />
      <Row>
        {Object.values(SessionType).map(type => (
          <TypeItem
            key={type}
            onPress={() => {
              setSelectedType(type);
              nextStep();
            }}
            label={t(`selectType.${type}.title`)}
            icon={t(`selectType.${type}.icon`)}
          />
        ))}
      </Row>
    </Step>
  );
};

const SetDateTime: React.FC<StepProps> = ({selectedExercise, selectedType}) => {
  const {t, i18n} = useTranslation('Component.CreateSessionModal');
  const {goBack, navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps, 'SessionModal'>>();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<dayjs.Dayjs | undefined>();
  const [time, setTime] = useState<dayjs.Dayjs | undefined>();
  const {addSession} = useSessions();
  const exercise = useExerciseById(selectedExercise);

  const onSubmit = async () => {
    if (selectedExercise && selectedType && date && time) {
      const sessionDateTime = date.hour(time.hour()).minute(time.minute());

      setIsLoading(true);
      const session = await addSession({
        contentId: selectedExercise,
        type: selectedType,
        startTime: sessionDateTime,
        language: i18n.resolvedLanguage as LANGUAGE_TAG,
      });
      setIsLoading(false);
      goBack();
      navigate('SessionModal', {session});
    }
  };

  return (
    <Step>
      <Spacer8 />
      <Row>
        <TextWrapper>
          <Display24>{exercise?.name}</Display24>
        </TextWrapper>
        <Spacer16 />
        <CardImageWrapper>
          <Image source={{uri: exercise?.card?.image?.source}} />
        </CardImageWrapper>
      </Row>
      <Spacer28 />
      <StepHeading>{t('setDateTime.title')}</StepHeading>
      <Spacer16 />
      <DateTimePicker
        minimumDate={dayjs().local()}
        onChange={(selectedDate, selectedTime) => {
          setDate(selectedDate);
          setTime(selectedTime);
        }}
      />
      <Spacer16 />
      <Cta variant="secondary" small onPress={onSubmit} disabled={isLoading}>
        {t('setDateTime.cta')}
      </Cta>
      <Spacer16 />
    </Step>
  );
};

type StepProps = {
  selectedExercise: Exercise['id'] | undefined;
  setSelectedExercise: Dispatch<SetStateAction<StepProps['selectedExercise']>>;
  nextStep: () => void;
  selectedType: SessionType | undefined;
  setSelectedType: Dispatch<SetStateAction<StepProps['selectedType']>>;
};

const publicHostSteps = (hasProfile: boolean) =>
  hasProfile
    ? [SelectContent, SelectType, SetDateTime]
    : [UpdateProfile, SelectContent, SelectType, SetDateTime];
const normalUserSteps = (hasProfile: boolean) =>
  hasProfile
    ? [SelectContent, SetDateTime]
    : [UpdateProfile, SelectContent, SetDateTime];

const CreateSessionModal = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<
    Exercise['id'] | undefined
  >();
  const {isPublicHost} = useIsPublicHost();
  const user = useUser();
  const [selectedType, setSelectedType] = useState<SessionType | undefined>(
    isPublicHost ? undefined : SessionType.private,
  );

  const hasProfile = Boolean(user?.displayName) && Boolean(user?.photoURL);

  const CurrentStepComponent: React.FC<StepProps> = isPublicHost
    ? publicHostSteps(hasProfile)[currentStep]
    : normalUserSteps(hasProfile)[currentStep];

  const stepProps: StepProps = {
    selectedExercise,
    setSelectedExercise,
    selectedType,
    setSelectedType,
    nextStep: () => setCurrentStep(currentStep + 1),
  };

  return (
    <HalfModal
      backgroundColor={currentStep === 0 ? COLORS.WHITE : COLORS.CREAM}>
      <Content>
        <CurrentStepComponent {...stepProps} />
      </Content>
    </HalfModal>
  );
};

export default CreateSessionModal;
