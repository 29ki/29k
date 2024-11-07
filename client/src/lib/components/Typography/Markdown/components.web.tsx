import React from 'react';
import {Text, View} from 'react-native';
import {Spacer16, Spacer8} from '../../Spacers/Spacer';
import {Components} from 'react-markdown';
import baseStyles from './styles';
import styled from 'styled-components';
import {HKGroteskRegular} from '../../../constants/fonts';

const Ul = styled.ul({
  marginLeft: 16,
  fontFamily: HKGroteskRegular,
});

const Ol = styled.ol({
  marginLeft: 16,
  fontFamily: HKGroteskRegular,
});

const components = (styles: typeof baseStyles): Components => ({
  h1: ({children}) => (
    <>
      <Text style={[styles.heading1, styles.text]}>{children}</Text>
      <Spacer16 />
    </>
  ),
  h2: ({children}) => (
    <>
      <Text style={[styles.heading2, styles.text]}>{children}</Text>
      <Spacer16 />
    </>
  ),
  h3: ({children}) => (
    <>
      <Text style={[styles.heading3, styles.text]}>{children}</Text>
      <Spacer16 />
    </>
  ),
  h4: ({children}) => (
    <>
      <Text style={[styles.heading4, styles.text]}>{children}</Text>
      <Spacer16 />
    </>
  ),
  p: ({children}) => (
    <>
      <Text style={[styles.paragraph, styles.text]}>{children}</Text>
      <Spacer16 />
    </>
  ),
  ol: ({children, start}) => (
    <>
      <View style={styles.bullet_list}>
        <Ol start={start}>{children}</Ol>
      </View>
      <Spacer8 />
    </>
  ),
  ul: ({children}) => (
    <>
      <View style={styles.ordered_list}>
        <Ul>{children}</Ul>
      </View>
      <Spacer8 />
    </>
  ),
  li: ({children}) => (
    <li>
      <Text style={[styles.paragraph, styles.text]}>{children}</Text>
      <Spacer8 />
    </li>
  ),
  hr: () => <View style={styles.hr} />,
  blockquote: ({children}) => (
    <View style={styles.blockquote}>
      <View style={styles.blockquote_background} />
      {children}
    </View>
  ),
  a: ({children, href}) => (
    <a href={href} style={styles.link}>
      {children}
    </a>
  ),
});

export default components;
