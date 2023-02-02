import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {RefreshControl, SectionList} from 'react-native';

import useSessions from '../../lib/sessions/hooks/useSessions';

import {COLORS} from '../../../../shared/src/constants/colors';

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
import SessionCard from './components/SessionCard';

const ListHeader = () => (
  <>
    <TopSafeArea />
    <Spacer16 />
  </>
);

const Plan = () => {
  // const {t} = useTranslation('Screen.Plan');
  const {fetchSessions, pinnedSessions, hostedSessions} = useSessions();
  const {completedSessions} = useCompletedSessions();
  const [isLoading, setIsLoading] = useState(false);

  const sections = useMemo(() => {
    let sectionsList = [];

    if (completedSessions.length > 0) {
      sectionsList.push({
        title: 'Completed',
        data: completedSessions,
        type: 'completed',
      });
    }

    if (hostedSessions.length > 0 || pinnedSessions.length > 0) {
      sectionsList.push({
        title: 'Upcoming',
        data: [...pinnedSessions, ...hostedSessions],
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
        sections={sections}
        keyExtractor={session => session.id}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={Spacer60}
        ItemSeparatorComponent={Spacer16}
        renderItem={SessionCard}
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
