import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import Button from '../../../common/components/Buttons/Button';
import {PlusIcon} from '../../../common/components/Icons';
import Image from '../../../common/components/Image/Image';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {Spacer16} from '../../../common/components/Spacers/Spacer';
import {Display24} from '../../../common/components/Typography/Display/Display';
import {COLORS} from '../../../common/constants/colors';
import {RootStackProps} from '../../../common/constants/routes';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import NS from '../../../lib/i18n/constants/namespaces';
import {userAtom} from '../../../lib/user/state/state';
import useAddToCalendar from '../hooks/useAddToCalendar';
import useTemples from '../hooks/useTemples';

const Content = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
});
const BottomContent = styled.View({
  flex: 1,
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const ImageContainer = styled.View({
  flex: 1,
  height: 80,
});

const DeleteButton = styled(Button)({
  backgroundColor: COLORS.DELETE,
  justifySelf: 'flex-end',
});

const Title = styled(Display24)({
  flex: 2,
});

const TempleModal = () => {
  const {
    params: {temple},
  } = useRoute<RouteProp<RootStackProps, 'TempleModal'>>();
  const {t} = useTranslation(NS.COMPONENT.TEMPLE_MODAL);
  const user = useRecoilValue(userAtom);
  const navigation = useNavigation();
  const {deleteTemple} = useTemples();
  const addToCalendar = useAddToCalendar();
  const exercise = useExerciseById(temple?.contentId);

  if (!temple || !exercise) {
    return null;
  }

  const onDelete = () => {
    Alert.alert(t('delete.header'), t('delete.text'), [
      {text: t('delete.buttons.cancel'), style: 'cancel', onPress: () => {}},
      {
        text: t('delete.buttons.confirm'),
        style: 'destructive',

        onPress: async () => {
          await deleteTemple(temple.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <HalfModal>
      <Content>
        <Title>{exercise?.name}</Title>
        <ImageContainer>
          <Image
            resizeMode="contain"
            source={{uri: exercise?.card?.image?.source}}
          />
        </ImageContainer>
      </Content>
      <Spacer16 />
      <BottomContent>
        <Button
          small
          LeftIcon={PlusIcon}
          variant="secondary"
          onPress={() =>
            addToCalendar(
              temple.name,
              exercise.name,
              dayjs().add(2, 'days'),
              dayjs().add(2, 'days').add(1, 'hour'),
            )
          }>
          {t('addToCalendar')}
        </Button>
        {user?.uid === temple?.facilitator && (
          <DeleteButton small onPress={onDelete}>
            {t('deleteButton')}
          </DeleteButton>
        )}
      </BottomContent>
    </HalfModal>
  );
};

export default TempleModal;
