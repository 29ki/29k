import React from 'react';
import styled from 'styled-components';

export const reverseVideo = (url: string) => {
  const transformFlags = (url.match(/cloudinary.*\/upload\/?(.*)\/v/) ?? [])[1];

  if (transformFlags === '') {
    return url.replace('/upload/v', '/upload/e_reverse/v');
  } else {
    return url.replace(transformFlags, `${transformFlags},e_reverse`);
  }
};

const Video = styled.video({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

type Props = {
  source?: string;
  loop?: boolean;
  reverse?: boolean;
};
const Portal: React.FC<Props> = ({source, loop, reverse}) =>
  source && (
    <Video controls loop={loop}>
      <source src={reverse ? reverseVideo(source) : source} />
    </Video>
  );

export default React.memo(Portal);
