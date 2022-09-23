import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import Button from '../../../common/components/Buttons/Button';
import {DeleteIcon} from '../../../common/components/Icons';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {H16} from '../../../common/components/Typography/Heading/Heading';
import {RootStackProps} from '../../../common/constants/routes';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import NS from '../../../lib/i18n/constants/namespaces';
import useTemples from '../hooks/useTemples';
import {templeByIdSelector} from '../state/state';

const Container = styled.View<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    backgroundColor,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  }),
);

const Controls = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-end',
});

const StyledButton = styled(Button)<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    backgroundColor,
  }),
);

const DeleteButtonWrapper = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
});

const TempleModal = () => {
  const {
    params: {templeId},
  } = useRoute<RouteProp<RootStackProps, 'TempleModal'>>();
  const {t} = useTranslation(NS.COMPONENT.TEMPLE_MODAL);
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const {deleteTemple} = useTemples();
  const temple = useRecoilValue(templeByIdSelector(templeId));
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
          await deleteTemple(templeId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <HalfModal backgroundColor={exercise.card?.backgroundColor}>
      <Container backgroundColor={exercise.card?.backgroundColor}>
        <Controls>
          <StyledButton
            backgroundColor={exercise.card?.backgroundColor}
            onPress={() => setIsEditing(editing => !editing)}>
            <H16>{isEditing ? t('done') : t('edit')}</H16>
          </StyledButton>
        </Controls>
        <DeleteButtonWrapper>
          <Button variant="tertiary" RightIcon={DeleteIcon} onPress={onDelete}>
            <H16>{t('deleteButton')}</H16>
          </Button>
        </DeleteButtonWrapper>
      </Container>
    </HalfModal>
  );
};

export default TempleModal;
