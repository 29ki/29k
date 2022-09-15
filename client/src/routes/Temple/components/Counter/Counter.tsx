import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import dayjs from 'dayjs';
import {B3} from '../../../../common/components/Typography/Text/Text';
import {COLORS} from '../../../../common/constants/colors';
import {HKGroteskBold} from '../../../../common/constants/fonts';
import {useTranslation} from 'react-i18next';
import NS from '../../../../lib/i18n/constants/namespaces';

type CounterProps = {
  startTime: dayjs.Dayjs;
};

const CounterText = styled(B3)({
  color: COLORS.WHITE,
  fontFamily: HKGroteskBold,
});

const Counter: React.FC<CounterProps> = ({startTime}) => {
  const [diff, setDiff] = useState<number>(
    startTime.subtract(dayjs().second(), 'seconds').second(),
  );
  const {t} = useTranslation(NS.COMPONENT.COUNTER);

  useEffect(() => {
    const handle = setInterval(() => {
      setDiff(startTime.subtract(dayjs().second(), 'seconds').second());
    }, 1000);
    return () => clearInterval(handle);
  }, [setDiff, startTime]);

  const isStartingShortly = () => {
    return diff <= 60 && diff > 0;
  };

  const isStartingNow = () => {
    return startTime.isBefore(diff) || startTime.isSame(diff);
  };

  return (
    <CounterText>
      {isStartingShortly() && t('counterValue.shortly')}
      {/* {isStartingNow() && t('counterValue.now')}
      {TIME_TO_START >= diff + 60000 &&
        new Date(TIME_TO_START - diff).getMinutes() +
          'm ' +
          new Date(TIME_TO_START - diff).getSeconds() +
          's'} */}
    </CounterText>
  );
};
export default Counter;
