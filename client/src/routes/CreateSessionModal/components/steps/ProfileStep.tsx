import React from 'react';
import {useTranslation} from 'react-i18next';
import Gutters from '../../../../common/components/Gutters/Gutters';
import ProfileInfo from '../../../../common/components/ProfileInfo/ProfileInfo';
import {Spacer16} from '../../../../common/components/Spacers/Spacer';
import {ModalHeading} from '../../../../common/components/Typography/Heading/Heading';
import {StepProps} from '../../CreateSessionModal';

const UpdateProfileStep: React.FC<StepProps> = () => {
  const {t} = useTranslation('Modal.CreateSession');
  return (
    <Gutters big>
      <Spacer16 />
      <ModalHeading>{t('profile.text')}</ModalHeading>
      <Spacer16 />
      <ProfileInfo />
    </Gutters>
  );
};

export default UpdateProfileStep;
