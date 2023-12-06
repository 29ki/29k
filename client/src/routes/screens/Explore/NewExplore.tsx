import React, {useCallback} from 'react';
import AutoScrollView from '../../../lib/components/AutoScrollView/AutoScrollView';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import {Spacer28, TopSafeArea} from '../../../lib/components/Spacers/Spacer';
import Screen from '../../../lib/components/Screen/Screen';
import {COLORS} from '../../../../../shared/src/constants/colors';
import BottomFade from '../../../lib/components/BottomFade/BottomFade';
import TopBar from '../../../lib/components/TopBar/TopBar';
import MiniProfile from '../../../lib/components/MiniProfile/MiniProfile';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ExploreStackProps,
  OverlayStackProps,
} from '../../../lib/navigation/constants/routes';
import useCategories from '../../../lib/content/hooks/useCategories';
import useCollections from '../../../lib/content/hooks/useCollections';
import useTags from '../../../lib/content/hooks/useTags';
import {Choices, Choice, Category, Label, Collection, Tag} from './Choices';

const Explore = () => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ExploreStackProps>
    >();

  const categories = useCategories();
  const collections = useCollections();
  const tags = useTags();

  const onPressEllipsis = useCallback(() => {
    navigate('AboutOverlay');
  }, [navigate]);

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <TopSafeArea />
      <TopBar
        backgroundColor={COLORS.PURE_WHITE}
        onPressEllipsis={onPressEllipsis}>
        <MiniProfile />
      </TopBar>
      <AutoScrollView stickyHeaderIndices={[0, 2, 4, 6]}>
        <StickyHeading>
          <Heading16>Explore</Heading16>
        </StickyHeading>
        <Choices>
          {categories.map(category => (
            <Choice
              key={category.id}
              onPress={() =>
                navigate('ExploreCategory', {categoryId: category.id})
              }>
              <Category>
                <Label>{category.name}</Label>
              </Category>
            </Choice>
          ))}
        </Choices>
        <StickyHeading>
          <Heading16>Collections</Heading16>
        </StickyHeading>
        <Choices>
          {collections.map(collection => (
            <Choice
              key={collection.id}
              onPress={() =>
                navigate('Collection', {collectionId: collection.id})
              }>
              <Collection>
                <Label>{collection.name}</Label>
              </Collection>
            </Choice>
          ))}
        </Choices>
        <StickyHeading>
          <Heading16>Skills</Heading16>
        </StickyHeading>
        <Choices>
          {tags.map(tag => (
            <Choice
              key={tag.id}
              onPress={() => navigate('ExploreTag', {tagId: tag.id})}>
              <Tag>
                <Label>{tag.name}</Label>
              </Tag>
            </Choice>
          ))}
        </Choices>
        <Spacer28 />
      </AutoScrollView>
      <BottomFade />
    </Screen>
  );
};

export default Explore;
