import React, {Fragment} from 'react';
import {View} from 'react-native';
import {RenderRules} from 'react-native-markdown-display';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import {InfoIcon} from '../../Icons';

import {Spacer16} from '../../Spacers/Spacer';

const IconWrapper = styled.View({
  width: 21,
  height: 21,
  marginRight: 2,
  marginLeft: -SPACINGS.FOUR,
});
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
        <IconWrapper>
          <InfoIcon fill={COLORS.PRIMARY} />
        </IconWrapper>
        {children}
      </View>
      <Spacer16 />
    </Fragment>
  ),
};

export default rules;
