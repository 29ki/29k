import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useContext, useEffect} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

import NS from '../../../lib/i18n/constants/namespaces';
import {TabNavigatorProps} from '../../../common/constants/routes';
import {DailyContext} from '../DailyProvider';

type ScreenNavigationProps = NativeStackNavigationProp<TabNavigatorProps>;

const useConfirmExitTemple = () => {
  const {leaveMeeting} = useContext(DailyContext);
  const navigation = useNavigation<ScreenNavigationProps>();
  const {t} = useTranslation(NS.COMPONENT.CONFIRM_EXIT_TEMPLE);

  useEffect(() => {
    return navigation.addListener('beforeRemove', e => {
      e.preventDefault();

      Alert.alert(t('header'), t('text'), [
        {text: t('buttons.cancel'), style: 'cancel', onPress: () => {}},
        {
          text: t('buttons.confirm'),
          style: 'destructive',

          onPress: async () => {
            await leaveMeeting();
            navigation.navigate('Temples');
          },
        },
      ]);
    });
  }, [navigation, t, leaveMeeting]);
};

export default useConfirmExitTemple;
