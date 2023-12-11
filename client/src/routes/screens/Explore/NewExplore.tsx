import React, {useCallback} from 'react';
import AutoScrollView from '../../../lib/components/AutoScrollView/AutoScrollView';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import {
  Spacer16,
  Spacer28,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
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
import {Columns, Column} from './components/Columns';
import {useTranslation} from 'react-i18next';
import Category from './components/Category';
import Collection from './components/Collection';
import Tag from './components/Tag';

const Explore = () => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ExploreStackProps>
    >();
  const {t} = useTranslation('Screen.Explore');

  const categories = useCategories();
  const collections = useCollections();
  const tags = useTags();

  const onPressEllipsis = useCallback(() => {
    navigate('AboutOverlay');
  }, [navigate]);

  const onPressCategory = useCallback(
    (categoryId: string) => () => {
      navigate('ExploreCategory', {categoryId});
    },
    [navigate],
  );

  const onPressCollection = useCallback(
    (collectionId: string) => () => {
      navigate('Collection', {collectionId});
    },
    [navigate],
  );

  const onPressTag = useCallback(
    (tagId: string) => () => {
      navigate('ExploreTag', {tagId});
    },
    [navigate],
  );

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <TopSafeArea />
      <TopBar
        backgroundColor={COLORS.PURE_WHITE}
        onPressEllipsis={onPressEllipsis}>
        <MiniProfile />
      </TopBar>
      <AutoScrollView stickyHeaderIndices={[2, 4, 6]}>
        <Spacer16 />
        <Columns>
          {categories.map(category => (
            <Column key={category.id}>
              <Category
                category={category}
                onPress={onPressCategory(category.id)}
              />
            </Column>
          ))}
        </Columns>
        <StickyHeading>
          <Heading16>{t('collectionsHeading')}</Heading16>
        </StickyHeading>
        <Columns>
          {collections.map(collection => (
            <Column key={collection.id}>
              <Collection
                collection={collection}
                onPress={onPressCollection(collection.id)}
              />
            </Column>
          ))}
        </Columns>
        <StickyHeading>
          <Heading16>{t('skillsHeading')}</Heading16>
        </StickyHeading>
        <Columns>
          {tags.map(tag => (
            <Column key={tag.id}>
              <Tag tag={tag} onPress={onPressTag(tag.id)} />
            </Column>
          ))}
        </Columns>
        <Spacer28 />
      </AutoScrollView>
      <BottomFade />
    </Screen>
  );
};

export default Explore;
