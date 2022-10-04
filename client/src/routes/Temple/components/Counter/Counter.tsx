import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {Body14} from '../../../../common/components/Typography/Body/Body';
import {COLORS} from '../../../../common/constants/colors';
import {HKGroteskBold} from '../../../../common/constants/fonts';
import NS from '../../../../lib/i18n/constants/namespaces';

dayjs.extend(duration);

type CounterProps = {
  startTime: dayjs.Dayjs;
  starting?: boolean;
};

const CounterText = styled(Body14)({
  color: COLORS.PURE_WHITE,
  fontFamily: HKGroteskBold,
});

const Counter: React.FC<CounterProps> = ({startTime, starting = false}) => {
  const {t} = useTranslation(NS.COMPONENT.COUNTER);
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isStartingShortly = () => {
    return now.add(1, 'minute').isAfter(startTime);
  };

  const getTime = () => {
    const diff = dayjs.duration(startTime.diff(now));
    const minutes = diff.minutes();
    const seconds = diff.seconds();
    return `${minutes}m ${seconds < 10 ? 0 : ''}${seconds}s`;
  };

  return (
    <CounterText>
      {starting
        ? t('counterValue.now')
        : isStartingShortly()
        ? t('counterValue.shortly')
        : getTime()}
    </CounterText>
  );
};
export default Counter;
