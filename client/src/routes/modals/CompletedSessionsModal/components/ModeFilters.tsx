import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {groupBy} from 'ramda';

import Gutters from '../../../../lib/components/Gutters/Gutters';
import {
  SessionMode,
  SessionType,
} from '../../../../../../shared/src/types/Session';
import FilterStatus from '../../../screens/Journey/components/FilterStatus';
import {
  CommunityIcon,
  FriendsIcon,
  MeIcon,
} from '../../../../lib/components/Icons';
import {Spacer16} from '../../../../lib/components/Spacers/Spacer';

import useCompletedSessions from '../../../../lib/sessions/hooks/useCompletedSessions';
import {CompletedSessionEvent} from '../../../../../../shared/src/types/Event';

const Row = styled(Gutters)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const ModeFilters: React.FC<{
  completedSessions: CompletedSessionEvent[];
  selectedMode?: SessionMode.async | SessionType.public | SessionType.private;
  showAsync?: boolean;
  onChange: (
    selectedMode?:
      | SessionMode.async
      | SessionType.public
      | SessionType.private
      | undefined,
  ) => void;
}> = ({selectedMode, completedSessions, showAsync = true, onChange}) => {
  const {t} = useTranslation('Modal.CompletedSessions');
  const {live: liveSessions, async: asyncSessions} = useMemo(
    () => groupBy(s => s.payload.mode, completedSessions),
    [completedSessions],
  );

  const {private: privateSessions, public: publicSessions} = useMemo(
    () => groupBy(s => s.payload.type, liveSessions ?? []),
    [liveSessions],
  );

  const onAsyncPress = useCallback(
    () =>
      onChange(
        selectedMode !== SessionMode.async ? SessionMode.async : undefined,
      ),
    [selectedMode, onChange],
  );
  const onPrivatePress = useCallback(
    () =>
      onChange(
        selectedMode !== SessionType.private ? SessionType.private : undefined,
      ),
    [selectedMode, onChange],
  );
  const onPublicPress = useCallback(
    () =>
      onChange(
        selectedMode !== SessionType.public ? SessionType.public : undefined,
      ),
    [onChange, selectedMode],
  );

  return (
    <Row>
      {showAsync && (
        <>
          <FilterStatus
            Icon={MeIcon}
            selected={selectedMode === SessionMode.async}
            onPress={onAsyncPress}
            heading={`${asyncSessions?.length ?? 0}`}
            description={t('async')}
            disabled={!asyncSessions?.length}
          />
          <Spacer16 />
        </>
      )}
      <FilterStatus
        Icon={FriendsIcon}
        selected={selectedMode === SessionType.private}
        onPress={onPrivatePress}
        heading={`${privateSessions?.length ?? 0}`}
        description={t('private')}
        disabled={!privateSessions?.length}
      />
      <Spacer16 />
      <FilterStatus
        Icon={CommunityIcon}
        selected={selectedMode === SessionType.public}
        onPress={onPublicPress}
        heading={`${publicSessions?.length ?? 0}`}
        description={t('public')}
        disabled={!publicSessions?.length}
      />
    </Row>
  );
};

export default ModeFilters;
