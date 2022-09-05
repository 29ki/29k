import React, {useEffect, useState} from 'react';
import {FlatListProps, ListRenderItemInfo, RefreshControl} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components';

import useTemples from './hooks/useTemples';
import {
  RootStackProps,
  RootStackRoutes,
  TempleStackRoutes,
} from '../../common/constants/routes';

import {
  Spacer16,
  Spacer28,
  Spacer32,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import Gutters from '../../common/components/Gutters/Gutters';
import {H3} from '../../common/components/Typography/Heading/Heading';
import Button from '../../common/components/Buttons/Button';
import NS from '../../lib/i18n/constants/namespaces';
import {isLoadingAtom, templesAtom} from './state/state';
import {Temple} from '../../../../shared/src/types/Temple';
import TempleCard from '../../common/components/Cards/TempleCard/TempleCard';
import TextInput from '../../common/components/Typography/TextInput/TextInput';

const TempleList = styled(FlatList)<FlatListProps<Temple>>({
  overflow: 'visible',
});

const Temples = () => {
  const {t} = useTranslation(NS.SCREEN.TEMPLES);
  const {fetchTemples, addTemple} = useTemples();
  const isLoading = useRecoilValue(isLoadingAtom);
  const temples = useRecoilValue(templesAtom);

  const [newTemple, setNewTemple] = useState<string | null>(null);
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackProps, 'TempleStack'>>();

  useEffect(() => {
    fetchTemples();
  }, [fetchTemples]);

  const renderTemple = ({item}: ListRenderItemInfo<Temple>) => (
    <Gutters>
      <TempleCard
        temple={item}
        graphicSrc="https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png"
        time="This session will start on saturday at 13.00"
        buttonText="Join"
        onPress={() =>
          navigate(RootStackRoutes.TEMPLE_STACK, {
            screen: TempleStackRoutes.CHANGING_ROOM,
            params: {
              templeId: item.id,
            },
          })
        }
      />
    </Gutters>
  );

  return (
    <>
      <TopSafeArea />
      <Gutters>
        <H3>{t('heading')}</H3>
      </Gutters>

      <Spacer16 />
      <TempleList
        data={temples}
        keyExtractor={temple => temple.id}
        ItemSeparatorComponent={Spacer16}
        renderItem={renderTemple}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchTemples}
            tintColor="white"
          />
        }
      />
      <Spacer32 />
      <Gutters>
        <TextInput
          onChangeText={setNewTemple}
          placeholder={t('createPlaceholder')}
        />
        <Spacer8 />
        <Button primary onPress={() => addTemple(newTemple)}>
          {t('create')}
        </Button>
      </Gutters>
      <Spacer28 />
    </>
  );
};

export default Temples;
