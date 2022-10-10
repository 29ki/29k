import {useCallback, useContext} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useResetRecoilState} from 'recoil';

import NS from '../../../lib/i18n/constants/namespaces';
import {DailyContext} from '../DailyProvider';
import {templeAtom} from '../state/state';
import {TabNavigatorProps} from '../../../common/constants/routes';

type ScreenNavigationProps = NativeStackNavigationProp<TabNavigatorProps>;

const useLeaveTemple = () => {
  const {t} = useTranslation(NS.COMPONENT.CONFIRM_EXIT_TEMPLE);
  const {leaveMeeting} = useContext(DailyContext);
  const {navigate} = useNavigation<ScreenNavigationProps>();

  const resetTemple = useResetRecoilState(templeAtom);

  const leaveTemple = useCallback(async () => {
    await leaveMeeting();
    resetTemple();
    navigate('Temples');
  }, [leaveMeeting, resetTemple, navigate]);

  const leaveTempleWithConfirm = useCallback(async () => {
    Alert.alert(t('header'), t('text'), [
      {text: t('buttons.cancel'), style: 'cancel', onPress: () => {}},
      {
        text: t('buttons.confirm'),
        style: 'destructive',

        onPress: leaveTemple,
      },
    ]);
  }, [t, leaveTemple]);

  return {leaveTemple, leaveTempleWithConfirm};
};

export default useLeaveTemple;
