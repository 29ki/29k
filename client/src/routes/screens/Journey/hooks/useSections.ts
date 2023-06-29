import {groupBy} from 'ramda';
import {useMemo} from 'react';
import {Section} from '../types/Section';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';

import useCompletedSessions from '../../../../lib/sessions/hooks/useCompletedSessions';
import useSessions from '../../../../lib/sessions/hooks/useSessions';
import usePinnedCollections from '../../../../lib/user/hooks/usePinnedCollections';
import useSharingPosts from '../../../../lib/posts/hooks/useSharingPosts';
import {SessionMode} from '../../../../../../shared/src/schemas/Session';

const useSections = () => {
  const {t} = useTranslation('Screen.Journey');
  const {pinnedSessions, hostedSessions} = useSessions();
  const {completedSessions} = useCompletedSessions();
  const {pinnedCollections} = usePinnedCollections();

  const {getSharingPostForSession} = useSharingPosts();

  return useMemo(() => {
    let sectionsList: Section[] = [];

    if (completedSessions.length > 0) {
      Object.entries(
        groupBy(
          item => dayjs(item.timestamp).format('MMM, YYYY'),
          completedSessions,
        ),
      ).forEach(([month, items]) => {
        sectionsList.push({
          title: month,
          data: items.map(s => ({
            type: 'completedSession',
            data: {
              ...s,
              sharingPost:
                s.payload.mode === SessionMode.async
                  ? getSharingPostForSession(s.payload.id)
                  : undefined,
            },
            id: s.payload.id,
            isFirst: completedSessions.indexOf(s) === 0,
            isLast:
              completedSessions.indexOf(s) === completedSessions.length - 1,
          })),
          type: 'completedSessions',
        });
      });

      sectionsList.push({
        title: '',
        data: [{id: 'completed-sessions-filter', type: 'filter'}],
        type: 'filters',
      });
    }

    if (pinnedCollections.length > 0) {
      sectionsList.push({
        title: t('headings.collections'),
        data: pinnedCollections.map(s => ({
          data: s,
          id: s.id,
          type: 'pinnedCollection',
        })),
        type: 'pinnedCollections',
      });
    }

    if (hostedSessions.length > 0 || pinnedSessions.length > 0) {
      sectionsList.push({
        title: t('headings.planned'),
        data: [...hostedSessions, ...pinnedSessions]
          .sort((a, b) =>
            dayjs(a.startTime).isBefore(dayjs(b.startTime)) ? -1 : 1,
          )
          .map(s => ({
            id: s.id,
            data: s,
            type: 'plannedSession',
          })),
        type: 'plannedSessions',
      });
    }

    return sectionsList;
  }, [
    pinnedSessions,
    hostedSessions,
    completedSessions,
    pinnedCollections,
    getSharingPostForSession,
    t,
  ]);
};

export default useSections;
