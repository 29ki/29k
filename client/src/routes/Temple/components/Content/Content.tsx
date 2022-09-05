import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {FlatList, ListRenderItemInfo} from 'react-native';

import {TopSafeArea} from '../../../../common/components/Spacers/Spacer';
import TextContent from './contentTypes/Text';
import VideoContent from './contentTypes/Video';

import {ContentSlide} from '../../../../../../shared/src/types/Content';

type ContentProps = {
  content: ContentSlide[];
  contentIndex: number;
  playing: boolean;
};

const Wrapper = styled.View({
  flex: 1,
});

const Slide = styled.View<{width: number}>(props => ({
  flex: 1,
  width: props.width,
}));

const Content: React.FC<ContentProps> = ({
  content,
  contentIndex = 0,
  playing,
}) => {
  const [width, setWidth] = useState<number>(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    listRef.current?.scrollToIndex({animated: true, index: contentIndex});
  }, [contentIndex]);

  const renderSlide = ({item, index}: ListRenderItemInfo<ContentSlide>) => {
    return (
      <Slide width={width}>
        {item.type === 'text' && <TextContent content={item} />}
        {item.type === 'video' && (
          <VideoContent
            content={item}
            playing={contentIndex === index && playing}
          />
        )}
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
