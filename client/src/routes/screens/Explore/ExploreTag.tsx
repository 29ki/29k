import React from 'react';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Screen from '../../../lib/components/Screen/Screen';
import {ExploreStackProps} from '../../../lib/navigation/constants/routes';
import Gutters from '../../../lib/components/Gutters/Gutters';
import useTagById from '../../../lib/content/hooks/useTagById';
import AutoScrollView from '../../../lib/components/AutoScrollView/AutoScrollView';
import BottomFade from '../../../lib/components/BottomFade/BottomFade';

const ExploreTag = () => {
  const {
    params: {tagId},
  } = useRoute<RouteProp<ExploreStackProps, 'ExploreTag'>>();
  const {goBack} = useNavigation();

  const tag = useTagById(tagId);

  return (
    <Screen
      onPressBack={goBack}
      backgroundColor={COLORS.PURE_WHITE}
      title={tag?.name}>
      <AutoScrollView>
        <Gutters></Gutters>
      </AutoScrollView>
      <BottomFade />
    </Screen>
  );
};

export default ExploreTag;
