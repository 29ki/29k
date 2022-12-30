import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import ActionButton from '../../../lib/components/ActionList/ActionItems/ActionButton';
import ActionList from '../../../lib/components/ActionList/ActionList';
import {CommunityIcon, CheckedIcon} from '../../../lib/components/Icons';
import {
  ProfileStackProps,
  ModalStackProps,
} from '../../../lib/navigation/constants/routes';

const CommunityActionList = () => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<ProfileStackProps & ModalStackProps>
    >();
  const {t} = useTranslation('Overlay.Community');

  const contributorsPress = useCallback(
    () => navigate('ContributorsModal'),
    [navigate],
  );

  const partnersPress = useCallback(
    () => navigate('PartnersModal'),
    [navigate],
  );

  return (
    <ActionList>
      <ActionList>
        {/*
            <ActionButton Icon={WandIcon}>{t('actions.contribute')}</ActionButton>
            */}
        <ActionButton Icon={CommunityIcon} onPress={contributorsPress}>
          {t('actions.contributors')}
        </ActionButton>
        <ActionButton Icon={CheckedIcon} onPress={partnersPress}>
          {t('actions.partners')}
        </ActionButton>
      </ActionList>
    </ActionList>
  );
};

export default CommunityActionList;
