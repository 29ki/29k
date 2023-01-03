import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import ActionButton from '../../../lib/components/ActionList/ActionItems/ActionButton';
import ActionList from '../../../lib/components/ActionList/ActionList';
import {
  SunUpIcon,
  MegaphoneIcon,
  EnvelopeIcon,
} from '../../../lib/components/Icons';
import {
  ProfileStackProps,
  ModalStackProps,
} from '../../../lib/navigation/constants/routes';
import useIsPublicHost from '../../../lib/user/hooks/useIsPublicHost';

const AboutActionList = () => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<ProfileStackProps & ModalStackProps>
    >();
  const {t} = useTranslation('Overlay.About');

  const isPublicHost = useIsPublicHost();

  const earlyAccessInfoPress = useCallback(
    () => navigate('EarlyAccessInfo'),
    [navigate],
  );

  const publicHostAccessPress = useCallback(
    () => navigate('UpgradeAccountModal'),
    [navigate],
  );

  const contactPress = useCallback(() => navigate('ContactModal'), [navigate]);

  return (
    <ActionList>
      <ActionButton Icon={SunUpIcon} onPress={earlyAccessInfoPress}>
        {t('actions.earlyAccessInfo')}
      </ActionButton>
      {!isPublicHost && (
        <ActionButton Icon={MegaphoneIcon} onPress={publicHostAccessPress}>
          {t('actions.publicHostAccess')}
        </ActionButton>
      )}
      <ActionButton Icon={EnvelopeIcon} onPress={contactPress}>
        {t('actions.contact')}
      </ActionButton>
    </ActionList>
  );
};

export default AboutActionList;
