import React, {useEffect} from 'react';

import Gutters from '../../../lib/components/Gutters/Gutters';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  HomeStackProps,
  ModalStackProps,
} from '../../../lib/navigation/constants/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CardModal from '../../../lib/components/Modals/CardModal';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import {Spacer16, Spacer8} from '../../../lib/components/Spacers/Spacer';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import styled from 'styled-components/native';
import {CheckIcon} from '../../../lib/components/Icons';
import Button from '../../../lib/components/Buttons/Button';
import {useBottomSheet} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import useUnlockCollectionById from '../../../lib/user/hooks/useUnlockCollectionById';

const Wrapper = styled(Gutters)({
  justifyContent: 'center',
  flex: 1,
});

const Title = styled(Display24)({
  textAlign: 'center',
});

const CenterButton = styled(Button)({
  alignSelf: 'center',
});

const UnlockCollectionModal = () => {
  const {t} = useTranslation('Modal.UnlockCollection');
  const {
    params: {collectionId},
  } = useRoute<RouteProp<ModalStackProps, 'UnlockCollectionModal'>>();
  const {navigate} = useNavigation<NativeStackNavigationProp<HomeStackProps>>();
  const {close} = useBottomSheet();

  const {collection, unlockCollection} = useUnlockCollectionById(collectionId);

  useEffect(() => {
    if (collection) {
      unlockCollection();
      navigate('Collection', {collectionId});
    }
  }, [collection, collectionId, navigate, unlockCollection]);

  if (!collection)
    return (
      <CardModal>
        <Wrapper>
          <ModalHeading>{t('invalidLink')}</ModalHeading>
          <Spacer16 />
          <CenterButton
            variant="secondary"
            size="small"
            onPress={close}
            LeftIcon={CheckIcon}>
            {t('confirmButton')}
          </CenterButton>
        </Wrapper>
      </CardModal>
    );

  return (
    <CardModal>
      <Wrapper>
        <ModalHeading>{t('heading1')}</ModalHeading>
        <ModalHeading>{t('heading2')}</ModalHeading>
        <Spacer8 />
        <Title>{collection.name}</Title>
        <Spacer16 />
        <CenterButton
          variant="secondary"
          size="small"
          onPress={close}
          LeftIcon={CheckIcon}>
          {t('confirmButton')}
        </CenterButton>
      </Wrapper>
    </CardModal>
  );
};

export default UnlockCollectionModal;
