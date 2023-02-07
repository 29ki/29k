import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  RefreshControl,
  SectionList as RNSectionList,
  SectionListRenderItem,
} from 'react-native';

import useSessions from '../../lib/sessions/hooks/useSessions';

import {COLORS} from '../../../../shared/src/constants/colors';

import {JourneySession} from './types/Session';
import {Session} from '../../../../shared/src/types/Session';
import {CompletedSession} from '../../lib/user/state/state';

import {
  Spacer16,
  Spacer24,
  Spacer60,
  Spacer8,
  TopSafeArea,
} from '../../lib/components/Spacers/Spacer';
import Gutters from '../../lib/components/Gutters/Gutters';
import Screen from '../../lib/components/Screen/Screen';
import {Heading18} from '../../lib/components/Typography/Heading/Heading';
import useCompletedSessions from '../../lib/sessions/hooks/useCompletedSessions';
import CompletedSessionCardContainer from './components/CompletedSessionCardContainer';
import SessionCard from '../../lib/components/Cards/SessionCard/SessionCard';

export type Section = {
  title: string;
  data: JourneySession[];
  type: 'interested' | 'completed';
};

const SectionList = RNSectionList<JourneySession, Section>;

const ListHeader = () => (
  <>
    <TopSafeArea />
    <Spacer16 />
  </>
);

const renderSession: SectionListRenderItem<JourneySession, Section> = ({
  section,
  item,
  index,
}) => {
  const standAlone = section.data.length === 1;
  const hasCardBefore = index > 0;
  const hasCardAfter = index !== section.data.length - 1;

  if (item.__type === 'completed') {
    return (
      <CompletedSessionCardContainer
        session={item as CompletedSession}
        hasCardBefore={hasCardBefore}
        hasCardAfter={hasCardAfter}
      />
    );
  } else {
    return (
      <Gutters>
        <SessionCard
          session={item as Session}
          standAlone={standAlone}
          hasCardBefore={hasCardBefore}
          hasCardAfter={hasCardAfter}
        />
      </Gutters>
    );
  }
};

const Plan = () => {
  // const {t} = useTranslation('Screen.Plan');
  const {fetchSessions, pinnedSessions, hostedSessions} = useSessions();
  const {completedSessions} = useCompletedSessions();
  const [isLoading, setIsLoading] = useState(false);

  const sections = useMemo(() => {
    let sectionsList: Section[] = [];

    if (completedSessions.length > 0) {
      sectionsList.push({
        title: 'Completed',
        data: completedSessions.map(s => ({...s, __type: 'completed'})),
        type: 'completed',
      });
    }

    if (hostedSessions.length > 0 || pinnedSessions.length > 0) {
      sectionsList.push({
        title: 'Now',
        data: [...pinnedSessions, ...hostedSessions],
        type: 'interested',
      });
    }

    return sectionsList;
  }, [pinnedSessions, hostedSessions, completedSessions]);

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

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <SectionList
        initialScrollIndex={completedSessions.length + 1}
        sections={sections}
        keyExtractor={session => session.id}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={Spacer60}
        ItemSeparatorComponent={Spacer16}
        renderItem={renderSession}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshPull} />
        }
        renderSectionHeader={({section: {title, type}}) => (
          <Gutters>
            {sections[0].type !== type && <Spacer24 />}
            <Heading18>{title}</Heading18>
            <Spacer8 />
          </Gutters>
        )}
      />
    </Screen>
  );
};

export default Plan;
