import {useContext} from 'react';
import {DailyContext} from '../../DailyProvider';

const Preview = () => {
  const {call} = useContext(DailyContext);
  call?.startCamera();
  return null;
};

export default Preview;
