import React, {useMemo} from 'react';
import {
  BottomSheetNavigationOptions,
  createBottomSheetNavigator,
} from '@th3rdwave/react-navigation-bottom-sheet';

import {ModalStackProps} from './constants/routes';
import SessionModal from '../../routes/modals/SessionModal/SessionModal';
import CompletedSessionModal from '../../routes/modals/CompletedSessionModal/CompletedSessionModal';
import CreateSessionModal from '../../routes/modals/CreateSessionModal/CreateSessionModal';
import AddSessionByInviteModal from '../../routes/modals/AddSessionByInviteModal/AddSessionByInviteModal';
import UpgradeAccountModal from '../../routes/modals/UpgradeAccountModal/UpgradeAccountModal';
import RequestPublicHostModal from '../../routes/modals/RequestPublicHostModal/RequestPublicHostModal';
import SessionUnavailableModal from '../../routes/modals/SessionUnavailableModal/SessionUnavailableModal';
import {COLORS} from '../../../../shared/src/constants/colors';
import SETTINGS from '../constants/settings';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import ChangeLanguageModal from '../../routes/modals/ChangeLanguageModal/ChangeLanguageModal';
import ProfileSettingsModal from '../../routes/modals/ProfileSettingsModal/ProfileSettingsModal';
import SignInModal from '../../routes/modals/SignInModal/SignInModal';
import ContributorsModal from '../../routes/modals/Contributors/ContributorsModal';
import DeveloperModal from '../../routes/modals/DeveloperModal/DeveloperModal';
import OverlayStack from './OverlayStack';
import PartnersModal from '../../routes/modals/Contributors/PartnersModal';
import ContactModal from '../../routes/modals/ConcactModal/ContactModal';
import SessionFeedbackModal from '../../routes/modals/SessionFeedbackModal/SessionFeedbackModal';
import SharingModal from '../../routes/modals/SharingModal/SharingModal';
import SharingPostModal from '../../routes/modals/SharingPostModal/SharingPostModal';
import DeleteUserModal from '../../routes/modals/DeleteUserModal/DeleteUserModal';
import HostsModal from '../../routes/modals/Contributors/HostsModal';
import SafetyToolkitModal from '../../routes/modals/SafetyToolkitModal/SafetyToolkitModal';
import ReportModal from '../../routes/modals/ReportModal/ReportModal';
import CalmDownModal from '../../routes/modals/CalmDownModal/CalmDownModal';
import HostInfoModal from '../../routes/modals/HostInfoModal/HostInfoModal';
import CompletedSessionsModal from '../../routes/modals/CompletedSessionsModal/CompletedSessionsModal';

const {Navigator, Screen, Group} =
  createBottomSheetNavigator<ModalStackProps>();

const modalScreenOptions: BottomSheetNavigationOptions = {
  backdropComponent: ({animatedIndex, animatedPosition, style}) => (
    <BottomSheetBackdrop
      pressBehavior="close"
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.1}
      style={style}
    />
  ),
  backgroundStyle: {
    backgroundColor: 'transparent',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.09,
    shadowRadius: 35,
    elevation: 35,
    borderRadius: SETTINGS.BORDER_RADIUS.MODALS,
    overflow: 'visible',
  },
  handleStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  /*
    Fixes issues with modals being clipped when focusing on input fields
    https://github.com/gorhom/react-native-bottom-sheet/issues/618
  */
  android_keyboardInputMode: 'adjustResize',
};

