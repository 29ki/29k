import React, {Fragment} from 'react';
import {View} from 'react-native';
import {RenderRules} from 'react-native-markdown-display';

import {Spacer16, Spacer8} from '../../Spacers/Spacer';

const rules: RenderRules = {
  heading1: (node, children) => (
    <View key={node.key}>
      {children}
      <Spacer16 />
    </View>
  ),
  heading2: (node, children) => (
    <View key={node.key}>
      {children}
      <Spacer16 />
    </View>
  ),
  heading3: (node, children) => (
    <View key={node.key}>
      {children}
      <Spacer16 />
    </View>
  ),
  heading4: (node, children) => (
    <View key={node.key}>
      {children}
      <Spacer16 />
    </View>
  ),
  paragraph: (node, children, parent, styles) => (
    <View key={node.key}>
      <View style={styles.paragraph}>{children}</View>
      <Spacer16 />
    </View>
  ),
  bullet_list: (node, children, parent, styles) => (
    <View key={node.key} style={styles.bullet_list}>
      {children}
      <Spacer8 />
    </View>
  ),
  ordered_list: (node, children, parent, styles) => (
    <View key={node.key} style={styles.ordered_list}>
      {children}
      <Spacer8 />
    </View>
  ),
  blockquote: (node, children, parent, styles) => (
    <View key={node.key} style={styles.blockquote}>
      <View style={styles.blockquote_background} />
      {children}
    </View>
  ),
};

export default rules;
