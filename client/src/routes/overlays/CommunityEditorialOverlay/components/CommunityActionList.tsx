import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

import ActionButton from '../../../../lib/components/ActionList/ActionItems/ActionButton';
import ActionList from '../../../../lib/components/ActionList/ActionList';
import {
  CommunityIcon,
  CheckedIcon,
  WandIcon,
  FriendsIcon,
  EnvelopeIcon,
  HeartIcon,
} from '../../../../lib/components/Icons';
import {ModalStackProps} from '../../../../lib/navigation/constants/routes';
import * as linking from '../../../../lib/linking/nativeLinks';

const CommunityActionList = () => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const {t} = useTranslation('Overlay.CommunityEditorial');

  const corporatePress = useCallback(
    () => linking.openURL(t('corporateLink')),
    [t],
  );
  const donatePress = useCallback(() => linking.openURL(t('donateLink')), [t]);
  const contributePress = useCallback(
    () => linking.openURL(t('contributeLink')),
    [t],
  );

  const contributorsPress = useCallback(
    () => navigate('ContributorsModal'),
    [navigate],
  );

  const hostsPress = useCallback(() => navigate('HostsModal'), [navigate]);

  const partnersPress = useCallback(
    () => navigate('PartnersModal'),
    [navigate],
  );

  return (
    <ActionList>
      <ActionList>
        <ActionButton Icon={HeartIcon} onPress={donatePress}>
          {t('actions.donate')}
        </ActionButton>
        <ActionButton Icon={EnvelopeIcon} onPress={corporatePress}>
          {t('actions.corporate')}
        </ActionButton>
        <ActionButton Icon={WandIcon} onPress={contributePress}>
          {t('actions.contribute')}
        </ActionButton>
        <ActionButton Icon={CommunityIcon} onPress={contributorsPress}>
          {t('actions.contributors')}
        </ActionButton>
        <ActionButton Icon={FriendsIcon} onPress={hostsPress}>
          {t('actions.hosts')}
        </ActionButton>
        <ActionButton Icon={CheckedIcon} onPress={partnersPress}>
          {t('actions.partners')}
        </ActionButton>
      </ActionList>
    </ActionList>
  );
};

export default CommunityActionList;
