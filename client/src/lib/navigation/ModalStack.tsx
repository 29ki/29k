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
import {SPACINGS} from '../../common/constants/spacings';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppStackWrapper from './AppStack';
import ModalBackground from '../modal/components/ModalBackground';
import ModalBackdrop from '../modal/components/ModalBackdrop';

const ModalStack = createBottomSheetNavigator<ModalStackProps>();

const getScreenOptions: (
  topInset: number,
) => BottomSheetNavigationOptions = topInset => ({
  snapPoints: ['30%'],
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
  handleIndicatorStyle: {
    backgroundColor: COLORS.GREYDARK,
  },
  topInset,
});

const ModalStackWrapper = () => {
  const {top} = useSafeAreaInsets();

  const screenOptions = useMemo(() => getScreenOptions(top), [top]);

  return (
    <ModalStack.Navigator screenOptions={screenOptions}>
      <ModalStack.Screen name="App" component={AppStackWrapper} />

      <ModalStack.Screen name={'SessionModal'} component={SessionModal} />
      <ModalStack.Screen
        name={'CreateSessionModal'}
        component={CreateSessionModal}
        options={{snapPoints: ['30%', '75%', '100%']}}
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
      <ModalStack.Group
        screenOptions={{
          ...screenOptions,
          detached: true,
          bottomInset: 5,
          style: {
            marginHorizontal: 4,
          },
          backgroundStyle: {
            borderBottomLeftRadius: 45,
            borderBottomRightRadius: 45,
          },
          handleIndicatorStyle: {
            display: 'none',
          },
        }}>
        <ModalStack.Screen
          name={'AddSessionModal'}
          component={AddSessionModal}
        />
      </ModalStack.Group>
    </ModalStack.Navigator>
  );
};

export default ModalStackWrapper;
