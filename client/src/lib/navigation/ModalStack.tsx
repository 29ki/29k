import React, {useMemo} from 'react';
import {
  BottomSheetNavigationOptions,
  createBottomSheetNavigator,
} from '@th3rdwave/react-navigation-bottom-sheet';

import {ModalStackProps} from './constants/routes';
import SessionModal from '../../routes/SessionModal/SessionModal';
import CreateSessionModal from '../../routes/CreateSessionModal/CreateSessionModal';
import JoinSessionModal from '../../routes/JoinSessionModal/JoinSessionModal';
import UpgradeAccountModal from '../../routes/UpgradeAccountModal/UpgradeAccountModal';
import AddSessionModal from '../../routes/AddSessionModal/AddSessionModal';
import SessionUnavailableModal from '../../routes/SessionUnavailableModal/SessionUnavailableModal';
import {COLORS} from '../../../../shared/src/constants/colors';
import SETTINGS from '../../common/constants/settings';
import {SPACINGS} from '../../common/constants/spacings';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppStackWrapper from './AppStack';
import ModalBackground from '../modal/components/ModalBackground';
import ModalBackdrop from '../modal/components/ModalBackdrop';

const ModalStack = createBottomSheetNavigator<ModalStackProps>();

const modalScreenOptions: BottomSheetNavigationOptions = {
  backdropComponent: ModalBackdrop,
  backgroundComponent: ModalBackground,
  backgroundStyle: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: SPACINGS.FOUR,
    },
    shadowOpacity: 0.16,
    shadowRadius: SPACINGS.TWELVE,
    elevation: SPACINGS.TWELVE,
  },
};

const ModalStackWrapper = () => {
  const {top} = useSafeAreaInsets();

  const sheetModalScreenOptions = useMemo(
    () => ({
      ...modalScreenOptions,
      snapPoints: ['50%', '75%', '100%'],
      handleIndicatorStyle: {
        backgroundColor: COLORS.GREYDARK,
      },
      topInset: top,
    }),
    [top],
  );

  const cardModalScreenOptions = useMemo(
    () => ({
      ...modalScreenOptions,
      snapPoints: [250],
      detached: true,
      bottomInset: 5,
      style: {
        marginHorizontal: 4,
      },
      backgroundStyle: {
        borderBottomLeftRadius: SETTINGS.BORDER_RADIUS.MODALS,
        borderBottomRightRadius: SETTINGS.BORDER_RADIUS.MODALS,
      },
      handleIndicatorStyle: {
        opacity: 0,
      },
    }),
    [],
  );

  return (
    <ModalStack.Navigator>
      <ModalStack.Screen name="App" component={AppStackWrapper} />

      <ModalStack.Group screenOptions={sheetModalScreenOptions}>
        <ModalStack.Screen name={'SessionModal'} component={SessionModal} />
        <ModalStack.Screen
          name={'CreateSessionModal'}
          component={CreateSessionModal}
        />
      </ModalStack.Group>

      <ModalStack.Group screenOptions={cardModalScreenOptions}>
        <ModalStack.Screen
          name={'AddSessionModal'}
          component={AddSessionModal}
        />
        <ModalStack.Screen
          name={'JoinSessionModal'}
          component={JoinSessionModal}
        />
        <ModalStack.Screen
          name={'UpgradeAccountModal'}
          component={UpgradeAccountModal}
        />
        <ModalStack.Screen
          name={'SessionUnavailableModal'}
          component={SessionUnavailableModal}
        />
      </ModalStack.Group>
    </ModalStack.Navigator>
  );
};

export default ModalStackWrapper;
