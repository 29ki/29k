import React from 'react';

import useSessionHost from '../../../../session/hooks/useSessionHost';
import Participant from '../../Participants/Participant';

type HostProps = {
  active: boolean;
};
const Host: React.FC<HostProps> = ({active}) => {
  const host = useSessionHost();

  if (!active || !host) {
    return null;
  }

  return <Participant participant={host} topGradient inSlide />;
};

export default React.memo(Host);
