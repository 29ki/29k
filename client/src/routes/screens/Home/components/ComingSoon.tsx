import {pick} from 'ramda';
import React from 'react';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import {Spacer16, Spacer24} from '../../../../lib/components/Spacers/Spacer';
import {SPACINGS} from '../../../../lib/constants/spacings';
import {ListRenderItem} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Body14, Body12} from '../../../../lib/components/Typography/Body/Body';
import {Display14} from '../../../../lib/components/Typography/Display/Display';
import hexToRgba from 'hex-to-rgba';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {ComingSoonHeading, ComingSoonItem, ComingSoon} from '../Home';
import {COLORS} from '../../../../../../shared/src/constants/colors';

const ComingSoonList = styled(FlatList)({
  flexGrow: 0,
  width: '100%',
  overflow: 'visible',
}) as unknown as FlatList;

const CardContainer = styled.View({width: 136, marginTop: -5, minHeight: 92});
const CardTag = styled.View({
  position: 'absolute',
  top: -8,
  backgroundColor: 'black',
  borderRadius: 4,
  paddingVertical: 2,
  paddingHorizontal: 4,
  left: -12,
});
const Tag = styled(Body12)({
  color: COLORS.PURE_WHITE,
});
const Description = styled.View({width: 143, marginRight: SPACINGS.SIXTEEN});

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
});

const renderComingSoonItem: ListRenderItem<
  ComingSoonHeading | ComingSoonItem
> = ({item}) => {
  console.log(item);
  if ((item as ComingSoonHeading).heading) {
    return (
      <Description>
        <Body14>{(item as ComingSoonHeading).description}</Body14>
      </Description>
    );
  } else {
    return (
      <CardContainer>
        <ComingSoonGradient>
          <Display14>{(item as ComingSoonItem).what}</Display14>
        </ComingSoonGradient>
        <CardTag>
          <Tag>{(item as ComingSoonItem).when}</Tag>
        </CardTag>
      </CardContainer>
    );
  }
};

const ComingSoonSlider: React.FC<{comingSoonSection: ComingSoon}> = ({
  comingSoonSection,
}) => {
  console.log([
    pick(['heading', 'description'], comingSoonSection),
    ...comingSoonSection.items,
  ]);
  return (
    <Gutters>
      <ComingSoonList
        horizontal
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={200 + SPACINGS.SIXTEEN}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={Spacer16}
        data={[
          pick(['heading', 'description'], comingSoonSection),
          ...comingSoonSection.items,
        ]}
        renderItem={renderComingSoonItem}
      />
      <Spacer24 />
    </Gutters>
  );
};

export default ComingSoonSlider;
