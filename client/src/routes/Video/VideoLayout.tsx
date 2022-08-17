import React, {Children} from 'react';
import {splitEvery} from 'ramda';
import {StyleSheet, View} from 'react-native';
import styled from 'styled-components';

const Flex1 = styled(View)({
  flex: 1,
});

const Thumb = styled(View)((props: {isThumbMode: boolean}) =>
  props.isThumbMode
    ? {
        overflow: 'hidden',
        borderRadius: 5,
        backgroundColor: 'black',
      }
    : {},
);

const ThumbContainer = styled(Flex1)(
  (props: {isThumbMode: boolean; hide: boolean}) =>
    props.isThumbMode
      ? {
          ...StyleSheet.absoluteFillObject,
          bottom: 116, // TODO: Allow adjustable bottom if needed for safe area
          right: 2,
          width: 75,
          height: 104,
          shadowColor: 'black',
          shadowOffset: {width: 6, height: 0},
          shadowOpacity: 0.34,
          shadowRadius: 15,
          zIndex: 2,
          opacity: props.hide ? 0 : 1,
        }
      : {},
);
const ViewRow = styled(View)({
  flexDirection: 'row',
  flex: 1,
});

type VideoUiProps = {
  showUI: Boolean;
};

const MultiLayout: React.FC<VideoUiProps> = ({showUI, children}) => {
  const rows = splitEvery(2, Children.toArray(children));
  return (
    <>
      {rows.map((row, index) => (
        <Row
          rowIndex={index}
          key={index}
          totalCount={Children.count(children)}
          showUI={showUI}>
          {row}
        </Row>
      ))}
    </>
  );
};

type RowProps = {
  showUI: Boolean;
  rowIndex: Number;
  totalCount: Number;
};

const Row: React.FC<RowProps> = ({
  children,
  rowIndex,
  totalCount,
  showUI = true,
}) => (
  <ViewRow>
    {React.Children.map(children, (item, index) => {
      const isThumbMode = totalCount === 2 && index === 0;
      return (
        <ThumbContainer key={index} hide={!showUI} isThumbMode={isThumbMode}>
          <Thumb isThumbMode={isThumbMode}>
            {React.cloneElement(item as React.ReactElement, {
              respectSafeArea: !isThumbMode && rowIndex === 0,
              thumbMode: isThumbMode,
            })}
          </Thumb>
        </ThumbContainer>
      );
    })}
  </ViewRow>
);

const VideoLayout: React.FC<VideoUiProps> = ({showUI, children}) => (
  <Flex1>
    <MultiLayout showUI={showUI}>{children}</MultiLayout>
  </Flex1>
);

export default VideoLayout;
