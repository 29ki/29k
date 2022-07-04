import React from 'react';
import {useRecoilValue} from 'recoil';

// import Error from './Overlays/Error';
import Entrance from './Overlays/Entrance';
import Loading from './Overlays/Loading';
import Waiting from './Overlays/Waiting';
import GettingStarted from './Overlays/GettingStarted';
import Preview from './Overlays/Preview';
import {videoSharingFields} from '../state/state';

const Lobby: React.FC = () => {
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const isJoined = useRecoilValue(videoSharingFields('isJoined'));
  const isStarted = useRecoilValue(videoSharingFields('isStarted'));

  // if (hasError) {
  //   return <Error />;
  // }

  if (!isJoined) {
    return isLoading ? (
      <GettingStarted />
    ) : (
      <>
        <Entrance />
        <Preview />
      </>
    );
  }

  if (!isStarted && !isLoading) {
    return <Waiting />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return null;
};

export default Lobby;
