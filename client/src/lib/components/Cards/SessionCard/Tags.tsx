import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import {SPACINGS} from '../../../constants/spacings';
import {Spacer4} from '../../Spacers/Spacer';
import Tag from '../../Tag/Tag';

const Container = styled.View({
  flexWrap: 'wrap',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: -SPACINGS.FOUR,
});

const Wrapper = styled.View({
  flexDirection: 'row',
});

type TagsProps = {
  tags: Array<string>;
  duration?: number;
};

const Tags: React.FC<TagsProps> = React.memo(({tags, duration}) => {
  const {t} = useTranslation('Component.SessionCard');

  return (
    <Container>
      {duration && (
        <Wrapper>
          <Tag value={`${duration} ${t('minutesAbbreviation')}`} />
          <Spacer4 />
        </Wrapper>
      )}
      {tags.map(tag => (
        <Wrapper key={tag}>
          <Tag value={tag} />
          <Spacer4 />
        </Wrapper>
      ))}
    </Container>
  );
});

export default Tags;
