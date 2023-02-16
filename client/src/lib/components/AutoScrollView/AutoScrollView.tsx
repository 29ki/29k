import React, {useCallback, useState} from 'react';
import {LayoutChangeEvent, ScrollView, ScrollViewProps} from 'react-native';

// This component only enables scroll when content is larger than the container
const AutoScrollView: React.FC<ScrollViewProps> = ({
  onLayout = () => {},
  onContentSizeChange = () => {},
  ...props
}) => {
  const [containerDimenstions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [contentDimensions, setContentDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const {
        nativeEvent: {
          layout: {width, height},
        },
      } = event;
      setContainerDimensions({width, height});
      onLayout(event);
    },
    [onLayout],
  );

  const handleContentSizeChange = useCallback(
    (width: number, height: number) => {
      setContentDimensions({width, height});
      onContentSizeChange(width, height);
    },
    [onContentSizeChange],
  );
  const enabled =
    contentDimensions.height > containerDimenstions.height ||
    contentDimensions.width > containerDimenstions.width;

  return (
    <ScrollView
      onLayout={handleLayout}
      onContentSizeChange={handleContentSizeChange}
      scrollEnabled={enabled}
      {...props}
    />
  );
};

export default React.memo(AutoScrollView);
