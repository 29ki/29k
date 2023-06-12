import React, {useEffect, useState} from 'react';
import Notification from './Notification';
import {Notification as NotificationProps} from '../../state/state';

const TimedNotification: React.FC<NotificationProps> = ({
  letter,
  text,
  Icon,
  image,
}) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setActive(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  if (active) {
    return (
      <Notification text={text} image={image} letter={letter} Icon={Icon} />
    );
  }
  return null;
};

export default React.memo(TimedNotification);
