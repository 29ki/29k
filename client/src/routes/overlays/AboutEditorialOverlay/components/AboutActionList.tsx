import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import ActionButton from '../../../../lib/components/ActionList/ActionItems/ActionButton';
import ActionList from '../../../../lib/components/ActionList/ActionList';
import {
  EnvelopeIcon,
  SafetyIcon,
  PrivateEyeIcon,
} from '../../../../lib/components/Icons';
import {
  ModalStackProps,
  OverlayStackProps,
} from '../../../../lib/navigation/constants/routes';
import * as linking from '../../../../lib/linking/nativeLinks';

const AboutActionList = () => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ModalStackProps>
    >();
  const {t} = useTranslation('Overlay.AboutEditorial');

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
