import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import NS from '../../../../lib/i18n/constants/namespaces';

dayjs.extend(duration);

type CounterProps = {
  startTime: dayjs.Dayjs;
  starting?: boolean;
};

const Counter: React.FC<CounterProps> = ({startTime, starting = false}) => {
  const {t} = useTranslation(NS.COMPONENT.COUNTER);
  const [now, setNow] = useState(dayjs());
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) {
      return;
    }

    if (dayjs.duration(startTime.diff(now)).days() < 1) {
      setActive(true);
    }
  }, [active, now, startTime]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  const isStartingShortly = () => {
    return now.add(1, 'minute').isAfter(startTime);
  };

  const getTime = () => {
    const diff = dayjs.duration(startTime.diff(now));

    if (diff.days() > 0) {
      return startTime.format('dddd, D MMM HH:mm');
    }

    if (diff.hours() > 0) {
      return t('counterValue.inHours', {
        hours: diff.hours(),
        minutes: diff.minutes(),
      });
    }

    return t('counterValue.inMinutes', {
      minutes: diff.minutes(),
      seconds: diff.seconds(),
    });
  };

  return (
    <>
      {starting
        ? t('counterValue.now')
        : isStartingShortly()
        ? t('counterValue.shortly')
        : getTime()}
    </>
  );
};
export default Counter;
