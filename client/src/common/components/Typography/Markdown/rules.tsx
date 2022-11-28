import React, {Fragment} from 'react';
import {View} from 'react-native';
import {RenderRules} from 'react-native-markdown-display';

import {Spacer16} from '../../Spacers/Spacer';

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
  bullet_list: (node, children) => (
    <Fragment key={node.key}>
      {children}
      <Spacer16 />
    </Fragment>
  ),
  ordered_list: (node, children) => (
    <Fragment key={node.key}>
      {children}
      <Spacer16 />
    </Fragment>
  ),
  blockquote: (node, children, parent, styles) => (
    <Fragment key={node.key}>
      <View style={styles.blockquote}>
        <View style={styles.blockquote_background} />
        {children}
      </View>
    </Fragment>
  ),
};

export default rules;
