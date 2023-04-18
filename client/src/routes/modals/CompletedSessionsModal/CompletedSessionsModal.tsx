import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  SectionList as RNSectionList,
  SectionListData,
  SectionListRenderItem,
} from 'react-native';
import {BottomSheetSectionList, useBottomSheet} from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import {groupBy} from 'ramda';

import Gutters from '../../../lib/components/Gutters/Gutters';

import SheetModal from '../../../lib/components/Modals/SheetModal';

import {ModalStackProps} from '../../../lib/navigation/constants/routes';

import {CompletedSessionEvent} from '../../../../../shared/src/types/Event';
import useCompletedSessions from '../../../lib/sessions/hooks/useCompletedSessions';

import JourneyNode from '../../screens/Journey/components/JourneyNode';

import {Spacer12, Spacer32} from '../../../lib/components/Spacers/Spacer';

import {
  SessionMode,
  SessionType,
} from '../../../../../shared/src/types/Session';
import useGetSessionsByFeedback from './hooks/useGetSessionsByFeedback';
import FeedbackFilters from './components/FeedbackFilters';
import ModeFilters from './components/ModeFilters';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import {COLORS} from '../../../../../shared/src/constants/colors';

const LIST_ITEM_HEIGHT = 110;

type Section = {
  title: string;
  data: CompletedSessionEvent[];
};

const renderSectionHeader: (info: {section: Section}) => React.ReactElement = ({
  section: {title},
}) => (
  <StickyHeading backgroundColor={COLORS.PURE_WHITE}>
    <Heading16>{title}</Heading16>
  </StickyHeading>
);

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
  const listRef = useRef<RNSectionList<CompletedSessionEvent, Section>>(null);
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
      data: events,
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
        <Spacer12 />
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
    SectionListRenderItem<CompletedSessionEvent, Section>
  >(
    ({item, index, section}) => (
      <Gutters key={item.payload.id}>
        <JourneyNode
          index={index}
          completedSessionEvent={item}
          isFirst={data.indexOf(section) === 0 && index === 0}
          isLast={
            data.indexOf(section) === data.length - 1 &&
            index === section.data.length - 1
          }
        />
      </Gutters>
    ),
    [data],
  );

  const footer = useMemo(
    () => (
      <>
        <Spacer12 />
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

  const getItemLayout = useCallback(
    (
      _: SectionListData<CompletedSessionEvent, Section>[] | null,
      index: number,
    ) => ({
      length: LIST_ITEM_HEIGHT,
      offset: LIST_ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

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
