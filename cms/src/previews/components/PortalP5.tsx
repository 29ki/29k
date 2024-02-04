import React, {useCallback, useEffect, useRef, useState} from 'react';
import P5Animation, {
  P5AnimationType,
} from '../../../../client/src/lib/session/components/P5Animation/P5Animation.web';
import IconButton from '../../../../client/src/lib/components/Buttons/IconButton/IconButton';
import {PauseIcon, PlayIcon} from '../../../../client/src/lib/components/Icons';
import styled from 'styled-components/native';

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

type Props = {
  script: string;
};
const PortalP5: React.FC<Props> = ({script}) => {
  const iframeRef = useRef<P5AnimationType>(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Pause the animation after 1 second
      if (
        isPaused &&
        iframeRef.current &&
        iframeRef.current.contentWindow?.noLoop
      ) {
        iframeRef.current.contentWindow.noLoop();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [script]);

  useEffect(() => {
    if (
      iframeRef.current &&
      iframeRef.current.contentWindow.noLoop &&
      iframeRef.current.contentWindow.loop
    ) {
      if (isPaused) {
        iframeRef.current.contentWindow.noLoop();
      } else {
        iframeRef.current.contentWindow.loop();
      }
    }
  }, [isPaused]);

  const onPress = useCallback(() => {
    setIsPaused(isPlaying => !isPlaying);
  }, []);

  return (
    <Container>
      <P5Animation script={script} ref={iframeRef} />
      <IconButton Icon={isPaused ? PlayIcon : PauseIcon} onPress={onPress} />
    </Container>
  );
};

export default React.memo(PortalP5);
