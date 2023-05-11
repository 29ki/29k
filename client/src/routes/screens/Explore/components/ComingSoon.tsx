import {pick} from 'ramda';
import React from 'react';
import {Spacer16} from '../../../../lib/components/Spacers/Spacer';
import {SPACINGS} from '../../../../lib/constants/spacings';
import {ListRenderItem} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Body14, Body12} from '../../../../lib/components/Typography/Body/Body';
import {Display14} from '../../../../lib/components/Typography/Display/Display';
import hexToRgba from 'hex-to-rgba';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {ComingSoonItem, ComingSoon} from '../Explore';

type ComingSoonDescription = {
  description: string;
};

const TAG_TOP_SPACING = 10;

const ComingSoonList = styled(FlatList)({
  flexGrow: 0,
  width: '100%',
  overflow: 'visible',
  marginTop: -TAG_TOP_SPACING / 2,
}) as unknown as FlatList;

const CardContainer = styled.View({
  width: 136,
  marginTop: 2,
  minHeight: 92,
  alignItems: 'flex-start',
});

const CardTag = styled.View({
  backgroundColor: COLORS.BLACK,
  borderRadius: 4,
  paddingVertical: 2,
  paddingHorizontal: 4,
  left: -SPACINGS.TWELVE,
  zIndex: 2,
});
const Tag = styled(Body12)({
  color: COLORS.PURE_WHITE,
});
const Description = styled.View({
  width: 143,
  marginRight: SPACINGS.SIXTEEN,
  marginTop: TAG_TOP_SPACING,
});

const ComingSoonGradient = styled(LinearGradient).attrs({
  colors: [
    hexToRgba('#E3D8C1', 0.6),
    hexToRgba('#FACBA0', 0.6),
    hexToRgba('#F1B09960', 0.6),
  ],
})({
  borderRadius: 10,
  flex: 1,
  justifyContent: 'center',
  padding: 15,
  marginTop: -TAG_TOP_SPACING,
  zIndex: 1,
  width: '100%',
});

const renderComingSoonItem: ListRenderItem<
  ComingSoonDescription | ComingSoonItem
> = ({item}) => {
  if ((item as ComingSoonDescription).description) {
    return (
      <Description>
        <Body14>{(item as ComingSoonDescription).description}</Body14>
      </Description>
    );
  } else {
    return (
      <CardContainer>
        <CardTag>
          <Tag>{(item as ComingSoonItem).when}</Tag>
        </CardTag>
        <ComingSoonGradient>
          <Display14>{(item as ComingSoonItem).what}</Display14>
        </ComingSoonGradient>
      </CardContainer>
    );
  }
};

const ComingSoonSlider: React.FC<{comingSoonSection: ComingSoon}> = ({
  comingSoonSection,
}) => (
  <ComingSoonList
    horizontal
    snapToAlignment="center"
    decelerationRate="fast"
    showsHorizontalScrollIndicator={false}
    ItemSeparatorComponent={Spacer16}
    data={[
      pick(['heading', 'description'], comingSoonSection),
      ...comingSoonSection.items,
    ]}
    renderItem={renderComingSoonItem}
  />
);

export default ComingSoonSlider;
