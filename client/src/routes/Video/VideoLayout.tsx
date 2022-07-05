import React, {Children} from 'react';
import {splitEvery} from 'ramda';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  item: {flex: 1},
  thumbContainer: {
    position: 'absolute',
    bottom: 116, // TODO: Allow adjustable bottom if needed for safe area
    right: 2,
    width: 75,
    height: 104,
    shadowColor: 'black',
    shadowOffset: {width: 6, height: 0},
    shadowOpacity: 0.34,
    shadowRadius: 15,
    zIndex: 2,
  },
  thumb: {
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: 'black',
  },
  hide: {
    opacity: 0,
  },
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
  <View style={styles.row}>
    {React.Children.map(children, (item, index) => {
      const isThumbMode = totalCount === 2 && index === 0;
      return (
        <View
          key={index}
          style={[
            styles.item,
            isThumbMode && styles.thumbContainer,
            !showUI && isThumbMode && styles.hide,
          ]}>
          <View style={[isThumbMode && styles.thumb, {}]}>
            {React.cloneElement(item as React.ReactElement, {
              respectSafeArea: !isThumbMode && rowIndex === 0,
              thumbMode: isThumbMode,
            })}
          </View>
        </View>
      );
    })}
  </View>
);

const VideoLayout: React.FC<VideoUiProps> = ({showUI, children}) => (
  <View style={[styles.layout]}>
    <MultiLayout showUI={showUI}>{children}</MultiLayout>
  </View>
);

export default VideoLayout;
