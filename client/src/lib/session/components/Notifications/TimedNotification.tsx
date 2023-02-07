import React, {useEffect, useState} from 'react';
import Notification from './Notification';
import {Notification as NotificationProps} from '../../state/state';

const TimedNotification: React.FC<NotificationProps> = ({
  letter,
  text,
  Icon,
  image,
  timeVisible,
  visible,
}) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!visible) {
      const timeoutId = setTimeout(() => {
        setActive(false);
      }, timeVisible ?? 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [visible, timeVisible]);

  if (active) {
    return (
      <Notification text={text} image={image} letter={letter} Icon={Icon} />
    );
  }
  return null;
};

export default TimedNotification;
