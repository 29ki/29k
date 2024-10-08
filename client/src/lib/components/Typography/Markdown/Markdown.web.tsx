import {mergeDeepRight} from 'ramda';
import React, {useMemo} from 'react';

import RMarkdown from 'react-markdown';
import baseStyles from './styles';
import components from './components.web';

type Props = {
  styles?: typeof baseStyles;
  children: string;
};
const Markdown = ({styles = {}, children}: Props) => {
  const mergedStyles = useMemo(
    () => mergeDeepRight(baseStyles, styles),
    [styles],
  );

  return (
    <RMarkdown components={components(mergedStyles)}>{children}</RMarkdown>
  );
};

export default Markdown;
