import React, {useEffect} from 'react';
import {ListRenderItemInfo, Platform, RefreshControl} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {useRecoilValue} from 'recoil';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

import useTemples from './hooks/useTemples';

import {
  Spacer12,
  Spacer16,
  Spacer60,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import Gutters from '../../common/components/Gutters/Gutters';
import Button from '../../common/components/Buttons/Button';
import NS from '../../lib/i18n/constants/namespaces';
import {isLoadingAtom, templesAtom} from './state/state';
import {Temple} from '../../../../shared/src/types/Temple';
import TempleCard from '../../common/components/Cards/TempleCard/TempleCard';
import SETTINGS from '../../common/constants/settings';
import {PlusIcon} from '../../common/components/Icons';
import {GUTTERS, SPACINGS} from '../../common/constants/spacings';
import {COLORS} from '../../common/constants/colors';
import {ModalStackProps} from '../../common/constants/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

const Wrapper = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.select({ios: 'position'}),
  contentContainerStyle: {flex: 1},
  backgroundColor: COLORS.PURE_WHITE,
})({flex: 1});

const CreateButton = styled(Button)({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const CreateTempleWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  ...SETTINGS.BOXSHADOW,
});

const FloatingForm = styled(LinearGradient).attrs({
  colors: ['rgba(249, 248, 244, 0)', 'rgba(249, 248, 244, 1)'],
})({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  paddingHorizontal: GUTTERS.BIG,
  paddingTop: SPACINGS.TWENTYFOUR,
  passingBottom: SPACINGS.TWELVE,
});

const ListHeader = () => (
  <>
    <TopSafeArea />
    <Spacer16 />
  </>
);

const CreateTempleForm = ({}) => {
  const {t} = useTranslation(NS.SCREEN.TEMPLES);
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  return (
    <CreateTempleWrapper>
      <CreateButton
        onPress={() => navigate('CreateTempleModal')}
        LeftIcon={PlusIcon}>
        {t('create')}
      </CreateButton>
    </CreateTempleWrapper>
  );
};

const Temples = () => {
  const {fetchTemples} = useTemples();
  const isLoading = useRecoilValue(isLoadingAtom);
  const temples = useRecoilValue(templesAtom);

  useEffect(() => {
    fetchTemples();
  }, [fetchTemples]);

  const renderTemple = ({item}: ListRenderItemInfo<Temple>) => (
    <Gutters>
      <TempleCard temple={item} />
    </Gutters>
  );

  return (
    <Wrapper>
      <FlatList
        data={temples}
        keyExtractor={temple => temple.id}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={Spacer60}
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
    </Wrapper>
  );
};

export default Temples;
