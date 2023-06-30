import React from 'react';
import {useTranslation} from 'react-i18next';
import Gutters from '../../../../../lib/components/Gutters/Gutters';
import ProfileInfo from '../../../../../lib/components/ProfileInfo/ProfileInfo';
import {Spacer16} from '../../../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../../../lib/components/Typography/Heading/Heading';

const UpdateProfileStep: React.FC = () => {
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
