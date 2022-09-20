import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useEffect} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

import NS from '../../../lib/i18n/constants/namespaces';
import {TabNavigatorProps} from '../../../common/constants/routes';

type ScreenNavigationProps = NativeStackNavigationProp<TabNavigatorProps>;

const useConfirmExitTemple = () => {
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
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => {
            navigation.navigate('Temples');
          },
        },
      ]);
    });
  }, [navigation, t]);
};

export default useConfirmExitTemple;
