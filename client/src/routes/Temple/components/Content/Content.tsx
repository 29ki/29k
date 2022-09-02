import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {FlatList, ListRenderItemInfo} from 'react-native';

import content from './content.json';
import {TopSafeArea} from '../../../../common/components/Spacers/Spacer';
import TextContent, {TextContentType} from './contentTypes/Text';
import VideoContent, {VideoContentType} from './contentTypes/Video';

type ContentProps = {
  contentIndex: number;
};

type ContentSlide = TextContentType | VideoContentType;

const Wrapper = styled.View({
  flex: 1,
});

const Slide = styled.View<{width: number}>(props => ({
  flex: 1,
  width: props.width,
}));

const Content: React.FC<ContentProps> = ({contentIndex = 0}) => {
  const [width, setWidth] = useState<number>(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    listRef.current?.scrollToIndex({animated: true, index: contentIndex});
  }, [contentIndex]);

  const renderSlide = ({item}: ListRenderItemInfo<ContentSlide>) => {
    return (
      <Slide width={width}>
        {item.type === 'text' && <TextContent content={item} />}
        {item.type === 'video' && <VideoContent content={item} />}
      </Slide>
    );
  };

  const getItemLayout = (_: any, index: number) => ({
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
