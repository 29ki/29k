import {useContext, useEffect} from 'react';

import {DailyContext} from './DailyProvider';

const Session = () => {
  const {prepareMeeting, leaveMeeting} = useContext(DailyContext);

  useEffect(() => {
    prepareMeeting();
  }, [prepareMeeting]);

  useEffect(() => {
    return leaveMeeting;
  }, [leaveMeeting]);

  return null;
};

export default Session;
