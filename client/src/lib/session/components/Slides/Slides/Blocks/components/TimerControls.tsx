import React from 'react';
import {Spacer12} from '../../../../../../components/Spacers/Spacer';
import Body from '../Body';
import TimerControlsComponent from '../../../../../../components/TimerControls/TimerControls';
import {useTranslation} from 'react-i18next';

type Props = {
  paused: boolean;
  onReset: () => void;
  onTogglePlay: () => void;
};
const TimerControls: React.FC<Props> = ({paused, onReset, onTogglePlay}) => {
  const {t} = useTranslation('Component.TimerControls');
  return (
    <>
      <Spacer12 />
      <Body>{t('text')}</Body>
      <Spacer12 />
      <TimerControlsComponent
        playing={!paused}
        onReset={onReset}
        onTogglePlay={onTogglePlay}
      />
    </>
  );
};

export default TimerControls;
