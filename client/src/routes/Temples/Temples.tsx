import React, {useEffect, useState} from 'react';
import {ListRenderItemInfo, RefreshControl} from 'react-native';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import useTemples from './hooks/useTemples';
import {ROUTES, ScreenProps} from '../../common/constants/routes';

import {
  Spacer16,
  Spacer32,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import Gutters from '../../common/components/Gutters/Gutters';
import {H3} from '../../common/components/Typography/Heading/Heading';
import Button from '../../common/components/Buttons/Button';
import NS from '../../lib/i18n/constants/namespaces';
import {useTranslation} from 'react-i18next';
import {useRecoilValue} from 'recoil';
import {isLoadingAtom, templesAtom} from './state/state';
import {Temple} from '../../../../shared/src/types/Temple';
import TempleCard from '../../common/components/Cards/TempleCard/TempleCard';

type ScreenNavigationProps = NativeStackNavigationProp<ScreenProps>;

const Temples = () => {
  const {t} = useTranslation(NS.SCREEN.TEMPLES);
  const {fetchTemples, addTemple} = useTemples();
  const isLoading = useRecoilValue(isLoadingAtom);
  const temples = useRecoilValue(templesAtom);

  const [newTemple, onChangeNewTemple] = useState<string | null>(null);
  const {navigate} = useNavigation<ScreenNavigationProps>();
  const lottieSource = require('../../assets/animations/mandala.json');

  const renderTemple = ({item}: ListRenderItemInfo<Temple>) => (
    <TempleCard
      temple={item}
      lottieSrc={lottieSource}
      time="This session will start on saturday at 13.00"
      buttonText="Join"
      onPress={() => navigate(ROUTES.TEMPLE, {templeId: item.id})}
    />
  );

  useEffect(() => {
    fetchTemples();
  }, [fetchTemples]);

  return (
    <>
      <TopSafeArea />
      <Gutters>
        <H3>{t('heading')}</H3>
        <Spacer16 />
        <FlatList
          data={temples}
          keyExtractor={temple => temple.id}
          ItemSeparatorComponent={Spacer16}
          renderItem={renderTemple}
          style={{overflow: 'visible'}}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchTemples}
              tintColor="white"
            />
          }
        />
        <Spacer32 />
        <TextInput
          placeholder={t('createPlaceholder')}
          onChangeText={onChangeNewTemple}
        />
        <Spacer8 />
        <Button primary onPress={() => addTemple(newTemple)}>
          {t('create')}
        </Button>
      </Gutters>
    </>
  );
};

export default Temples;
