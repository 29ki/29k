import {useIsFocused, useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';
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
import SheetModal from '../../common/components/Modals/SheetModal';
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
import {ModalHeading} from '../../common/components/Typography/Heading/Heading';
import {COLORS} from '../../../../shared/src/constants/colors';
import SETTINGS from '../../common/constants/settings';
import {SPACINGS} from '../../common/constants/spacings';
import {Body16} from '../../common/components/Typography/Body/Body';
import DateTimePicker from './components/DateTimePicker';
import {LANGUAGE_TAG} from '../../lib/i18n';
import useIsPublicHost from '../../lib/user/hooks/useIsPublicHost';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomSheetFlatList, useBottomSheet} from '@gorhom/bottom-sheet';
import ProfileInfo from '../../common/components/ProfileInfo/ProfileInfo';
import useUser from '../../lib/user/hooks/useUser';
import Byline from '../../common/components/Bylines/Byline';
import {UserProfile} from '../../../../shared/src/types/User';
import {PrivateIcon, PublicIcon} from '../../common/components/Icons';

const Row = styled.View({
  flexDirection: 'row',
  paddingHorizontal: SPACINGS.EIGHT,
});

const Card = styled(TouchableOpacity)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  paddingRight: 0,
  paddingLeft: SPACINGS.SIXTEEN,
  backgroundColor: COLORS.CREAM,
  overflow: 'hidden',
});

const IconWrapper = styled.View({
  width: 30,
  height: 30,
});

const CardImageWrapper = styled.View({
  width: 80,
  height: 80,
});

const TextWrapper = styled.View({
  flex: 2,
  paddingVertical: SPACINGS.SIXTEEN,
});

const Step = styled(Animated.View).attrs({
  entering: FadeIn.duration(300),
  exiting: FadeOut.duration(300),
})({
  flex: 1,
});

const Cta = styled(Button)({alignSelf: 'center'});

const TypeWrapper = styled(TouchableOpacity)({
  justifyContent: 'center',
  height: 96,
  flex: 1,
  backgroundColor: COLORS.PURE_WHITE,
  borderRadius: SPACINGS.SIXTEEN,
  paddingHorizontal: SPACINGS.SIXTEEN,
});
const TypeItemHeading = styled(ModalHeading)({
  textAlign: 'left',
  paddingHorizontal: SPACINGS.EIGHT,
});

const ContentCard: React.FC<{
  exerciseId: Exercise['id'];
  onPress: () => void;
}> = ({exerciseId, onPress}) => {
  const exercise = useExerciseById(exerciseId);

  return (
    <Gutters>
      <Card onPress={onPress}>
        <TextWrapper>
          <Display16>{exercise?.name}</Display16>
        </TextWrapper>
        <Spacer16 />
        <CardImageWrapper>
          <Image source={{uri: exercise?.card?.image?.source}} />
        </CardImageWrapper>
      </Card>
    </Gutters>
  );
};

const UpdateProfile: React.FC<StepProps> = () => {
  const {t} = useTranslation('Modal.CreateSession');
  return (
    <Gutters>
      <Spacer16 />
      <ModalHeading>{t('profile.text')}</ModalHeading>
      <Spacer16 />
      <ProfileInfo />
    </Gutters>
  );
};

const SelectContent: React.FC<StepProps> = ({
  nextStep,
  setSelectedExercise,
}) => {
  const exerciseIds = useExerciseIds();

  const {t} = useTranslation('Modal.CreateSession');

  return (
    <Step>
      <BottomSheetFlatList
        ListHeaderComponent={
          <>
            <ModalHeading>{t('selectContent.title')}</ModalHeading>
            <Spacer16 />
          </>
        }
        focusHook={useIsFocused}
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
  Icon: React.ReactNode;
  label: string;
  onPress: () => void;
}> = ({Icon, label, onPress = () => {}}) => (
  <TypeWrapper onPress={onPress}>
    <IconWrapper>{Icon}</IconWrapper>
    <Body16>{label}</Body16>
  </TypeWrapper>
);

const SelectType: React.FC<StepProps> = ({
  selectedExercise,
  setSelectedType,
  nextStep,
  userProfile,
}) => {
  const exercise = useExerciseById(selectedExercise);
  const {t} = useTranslation('Modal.CreateSession');

  return (
    <Step>
      <Gutters>
        <Spacer8 />
        <Row>
          <TextWrapper>
            <Display24>{exercise?.name}</Display24>
            <Spacer8 />
            <Byline
              pictureURL={userProfile.photoURL}
              name={userProfile.displayName}
            />
          </TextWrapper>
          <Spacer16 />
          <CardImageWrapper>
            <Image source={{uri: exercise?.card?.image?.source}} />
          </CardImageWrapper>
        </Row>
        <Spacer28 />
        <TypeItemHeading>{t('selectType.title')}</TypeItemHeading>
        <Spacer16 />
        <Row>
          {Object.values(SessionType).map((type, i, arr) => (
            <>
              <TypeItem
                key={i}
                onPress={() => {
                  setSelectedType(type);
                  nextStep();
                }}
                label={t(`selectType.${type}.title`)}
                Icon={type === 'private' ? <PrivateIcon /> : <PublicIcon />}
              />
              {i < arr.length - 1 && <Spacer16 />}
            </>
          ))}
        </Row>
      </Gutters>
    </Step>
  );
};

const SetDateTime: React.FC<StepProps> = ({selectedExercise, selectedType}) => {
  const {t, i18n} = useTranslation('Modal.CreateSession');
  const {expand, collapse} = useBottomSheet();
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
      <Gutters>
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
        <ModalHeading>{t('setDateTime.title')}</ModalHeading>
        <Spacer16 />
        <DateTimePicker
          minimumDate={dayjs().local()}
          onChange={(selectedDate, selectedTime) => {
            setDate(selectedDate);
            setTime(selectedTime);
          }}
          onToggle={expanded => (expanded ? expand() : collapse())}
        />
        <Spacer16 />
        <Cta variant="secondary" small onPress={onSubmit} disabled={isLoading}>
          {t('setDateTime.cta')}
        </Cta>
        <Spacer16 />
      </Gutters>
    </Step>
  );
};

type StepProps = {
  selectedExercise: Exercise['id'] | undefined;
  setSelectedExercise: Dispatch<SetStateAction<StepProps['selectedExercise']>>;
  nextStep: () => void;
  selectedType: SessionType | undefined;
  userProfile: UserProfile;
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
  const isPublicHost = useIsPublicHost();
  const user = useUser();
  const [selectedType, setSelectedType] = useState<SessionType | undefined>(
    isPublicHost ? undefined : SessionType.private,
  );

  const hasProfile = Boolean(user?.displayName) && Boolean(user?.photoURL);
  const userProfile = {
    displayName: user?.displayName ?? undefined,
    photoURL: user?.photoURL ?? undefined,
  };

  const CurrentStepComponent: React.FC<StepProps> = isPublicHost
    ? publicHostSteps(hasProfile)[currentStep]
    : normalUserSteps(hasProfile)[currentStep];

  const stepProps: StepProps = {
    selectedExercise,
    setSelectedExercise,
    selectedType,
    setSelectedType,
    userProfile,
    nextStep: () => setCurrentStep(currentStep + 1),
  };

  return (
    <SheetModal
      backgroundColor={currentStep === 0 ? COLORS.WHITE : COLORS.CREAM}>
      <CurrentStepComponent {...stepProps} />
    </SheetModal>
  );
};

export default CreateSessionModal;
