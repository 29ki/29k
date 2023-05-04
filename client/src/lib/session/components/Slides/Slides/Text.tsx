import React, {useMemo} from 'react';
import styled from 'styled-components/native';

import {ExerciseSlideTextSlide} from '../../../../../../../shared/src/types/generated/Exercise';
import Heading from './Blocks/Heading';
import Image from '../../../../components/Image/Image';
import {Spacer16} from '../../../../components/Spacers/Spacer';

import TextBlock from './Blocks/Text';

const ContentWrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const GraphicsWrapper = styled.View({
  width: 200,
  height: 200,
});

const TextWrapper = styled.View({
  justifyContent: 'center',
});

type TextProps = {
  slide: ExerciseSlideTextSlide;
};
const Text: React.FC<TextProps> = ({slide: {content = {}}}) => {
  const imageSource = useMemo(
    () => ({uri: content?.image?.source}),
    [content?.image?.source],
  );

  return (
    <ContentWrapper>
      <GraphicsWrapper>
        <Image resizeMode="contain" source={imageSource} />
      </GraphicsWrapper>
      <Spacer16 />
      <TextWrapper>
        {content.heading && <Heading>{content.heading}</Heading>}
        <Spacer16 />
        {content.text && <TextBlock multiline>{content.text}</TextBlock>}
      </TextWrapper>
    </ContentWrapper>
  );
};

export default React.memo(Text);
