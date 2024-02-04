import React, {useMemo} from 'react';
import styled from 'styled-components/native';

import {ExerciseSlideInstructionSlide} from '../../../../../../../shared/src/types/generated/Exercise';
import Heading from './Blocks/Heading';
import Image from '../../../../components/Image/Image';
import {Spacer16} from '../../../../components/Spacers/Spacer';

import Body from './Blocks/Body';
import ContentWrapper from '../../ContentWrapper/ContentWrapper';

const GraphicsWrapper = styled.View({
  flex: 1,
});

const TextWrapper = styled.View({
  justifyContent: 'center',
});

type InstructionProps = {
  slide: ExerciseSlideInstructionSlide;
};

const Instruction: React.FC<InstructionProps> = ({slide: {content = {}}}) => {
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
        {content.text && <Body>{content.text}</Body>}
      </TextWrapper>
    </ContentWrapper>
  );
};

export default React.memo(Instruction);
