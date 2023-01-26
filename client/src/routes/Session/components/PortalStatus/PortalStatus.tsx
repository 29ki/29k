import dayjs from 'dayjs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Spacer8} from '../../../../lib/components/Spacers/Spacer';
import useSessionState from '../../state/state';
import useDailyState from '../../../../lib/daily/state/state';
import Badge from '../../../../lib/components/Badge/Badge';
import useSessionStartTime from '../../hooks/useSessionStartTime';
import useSessionExercise from '../../hooks/useSessionExercise';
import styled from 'styled-components/native';
import {Body14} from '../../../../lib/components/Typography/Body/Body';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {HKGroteskBold} from '../../../../lib/constants/fonts';

export const StatusItem = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

export const StatusText = styled(Body14)<{themeColor?: string}>(
  ({themeColor}) => ({
    color: themeColor ? themeColor : COLORS.PURE_WHITE,
    fontFamily: HKGroteskBold,
  }),
);

export const Container = styled(Gutters)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const PortalStatus: React.FC = () => {
  const {t} = useTranslation('Screen.Portal');
  const exercise = useSessionExercise();
  const textColor = exercise?.theme?.textColor;
  const sessionState = useSessionState(state => state.sessionState);
  const startTime = useSessionState(state => state.session?.startTime);
  const sessionTime = useSessionStartTime(dayjs(startTime));
  const started = sessionState?.started;
  const participants = useDailyState(state => state.participants);
  const participantsCount = Object.keys(participants ?? {}).length;

  return (
    <Container>
      <StatusItem>
        <StatusText themeColor={textColor}>
          {sessionTime.isStartingShortly
            ? t('counterLabel.starts')
            : t('counterLabel.startsIn')}
        </StatusText>
        <Spacer8 />

        <Badge
          themeColor={textColor ?? textColor}
          text={
            started
              ? t('counterLabel.started')
              : sessionTime.isStartingShortly
              ? t('counterLabel.shortly')
              : sessionTime.time
          }
        />
      </StatusItem>

      {participantsCount > 1 && (
        <StatusItem>
          <StatusText themeColor={textColor}>{t('participants')}</StatusText>
          <Spacer8 />
          <Badge themeColor={textColor} text={participantsCount} />
        </StatusItem>
      )}
    </Container>
  );
};

export default PortalStatus;
