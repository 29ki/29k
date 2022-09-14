import React, {useEffect, useState} from 'react';
import {ListRenderItemInfo, RefreshControl} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import Animated, {FlipInXUp, FlipOutXDown} from 'react-native-reanimated';

import useTemples from './hooks/useTemples';
import {RootStackProps} from '../../common/constants/routes';

import {
  Spacer12,
  Spacer16,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import Gutters from '../../common/components/Gutters/Gutters';
import Button from '../../common/components/Buttons/Button';
import NS from '../../lib/i18n/constants/namespaces';
import {isLoadingAtom, templesAtom} from './state/state';
import {Temple} from '../../../../shared/src/types/Temple';
import TempleCard from '../../common/components/Cards/TempleCard/TempleCard';
import TextInput from '../../common/components/Typography/TextInput/TextInput';
import {COLORS} from '../../common/constants/colors';
import SETTINGS from '../../common/constants/settings';
import {Plus} from '../../common/components/Icons';

const CreateButton = styled(Button)({
  backgroundColor: COLORS.GREEN,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const CreateTempleWrapper = styled(Animated.View)({
  flexDirection: 'row',
  justifyContent: 'center',
  ...SETTINGS.BOXSHADOW,
});

const FloatingForm = styled(Gutters)({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
});

const CreateTempleForm = ({}) => {
  const {t} = useTranslation(NS.SCREEN.TEMPLES);
  const [isAdding, setIsAdding] = useState(false);
  const [templeName, setTempleName] = useState<string>();
  const {addTemple} = useTemples();

  return isAdding ? (
    <CreateTempleWrapper entering={FlipInXUp} exiting={FlipOutXDown} key="in">
      <TextInput
        onChangeText={setTempleName}
        placeholder={t('createPlaceholder')}
      />
      <Spacer8 />
      <CreateButton
        onPress={async () => {
          await addTemple(templeName);
          setIsAdding(false);
        }}>
        {t('create')}
      </CreateButton>
    </CreateTempleWrapper>
  ) : (
    <CreateTempleWrapper entering={FlipInXUp} exiting={FlipOutXDown} key="out">
      <CreateButton onPress={() => setIsAdding(true)} LeftIcon={Plus}>
        {t('create')}
      </CreateButton>
    </CreateTempleWrapper>
  );
};

const Temples = () => {
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
      <FlatList
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
      <FloatingForm>
        <CreateTempleForm />
        <Spacer12 />
      </FloatingForm>
    </>
  );
};

export default Temples;
