import {useCallback, useContext} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useResetRecoilState} from 'recoil';

import * as NS from '../../../../../shared/src/constants/namespaces';
import {DailyContext} from '../DailyProvider';
import {sessionAtom} from '../state/state';
import {TabNavigatorProps} from '../../../common/constants/routes';

type ScreenNavigationProps = NativeStackNavigationProp<TabNavigatorProps>;

const useLeaveSession = () => {
  const {t} = useTranslation(NS.COMPONENT.CONFIRM_EXIT_SESSION);
  const {leaveMeeting} = useContext(DailyContext);
  const {navigate} = useNavigation<ScreenNavigationProps>();

  const resetSession = useResetRecoilState(sessionAtom);

  const leaveSession = useCallback(async () => {
    await leaveMeeting();
    resetSession();
    navigate('Sessions');
  }, [leaveMeeting, resetSession, navigate]);

  const leaveSessionWithConfirm = useCallback(async () => {
    Alert.alert(t('header'), t('text'), [
      {text: t('buttons.cancel'), style: 'cancel', onPress: () => {}},
      {
        text: t('buttons.confirm'),
        style: 'destructive',

        onPress: leaveSession,
      },
    ]);
  }, [t, leaveSession]);

  return {leaveSession, leaveSessionWithConfirm};
};

export default useLeaveSession;