const ModalStack = () => {
  const {top} = useSafeAreaInsets();

  const sheetModalScreenOptions = useMemo(
    () => ({
      ...modalScreenOptions,
      // Please note - Having a fixed snap point as first value improves keyboard input focus on Android
      snapPoints: [460, '75%', '100%'],
      style: {
        // Using margin instead of topInset to make the shadow visible when snapped at 100%
        marginTop: top,
      },
      handleIndicatorStyle: {
        backgroundColor: COLORS.GREYDARK,
      },
    }),
    [top],
  );

  const shortSheetModalScreenOptions = useMemo(
    () => ({
      ...sheetModalScreenOptions,
      // Please note - Having a fixed snap point as first value improves keyboard input focus on Android
      snapPoints: [340, '75%', '100%'],
    }),
    [sheetModalScreenOptions],
  );

  const tallSheetModalScreenOptions = useMemo(
    () => ({
      ...sheetModalScreenOptions,
      // Please note - Having a fixed snap point as first value improves keyboard input focus on Android
      snapPoints: [600, '100%'],
    }),
    [sheetModalScreenOptions],
  );

  const fullSheetModalScreenOptions = useMemo(
    () => ({
      ...sheetModalScreenOptions,
      // Please note - Having a fixed snap point as first value improves keyboard input focus on Android
      snapPoints: [800, '100%'],
    }),
    [sheetModalScreenOptions],
  );

  const cardModalScreenOptions = useMemo(
    () => ({
      ...modalScreenOptions,
      snapPoints: [200],
      detached: true,
      bottomInset: 10,
      style: {
        marginHorizontal: 10,
      },
      handleIndicatorStyle: {
        opacity: 0,
      },
    }),
    [],
  );

  return (
    <Navigator>
      <Screen name="OverlayStack" component={OverlayStack} />

      <Group screenOptions={sheetModalScreenOptions}>
        <Screen
          name={'SessionModal'}
          component={SessionModal}
          options={tallSheetModalScreenOptions}
        />
        <Screen
          name={'CompletedSessionModal'}
          component={CompletedSessionModal}
          options={tallSheetModalScreenOptions}
        />
        <Screen
          name={'SharingModal'}
          component={SharingModal}
          options={fullSheetModalScreenOptions}
        />
        <Screen
          name={'SharingPostModal'}
          component={SharingPostModal}
          options={tallSheetModalScreenOptions}
        />
        <Screen
          name={'CreateSessionModal'}
          component={CreateSessionModal}
          options={props =>
            props.route.params.exerciseId
              ? fullSheetModalScreenOptions
              : sheetModalScreenOptions
          }
        />
        <Screen
          name={'SessionUnavailableModal'}
          component={SessionUnavailableModal}
        />
        <Screen name={'ChangeLanguageModal'} component={ChangeLanguageModal} />
        <Screen
          name={'ProfileSettingsModal'}
          component={ProfileSettingsModal}
          options={fullSheetModalScreenOptions}
        />
        <Screen
          name={'HostInfoModal'}
          component={HostInfoModal}
          options={tallSheetModalScreenOptions}
        />

        <Screen name={'ContributorsModal'} component={ContributorsModal} />
        <Screen name={'HostsModal'} component={HostsModal} />
        <Screen name={'PartnersModal'} component={PartnersModal} />
        <Screen name={'DeveloperModal'} component={DeveloperModal} />
        <Screen name={'ContactModal'} component={ContactModal} />
        <Screen
          name={'SignInModal'}
          component={SignInModal}
          options={shortSheetModalScreenOptions}
        />

        <Screen
          name={'DeleteUserModal'}
          component={DeleteUserModal}
          options={shortSheetModalScreenOptions}
        />

        <Screen
          name={'SessionFeedbackModal'}
          component={SessionFeedbackModal}
          options={shortSheetModalScreenOptions}
        />

        <Screen
          name={'UpgradeAccountModal'}
          component={UpgradeAccountModal}
          options={shortSheetModalScreenOptions}
        />

        <Screen
          name={'SafetyToolkitModal'}
          component={SafetyToolkitModal}
          options={shortSheetModalScreenOptions}
        />

        <Screen
          name={'ReportModal'}
          component={ReportModal}
          options={tallSheetModalScreenOptions}
        />
        <Screen
          name={'CalmDownModal'}
          component={CalmDownModal}
          options={tallSheetModalScreenOptions}
        />
        <Screen
          name={'CompletedSessionsModal'}
          component={CompletedSessionsModal}
          options={fullSheetModalScreenOptions}
        />
      </Group>

      <Group screenOptions={cardModalScreenOptions}>
        <Screen
          name={'AddSessionByInviteModal'}
          component={AddSessionByInviteModal}
        />
        <Screen
          name={'RequestPublicHostModal'}
          component={RequestPublicHostModal}
        />
      </Group>
    </Navigator>
  );
};

export default ModalStack;
