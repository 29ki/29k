import React from 'react';
import styled from 'styled-components/native';

const AsyncMediaWrapper = styled.View({
  width: '100%',
  aspectRatio: '1',
});

const LiveMediaWrapper = styled.View({
  height: '100%',
  aspectRatio: '1',
});

const MediaWrapperResolver: React.FC<{
  isLive?: boolean;
  children: React.ReactNode;
}> = ({isLive, children}) =>
  isLive ? (
    <LiveMediaWrapper>{children}</LiveMediaWrapper>
  ) : (
    <AsyncMediaWrapper>{children}</AsyncMediaWrapper>
  );

export default MediaWrapperResolver;
