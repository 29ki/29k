import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {FlatList, ListRenderItemInfo} from 'react-native';

import content from './content.json';
import Markdown from '../../../../common/components/Typography/Markdown/Markdown';
import {
  Spacer12,
  TopSafeArea,
} from '../../../../common/components/Spacers/Spacer';
import Gutters from '../../../../common/components/Gutters/Gutters';

type ContentProps = {
  contentIndex: number;
};

type ContentSlide = {type: string; content: {text: string}};

const Wrapper = styled.View({
  flex: 1,
});

const Slide = styled.View<{width: number}>(props => ({
  flex: 1,
  width: props.width,
  backgroundColor: 'pink',
}));

const Content: React.FC<ContentProps> = ({contentIndex = 0}) => {
  const [width, setWidth] = useState<number>(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    listRef.current?.scrollToIndex({animated: true, index: contentIndex});
  }, [contentIndex]);

  const renderSlide = ({item}: ListRenderItemInfo<ContentSlide>) => (
    <Slide width={width}>
      <Gutters>
        <Spacer12 />
        <Markdown>{item.content.text}</Markdown>
        <Spacer12 />
      </Gutters>
    </Slide>
  );

  const getItemLayout = (_, index: number) => ({
    length: width,
    offset: index * width,
    index,
  });

  return (
    <>
      <TopSafeArea />
      <Wrapper
        onLayout={event => {
          setWidth(event.nativeEvent.layout.width);
        }}>
        <FlatList
          getItemLayout={getItemLayout}
          ref={listRef}
          horizontal
          data={content}
          renderItem={renderSlide}
          snapToInterval={width}
          scrollEnabled={false}
          initialScrollIndex={contentIndex}
        />
      </Wrapper>
    </>
  );
};

export default Content;
