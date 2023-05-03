import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  SectionList as RNSectionList,
  SectionListData,
  SectionListRenderItem,
} from 'react-native';
import {
  BottomSheetSectionList as RNBottomSheetSectionList,
  useBottomSheet,
} from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import {groupBy} from 'ramda';

import {CompletedSessionItem} from '../../screens/Journey/types/Section';
import {
  SessionMode,
  SessionType,
} from '../../../../../shared/src/schemas/Session';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Gutters from '../../../lib/components/Gutters/Gutters';
import {CompletedSessionEvent} from '../../../../../shared/src/types/Event';
import {Spacer32, Spacer8} from '../../../lib/components/Spacers/Spacer';

import useCompletedSessions from '../../../lib/sessions/hooks/useCompletedSessions';
import useGetSessionsByFeedback from '../../../lib/user/hooks/useGetSessionsByFeedback';

import SheetModal from '../../../lib/components/Modals/SheetModal';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import JourneyNode, {
  HEIGHT as JOURNEY_NODE_HEIGHT,
} from '../../screens/Journey/components/JourneyNode';
import FeedbackFilters from './components/FeedbackFilters';
import ModeFilters from './components/ModeFilters';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import StickyHeading, {
  HEIGHT as HEADER_HEIGHT,
} from '../../../lib/components/StickyHeading/StickyHeading';
import {SPACINGS} from '../../../lib/constants/spacings';
import getSectionListItemLayout from '../../../lib/utils/getSectionListItemLayout';

const LIST_ITEM_HEIGHT = 110;

type Section = {
  title: string;
  data: CompletedSessionItem[];
};

const BottomSheetSectionList = RNBottomSheetSectionList<
  CompletedSessionItem,
  Section
>;

const renderSectionHeader: (info: {section: Section}) => React.ReactElement = ({
  section: {title},
}) => (
  <StickyHeading backgroundColor={COLORS.PURE_WHITE}>
    <Heading16>{title}</Heading16>
  </StickyHeading>
);

const getItemLayout = getSectionListItemLayout<CompletedSessionItem, Section>({
  getItemHeight: (item, sectionIndex, rowIndex) => {
    switch (item?.type) {
      case 'completedSession':
        const isFirstItem = sectionIndex === 0 && rowIndex === 0;
        return JOURNEY_NODE_HEIGHT - (isFirstItem ? SPACINGS.SIXTEEN : 0);
      default:
        return 0;
    }
  },
  getSectionHeaderHeight: section => (section?.title ? HEADER_HEIGHT : 0),
  listHeaderHeight: () => SPACINGS.TWENTYFOUR,
});

const CompletedSessionsModal = () => {
  const {animatedIndex} = useBottomSheet();
  const {
    params: {filterSetting},
  } = useRoute<RouteProp<ModalStackProps, 'CompletedSessionsModal'>>();
  const {completedSessions, completedHostedSessions} = useCompletedSessions();
  const [selectedMode, setSelectedMode] = useState<
    SessionMode.async | SessionType.public | SessionType.private
  >();
  const [selectedFeedback, setSelectedFeedback] = useState<boolean>();
  const getSessionsByFeedback = useGetSessionsByFeedback();
  const listRef = useRef<RNSectionList<CompletedSessionItem, Section>>(null);
  const [listItems, setListItems] = useState<CompletedSessionEvent[]>([]);

  const data = useMemo(() => {
    let sessions = completedSessions;

    if (filterSetting === 'feedback') {
      sessions = getSessionsByFeedback(selectedFeedback);
    }

    if (filterSetting === 'mode') {
      sessions = completedSessions.filter(({payload}) => {
        if (selectedMode) {
          return selectedMode === SessionMode.async
            ? payload.mode === selectedMode
            : payload.type === selectedMode;
        } else {
          return true;
        }
      });
    }

    if (filterSetting === 'host') {
      sessions = completedHostedSessions;
    }

    setListItems(sessions);
    return Object.entries(
      groupBy(event => dayjs(event.timestamp).format('MMM, YYYY'), sessions),
    ).map(([month, events]) => ({
      title: month,
      data: events.map(event => ({
        data: event,
        type: 'completedSession',
        isLast: sessions.indexOf(event) === sessions.length - 1,
        isFirst: sessions.indexOf(event) === 0,
      })) as CompletedSessionItem[],
    }));
  }, [
    completedHostedSessions,
    completedSessions,
    filterSetting,
    selectedFeedback,
    selectedMode,
    getSessionsByFeedback,
    setListItems,
  ]);

  const filters = useMemo(
    () => (
      <>
        {filterSetting === 'feedback' && (
          <FeedbackFilters
            selectedFeedback={selectedFeedback}
            onChange={setSelectedFeedback}
          />
        )}

        {['mode', 'host'].includes(filterSetting) && (
          <ModeFilters
            completedSessions={
              filterSetting === 'host'
                ? completedHostedSessions
                : completedSessions
            }
            selectedMode={selectedMode}
            onChange={setSelectedMode}
            showAsync={filterSetting !== 'host'}
          />
        )}
      </>
    ),
    [
      filterSetting,
      selectedMode,
      selectedFeedback,
      completedHostedSessions,
      completedSessions,
    ],
  );

  const renderItem = useCallback<
    SectionListRenderItem<CompletedSessionItem, Section>
  >(
    ({item}) => (
      <Gutters key={item.id}>
        <JourneyNode
          completedSessionEvent={item.data}
          isLast={item.isLast}
          isFirst={item.isFirst}
        />
      </Gutters>
    ),
    [],
  );

  const footer = useMemo(
    () => (
      <>
        <Spacer8 />
        {filters}
        <Spacer32 />
        <Spacer32 />
      </>
    ),
    [filters],
  );

  useEffect(() => {
    if (animatedIndex.value > -1) {
      const lastSectionIndex = data.length - 1;
      const lastItemIndex = data[lastSectionIndex].data.length - 1;

      listRef.current?.scrollToLocation({
        itemIndex: lastItemIndex,
        sectionIndex: lastSectionIndex,
        animated: true,
      });
    }
  }, [data, animatedIndex.value]);

  return (
    <SheetModal backgroundColor={COLORS.PURE_WHITE}>
      <BottomSheetSectionList
        ref={listRef}
        sections={data}
        focusHook={useIsFocused}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListFooterComponent={listItems.length <= 5 ? footer : null}
      />
      {listItems.length > 5 && footer}
    </SheetModal>
  );
};

export default CompletedSessionsModal;
