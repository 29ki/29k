import {useContext} from 'react';
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

const useLeaveTemple = (confirm: boolean = true) => {
  const {t} = useTranslation(NS.COMPONENT.CONFIRM_EXIT_TEMPLE);
  const {leaveMeeting} = useContext(DailyContext);
  const navigation = useNavigation<ScreenNavigationProps>();

  const resetTemple = useResetRecoilState(templeAtom);

  const onConfirm = async () => {
    await leaveMeeting();
    resetTemple();
    navigation.navigate('Temples');
  };

  if (confirm) {
    return async () => {
      Alert.alert(t('header'), t('text'), [
        {text: t('buttons.cancel'), style: 'cancel', onPress: () => {}},
        {
          text: t('buttons.confirm'),
          style: 'destructive',

          onPress: onConfirm,
        },
      ]);
    };
  }

  return onConfirm;
};

export default useLeaveTemple;
