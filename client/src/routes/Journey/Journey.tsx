import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  RefreshControl,
  SectionList as RNSectionList,
  SectionListRenderItem,
} from 'react-native';

import useSessions from '../../lib/sessions/hooks/useSessions';

import {COLORS} from '../../../../shared/src/constants/colors';

import {JourneySession} from './types/Session';
import {LiveSession} from '../../../../shared/src/types/Session';
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
import {useTranslation} from 'react-i18next';
import {Display24} from '../../lib/components/Typography/Display/Display';
import styled from 'styled-components/native';
import dayjs from 'dayjs';

export type Section = {
  title: string;
  data: JourneySession[];
  type: 'planned' | 'completed';
};

const SectionList = RNSectionList<JourneySession, Section>;

const Container = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});

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
          session={item as LiveSession}
          standAlone={true}
          hasCardBefore={hasCardBefore}
          hasCardAfter={hasCardAfter}
        />
      </Gutters>
    );
  }
};

const Journey = () => {
  const {t} = useTranslation('Screen.Journey');
  const {fetchSessions, pinnedSessions, hostedSessions} = useSessions();
  const {completedSessions} = useCompletedSessions();
  const [isLoading, setIsLoading] = useState(false);

  const sections = useMemo(() => {
    let sectionsList: Section[] = [];

    if (completedSessions.length > 0) {
      sectionsList.push({
        title: t('headings.completed'),
        data: completedSessions.map(s => ({...s, __type: 'completed'})),
        type: 'completed',
      });
    }

    if (hostedSessions.length > 0 || pinnedSessions.length > 0) {
      sectionsList.push({
        title: t('headings.planned'),
        data: [...hostedSessions, ...pinnedSessions].sort((a, b) =>
          dayjs(a.startTime).isBefore(dayjs(b.startTime)) ? -1 : 1,
        ),
        type: 'planned',
      });
    }

    return sectionsList;
  }, [pinnedSessions, hostedSessions, completedSessions, t]);

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

  if (!sections.length) {
    return (
      <Screen backgroundColor={COLORS.GREYLIGHTEST}>
        <Container>
          <Display24>{t('fallback')}</Display24>
        </Container>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <SectionList
        sections={sections}
        keyExtractor={session => session.id}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={Spacer60}
        ItemSeparatorComponent={Spacer16}
        stickySectionHeadersEnabled={true}
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

export default Journey;
