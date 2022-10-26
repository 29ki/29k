import React, {Fragment} from 'react';
import {View} from 'react-native';
import {RenderRules} from 'react-native-markdown-display';

import {Spacer16} from '../../Spacers/Spacer';
import {Body16} from '../Body/Body';

const rules: RenderRules = {
  heading1: (node, children) => (
    <Fragment key={node.key}>
      {children}
      <Spacer16 />
    </Fragment>
  ),
  heading2: (node, children) => (
    <Fragment key={node.key}>
      {children}
      <Spacer16 />
    </Fragment>
  ),
  heading3: (node, children) => (
    <Fragment key={node.key}>
      {children}
      <Spacer16 />
    </Fragment>
  ),
  heading4: (node, children) => (
    <Fragment key={node.key}>
      {children}
      <Spacer16 />
    </Fragment>
  ),
  paragraph: (node, children, parent, styles) => (
    <Fragment key={node.key}>
      <View style={styles.paragraph}>{children}</View>
      <Spacer16 />
    </Fragment>
  ),

  code_inline: (node, children, parent, styles) => (
    <Fragment key={node.key}>
      <View style={styles.code_inline}>
        <Body16>{node.content}</Body16>
      </View>
      <Spacer16 />
    </Fragment>
  ),
};

export default rules;
