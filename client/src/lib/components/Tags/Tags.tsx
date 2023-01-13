import React from 'react';
import styled from 'styled-components/native';

import {SPACINGS} from '../../constants/spacings';
import useGetTagById from '../../content/hooks/useTagsById';
import {Spacer4} from '../Spacers/Spacer';
import Tag from '../Tag/Tag';

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
  tagIds?: Array<string>;
  duration?: number;
};

const Tags: React.FC<TagsProps> = React.memo(({tagIds, duration}) => {
  const getTagById = useGetTagById();
  const translatedTags = tagIds
    ? tagIds
        .map(getTagById)
        .filter(tag => Boolean(tag))
        .filter(tag => tag.tag && tag.tag.length > 0)
        .sort((a, b) => (a.featuredOrder ?? 100) - (b.featuredOrder ?? 100))
    : [];

  return (
    <Container>
      {duration && (
        <Wrapper>
          <Tag value={`${duration} min`} />
          <Spacer4 />
        </Wrapper>
      )}
      {translatedTags.map(tag => (
        <Wrapper key={tag.id}>
          <Tag key={tag.id} value={tag.tag} />
          <Spacer4 />
        </Wrapper>
      ))}
    </Container>
  );
});

export default Tags;
