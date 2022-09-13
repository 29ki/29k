import React, {useEffect} from 'react';
import {FlatListProps, ListRenderItemInfo, RefreshControl} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components';

import useTemples from './hooks/useTemples';
import {RootStackProps} from '../../common/constants/routes';

import {
  Spacer16,
  Spacer28,
  Spacer32,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import Gutters from '../../common/components/Gutters/Gutters';
import {H3} from '../../common/components/Typography/Heading/Heading';
import Button from '../../common/components/Buttons/Button';
import NS from '../../lib/i18n/constants/namespaces';
import {isLoadingAtom, templesAtom} from './state/state';
import {Temple} from '../../../../shared/src/types/Temple';
import TempleCard from '../../common/components/Cards/TempleCard/TempleCard';
import {COLORS} from '../../common/constants/colors';

const CreateButton = styled(Button)({
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.16)',
  backgroundColor: COLORS.GREEN,
});

const TempleList = styled(FlatList)<FlatListProps<Temple>>({
  overflow: 'visible',
});

const Temples = () => {
  const {t} = useTranslation(NS.SCREEN.TEMPLES);
  const {fetchTemples, deleteTemple} = useTemples();
  const isLoading = useRecoilValue(isLoadingAtom);
  const temples = useRecoilValue(templesAtom);

  const {navigate} = useNavigation<NativeStackNavigationProp<RootStackProps>>();

  useEffect(() => {
    fetchTemples();
  }, [fetchTemples]);

  const renderTemple = ({item}: ListRenderItemInfo<Temple>) => (
    <Gutters>
      <TempleCard
        temple={item}
        image={{
          uri: 'https://res.cloudinary.com/twentyninek/image/upload/v1646061249/Illustrations_Tests/take-test_c4qa3u.png',
        }}
        time="This session will start on saturday at 13.00"
        buttonText="Join"
        onPress={() =>
          navigate('TempleStack', {
            screen: 'ChangingRoom',
            params: {
              templeId: item.id,
            },
          })
        }
      />
      {__DEV__ && (
        <Button
          onPress={() => deleteTemple(item.id)}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{position: 'absolute', right: 10, top: -2}}>
          {'x'}
        </Button>
      )}
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
        <CreateButton primary={false} onPress={() => navigate('CreateTemple')}>
          {t('create')}
        </CreateButton>
      </Gutters>
      <Spacer28 />
    </>
  );
};

export default Temples;
