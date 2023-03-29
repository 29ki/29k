import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import ActionButton from '../../../../lib/components/ActionList/ActionItems/ActionButton';
import ActionList from '../../../../lib/components/ActionList/ActionList';
import {
  SunUpIcon,
  MegaphoneIcon,
  EnvelopeIcon,
  SafetyIcon,
} from '../../../../lib/components/Icons';
import {
  ModalStackProps,
  OverlayStackProps,
} from '../../../../lib/navigation/constants/routes';
import useIsPublicHost from '../../../../lib/user/hooks/useIsPublicHost';
import useUserState from '../../../../lib/user/state/state';

const AboutActionList = () => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ModalStackProps>
    >();
  const {t} = useTranslation('Overlay.AboutEditorial');

  const isPublicHost = useIsPublicHost();

  const isAnonymous = useUserState(state => state.user?.isAnonymous);
  const earlyAccessInfoPress = useCallback(
    () => navigate('EarlyAccessInfoOverlay'),
    [navigate],
  );

  const publicHostAccessPress = useCallback(
    () =>
      isAnonymous
        ? navigate('UpgradeAccountModal')
        : navigate('RequestPublicHostModal'),
    [navigate, isAnonymous],
  );

  const contactPress = useCallback(() => navigate('ContactModal'), [navigate]);

  const safetyToolkitPress = useCallback(
    () => navigate('SafetyToolkitModal'),
    [navigate],
  );

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
      <ActionButton Icon={SafetyIcon} onPress={safetyToolkitPress}>
        {t('actions.safetyToolkit')}
      </ActionButton>
    </ActionList>
  );
};

export default AboutActionList;
