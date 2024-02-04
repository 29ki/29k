import React, {forwardRef} from 'react';
import styled from 'styled-components';
import p5HtmlTemplate from './p5HtmlTemplate';

const Iframe = styled.iframe({
  position: 'absolute',
  width: '100%',
  height: '100%',
  border: 0,
});

export type P5AnimationType = HTMLIFrameElement & {
  contentWindow: {
    noLoop?: () => void;
    loop?: () => void;
  };
};

type Props = {
  script: string;
};
const P5Animation = forwardRef<P5AnimationType, Props>(({script}, ref) => (
  <Iframe srcDoc={p5HtmlTemplate(script)} ref={ref} />
));

export default React.memo(P5Animation);
