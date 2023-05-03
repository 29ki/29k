import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  SectionList as RNSectionList,
  RefreshControl,
  SectionListRenderItem,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {useNavigation, useScrollToTop} from '@react-navigation/native';
import {findLastIndex} from 'ramda';

import getSectionListItemLayout from '../../../lib/utils/getSectionListItemLayout';

import {
  ModalStackProps,
  OverlayStackProps,
} from '../../../lib/navigation/constants/routes';
import {SPACINGS} from '../../../lib/constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';

import useSessions from '../../../lib/sessions/hooks/useSessions';
import useSections from './hooks/useSections';

import {
  Spacer16,
  Spacer24,
  Spacer28,
  Spacer48,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import Gutters from '../../../lib/components/Gutters/Gutters';
import Screen from '../../../lib/components/Screen/Screen';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import SessionCard from '../../../lib/components/Cards/SessionCard/SessionCard';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import TopBar from '../../../lib/components/TopBar/TopBar';
import MiniProfile from '../../../lib/components/MiniProfile/MiniProfile';
import CollectionCardContainer from './components/CollectionCardContainer';
import BottomFade from '../../../lib/components/BottomFade/BottomFade';
import SessionFilters from './components/SessionFilters';

import StickyHeading, {
  HEIGHT as HEADER_HEIGHT,
} from '../../../lib/components/StickyHeading/StickyHeading';
import JourneyNode, {
  HEIGHT as JOURNEY_NODE_HEIGHT,
} from './components/JourneyNode';
import {HEIGHT as FILTER_HEIGHT} from './components/SessionFilters';
import {HEIGHT as COLLECTION_HEIGHT} from '../../../lib/components/Cards/CollectionCards/CollectionFullCard';
import {HEIGHT as PLANNED_SESSION_HEIGHT} from '../../../lib/components/Cards/Card';

import {Section, Item} from './types/Section';

const SectionList = styled(RNSectionList<Item, Section>)({
  flex: 1,
});

const Container = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});

const renderSectionHeader: (info: {
  section: Section;
}) => React.ReactElement | null = ({section: {title}}) =>
  title ? (
    <StickyHeading backgroundColor={COLORS.PURE_WHITE}>
      <Heading16>{title}</Heading16>
    </StickyHeading>
  ) : null;

const getItemLayout = getSectionListItemLayout<Item, Section>({
  getItemHeight: (item, sectionIndex, rowIndex) => {
    switch (item?.type) {
      case 'completedSession':
        const isFirstItem = sectionIndex === 0 && rowIndex === 0;
        return JOURNEY_NODE_HEIGHT - (isFirstItem ? SPACINGS.SIXTEEN : 0);
      case 'filter':
        return FILTER_HEIGHT + SPACINGS.TWENTYEIGHT * 2;
      case 'pinnedCollection':
        return COLLECTION_HEIGHT + SPACINGS.SIXTEEN;
      case 'plannedSession':
        return PLANNED_SESSION_HEIGHT + SPACINGS.SIXTEEN;
      default:
        return 0;
    }
  },
  getSectionHeaderHeight: section => (section?.title ? HEADER_HEIGHT : 0),
  listHeaderHeight: () => SPACINGS.TWENTYFOUR,
});

const Journey = () => {
  const {t} = useTranslation('Screen.Journey');
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ModalStackProps>
    >();
  const {fetchSessions} = useSessions();
  const sections = useSections();
  const [isLoading, setIsLoading] = useState(false);

  const listRef = useRef<RNSectionList<Item, Section>>(null);
  const filtersScrollIndex = useRef({sectionIndex: 0, itemIndex: 0});

  const scrollToFiltersSection = useCallback((animated = false) => {
    listRef.current?.scrollToLocation({
      ...filtersScrollIndex.current,
      viewOffset: -(FILTER_HEIGHT / 2),
      viewPosition: 0.5, // Center of the screen
      animated,
    });
  }, []);

  useEffect(() => {
    const filtersSectionIndex = findLastIndex(
      ({type}) => type === 'filters',
      sections,
    );

    filtersScrollIndex.current =
      filtersSectionIndex > -1
        ? {
            sectionIndex: filtersSectionIndex,
            itemIndex: 0,
          }
        : {sectionIndex: 0, itemIndex: 0};

    scrollToFiltersSection();
  }, [scrollToFiltersSection, sections]);

  useScrollToTop(
    useRef({
      scrollToTop: () => scrollToFiltersSection(true),
    }),
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const refreshPull = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetchSessions();
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      throw e;
    }
  }, [setIsLoading, fetchSessions]);

  const onPressEllipsis = useCallback(() => {
    navigate('AboutOverlay');
  }, [navigate]);

  const renderSession = useCallback<SectionListRenderItem<Item, Section>>(
    ({item}) => {
      switch (item.type) {
        case 'completedSession':
          return (
            <Gutters>
              <JourneyNode
                completedSessionEvent={item.data}
                isLast={item.isLast}
                isFirst={item.isFirst}
              />
            </Gutters>
          );

        case 'filter':
          return (
            <Gutters>
              <Spacer28 />
              <SessionFilters />
              <Spacer28 />
            </Gutters>
          );

        case 'pinnedCollection':
          return (
            <Gutters>
              <CollectionCardContainer collectionId={item.id} />
              <Spacer16 />
            </Gutters>
          );

        case 'plannedSession':
          return (
            <Gutters>
              <SessionCard session={item.data} />
              <Spacer16 />
            </Gutters>
          );
      }
    },
    [],
  );

  if (!sections.length) {
    return (
      <Screen backgroundColor={COLORS.GREYLIGHTEST}>
        <TopSafeArea minSize={SPACINGS.SIXTEEN} />
        <TopBar
          backgroundColor={COLORS.GREYLIGHTEST}
          onPressEllipsis={onPressEllipsis}>
          <MiniProfile />
        </TopBar>
        <Container>
          <Display24>{t('fallback')}</Display24>
        </Container>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />
      <TopBar
        backgroundColor={COLORS.PURE_WHITE}
        onPressEllipsis={onPressEllipsis}>
        <MiniProfile />
      </TopBar>
      <SectionList
        ref={listRef}
        sections={sections}
        getItemLayout={getItemLayout}
        keyExtractor={session => session.id}
        ListHeaderComponent={Spacer24}
        ListFooterComponent={Spacer48}
        stickySectionHeadersEnabled
        renderSectionHeader={renderSectionHeader}
        renderItem={renderSession}
        initialNumToRender={5}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshPull} />
        }
      />
      <Spacer16 />
      <BottomFade />
    </Screen>
  );
};

export default Journey;
