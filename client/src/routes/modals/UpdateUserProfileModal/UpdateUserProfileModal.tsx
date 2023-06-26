import React from 'react';

import Gutters from '../../../lib/components/Gutters/Gutters';

import SheetModal from '../../../lib/components/Modals/SheetModal';

import UpdateProfileStep from '../CreateSessionModal/components/steps/ProfileStep';
import Button from '../../../lib/components/Buttons/Button';

const UpdateUserProfileModal = () => {
  return (
    <SheetModal>
      <UpdateProfileStep />
      <Gutters>
        <Button onPress={() => {}}>{'Save'}</Button>
      </Gutters>
    </SheetModal>
  );
};

export default UpdateUserProfileModal;
