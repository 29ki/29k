import React from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import styled from 'styled-components/native';
import p5HtmlTemplate from './p5HtmlTemplate';

const Wrapper = styled.View({
  ...StyleSheet.absoluteFillObject,
});

type P5AnimationProps = {
  script: string;
};

const P5Animation: React.FC<P5AnimationProps> = ({script}) => (
  <Wrapper>
    <WebView source={{html: p5HtmlTemplate(script)}} />
  </Wrapper>
);

export default React.memo(P5Animation);
