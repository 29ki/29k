import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import ActionButton from '../../../../lib/components/ActionList/ActionItems/ActionButton';
import ActionList from '../../../../lib/components/ActionList/ActionList';
import {
  MegaphoneIcon,
  EnvelopeIcon,
  SafetyIcon,
  PrivateEyeIcon,
} from '../../../../lib/components/Icons';
import {
  ModalStackProps,
  OverlayStackProps,
} from '../../../../lib/navigation/constants/routes';
import useIsPublicHost from '../../../../lib/user/hooks/useIsPublicHost';
import useUserState from '../../../../lib/user/state/state';
import * as linking from '../../../../lib/linking/nativeLinks';

const AboutActionList = () => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ModalStackProps>
    >();
  const {t} = useTranslation('Overlay.AboutEditorial');

  const isPublicHost = useIsPublicHost();

  const isAnonymous = useUserState(state => state.user?.isAnonymous);

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

  const privacyNoticePress = useCallback(() => {
    linking.openURL(t('actions.privacyNoticeUrl'));
  }, [t]);

  return (
    <ActionList>
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
      <ActionButton Icon={PrivateEyeIcon} onPress={privacyNoticePress}>
        {t('actions.privacyNotice')}
      </ActionButton>
    </ActionList>
  );
};

export default AboutActionList;
