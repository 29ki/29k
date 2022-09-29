import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList} from 'react-native-gesture-handler';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import styled from 'styled-components/native';
import Button from '../../../common/components/Buttons/Button';

import Gutters from '../../../common/components/Gutters/Gutters';
import Image from '../../../common/components/Image/Image';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {
  Spacer16,
  Spacer24,
  Spacer28,
  Spacer8,
} from '../../../common/components/Spacers/Spacer';
import TouchableOpacity from '../../../common/components/TouchableOpacity/TouchableOpacity';
import {Body14} from '../../../common/components/Typography/Body/Body';
import {
  Display16,
  Display24,
} from '../../../common/components/Typography/Display/Display';
import {Heading16} from '../../../common/components/Typography/Heading/Heading';
import {COLORS} from '../../../common/constants/colors';
import {ModalStackProps} from '../../../common/constants/routes';
import SETTINGS from '../../../common/constants/settings';
import {SPACINGS} from '../../../common/constants/spacings';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import NS from '../../../lib/i18n/constants/namespaces';
import useTemples from '../hooks/useTemples';
import DateTimePicker from './DateTimePicker';

const Row = styled.View({
  flexDirection: 'row',
  paddingHorizontal: SPACINGS.EIGHT,
});

const Content = styled(Gutters)({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
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
  flex: 1,
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

const ContentCard: React.FC<{id: string; onPress: () => void}> = ({
  id,
  onPress,
}) => {
  const exercise = useExerciseById(id);
  return (
    <Card onPress={onPress}>
      <TextWrapper>
        <Display16>{exercise?.name}</Display16>
        <Body14 numberOfLines={1}>{exercise?.id}</Body14>
      </TextWrapper>
      <Spacer16 />
      <CardImageWrapper>
        <Image source={{uri: exercise?.card?.image?.source}} />
      </CardImageWrapper>
    </Card>
  );
};

const SelectContent: React.FC<StuffType> = ({
  setCurrentStep,
  setSelectedExercise,
}) => {
  const exercises = ['095f9642-73b6-4c9a-ae9a-ea7dea7363f5'];
  const {t} = useTranslation(NS.COMPONENT.CREATE_TEMPLE_MODAL);

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
        data={exercises}
        renderItem={({item}) => (
          <ContentCard
            onPress={() => {
              setSelectedExercise(item);
              setCurrentStep(1);
            }}
            id={item}
          />
        )}
      />
    </Step>
  );
};

const SetDateTime: React.FC<StuffType> = ({selectedExercise}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dateTime, setDateTime] = useState();
  const {addTemple} = useTemples();

  const {t} = useTranslation(NS.COMPONENT.CREATE_TEMPLE_MODAL);
  const exercise = useExerciseById(selectedExercise);
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const onSubmit = async () => {
    if (exercise && dateTime) {
      setIsLoading(true);
      await addTemple(exercise, dateTime);
      setIsLoading(false);
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
      <DateTimePicker />
      <Cta variant="secondary" small onPress={onSubmit} disabled={isLoading}>
        {t('setDateTime.cta')}
      </Cta>
    </Step>
  );
};

type StuffType = {
  selectedExercise: string | null;
  setSelectedExercise: Dispatch<SetStateAction<string | null>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  selectedDate: Date | null;
  setSelectedDate: Dispatch<SetStateAction<Date | null>>;
};

const steps = [SelectContent, SetDateTime];

const CreateTempleModal = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const CurrentStepComponent: React.FC<StuffType> = steps[currentStep];

  const stuff: StuffType = {
    selectedExercise,
    setSelectedExercise,
    currentStep,
    setCurrentStep,
    selectedDate,
    setSelectedDate,
  };

  return (
    <HalfModal
      backgroundColor={currentStep === 0 ? COLORS.WHITE : COLORS.CREAM}>
      <Content>
        <CurrentStepComponent {...stuff} />
      </Content>
    </HalfModal>
  );
};

export default CreateTempleModal;
